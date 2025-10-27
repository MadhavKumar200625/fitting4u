"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Store, Shirt, Ruler, Settings } from "lucide-react";

export default function AdminHome() {
  const sections = [
    {
      name: "Boutiques Management",
      icon: <Store size={30} />,
      link: "/admin/boutiques-management",
      desc: "Manage all boutiques, verify them, and update their details.",
    },
    {
      name: "Fabric Store Management",
      icon: <Shirt size={30} />,
      link: "/admin/fabric-management",
      desc: "Control fabric categories, prices, and availability.",
    },
    {
      name: "Home Measurement",
      icon: <Ruler size={30} />,
      link: "/admin/home-measurements",
      desc: "Track bookings, schedule tailor visits, and manage regions.",
    },
    {
      name: "Settings",
      icon: <Settings size={30} />,
      link: "/admin/settings",
      desc: "Manage users, permissions, and system configuration.",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#ffffff] to-[#f9f9f9] py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage everything from one place — boutiques, fabrics, users, and more.
          </p>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {sections.map((section, i) => (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={section.link}
                className="group relative block bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_50px_rgba(0,0,0,0.1)] transition-all duration-500"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-[var(--color-accent)]/20 text-[var(--color-primary)] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {section.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {section.desc}
                </p>
                <div className="absolute bottom-5 right-6 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}