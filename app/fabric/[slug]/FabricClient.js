"use client";

import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Star as StarIcon,
  StarHalf,
  StarOff,
} from "lucide-react";
import React, { useState, Suspense } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

// ✅ Skeleton Loader
function FabricSkeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto pt-24 px-4 sm:px-6 md:px-10">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        <div className="h-[300px] sm:h-[400px] md:h-[500px] bg-neutral-200 rounded-3xl" />
        <div className="space-y-5">
          <div className="h-8 w-3/4 bg-neutral-200 rounded-lg" />
          <div className="h-4 w-1/3 bg-neutral-200 rounded-lg" />
          <div className="h-20 bg-neutral-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function FabricClient({ fabric }) {
  return (
    <Suspense fallback={<FabricSkeleton />}>
      <section className="min-h-screen bg-white text-black pt-36 sm:pt-32 pb-20 px-4 sm:px-6 md:px-10 font-[Poppins]">
        <div className="max-w-7xl mx-auto">
          {/* === HEADER === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-16">
            {/* Gallery */}
            <FabricImageSlider images={fabric.images} name={fabric.name} />

            {/* Details */}
            <div className="w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
                {fabric.name}
              </h1>
              <p className="text-base sm:text-lg font-medium text-neutral-700 mb-6 sm:mb-8">
                {fabric.collectionName}
              </p>

              <ReviewStars avgStars={fabric.avgStars} reviews={fabric.reviews} />

              {/* Prices */}
              <div className="mb-8 sm:mb-10">
                <p className="text-2xl sm:text-3xl font-semibold text-black">
                  ₹{fabric.customerPrice}{" "}
                  <span className="text-neutral-400 text-sm sm:text-base line-through ml-2 sm:ml-3">
                    ₹{fabric.price}
                  </span>
                </p>
                <p className="text-sm sm:text-base text-neutral-700 mt-1">
                  Boutique price: ₹{fabric.boutiquePrice} / meter
                </p>
                <p
                  className={`font-medium mt-2 ${
                    fabric.stockLeft > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {fabric.stockLeft > 0
                    ? `${fabric.stockLeft} meters available`
                    : "Out of Stock"}
                </p>
              </div>

              <QtyCartSection fabric={fabric} />

              {/* Meta */}
              <div className="mt-10 border-t border-neutral-200 pt-6 text-sm sm:text-base space-y-1">
                <p>
                  <strong>Width:</strong> {fabric.width} inches
                </p>
                <p>
                  <strong>Material:</strong> {fabric.material}
                </p>
                <p>
                  <strong>Weave:</strong> {fabric.weave}
                </p>
                <p>
                  <strong>Color:</strong> {fabric.color}
                </p>
              </div>
            </div>
          </div>

          {/* === DETAILS === */}
          <div className="space-y-14 sm:space-y-20">
            <Section title="Description">{fabric.description}</Section>

            {fabric.careInstructions?.length > 0 && (
              <Section title="Care Instructions">
                <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                  {fabric.careInstructions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </Section>
            )}

            {fabric.faqs?.length > 0 && (
              <Section title="FAQs">
                <div className="space-y-4 sm:space-y-5">
                  {fabric.faqs.map((f, i) => (
                    <div
                      key={i}
                      className="border border-neutral-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition"
                    >
                      <h4 className="font-semibold text-base sm:text-lg mb-2">
                        {f.question}
                      </h4>
                      <p className="text-neutral-800 text-sm sm:text-base">
                        {f.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {fabric.reviews?.length > 0 && (
              <Section title="Reviews & Testimonials">
                <div className="grid sm:grid-cols-2 gap-6 sm:gap-10">
                  {fabric.reviews.map((t, i) => (
                    <div
                      key={i}
                      className="border border-neutral-200 rounded-3xl p-5 sm:p-6 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition"
                    >
                      <p className="italic mb-3 text-neutral-900 leading-relaxed text-sm sm:text-base">
                        “{t.review}”
                      </p>
                      <p className="font-semibold text-black">{t.name}</p>
                      <div className="flex gap-1 mt-2">
                        {Array.from({ length: t.stars }).map((_, j) => (
                          <StarIcon
                            key={j}
                            size={15}
                            className="text-[#FFD700] fill-[#FFD700]"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </section>
    </Suspense>
  );
}

// ✅ Responsive Image Slider
function FabricImageSlider({ images, name }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
    duration: 1200,
    renderMode: "performance",
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  React.useEffect(() => {
    const interval = setInterval(() => instanceRef.current?.next(), 5000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div className="relative w-full group">
      <div ref={sliderRef} className="keen-slider rounded-xl sm:rounded-3xl overflow-hidden">
        {images?.map((img, i) => (
          <div key={i} className="keen-slider__slide">
            <motion.div
              className="relative w-full h-[280px] sm:h-[400px] md:h-[550px] bg-neutral-100 flex items-center justify-center"
              initial={{ opacity: 0.8 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={img}
                alt={`${name}-${i}`}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-black p-2 sm:p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
      >
        ‹
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-black p-2 sm:p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
      >
        ›
      </button>

      {/* Dots */}
      {images?.length > 1 && (
        <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-all ${
                currentSlide === idx
                  ? "bg-black scale-125"
                  : "bg-neutral-400/60 hover:bg-neutral-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Stars with Half Ratings
function ReviewStars({ avgStars = 0, reviews = [] }) {
  const stars = Array.from({ length: 5 }).map((_, i) => {
    const diff = avgStars - i;
    if (diff >= 1)
      return <StarIcon key={i} size={18} className="text-[#FFD700] fill-[#FFD700]" />;
    if (diff > 0.3)
      return <StarHalf key={i} size={18} className="text-[#FFD700] fill-[#FFD700]" />;
    return <StarOff key={i} size={18} className="text-neutral-400" />;
  });

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex gap-1">{stars}</div>
      <span className="text-neutral-600 text-xs sm:text-sm">
        ({reviews?.length || 0} reviews)
      </span>
    </div>
  );
}

// ✅ Qty & Add to Cart
function QtyCartSection({ fabric }) {
  const [qty, setQty] = useState(1);
  const handleQtyChange = (delta) =>
    setQty((p) => Math.max(0.25, parseFloat((p + delta).toFixed(2))));
  const total = (fabric.customerPrice * qty).toFixed(2);

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center gap-3 sm:gap-4 mb-5">
        <button
          onClick={() => handleQtyChange(-0.25)}
          className="p-2 sm:p-3 bg-neutral-100 rounded-full hover:bg-neutral-200 transition"
        >
          <Minus size={16} />
        </button>
        <span className="text-base sm:text-lg font-semibold w-16 text-center">
          {qty}m
        </span>
        <button
          onClick={() => handleQtyChange(0.25)}
          className="p-2 sm:p-3 bg-neutral-100 rounded-full hover:bg-neutral-200 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      <p className="text-black mb-3 text-sm sm:text-base">
        <span className="font-semibold">Total:</span> ₹{total}
      </p>

      <button className="flex items-center justify-center gap-2 sm:gap-3 bg-black text-white px-8 sm:px-10 py-2.5 sm:py-3 rounded-full shadow-md hover:shadow-lg hover:bg-neutral-900 transition-all text-xs sm:text-sm uppercase tracking-wide font-medium w-full sm:w-auto">
        <ShoppingBag size={16} /> Add to Cart
      </button>
    </div>
  );
}

// ✅ Section Wrapper
function Section({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-black">
        {title}
      </h2>
      <div className="leading-relaxed text-neutral-900 text-sm sm:text-base">
        {children}
      </div>
    </motion.div>
  );
}