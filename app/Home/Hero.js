"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    headline: "Discover Your Perfect Fit",
    subtext: "Boutiques • Fabrics • Home Measurements",
    cta: ["Explore Boutiques", "Shop Fabrics", "Book Measurement"],
  },
  {
    id: 2,
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    headline: "Premium Fabrics, Curated For You",
    subtext: "High-quality fabrics at your fingertips",
    cta: ["Shop Fabrics", "Explore Boutiques"],
  },
  {
    id: 3,
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    headline: "Personalized Home Measurements",
    subtext: "We bring precision to your home",
    cta: ["Book Measurement", "Explore Boutiques"],
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  

  useEffect(() => {

    const initTimer = setTimeout(() => {
      window.scrollTo({ top: 150, behavior: "smooth" });
    }, 500);
    

    // Then scroll back up after 1 second
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);

    return () => {clearTimeout(timer);clearTimeout(initTimer)}
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const handleScrollCueClick = () => {
    window.scrollBy({ top: 200, behavior: "smooth" }); 
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <AnimatePresence key={slide.id}>
          {current === index && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image */}
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.55)] to-[rgba(0,0,0,0.25)]" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-0">
                <motion.h1
                  className="text-4xl md:text-6xl font-bold text-white mb-4 fade-in-up"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {slide.headline}
                </motion.h1>
                <motion.p
                  className="text-lg md:text-2xl text-white mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {slide.subtext}
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  {slide.cta.map((btn) => (
                    <button
                      key={btn}
                      className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-full border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/90 hover:scale-105 hover:shadow-2xl"
                    >
                      {btn}
                    </button>
                  ))}
                </motion.div>
              </div>

              {/* Scroll Cue */}
              <div
                className="absolute bottom-8 w-full flex justify-center cursor-pointer"
                onClick={handleScrollCueClick}
              >
                <motion.div
                  animate={{ y: [0, 15, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronDown size={40} className="text-white" />
                </motion.div>
              </div>

              {/* Left & Right Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-[rgba(0,0,0,0.35)] hover:bg-[rgba(0,0,0,0.55)] p-3 rounded-full transition-all shadow-lg"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-[rgba(0,0,0,0.35)] hover:bg-[rgba(0,0,0,0.55)] p-3 rounded-full transition-all shadow-lg"
              >
                <ChevronRight size={28} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </section>
  );
}