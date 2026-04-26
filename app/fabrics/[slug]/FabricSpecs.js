"use client";

import { Ruler, Layers, Grid, Palette } from "lucide-react";
import { motion } from "framer-motion";

export default function FabricSpecs({ fabric }) {
  const specs = [
    { icon: Ruler, label: "Width", value: `${fabric.width} in` },
    { icon: Layers, label: "Material", value: fabric.material },
    { icon: Grid, label: "Weave", value: fabric.weave },
    { icon: Palette, label: "Color", value: fabric.color },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="my-6"
    >
      <div className="bg-[#fafafa] border border-neutral-200 rounded-2xl p-4">
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {specs.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white border border-neutral-100 hover:shadow-sm transition"
              >
                {/* ICON */}
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#003466]/5 relative">
                  <div className="absolute w-full h-full bg-[#ffc1cc]/20 blur-md rounded-lg"></div>
                  <Icon className="w-4 h-4 text-[#003466]/80 relative z-10" />
                </div>

                {/* TEXT */}
                <div className="leading-tight">
                  <p className="text-[11px] text-gray-500">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}