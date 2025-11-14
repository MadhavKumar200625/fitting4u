"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const dresses = [
  {
    id: 1,
    name: "Emerald Satin Gown",
    price: "₹12,999",
    image:
      "https://dylandavids.com/cdn/shop/files/DD1318-2110.jpg?format=webp&v=1739916635&width=900",
    tag: "New Arrival",
  },
  {
    id: 2,
    name: "Ivory Lace Dress",
    price: "₹9,499",
    image:
      "https://www.teutamatoshi.com/cdn/shop/files/BC8CF42D-D332-42A9-9FF4-AF18AEC67E3D.jpg?v=1707378617",
    tag: "Luxury Edit",
  },
  {
    id: 3,
    name: "Midnight Velvet Suit",
    price: "₹14,799",
    image:
      "https://madhusha.in/cdn/shop/files/3_8_64ad834e-358f-426c-ab5c-57b06c3faf4f.jpg?v=1729861805&width=1445",
    tag: "Exclusive",
  },
  {
    id: 4,
    name: "Rose Gold Lehenga",
    price: "₹19,999",
    image:
      "https://i.pinimg.com/736x/4b/3d/ce/4b3dce75b28f4fd0a45e3b7394339eec.jpg",
    tag: "Designer Pick",
  },
];

export default function BoutiqueSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Boutique Highlights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Step into curated luxury — a glimpse of boutique-ready silhouettes
            redefining modern Indian elegance.
          </p>
        </motion.div>

        {/* Grid Layout (Responsive, No Scroll) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {dresses.map((dress, index) => (
            <motion.div
              key={dress.id}
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_45px_rgba(0,0,0,0.08)] transition-all duration-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Tag */}
              <div className="absolute top-4 left-4 z-10 bg-[var(--color-accent)] text-[var(--color-primary)] text-xs font-medium uppercase px-3 py-1 rounded-full shadow-md">
                {dress.tag}
              </div>

              {/* Image */}
              <div className="relative w-full h-[460px] overflow-hidden">
                <img
                  src={dress.image}
                  alt={dress.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-all duration-500"></div>

                {/* Hover Info */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <h3 className="text-2xl font-semibold mb-1">{dress.name}</h3>
                  <p className="text-lg font-medium mb-3 text-[var(--color-accent)]">
                    {dress.price}
                  </p>
                  <button className="px-6 py-2 bg-white/90 text-gray-900 font-medium rounded-full shadow-sm hover:bg-white transition-all">
                    View Details
                  </button>
                </div>
              </div>

              {/* Default Footer */}
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {dress.name}
                </h3>
                <p className="text-gray-500">{dress.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/boutiques" className="px-10 py-4  bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-gray-900 font-medium text-lg rounded-full shadow-md hover:shadow-[0_0_30px_rgba(255,193,204,0.4)] transition-all duration-300">
            Explore Full Boutique Collection
          </Link>
        </motion.div>
      </div>

      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-[-150px] w-[400px] h-[400px] bg-[var(--color-accent)]/20 rounded-full blur-3xl"></div>
    </section>
  );
}