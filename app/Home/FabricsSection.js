"use client";

import { motion } from "framer-motion";

const fabrics = [
  {
    id: 1,
    name: "Silken Whisper",
    price: "₹2,499/meter",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcNACGUf9T5RjYfDK84ukD2fksq5qB_Iphjw&s",
    material: "Pure Chiffon",
  },
  {
    id: 2,
    name: "Velvet Luxe",
    price: "₹3,299/meter",
    image:
      "https://saniamaskatiya.com/cdn/shop/files/MG_1308_f6054f9c-5051-4ceb-8cd2-e71f1c04b6f2.jpg?v=1729761077&width=600",
    material: "Fine Velvet",
  },
  {
    id: 3,
    name: "Ivory Essence",
    price: "₹1,999/meter",
    image:
      "https://peacepoint.in/cdn/shop/files/WhatsAppImage2025-01-31at4.32.13PM_1.jpg?v=1738403022&width=1067",
    material: "Cotton-Linen Blend",
  },
  {
    id: 4,
    name: "Golden Weave",
    price: "₹4,999/meter",
    image:
      "https://clothsvilla.com/cdn/shop/products/14_4d286a28-e4b8-4afc-aad6-1f3637c025ba_1024x1024.jpg?v=1698869117",
    material: "Banarasi Brocade",
  },
];

export default function FabricShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Exquisite Fabrics
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore a curated collection of timeless fabrics that define luxury,
            comfort, and sophistication.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {fabrics.map((fabric) => (
            <div
              key={fabric.id}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative w-full h-[360px] overflow-hidden">
                <img
                  src={fabric.image}
                  alt={fabric.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <h3 className="text-2xl font-semibold mb-1 tracking-wide">
                    {fabric.name}
                  </h3>
                  <p className="text-sm text-gray-200 mb-2">
                    {fabric.material}
                  </p>
                  <p className="text-lg font-medium text-[var(--color-accent)]">
                    {fabric.price}
                  </p>
                  <button className="mt-4 px-6 py-2 rounded-full bg-white/90 text-gray-900 font-medium shadow-md hover:bg-white transition-all duration-300">
                    View Details
                  </button>
                </div>
              </div>

              {/* Text (Visible on Idle) */}
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {fabric.name}
                </h3>
                <p className="text-gray-500 text-sm">{fabric.material}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="px-10 py-4 bg-[var(--color-accent)] text-gray-900 font-medium text-lg rounded-full shadow-md hover:shadow-lg hover:bg-[#ffb8c4] transition-all duration-300">
            Browse All Fabrics
          </button>
        </div>
      </div>
    </section>
  );
}