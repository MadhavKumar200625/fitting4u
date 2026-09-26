"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const featuredBoutiques = [
  {
    slug: "aryatha-fashion-studio",
    name: "Aryatha Fashion Studio",
    location: "Bengaluru",
    specialty: "Bridal & Occasion Wear",
    logo: "A",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "golden-lotus-designer-studio",
    name: "Golden Lotus Designer Studio",
    location: "Bengaluru",
    specialty: "Designer Dresses",
    logo: "G",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "kianaa-fashion-studio-3",
    name: "Kianaa Fashion Studio",
    location: "Bengaluru",
    specialty: "Luxury Tailoring",
    logo: "K",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "ethnic-barn-boutique-vignan-nagar",
    name: "Ethnic Barn Boutique",
    location: "Vignan Nagar",
    specialty: "Ethnic & Festive Edit",
    logo: "E",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "riddhi-designer-boutique",
    name: "Riddhi Designer Boutique",
    location: "Bengaluru",
    specialty: "Custom Fashion",
    logo: "R",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "aadvey-designer-studio-2",
    name: "Aadvey Designer Studio",
    location: "Bengaluru",
    specialty: "Modern Couture",
    logo: "A",
    image:
      "https://images.unsplash.com/photo-1524503033410-cd2d5e10c7d9?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "asha-boutique-tailoring-embroidery-works-3",
    name: "Asha Boutique & Embroidery Works",
    location: "Bengaluru",
    specialty: "Tailoring & Embroidery",
    logo: "A",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "mikhu-clothing-brand-5",
    name: "Mikhu Clothing Brand",
    location: "Bengaluru",
    specialty: "Contemporary Style",
    logo: "M",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
];

export default function BoutiqueSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]/80">
            Curated boutique network
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Handpicked designer studios across Bengaluru
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredBoutiques.map((boutique, index) => (
            <motion.div
              key={boutique.slug}
              className="group overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={boutique.image}
                  alt={boutique.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/90 text-sm font-bold text-[var(--color-primary)] shadow-sm">
                  {boutique.logo}
                </div>
                <div className="absolute left-3 top-14 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                  {boutique.specialty}
                </div>
              </div>

              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold leading-snug text-gray-900">{boutique.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={14} className="text-[var(--color-primary)]" />
                  <span>{boutique.location}</span>
                </div>
                <Link
                  href={`/boutiques/${boutique.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary)]"
                >
                  View boutique
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="/boutiques"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-8 py-4 text-base font-medium text-gray-900 shadow-md transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white hover:shadow-[0_0_30px_rgba(255,193,204,0.4)]"
          >
            Explore Full Boutique Collection
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      <div className="absolute right-[-150px] top-0 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)]/20 blur-3xl" />
    </section>
  );
}