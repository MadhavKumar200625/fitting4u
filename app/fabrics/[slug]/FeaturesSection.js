"use client";

import { Truck, Headphones, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Truck,
    title: "All India Shipping",
    desc: "We deliver across India with trusted logistics partners ensuring fast, safe, and reliable doorstep delivery. Every order is carefully packed to preserve fabric quality.",
  },
  {
    icon: Headphones,
    title: "Expert Fabric Guidance",
    desc: "Get personalized assistance from textile experts for fabric selection, styling, and stitching recommendations — tailored to your needs.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Seamless and secure checkout with trusted payment gateways including UPI, cards, and net banking — ensuring complete peace of mind.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full bg-[#fff9fb] py-24 px-6 md:px-16 lg:px-24">
      
      {/* HEADER */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#003466] tracking-tight relative inline-block">
          Why Choose Fitting4u
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-16 h-[3px] bg-[#ffc1cc] rounded-full"></span>
        </h2>

        <p className="text-gray-600 mt-4 max-w-xl mx-auto text-sm md:text-base">
          Designed to deliver a seamless experience from fabric selection to final stitching.
        </p>
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {features.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-[#003466]/5 shadow-sm hover:shadow-md transition text-center"
            >
              {/* ICON */}
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[#003466]/10 mb-5 relative">
                
                {/* soft pink glow */}
                <div className="absolute w-full h-full rounded-full bg-[#ffc1cc]/30 blur-xl opacity-40"></div>

                <Icon className="w-7 h-7 text-[#003466] relative z-10" />
              </div>

              {/* TITLE */}
              <h3 className="text-lg md:text-xl font-semibold text-[#003466]">
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}