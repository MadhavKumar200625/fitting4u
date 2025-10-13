"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HomeMeasurementSection() {
  return (
    <section className="relative py-28 bg-white overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#fff] via-[#fafafa] to-[#fdfdfd]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        {/* IMAGE SIDE */}
        <motion.div
          className="relative w-full lg:w-1/2"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 shadow-[0_15px_60px_rgba(0,0,0,0.08)]">
            <Image
              src="https://fcdrycleaners.com/wp-content/uploads/2024/06/Essential-Custom-Tailoring-Tips-For-A-Perfect-Fit-998x570.jpg"
              alt="Home Measurement"
              width={800}
              height={600}
              className="object-cover w-full h-[480px] transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-30 rounded-[2rem]" />
          </div>

          {/* Floating Info Box */}
          <motion.div
            className="absolute -bottom-8 left-8 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-gray-100 rounded-2xl px-8 py-5 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-1">
              Premium Tailor Visit
            </h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Our experts arrive with precision tools and experience to ensure
              your fit feels effortless and bespoke.
            </p>
          </motion.div>
        </motion.div>

        {/* TEXT SIDE */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
            Tailoring Redefined —{" "}
            <span className="text-black">
              Precision at Your Doorstep
            </span>
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
            Transform your measurements into confidence. Fitting4U brings
            couture-level craftsmanship to your living room — merging
            convenience with the artistry of a perfect fit.
          </p>

          <ul className="space-y-3 mb-10">
            {[
              "Professional tailors visit your home",
              "Measurements recorded with precision tools",
              "Quick digital fitting report shared instantly",
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 text-gray-700 text-base"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
              >
                <span className="w-2.5 h-2.5 mt-2 bg-[var(--color-accent)] rounded-full"></span>
                {item}
              </motion.li>
            ))}
          </ul>

          {/* CTA Button */}
          <motion.button
            className="px-10 py-4 bg-gray-900 text-white text-lg rounded-full font-medium shadow-md hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Book Your Measurement
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}