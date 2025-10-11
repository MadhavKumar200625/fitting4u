"use client";

import { motion } from "framer-motion";
import { Home, Store, Scissors } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Boutiques",
    description: "Discover curated boutiques near you with premium selections.",
    icon: <Store size={48} className="text-[var(--color-primary)]" />,
    cta: "Explore Boutiques",
    link: "/boutiques",
  },
  {
    id: 2,
    title: "Fabric Store",
    description: "High-quality fabrics at your fingertips, delivered with ease.",
    icon: <Scissors size={48} className="text-[var(--color-primary)]" />,
    cta: "Shop Fabrics",
    link: "/fabric-store",
  },
  {
    id: 3,
    title: "Home Measurement",
    description: "Book professional measurements at your home, precise & easy.",
    icon: <Home size={48} className="text-[var(--color-primary)]" />,
    cta: "Book Measurement",
    link: "/home-measurement",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-[var(--color-base)]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What We Offer
        </motion.h2>
        <motion.p
          className="text-black max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Fitting4U brings premium services right to your doorstep. Choose what
          fits your style and comfort.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="card p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-[var(--color-primary)]">
                {service.title}
              </h3>
              <p className="text-black mb-4">{service.description}</p>
              <a
                href={service.link}
                className="btn-accent px-6 py-2 rounded-full text-white hover:shadow-lg transition-all duration-300"
              >
                {service.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}