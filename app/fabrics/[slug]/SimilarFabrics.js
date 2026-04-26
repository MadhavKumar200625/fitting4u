"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ===== ANIMATION ===== */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function SimilarFabrics({ fabrics = [] }) {
  if (!fabrics || fabrics.length === 0) return null;

  const topRow = fabrics.slice(0, 4);
  const bottomRow = fabrics.slice(4, 8);

  return (
    <section className="mt-28 px-4 md:px-12 lg:px-20">

      {/* ===== TOP ===== */}
      <div className="mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#003466] tracking-tight">
            Curated For Your Taste
          </h2>
          <p className="text-gray-600 mt-3 max-w-xl">
            Handpicked fabrics aligned with your choice — refined in tone, texture, and craftsmanship.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10"
        >
          {topRow.map((item) => (
            <motion.div key={item._id} variants={itemAnim}>
              <FabricCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ===== BOTTOM ===== */}
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#003466] tracking-tight">
            You Might Also Like
          </h2>
          <p className="text-gray-600 mt-3 max-w-xl">
            Discover more fabrics curated for elegance and versatility.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10"
        >
          {bottomRow.map((item) => (
            <motion.div key={item._id} variants={itemAnim}>
              <FabricCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ===== CARD ===== */

function FabricCard({ item }) {
  const discount =
    item.price > item.customerPrice
      ? Math.round(((item.price - item.customerPrice) / item.price) * 100)
      : 0;

  return (
    <Link href={`/fabrics/${item.slug}`} className="block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-[#003466]/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
      >
        {/* IMAGE */}
        <div className="relative">
          <motion.img
            src={item.images?.[0]}
            alt={item.name}
            className="w-full h-64 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />

          {/* RATING */}
          <div className="absolute top-3 left-3 bg-white border border-[#003466]/10 px-2 py-1 rounded-full text-xs font-medium text-[#003466]">
            ★ {item.avgStars?.toFixed(1) || "0.0"}
          </div>

          {/* DISCOUNT BADGE */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-[#ffc1cc] text-[#003466] text-[10px] font-semibold px-2 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-1">
            {item.name}
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {item.material} • {item.weave}
          </p>

          {/* PRICE BLOCK */}
          <div className="mt-3 space-y-1">
            {/* MAIN PRICE */}
            <p className="text-base font-semibold text-[#003466]">
              ₹{item.customerPrice}
            </p>

            {/* MRP */}
            {item.price > item.customerPrice && (
              <p className="text-xs text-gray-400 line-through">
                ₹{item.price}
              </p>
            )}

            {/* BOUTIQUE PRICE */}
            <p className="text-[11px] text-gray-500">
              Boutique Price: ₹{item.boutiquePrice}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}