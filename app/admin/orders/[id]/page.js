"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);

  const load = async () => {
    const token =
      sessionStorage.getItem("admin_auth") || localStorage.getItem("admin_auth");

    const r = await fetch(`/api/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const d = await r.json();
    if (!d.success) return toast.error("Failed to load order");

    setOrder(d.order);
    setCustomer(d.customer || null);
  };

  useEffect(() => { load(); }, []);

  if (!order) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 text-black">

      <Link href="/admin/orders" className="underline">
        ← Back to Orders
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-6">Order Details</h1>

      <div className="bg-white border border-black rounded p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Order summary</h2>
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Placed:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Not available"}</p>
        <p><b>Status:</b> {order.status}</p>
        <p><b>Total:</b> ₹{order.total}</p>
        <p><b>Delivery Type:</b> {order.deliveryType}</p>
        </section>

        <section className="border-t pt-5">
          <h2 className="text-xl font-semibold mb-2">Customer</h2>
          <p><b>Name:</b> {customer?.name || order.deliveryAddress?.name || "Not available"}</p>
          <p><b>Email:</b> {customer?.email || order.userPhone}</p>
          <p><b>Phone:</b> {customer?.phone || order.deliveryAddress?.phone || "Not available"}</p>
        </section>

        {order.deliveryType === "HOME" && (
          <section className="border-t pt-5">
            <h2 className="text-xl font-semibold mb-2">Delivery address</h2>
            <p>{[order.deliveryAddress?.name, order.deliveryAddress?.street, order.deliveryAddress?.landmark, order.deliveryAddress?.city, order.deliveryAddress?.district, order.deliveryAddress?.state, order.deliveryAddress?.postalCode, order.deliveryAddress?.country].filter(Boolean).join(", ") || "Not available"}</p>
            <p><b>Delivery phone:</b> {order.deliveryAddress?.phone || "Not available"}</p>
          </section>
        )}

        {order.deliveryType === "BOUTIQUE" && (
          <section className="border-t pt-5">
            <h3 className="font-semibold">Pickup Boutique</h3>
            <p>{order.pickupBoutiqueId?.title}</p>
            <p>{order.pickupBoutiqueId?.googleAddress}</p>
            <p><b>Collecting person:</b> {order.pickupContactName || "Not available"}</p>
            <p><b>Pickup mobile:</b> {order.pickupContactPhone || "Not available"}</p>
            <Link
              href={`https://www.google.com/maps/?q=${order.pickupBoutiqueId?.lat},${order.pickupBoutiqueId?.long}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              Get Directions
            </Link>
          </section>
        )}

        {/* ORDER ITEMS */}
        <section className="border-t pt-5">
          <h3 className="font-semibold mb-2">Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="border p-3 rounded mb-2">
              <p><b>{item.fabricId?.name || item.name || "Fabric item"}</b> — {item.qty}m × ₹{item.price}</p>
              <p>{[item.fabricId?.material, item.fabricId?.color, item.fabricId?.gender].filter(Boolean).join(" • ")}</p>
              <p><b>Subtotal:</b> ₹{item.subtotal}</p>
              {item.fabricId?.slug && <Link href={`/fabrics/${item.fabricId.slug}`} target="_blank" className="text-blue-600 underline">View fabric</Link>}
            </div>
          ))}
        </section>

        <section className="border-t pt-5">
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <p><b>Provider:</b> {order.payment?.provider || "Not available"}</p>
          <p><b>Payment status:</b> {order.payment?.status || "Not available"}</p>
          <p><b>Payment ID:</b> {order.payment?.paymentId || "Not available"}</p>
          <p><b>Gateway order ID:</b> {order.payment?.orderId || "Not available"}</p>
        </section>

      </div>
    </div>
  );
}
