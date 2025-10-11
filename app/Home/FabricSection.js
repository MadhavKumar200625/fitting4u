"use client";

import { motion } from "framer-motion";

const fabrics = [
  {
    id: 1,
    name: "Silk Elegance",
    material: "100% Pure Silk",
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    link: "/fabric-store/silk-elegance",
  },
  {
    id: 2,
    name: "Linen Luxe",
    material: "Premium Linen",
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    link: "/fabric-store/linen-luxe",
  },
  {
    id: 3,
    name: "Cotton Comfort",
    material: "Organic Cotton",
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    link: "/fabric-store/cotton-comfort",
  },
  {
    id: 4,
    name: "Velvet Touch",
    material: "Luxury Velvet",
    image: "https://www.tradeuno.com/cdn/shop/collections/Abstract-min.webp?v=1718288697&width=1120",
    link: "/fabric-store/velvet-touch",
  },
];

export default function FabricsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Premium Fabrics
        </motion.h2>
        <motion.p
          className="text-gray-700 max-w-3xl mx-auto mb-16 text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover our curated collection of luxurious fabrics, perfect for
          custom tailoring and premium designs.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {fabrics.map((fabric, index) => (
            <motion.a
              key={fabric.id}
              href={fabric.link}
              className="relative group rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div
                className="w-full h-80 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 rounded-3xl"
                style={{ backgroundImage: `url(${fabric.image})` }}
              />
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-all duration-500 rounded-3xl" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-left">
                <h3 className="text-2xl font-bold text-[var(--color-primary)] group-hover:underline">
                  {fabric.name}
                </h3>
                <p className="text-gray-600 mt-1">{fabric.material}</p>
                <span className="mt-4 inline-block px-5 py-2 bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold rounded-full shadow-lg transition-all duration-300 group-hover:bg-gradient-to-r from-[var(--color-accent)] to-[#ff85a2]">
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