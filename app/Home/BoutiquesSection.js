"use client";

import { motion } from "framer-motion";

const boutiques = [
  {
    id: 1,
    name: "Boutique Luxe",
    location: "Downtown, NY",
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    link: "/boutiques/boutique-luxe",
  },
  {
    id: 2,
    name: "Designer Corner",
    location: "Beverly Hills, CA",
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    link: "/boutiques/designer-corner",
  },
  {
    id: 3,
    name: "Elegant Threads",
    location: "Paris, France",
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    link: "/boutiques/elegant-threads",
  },
  {
    id: 4,
    name: "Chic Atelier",
    location: "Milan, Italy",
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    link: "/boutiques/chic-atelier",
  },
];

export default function BoutiquesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[var(--color-base)] to-[#f9f9fc]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold text-[var(--color-primary)] mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Boutiques
        </motion.h2>
        <motion.p
          className="text-gray-600 max-w-3xl mx-auto mb-16 text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Discover curated boutiques with exclusive selections. Elevate your style with premium experiences and bespoke services.
        </motion.p>

        <div className="relative grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {boutiques.map((boutique, index) => (
            <motion.a
              key={boutique.id}
              href={boutique.link}
              className="relative group rounded-3xl overflow-hidden cursor-pointer shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              {/* Background Image */}
              <div
                className="w-full h-96 bg-cover bg-center transform transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${boutique.image})` }}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/40 group-hover:via-black/10" />

              {/* Boutique Info */}
              <div className="absolute bottom-6 left-6 text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[var(--color-accent)] transition-colors duration-500">
                  {boutique.name}
                </h3>
                <p className="text-gray-200 text-sm md:text-base mt-1">{boutique.location}</p>
                <span className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-[var(--color-accent)] to-[#ff85a2] text-[var(--color-primary)] font-semibold rounded-full shadow-lg text-sm md:text-base transition-all duration-300 group-hover:scale-105">
                  Explore
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}