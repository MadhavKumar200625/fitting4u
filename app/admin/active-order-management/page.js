"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const token = localStorage.getItem("admin_auth");

    const r = await fetch("/api/admin/orders/active", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const d = await r.json();
    if (!d.success) toast.error("Failed to load");

    setOrders(d.orders);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("admin_auth");

    await fetch("/api/admin/orders/update-status", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ orderId: id, status })
    });

    toast.success("Order updated");
    load();
  };

  return (
    <div className="min-h-screen bg-[#f6f9ff]  text-black px-6 lg:px-12 py-32">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-[#003466]">
          Active Orders
        </h1>

        <p className="text-gray-600 mt-2">
          Manage & update all currently active orders.
        </p>
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-[1400px] mx-auto space-y-4">

        {orders.length === 0 && (
          <p className="text-center text-gray-500 mt-20">
            No active orders found.
          </p>
        )}

        {orders.map((o, i) => (
          <motion.div
            key={o._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="
              bg-white
              border border-gray-200
              shadow-sm
              hover:shadow-md
              transition
              p-6
              rounded-2xl
              flex flex-col lg:flex-row justify-between
              gap-6
            "
          >
            {/* LEFT INFO */}
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-[#003466]">Order ID:</span>{" "}
                <span className="font-mono break-all">{o._id}</span>
              </p>

              <p>
                <span className="font-semibold text-[#003466]">Customer:</span>{" "}
                {o.userPhone}
              </p>

              <p className="flex items-center gap-2">
                <span className="font-semibold text-[#003466]">Current Status:</span>
                <StatusBadge status={o.status} />
              </p>
            </div>

            {/* RIGHT ACTION */}
            <div className="flex items-center">
              <select
                defaultValue={o.status}
                onChange={(e) => updateStatus(o._id, e.target.value)}
                className="
                  w-[230px]
                  px-4 py-3
                  text-black
                  border border-gray-300
                  rounded-xl
                  shadow-inner
                  focus:ring-2 ring-[#ffc1cc]
                  outline-none
                  cursor-pointer
                  transition
                "
              >
                <option value="PROCESSING">PROCESSING</option>
                <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* -----------------------------------
      STATUS BADGE COMPONENT
------------------------------------ */

function StatusBadge({ status }) {
  const map = {
    PROCESSING: "bg-yellow-100 text-yellow-700",
    READY_FOR_PICKUP: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
        px-3 py-1
        text-xs
        font-semibold
        rounded-full
        uppercase
        tracking-wide
        ${map[status] || "bg-gray-100 text-gray-700"}
      `}
    >
      {status.replace("_", " ")}
    </span>
  );
}