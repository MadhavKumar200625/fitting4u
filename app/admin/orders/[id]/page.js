"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const load = async () => {
    const token = localStorage.getItem("admin_auth");

    const r = await fetch(`/api/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const d = await r.json();
    if (!d.success) return toast.error("Failed to load order");

    setOrder(d.order);
  };

  useEffect(() => { load(); }, []);

  if (!order) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 text-black">

      <Link href="/admin/orders" className="underline">
        ← Back to Orders
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-6">Order Details</h1>

      <div className="bg-white border border-black rounded p-6">
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Customer:</b> {order.userPhone}</p>
        <p><b>Status:</b> {order.status}</p>
        <p><b>Total:</b> ₹{order.total}</p>
        <p><b>Delivery Type:</b> {order.deliveryType}</p>

        {order.deliveryType === "BOUTIQUE" && (
          <div className="mt-4">
            <h3 className="font-semibold">Pickup Boutique</h3>
            <p>{order.pickupBoutiqueId?.title}</p>
            <p>{order.pickupBoutiqueId?.googleAddress}</p>
            <Link
              href={`https://www.google.com/maps/?q=${order.pickupBoutiqueId?.lat},${order.pickupBoutiqueId?.long}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              Get Directions
            </Link>
          </div>
        )}

        {/* ORDER ITEMS */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="border p-3 rounded mb-2">
              <p><b>{item.name}</b> — {item.qty}m × ₹{item.price}</p>
              <p><b>Subtotal:</b> ₹{item.subtotal}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}