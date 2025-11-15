"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Star as StarIcon,
  StarHalf,
  StarOff,
  ChevronDown,
} from "lucide-react";
import React, { useState, Suspense } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Toaster, toast } from "react-hot-toast";

// ✅ Skeleton Loader
function FabricSkeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto pt-24 px-4 sm:px-6 md:px-10">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        <div className="h-[400px] sm:h-[500px] bg-neutral-200 rounded-3xl" />
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
  const [cartQty, setCartQty] = useState(0);
    const [isBoutiqueUser, setIsBoutiqueUser] = useState(false);

  useEffect(() => {
    const boutique = localStorage.getItem("boutique");
    setIsBoutiqueUser(boutique === "true");
  }, []);

  // Load cart data on mount
  useEffect(() => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = existingCart.reduce((sum, item) => sum + item.qty, 0);
    setCartQty(total);
  }, []);

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#003466",
            color: "#fff",
            fontFamily: "Poppins, sans-serif",
            borderRadius: "12px",
            padding: "12px 18px",
          },
          success: {
            iconTheme: { primary: "#ffc1cc", secondary: "#003466" },
          },
        }}
      />
      <Suspense fallback={<FabricSkeleton />}>
        <section className="min-h-screen bg-gradient-to-b from-white via-[#f9fafc] to-[#eef2f6] text-black pt-36 sm:pt-32 pb-32 px-4 sm:px-6 md:px-10 font-[Poppins]">
          <div className="max-w-7xl mx-auto">
            {/* === HEADER === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-24 items-start">
              {/* === LEFT COLUMN === */}
              <div className="space-y-16">
                <FabricImageSlider images={fabric.images} name={fabric.name} />

                <div className="hidden sm:block">
                  <Section title="Description">
                    <p className="text-neutral-800 leading-relaxed text-lg whitespace-pre-line">
                      {fabric.description}
                    </p>
                  </Section>
                </div>
              </div>

              {/* === RIGHT COLUMN === */}
              <div className="w-full">
                {/* Title */}
                <div className="mb-10 border-l-4 border-[#003466] pl-4">
                  <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-[#003466]">
                    {fabric.name}
                  </h1>
                  <p className="text-lg text-neutral-600 font-medium mt-2">
                    {fabric.collectionName}
                  </p>
                </div>

                {/* Ratings */}
                <ReviewStars
                  avgStars={fabric.avgStars}
                  reviews={fabric.reviews}
                />

                <div className="mb-10 bg-white shadow-lg rounded-2xl p-6 border border-neutral-100 relative overflow-hidden">
                  {/* Discount Badge */}
                  <div className="absolute top-0 right-0 bg-[#003466] text-white text-xs font-medium px-3 py-1 rounded-bl-xl">
                    {Math.round(
                      ((fabric.price - fabric.customerPrice) / fabric.price) *
                        100
                    )}
                    % OFF
                  </div>

                  {/* Price Row */}
                  <div className="flex items-end  flex-wrap gap-2">
                    <div>
                      <p className="text-3xl sm:text-4xl font-bold text-[#003466] leading-tight">
                        ₹{fabric.customerPrice}
                        {" / meter "}
                        <span className="text-xl sm:text-2xl  whitespace-nowrap mb-1">
                          (Inclusive of all taxes)
                        </span>
                      </p>
                      <span className="text-neutral-400 text-xl line-through ml-2 font-normal">
                        ₹{fabric.price} / meter
                      </span>
                      {isBoutiqueUser && (
  <p className="text-base text-neutral-700 mt-2">
    Boutique Price: ₹{fabric.boutiquePrice} / meter
  </p>
)}
                      <p className="text-black text-base mt-1 font-medium">
                        You save ₹
                        {(fabric.price - fabric.customerPrice).toFixed(2)}
                      </p>
                    </div>

                    {/* Taxes Note */}
                  </div>

                  {/* Stock Status */}
                  <p
                    className={`font-medium mt-4 ${
                      fabric.stockLeft > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {fabric.stockLeft > 0
                      ? `${fabric.stockLeft} meters available`
                      : "Out of Stock"}
                  </p>
                </div>

                <QtyCartSection fabric={fabric} setCartQty={setCartQty} cartQty={cartQty} />

                {/* Specifications */}
                <div className="mt-12 bg-white border border-neutral-100 rounded-3xl shadow-sm p-6 space-y-2">
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

                <div className="block sm:hidden">
                  <Section title="Description">
                    <p className="text-neutral-800 leading-relaxed text-lg whitespace-pre-line">
                      {fabric.description}
                    </p>
                  </Section>
                </div>

                {/* Dropdown Info Sections (Care comes first) */}
                <div className="mt-6 divide-y divide-neutral-200 bg-white/70 backdrop-blur-sm rounded-2xl border border-neutral-100 overflow-hidden">
                  {/* Care Instructions FIRST */}
                  {fabric.careInstructions?.length > 0 && (
                    <DropdownSection title="Care Instructions">
                      <ul className="list-disc list-inside space-y-2 text-neutral-700">
                        {fabric.careInstructions.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </DropdownSection>
                  )}

                  <DropdownSection title="Shipping Information">
                    <p>
                      Orders are processed within 24–48 hours. Delivery
                      typically takes 5–7 business days.
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Free shipping on orders above ₹999.</li>
                      <li>International shipping available on request.</li>
                      <li>
                        Fabric is shipped rolled or folded to prevent creases.
                      </li>
                    </ul>
                  </DropdownSection>

                  <DropdownSection title="Returns & Exchange Policy">
                    <p>
                      Returns are accepted within 7 days of delivery if the
                      fabric is uncut and unused.
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Fabric once cut cannot be returned or exchanged.</li>
                      <li>
                        For damaged or defective items, contact support within
                        48 hours.
                      </li>
                      <li>
                        Refunds will be processed within 5–7 working days.
                      </li>
                    </ul>
                  </DropdownSection>

                  <DropdownSection title="Ask a Question">
                    <p>
                      Have queries about customization, availability, or
                      wholesale? Reach out to us:
                    </p>
                    <div className="mt-3 space-y-1 text-[#003466] font-medium">
                      <p>Email: support@fitting-4-u.com</p>
                      <p>Phone: +91 some sample number</p>
                    </div>
                  </DropdownSection>

                  <DropdownSection title="Additional Information">
                    <ul className="space-y-2">
                      <li>
                        <strong>Category:</strong> Dress Material
                      </li>
                      <li>
                        <strong>Origin:</strong> Handwoven in India
                      </li>
                      <li>
                        <strong>Fabric Code:</strong> FBR-2025-IVS
                      </li>
                      <li>
                        <strong>Weight:</strong> 120 GSM
                      </li>
                    </ul>
                  </DropdownSection>
                </div>
              </div>
            </div>

            {/* === REVIEWS === */}
            {fabric.reviews?.length > 0 && (
              <Section title="Reviews & Testimonials">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {fabric.reviews.map((t, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="border border-neutral-100 bg-white rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition"
                    >
                      <p className="italic text-neutral-900 leading-relaxed mb-3">
                        “{t.review}”
                      </p>
                      <p className="font-semibold text-[#003466]">{t.name}</p>
                      <div className="flex gap-1 mt-2">
                        {Array.from({ length: t.stars }).map((_, j) => (
                          <StarIcon
                            key={j}
                            size={16}
                            className="text-[#FFD700] fill-[#FFD700]"
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </section>
      </Suspense>
      {/* 🛒 Floating Cart Indicator */}

    </>
  );
}

/* ---------- Image Slider ---------- */
function FabricImageSlider({ images, name }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    duration: 1200,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  React.useEffect(() => {
    const interval = setInterval(() => instanceRef.current?.next(), 4000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div className="relative w-full group">
      <div
        ref={sliderRef}
        className="keen-slider rounded-3xl overflow-hidden shadow-2xl"
      >
        {images?.map((img, i) => (
          <div key={i} className="keen-slider__slide">
            <motion.div
              className="relative w-full h-[350px] sm:h-[500px] md:h-[650px] bg-[#f1f3f5] flex items-center justify-center"
              initial={{ opacity: 0.9 }}
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

      {/* Dots */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {images?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === idx
                ? "bg-[#003466] scale-125"
                : "bg-neutral-300 hover:bg-neutral-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Stars ---------- */
function ReviewStars({ avgStars = 0, reviews = [] }) {
  const stars = Array.from({ length: 5 }).map((_, i) => {
    const diff = avgStars - i;
    if (diff >= 1)
      return (
        <StarIcon key={i} size={18} className="text-[#FFD700] fill-[#FFD700]" />
      );
    if (diff > 0.3)
      return (
        <StarHalf key={i} size={18} className="text-[#FFD700] fill-[#FFD700]" />
      );
    return <StarOff key={i} size={18} className="text-neutral-400" />;
  });

  return (
    <div className="flex items-center gap-2 mb-8">
      <div className="flex gap-1">{stars}</div>
      <span className="text-neutral-600 text-sm">
        ({reviews?.length || 0} reviews)
      </span>
    </div>
  );
}

/* ---------- Add to Cart Section with Remove & Reduce ---------- */
function QtyCartSection({ fabric, setCartQty, cartQty }) {
  const [qty, setQty] = useState(1);
  const [existingQty, setExistingQty] = useState(0);

  // Load existing item qty
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === fabric._id);
    setExistingQty(existingItem ? existingItem.qty : 0);
  }, [fabric._id, cartQty]);

  const handleQtyChange = (delta) =>
    setQty((p) => Math.max(0.25, parseFloat((p + delta).toFixed(2))));

  const total = (fabric.customerPrice * qty).toFixed(2);

  const updateCartState = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartQty(totalQty);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((i) => i.id === fabric._id);
    let message = "";

    if (index !== -1) {
      cart[index].qty = parseFloat(
        (parseFloat(cart[index].qty) + qty).toFixed(2)
      );
      message = `Updated quantity: ${cart[index].qty}m of "${fabric.name}"`;
    } else {
      cart.push({ id: fabric._id, qty: parseFloat(qty.toFixed(2)) });
      message = `Added ${qty}m of "${fabric.name}" to cart`;
    }

    updateCartState(cart);
    setExistingQty(cart.find((i) => i.id === fabric._id)?.qty || 0);
    toast.success(message);
  };

  const handleDecreaseQty = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((i) => i.id === fabric._id);
    if (index === -1) return;

    if (cart[index].qty > 0.25) {
      cart[index].qty = parseFloat((cart[index].qty - 0.25).toFixed(2));
      toast.success(`Reduced to ${cart[index].qty}m`);
    } else {
      cart.splice(index, 1);
      toast("Removed from cart", { icon: "🗑️" });
    }

    updateCartState(cart);
    setExistingQty(cart.find((i) => i.id === fabric._id)?.qty || 0);
  };

  const handleRemoveFromCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCart = cart.filter((i) => i.id !== fabric._id);

    updateCartState(newCart);
    setExistingQty(0);
    toast("Removed from cart", { icon: "🗑️" });
  };

  return (
    <div className="mb-10">
      {/* Qty Selector */}
      <div className="flex items-center gap-4 mb-5">
        <button
          onClick={() => handleQtyChange(-0.25)}
          className="p-3 bg-neutral-100 rounded-full hover:bg-neutral-200 transition"
        >
          <Minus size={16} />
        </button>
        <span className="text-lg font-semibold w-16 text-center">{qty}m</span>
        <button
          onClick={() => handleQtyChange(0.25)}
          className="p-3 bg-neutral-100 rounded-full hover:bg-neutral-200 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Total Price */}
      <p className="text-black mb-3">
        <span className="font-semibold">Total:</span> ₹{total}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-3 bg-[#003466] text-white px-10 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-[#002850] transition-all text-sm uppercase tracking-wide font-medium"
        >
          <ShoppingBag size={18} />{" "}
          {existingQty > 0 ? "Update Cart" : "Add to Cart"}
        </button>

        {existingQty > 0 && (
          <>
            <button
              onClick={handleDecreaseQty}
              className="flex items-center justify-center gap-2 bg-[#ffc1cc] text-[#003466] px-6 py-3 rounded-full shadow hover:shadow-lg hover:bg-[#ffb3bd] transition-all text-sm font-medium"
            >
              <Minus size={16} /> Reduce 0.25m
            </button>

            <button
              onClick={handleRemoveFromCart}
              className="flex items-center justify-center gap-2 border border-[#003466] text-[#003466] px-6 py-3 rounded-full hover:bg-[#003466] hover:text-white transition-all text-sm font-medium"
            >
              🗑️ Remove
            </button>
          </>
        )}
      </div>

      {/* Cart Info */}
      {cartQty > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-[#003466] font-medium text-base"
        >
          🧵 You have{" "}
          <span className="font-bold">{cartQty.toFixed(2)}m</span> total in your
          cart
          {existingQty > 0 && (
            <>
              {" "}
              | This fabric:{" "}
              <span className="font-bold">{existingQty.toFixed(2)}m</span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Section Wrapper ---------- */
function Section({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-10 mt-20">
        <h2 className="text-3xl font-bold text-[#003466] mb-3 tracking-tight">
          {title}
        </h2>
        <div className="w-16 h-[3px] bg-[#003466] mx-auto rounded-full"></div>
      </div>
      <div className="leading-relaxed text-neutral-900 text-base sm:text-lg max-w-5xl mx-auto">
        {children}
      </div>
    </motion.div>
  );
}

/* ---------- Compact Modern Dropdown ---------- */
function DropdownSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-neutral-200 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full py-4 px-5 text-left group"
      >
        <span className="text-[#003466] text-base sm:text-lg font-semibold group-hover:text-[#002850] transition-all">
          {title}
        </span>
        <ChevronDown
          size={18}
          className={`text-[#003466] transform transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-neutral-700 text-sm sm:text-base leading-relaxed px-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
