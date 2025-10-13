"use client";

import { motion } from "framer-motion";
import { Scissors, Star, Truck, ShieldCheck } from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Scissors size={34} />,
    title: "Tailored to Perfection",
    desc: "Every outfit is crafted with meticulous precision — measured, cut, and refined to match your individuality.",
  },
  {
    id: 2,
    icon: <Star size={34} />,
    title: "Premium Materials",
    desc: "We collaborate with renowned mills and trusted boutiques to source world-class fabrics built to last.",
  },
  {
    id: 3,
    icon: <Truck size={34} />,
    title: "Seamless Experience",
    desc: "From online booking to doorstep delivery — we blend luxury with convenience at every touchpoint.",
  },
  {
    id: 4,
    icon: <ShieldCheck size={34} />,
    title: "Trusted Craftsmanship",
    desc: "Our verified tailors and designers follow time-honored traditions while embracing modern aesthetics.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Why Choose Fitting4U
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            A seamless blend of modern innovation and timeless artistry — redefining how you experience
            bespoke fashion.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="relative group bg-white border border-gray-100 rounded-3xl p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gray-200 shadow-[0_2px_15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <motion.div
                    className="text-gray-800"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-base">
                  {feature.desc}
                </p>
              </div>

              {/* Subtle glow animation */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-black transition-opacity duration-500 rounded-3xl"></div>
            </motion.div>
          ))}
        </div>

        {/* Divider Line */}
        <motion.div
          className="w-full h-px bg-gray-100 mt-24 mb-0"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </section>
  );
}