"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HomeMeasurementSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#ffffff] to-[#f9f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        {/* Image Side */}
        <motion.div
          className="relative w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120"
            alt="Home Measurement Service"
            width={800}
            height={600}
            className="rounded-3xl object-cover w-full h-[480px] transition-transform duration-700 hover:scale-105"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl" />
        </motion.div>

        {/* Text Side */}
        <motion.div
          className="w-full lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-4 tracking-tight">
            Perfect Fit, Delivered to Your Home
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            With Fitting4U’s professional home measurement service, precision meets convenience. 
            Our experts visit your home, ensuring your bespoke garments are tailored with absolute accuracy.
          </p>

          {/* CTA Card */}
          <motion.div
            className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg inline-block px-8 py-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-[var(--color-primary)] mb-2">
              Book Your Measurement
            </h3>
            <p className="text-gray-600 mb-4">
              Available in select cities across India — schedule your session in minutes.
            </p>
            <button className="px-6 py-3 bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold rounded-full shadow-lg hover:shadow-2xl hover:bg-gradient-to-r from-[var(--color-accent)] to-[#ff85a2] transition-all duration-300">
              Book Now
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}