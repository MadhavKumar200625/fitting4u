"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import jwt from "jsonwebtoken";


export default function OrdersDashboard() {
  const STATUS_PERMISSIONS = {
  SUPER_ADMIN: [
    "CREATED",
    "PAID",
    "PROCESSING",
    "READY_FOR_PICKUP",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ],

  SUB_ADMIN: [
    "PROCESSING",
    "READY_FOR_PICKUP",
    "SHIPPED"
  ],
  
  VIEWER: [] // optional future role
};

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const token = () => localStorage.getItem("admin_auth");

  /* -----------------------
      LOAD ALL ORDERS
  -------------------------*/
  const loadAll = async () => {
    const r = await fetch("/api/admin/orders/all", {
      headers: { Authorization: `Bearer ${token()}` },
    });

    const d = await r.json();
    if (!d.success) return toast.error("Load failed");

    const payload = jwt.decode(token());
    setRole(payload.role);

    setOrders(d.orders);
  };

  /* -----------------------
      SEARCH ORDERS
  -------------------------*/
  const searchOrder = async () => {
    const r = await fetch(`/api/admin/orders/search?q=${search}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });

    const d = await r.json();
    setOrders(d.orders);
  };

  /* -----------------------
      UPDATE STATUS
  -------------------------*/
  const updateStatus = async (id, status) => {
    const r = await fetch("/api/admin/orders/update-status", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: id, status }),
    });

    const d = await r.json();

    if (!d.success) return toast.error("Update failed");

    toast.success("Status Updated");
    loadAll();
  };

  useEffect(loadAll, []);

  return (
    <div className="p-10 text-black">

      <h1 className="text-4xl font-bold mb-8">
        Orders Dashboard
      </h1>

      {/* SEARCH */}
      <div className="flex gap-4 mb-8">
        <input
          placeholder="Search order / phone / status"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border border-black px-4 py-2 rounded w-80"
        />

        <button
          onClick={searchOrder}
          className="bg-[#003466] text-white px-6 py-2 rounded">
          Search
        </button>

        <button
          onClick={loadAll}
          className="border border-black px-6 py-2 rounded">
          Reset
        </button>
      </div>

      {/* ORDER LIST */}
      <div className="space-y-4">

       {orders.map(o => {
         const allowedStatuses = STATUS_PERMISSIONS[role] || [];

         return (
          <div
            key={o._id}
            className="
              border border-black rounded p-4 
              flex justify-between bg-white cursor-pointer
            "
          >

            <Link href={`/admin/orders/${o._id}`} className="flex-1">
              <p className="font-bold">{o._id}</p>
              <p>{o.userPhone}</p>
              <p>{o.status}</p>
            </Link>

            <div className="space-x-2 flex items-center">

              {/* STATUS DROPDOWN */}
              <select
                className="border border-black px-3 py-1 rounded"
                defaultValue={o.status}
                onChange={(e) =>
                  updateStatus(o._id, e.target.value)
                }
              >
                {allowedStatuses.map(st => (
                  <option key={st}>{st}</option>
                ))}
              </select>

            </div>

          </div>
         );
       })}

      </div>
    </div>
  );
}