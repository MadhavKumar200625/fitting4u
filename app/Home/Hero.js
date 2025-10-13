"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const slides = [
  {
    id: 1,
    image:
      "https://cdn.shopify.com/s/files/1/0817/7988/4088/files/image5_a36e393a-98fe-4f28-a8c6-46699cc1432d.png?v=1741877170",
    headline: "Discover Your Perfect Fit",
    subtext: "Boutiques • Fabrics • Home Measurements",
    cta: ["Explore Boutiques", "Shop Fabrics", "Book Measurement"],
  },
  {
    id: 2,
    image:
      "https://cdn.shopify.com/s/files/1/0817/7988/4088/files/image5_a36e393a-98fe-4f28-a8c6-46699cc1432d.png?v=1741877170",
    headline: "Premium Fabrics, Curated For You",
    subtext: "High-quality fabrics at your fingertips",
    cta: ["Shop Fabrics", "Explore Boutiques"],
  },
  {
    id: 3,
    image:
      "https://cdn.shopify.com/s/files/1/0817/7988/4088/files/image5_a36e393a-98fe-4f28-a8c6-46699cc1432d.png?v=1741877170",
    headline: "Personalized Home Measurements",
    subtext: "We bring precision to your home",
    cta: ["Book Measurement", "Explore Boutiques"],
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative w-full mt-32 h-[80vh] md:h-[70vh] overflow-hidden bg-[#f9fafb]">
      <div className="absolute inset-0">
        <AnimatePresence>
          {slides.map(
            (slide, index) =>
              current === index && (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0"
                >
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-[2000ms]"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      transform: "scale(1.02)",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,52,102,0.7)] via-[rgba(0,52,102,0.4)] to-transparent"></div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-6 md:px-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 max-w-3xl drop-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {slides[current].headline}
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {slides[current].subtext}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {slides[current].cta.map((btn) => (
            <button
              key={btn}
              className="px-8 py-3 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {btn}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <button
          onClick={prevSlide}
          className="bg-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,1)] text-[var(--color-primary)] p-2 rounded-full shadow-md transition-all"
        >
          <ChevronLeft size={28} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        <button
          onClick={nextSlide}
          className="bg-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,1)] text-[var(--color-primary)] p-2 rounded-full shadow-md transition-all"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Scroll Cue */}
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