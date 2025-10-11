"use client";

import { motion } from "framer-motion";
import { Scissors, Star, Truck, ShieldCheck } from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Scissors size={36} />,
    title: "Tailored to Perfection",
    desc: "Every piece is measured, crafted, and finished to ensure the perfect fit — your individuality reflected in every stitch.",
  },
  {
    id: 2,
    icon: <Star size={36} />,
    title: "Premium Quality Materials",
    desc: "We handpick fabrics from trusted sources across the globe, ensuring only the finest textures reach your wardrobe.",
  },
  {
    id: 3,
    icon: <Truck size={36} />,
    title: "Convenient & Hassle-Free",
    desc: "From booking to doorstep delivery, experience smooth, effortless service that fits your lifestyle.",
  },
  {
    id: 4,
    icon: <ShieldCheck size={36} />,
    title: "Trusted Craftsmanship",
    desc: "Our experienced artisans and verified boutiques uphold the highest standards of quality and precision.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#fefefe] to-[#fff6f8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Section Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Fitting4U
        </motion.h2>
        <motion.p
          className="text-gray-700 max-w-2xl mx-auto mb-16 text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Every detail matters — from the fabric to the final fitting. We combine craftsmanship, technology, and style to redefine your fashion experience.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-[var(--color-primary)] text-white rounded-full shadow-md group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>

              {/* Accent Glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 bg-[var(--color-accent)] blur-3xl transition-all duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}