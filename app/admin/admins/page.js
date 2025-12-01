"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, UserPlus, Save, Lock } from "lucide-react";

const ALL_ROUTES = [
  "/admin",
  "/admin/boutiques-management",
  "/admin/fabric-management",
  "/admin/home-measurements",
  "/admin/design-management",
  "/admin/settings",
  "/admin/admins",
];

export default function AdminUsersPage() {
  const [me, setMe] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [changing, setChanging] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    routes: [...ALL_ROUTES],
  });

  const [newPassword, setNewPassword] = useState("");

  const token =
    sessionStorage.getItem("admin_auth") ||
    localStorage.getItem("admin_auth");

  // ---------------------------------
  // LOAD CURRENT ADMIN
  // ---------------------------------
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const meRes = await fetch("/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const meData = await meRes.json();
        if (!meData.success) return setLoading(false);

        setMe(meData.admin);

        if (meData.admin.role === "SUPER_ADMIN") {
          const listRes = await fetch("/api/admin/subadmins", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const listData = await listRes.json();
          if (listData.success) setAdmins(listData.admins || []);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ---------------------------------
  // CREATE SUB ADMIN
  // ---------------------------------
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);

    const res = await fetch("/api/admin/subadmins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        password: form.password,
        allowedRoutes: form.routes,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Sub Admin created");

      setAdmins((prev) => [data.admin, ...prev]);

      setForm({
        name: "",
        phone: "",
        password: "",
        routes: [...ALL_ROUTES],
      });
    } else {
      alert(data.error || "Failed to create admin");
    }

    setCreating(false);
  };

  // ---------------------------------
  // CHANGE PASSWORD — SUB ADMIN
  // ---------------------------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChanging(true);

    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Password updated");
      setNewPassword("");
    } else {
      alert(data.error || "Password update failed");
    }

    setChanging(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Loading admin panel...
      </div>
    );

  if (!me)
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Not authorized. Please login again.
      </div>
    );

  const isSuper = me.role === "SUPER_ADMIN";

  return (
    <section className="min-h-screen bg-gray-100 pt-32 pb-16 px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-black">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield />
            Admin Management
          </h1>
          <p>
            Logged in as <b>{me.name}</b> ({me.role})
          </p>
        </div>

        {/* SUPER ADMIN CREATE FORM */}
        {isSuper && (
          <motion.div className="bg-white shadow-xl rounded-3xl p-6 space-y-6">

            <h2 className="flex gap-2 items-center font-semibold text-lg text-black">
              <UserPlus size={18} />
              Create Sub Admin
            </h2>

            <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">

              {["name","phone","password"].map((f) => (
                <input
                  key={f}
                  type={f === "password" ? "password" : "text"}
                  required
                  placeholder={f.toUpperCase()}
                  value={form[f]}
                  className="border border-gray-300 px-3 py-2 rounded-lg bg-white text-black"
                  onChange={(e) =>
                    setForm((old) => ({ ...old, [f]: e.target.value }))
                  }
                />
              ))}

              {/* ROUTES */}
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-1 text-black">
                  Allowed Routes
                </h3>

                <div className="grid sm:grid-cols-2 gap-2 text-black">
                  {ALL_ROUTES.map((route) => (
                    <label
                      key={route}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={form.routes.includes(route)}
                        onChange={() =>
                          setForm((f) => ({
                            ...f,
                            routes: f.routes.includes(route)
                              ? f.routes.filter((r) => r !== route)
                              : [...f.routes, route],
                          }))
                        }
                      />
                      {route}
                    </label>
                  ))}
                </div>
              </div>

              <button
                disabled={creating}
                type="submit"
                className="md:col-span-2 bg-[#003466] text-white py-2 rounded-full"
              >
                <Save size={16} className="inline mr-2" />
                {creating ? "Creating..." : "Create Sub Admin"}
              </button>

            </form>
          </motion.div>
        )}

        {/* SUB ADMIN CHANGE PASSWORD */}
        {!isSuper && (
          <motion.div className="bg-white shadow-xl rounded-3xl p-6 space-y-4">

            <div className="flex items-center gap-2 font-semibold text-black">
              <Lock size={18} />
              Change Password
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <input
                type="password"
                required
                placeholder="New Password"
                value={newPassword}
                className="border border-gray-300 w-full px-3 py-2 rounded-lg bg-white text-black"
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                disabled={changing}
                className="w-full bg-[#003466] text-white py-2 rounded-full"
              >
                {changing ? "Updating..." : "Update Password"}
              </button>

            </form>

          </motion.div>
        )}

        {/* ADMIN LIST */}
        {isSuper && (
          <motion.div className="bg-white shadow-xl rounded-3xl p-6">

            <h2 className="font-semibold mb-3 text-black">
              Existing Sub Admins
            </h2>

            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr className="text-black">
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a._id} className="border-t text-black">
                    <td>{a.name}</td>
                    <td>{a.phone}</td>
                    <td>{a.isActive ? "Active" : "Disabled"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </motion.div>
        )}
      </div>
    </section>
  );
}