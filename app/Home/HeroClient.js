"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function HeroSliderClient({ slides }) {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length)
    return (
      <section className="w-full h-[70vh] flex items-center justify-center bg-gray-100 text-gray-500">
        No banners configured
      </section>
    );

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative w-full mt-32 h-[80vh] md:h-[70vh] overflow-hidden bg-[#f9fafb]">
      {/* BACKGROUND IMAGES */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {slides.map(
            (slide, idx) =>
              current === idx && (
                <motion.div
                  key={slide._id || idx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0"
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      transform: "scale(1.02)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,52,102,0.7)] via-[rgba(0,52,102,0.4)] to-transparent"></div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-6 md:px-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white drop-shadow-md mb-4 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {slides[current].heading}
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {slides[current].subheading}
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {slides[current].buttonText && (
            <a
              href={slides[current].buttonLink || "#"}
              className="px-8 py-3 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-full font-medium shadow-lg hover:scale-105 transition"
            >
              {slides[current].buttonText}
            </a>
          )}
        </motion.div>
      </div>

      {/* ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
      >
        <ChevronRight size={28} />
      </button>

      {/* SCROLL CUE */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={32} className="text-white opacity-80" />
        </motion.div>
      </div>
    </section>
  );
}