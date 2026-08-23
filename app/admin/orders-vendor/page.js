"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function OrdersVendorPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("admin_auth");
      const res = await fetch("/api/admin/orders/vendor", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success) {
        toast.error("Failed to load vendor orders");
        setOrders([]);
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("VENDOR ORDERS LOAD ERROR:", error);
      toast.error("Something went wrong while loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-28 text-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#003466]">Orders(vendor)</h1>
          <p className="text-gray-600 mt-2">
            Basic customer and item details only.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-gray-600">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-gray-600 text-center">
            No orders found.
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-sm break-all">{order._id}</p>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase">
                    {order.status || "CREATED"}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-500 mb-1">Customer Name</p>
                    <p className="font-semibold">{order.customerName || "Not available"}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-500 mb-1">Phone Number</p>
                    <p className="font-semibold">{order.userPhone || "Not available"}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 md:col-span-2 xl:col-span-1">
                    <p className="text-gray-500 mb-1">Email ID</p>
                    <p className="font-semibold break-all">{order.customerEmail || "Not available"}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 md:col-span-2 xl:col-span-1">
                    <p className="text-gray-500 mb-1">Delivery Type</p>
                    <p className="font-semibold">{order.deliveryType || "N/A"}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="font-semibold text-[#003466] mb-3">
                    {order.deliveryType === "HOME" ? "Shipping Address" : "Boutique Address"}
                  </p>

                  {order.deliveryType === "HOME" ? (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="font-semibold text-black">Name:</span> {order.customerAddress?.name || "Not available"}</p>
                      <p><span className="font-semibold text-black">Phone:</span> {order.customerAddress?.phone || order.userPhone || "Not available"}</p>
                      <p><span className="font-semibold text-black">Address:</span> {order.customerAddress?.street || ""}{order.customerAddress?.street ? ", " : ""}{order.customerAddress?.landmark || ""}{order.customerAddress?.landmark ? ", " : ""}{order.customerAddress?.city || ""}{order.customerAddress?.city ? ", " : ""}{order.customerAddress?.district || ""}{order.customerAddress?.district ? ", " : ""}{order.customerAddress?.state || ""}{order.customerAddress?.state ? " - " : ""}{order.customerAddress?.postalCode || ""}{order.customerAddress?.country ? ", " + order.customerAddress.country : ""}</p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="font-semibold text-black">Boutique:</span> {order.boutiqueAddress?.title || "Boutique"}</p>
                      <p><span className="font-semibold text-black">Address:</span> {order.boutiqueAddress?.address || "Address not available"}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <p className="font-semibold text-[#003466] mb-3">Ordered Items</p>
                  <div className="space-y-2">
                    {order.items?.length ? (
                      order.items.map((item, index) => (
                        <div
                          key={`${order._id}-item-${index}`}
                          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-gray-500 text-xs uppercase tracking-wide">Item</p>
                              <p className="font-semibold text-black">{item.name || "Fabric item"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-500 text-xs uppercase tracking-wide">Quantity</p>
                              <p className="font-semibold text-black">{Number(item.qty) || 1}</p>
                            </div>
                          </div>

                          {item.productUrl && (
                            <a
                              href={item.productUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-block text-sm font-medium text-blue-700 underline break-all"
                            >
                              Open item URL
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No items listed.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
