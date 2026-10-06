"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80";
const emptyFeaturedSlugs = [];

function normalizeBoutiqueKey(value) {
  if (value == null) return "";
  const key = String(value).trim();
  if (!key) return "";

  const path = key.replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0];
  return path.split("/").filter(Boolean).pop()?.toLowerCase() || key.toLowerCase();
}

export default function BoutiqueSection({ config }) {
  const [featuredBoutiques, setFeaturedBoutiques] = useState([]);
  const featuredSlugs = config?.boutiquesSection?.featuredBoutiques || emptyFeaturedSlugs;
  const featuredSlugsKey = JSON.stringify(featuredSlugs);

  useEffect(() => {
    let mounted = true;
    const configuredKeys = JSON.parse(featuredSlugsKey)
      .map(normalizeBoutiqueKey)
      .filter(Boolean);
    const configuredPositions = new Map(
      configuredKeys.map((key, index) => [key, index])
    );

    if (!configuredPositions.size) {
      setFeaturedBoutiques([]);
      return () => {
        mounted = false;
      };
    }

    const getConfiguredPosition = (boutique) =>
      [boutique.websiteUrl, boutique.slug, boutique._id, boutique.title]
        .map(normalizeBoutiqueKey)
        .map((key) => configuredPositions.get(key))
        .find((position) => position !== undefined);

    async function loadBoutiques() {
      try {
        const res = await fetch("/api/boutiques/homepage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ keys: configuredKeys }),
        });

        if (!res.ok) {
          throw new Error("Failed to load boutiques");
        }

        const data = await res.json();
        const boutiques = (data.boutiques || [])
          .filter((boutique) => getConfiguredPosition(boutique) !== undefined)
          .sort((a, b) => {
            const aHasMedia = Boolean(a.businessLogo || a.imageGallery?.some(Boolean));
            const bHasMedia = Boolean(b.businessLogo || b.imageGallery?.some(Boolean));
            if (aHasMedia !== bHasMedia) return Number(bHasMedia) - Number(aHasMedia);

            return getConfiguredPosition(a) - getConfiguredPosition(b);
          })
          .map((boutique) => ({
            slug: boutique.websiteUrl || boutique.slug || boutique._id,
            name: boutique.title,
            location: boutique.googleAddress || "Bengaluru",
            specialty: boutique.tagline || boutique.type || "Designer Boutique",
            logo: boutique.businessLogo || boutique.title?.charAt(0)?.toUpperCase() || "B",
            image:
              boutique.imageGallery?.[0] ||
              boutique.businessLogo ||
              fallbackImage,
          }));

        if (mounted) setFeaturedBoutiques(boutiques);
      } catch (error) {
        if (mounted) setFeaturedBoutiques([]);
      }
    }

    loadBoutiques();

    return () => {
      mounted = false;
    };
  }, [featuredSlugsKey]);

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
            Handpicked designer studios across Bengaluru and Delhi, with more cities coming soon
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
                {boutique.logo && (
                  <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-white/90 text-sm font-bold text-[var(--color-primary)] shadow-sm">
                      <img src={boutique.logo} alt={`${boutique.name} logo`} className="h-full w-full object-cover" />
                    
                  
                  </div>
                )}
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