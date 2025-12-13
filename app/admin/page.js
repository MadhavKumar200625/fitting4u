"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import jwt from "jsonwebtoken";
import { motion } from "framer-motion";

import {
  Store,
  Shirt,
  Ruler,
  Settings,
  Palette,
  Package,      // ✅ Orders
  Boxes         // ✅ Fabric Orders Home
} from "lucide-react";

const SECTIONS = [
  // ---------------- ORDER PANELS ----------------
  {
    name: "Active Orders",
    icon: Package,
    link: "/admin/active-order-management",
  },
  
  {
    name: "Orders Overview",
    icon: Boxes,
    link: "/admin/orders",
    
  },

  // ---------------- CORE BUSINESS ----------------
  {
    name: "Boutiques Management",
    icon: Store,
    link: "/admin/boutiques-management",
  },
  {
    name: "Fabric Store",
    icon: Shirt,
    link: "/admin/fabric-management",
  },
  {
    name: "Home Measurement",
    icon: Ruler,
    link: "/admin/home-measurements",
  },
  {
    name: "Design Now",
    icon: Palette,
    link: "/admin/design-management",
  },

  // ---------------- SYSTEM ----------------
  {
    name: "Admins",
    icon: Settings,
    link: "/admin/admins",
  },
  {
    name: "Settings",
    icon: Settings,
    link: "/admin/settings",
  },
  {
    name: "Applciation Home Page Management",
    icon: Settings,
    link: "/admin/fabric-home",
    
  },

];

export default function AdminHome() {
  const [allowedRoutes, setAllowedRoutes] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token =
      sessionStorage.getItem("admin_auth") ||
      localStorage.getItem("admin_auth");

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    const payload = jwt.decode(token);

    setRole(payload.role);

    if (payload.role === "SUPER_ADMIN") {
      setAllowedRoutes(SECTIONS.map((s) => s.link));
    } else {
      setAllowedRoutes(payload.routes || []);
    }
  }, []);

  const sections = SECTIONS.filter((s) =>
    role === "SUPER_ADMIN"
      ? true
      : allowedRoutes.includes(s.link)
  );

  return (
    <section className="min-h-screen bg-gray-100 pt-28 pb-16 px-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold text-black">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your platform sections from one place
        </p>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {sections.map((s, i) => {
          const Icon = s.icon;

          return (
            <motion.div
              key={s.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={s.link}
                className="
                  block p-8 bg-white rounded-3xl shadow 
                  hover:shadow-2xl hover:-translate-y-1 
                  transition-all duration-300 group
                "
              >
                {/* ICON */}
                <div
                  className="
                    w-14 h-14
                    flex items-center justify-center
                    rounded-2xl
                    bg-gray-100
                    mb-5
                  "
                >
                  <Icon
                    size={28}
                    className="text-black"
                  />
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-black mb-1">
                  {s.name}
                </h3>

                {/* DESC */}
                <p className="text-sm text-gray-500">
                  Open {s.name}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}