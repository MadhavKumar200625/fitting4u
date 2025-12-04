"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  User,
  Package,
  Truck,
  Store,
  LogOut,
  Save,
  MapPin
} from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
    district: "",
    state: "",
    postalCode: "",
    landmark: "",
  });

  /* --------------------------------------------
     LOAD USER + ORDERS
  -------------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Login required");
      window.location.href = "/";
      return;
    }

    Promise.all([
      fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),

      fetch("/api/order/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([userRes, ordersRes]) => {
        if (userRes?.success) {
          setUser(userRes.user);
          setForm({
            name: userRes.user.name || "",
            street: userRes.user.address?.street || "",
            city: userRes.user.address?.city || "",
            district: userRes.user.address?.district || "",
            state: userRes.user.address?.state || "",
            postalCode: userRes.user.address?.postalCode || "",
            landmark: userRes.user.address?.landmark || "",
          });
        }

        if (ordersRes?.success) setOrders(ordersRes.orders || []);
      })
      .catch(() => toast.error("Failed to load account"))
      .finally(() => setLoading(false));
  }, []);

  /* --------------------------------------------
        LOGOUT
  -------------------------------------------- */
  const logout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logged out");
    window.location.href = "/";
  };

  /* --------------------------------------------
        SAVE PROFILE
  -------------------------------------------- */
  const saveProfile = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: user.phone,
          updateData: {
            name: form.name,
            address: {
              street: form.street,
              city: form.city,
              district: form.district,
              state: form.state,
              postalCode: form.postalCode,
              landmark: form.landmark,
            },
          },
        }),
      });

      const data = await res.json();

      if (!data?.success) {
        toast.error("Update failed");
        return;
      }

      toast.success("Profile updated");
      setUser(data.data);
      setActiveTab("orders");

    } catch {
      toast.error("Save failed");
    }
  };

  /* --------------------------------------------
          STATES
  -------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-16 h-16 border-4 border-[#003466]/30 border-t-[#003466] rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  /* --------------------------------------------
            UI
  -------------------------------------------- */
  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-20 pt-28 pb-20 bg-gradient-to-br from-[#f6f9ff] to-white text-black">

      {/* ---------- HEADER ---------- */}
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row gap-6 sm:gap-0 justify-between mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-black">
            Hello, {user.name || "Customer"} 👋
          </h1>
          <p className="text-gray-600">
            Manage your orders & profile
          </p>
        </div>

        <button
          onClick={logout}
          className="
            flex items-center gap-2
            px-6 py-3 rounded-full
            bg-[#003466] text-white
            hover:bg-[#002850]
          "
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* ---------- MAIN GRID ---------- */}
      <div className="
        max-w-[1600px]
        mx-auto
        grid
        grid-cols-1
        lg:grid-cols-[280px_1fr]
        gap-8
      ">

        {/* ---------- SIDEBAR ---------- */}
        <div className="
          bg-white
          rounded-3xl
          shadow-lg
          p-6
          space-y-6
        ">
          <div className="text-center">
            <User size={64} className="mx-auto text-[#003466]" />
            <p className="mt-2 font-semibold text-black">
              {user.name || "Not Set"}
            </p>

            {!user.name && (
              <button
                onClick={() => setActiveTab("details")}
                className="text-sm text-[#003466] underline"
              >
                Set now
              </button>
            )}
          </div>

          <div className="space-y-2">
            <SidebarTab
              active={activeTab === "orders"}
              label="Orders"
              icon={<Package size={18} />}
              onClick={() => setActiveTab("orders")}
            />

            <SidebarTab
              active={activeTab === "details"}
              label="My Details"
              icon={<User size={18} />}
              onClick={() => setActiveTab("details")}
            />
          </div>
        </div>

        {/* ---------- CONTENT ---------- */}
        <div>

          {/* ----------- ORDERS ----------- */}
          {activeTab === "orders" && (
            <>
              <h2 className="text-2xl font-bold mb-5 text-black">
                My Orders
              </h2>

              {orders.length === 0 ? (
                <p className="text-gray-600">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <Link
                      key={o._id}
                      href={`/orders/${o._id}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="
                          p-5 rounded-2xl
                          bg-white border border-gray-200
                          shadow hover:shadow-md
                          transition
                          cursor-pointer
                          flex flex-col sm:flex-row
                          my-6
                          justify-between gap-5
                        "
                      >
                        {/* LEFT */}
                        <div>
                          <p className="text-xs text-gray-500">Order ID</p>

                          <p className="font-semibold text-black break-all">
                            {o._id}
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
                            ₹{o.total} • {o.items.length} items
                          </p>
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-2 text-right">

                          <div className="flex items-center justify-end gap-2 text-black">
                            {o.deliveryType === "HOME" ? (
                              <>
                                <Truck size={14}/> Home
                              </>
                            ) : (
                              <>
                                <Store size={14}/> Boutique
                              </>
                            )}
                          </div>

                          <p className="text-xs text-gray-500">
                            {o.status.replace("_", " ")}
                          </p>

                          {/* MAP DIRECTIONS */}
                          {o.deliveryType === "BOUTIQUE" &&
                            o.pickupBoutiqueId?.lat &&
                            o.pickupBoutiqueId?.long && (

                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`https://www.google.com/maps/dir/?api=1&destination=${o.pickupBoutiqueId.lat},${o.pickupBoutiqueId.long}`}
                                onClick={(e) => e.stopPropagation()}
                                className="
                                  inline-flex items-center gap-1 text-xs
                                  text-[#003466] hover:underline
                                "
                              >
                                <MapPin size={12}/>
                                Directions
                              </a>
                            )}
                        </div>

                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ----------- DETAILS ----------- */}
          {activeTab === "details" && (
            <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-6">

              <h2 className="text-2xl font-bold text-black">
                Edit Profile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
                <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <Input label="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                <Input label="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                <Input label="Landmark" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} />
              </div>

              <button
                onClick={saveProfile}
                className="
                  flex items-center gap-2
                  bg-[#003466] text-white
                  px-8 py-3 rounded-full
                  hover:bg-[#002850]
                "
              >
                <Save size={16} />
                Save Profile
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ------------------------------------- */

function SidebarTab({ active, label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl
        transition text-sm font-semibold
        ${active
          ? "bg-[#003466] text-white"
          : "bg-[#003466]/5 text-black hover:bg-[#003466]/10"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function Input({ label, value, ...props }) {
  return (
    <div>
      <label className="text-xs font-semibold text-black uppercase">
        {label}
      </label>

      <input
        value={value}
        {...props}
        className="
          w-full mt-1 px-4 py-2
          border-2 border-[#003466]/40
          rounded-lg
          text-black
          outline-none
          focus:border-[#003466]
          focus:ring-1 ring-[#003466]/30
        "
      />
    </div>
  );
}