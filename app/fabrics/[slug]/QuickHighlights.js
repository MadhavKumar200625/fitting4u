"use client";

import { motion } from "framer-motion";
import { Package, Globe, Banknote, Truck } from "lucide-react";

const items = [
  { icon: Package, title: "Customized\nFabric & Prints" },
  { icon: Globe, title: "Pan India\nShipping" },
  { icon: Banknote, title: "Cash on Delivery\nAvailable" },
  { icon: Truck, title: "Free Shipping\nAbove ₹499" },
];

export default function QuickHighlights() {
  return (
    <div className="mt-8">
      
      {/* MOBILE → SCROLL | DESKTOP → GRID */}
      <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible no-scrollbar">

        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="min-w-[140px] md:min-w-0"
            >
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-5 rounded-2xl border border-[#003466]/15 bg-[#fff9fb] hover:shadow-md transition">

                {/* ICON */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#003466]/10 mb-3 relative">
                  <div className="absolute w-full h-full bg-[#ffc1cc]/40 blur-md rounded-full"></div>
                  <Icon className="w-5 h-5 text-[#003466] relative z-10" />
                </div>

                {/* TEXT */}
                <p className="text-xs sm:text-sm font-medium text-[#003466] leading-tight whitespace-pre-line">
                  {item.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}