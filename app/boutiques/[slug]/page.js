"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export default function BoutiquePage() {
  const { slug } = useParams();
  const [boutique, setBoutique] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Boutique from API
  useEffect(() => {
    if (!slug) return;

    async function fetchBoutique() {
      try {
        const res = await fetch(`/api/boutiques/slug/${slug}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch boutique");
        const data = await res.json();

        // ✅ Map DB schema → current UI format
        const mapped = {
          title: data.title,
          tagline: data.tagline,
          logo: data.businessLogo,
          verified: data.verified,
          location: {
            name: data.googleAddress,
            lat: data.lat,
            lng: data.long,
          },
          images: data.imageGallery || [],
          videoUrl: data.videoUrl,
          social: {
            instagram: data.socialLinks.x || "",
            facebook: data.socialLinks.facebook || "",
            twitter: data.socialLinks.linkedin || "",
            youtube: data.socialLinks.youtube || "",
          },
          businessHours: Object.fromEntries(
            (data.businessHours || []).map((bh) => [
              bh.day,
              bh.isClosed ? "Closed" : `${bh.open} - ${bh.close}`,
            ])
          ),
          faqs: (data.faqs || []).map((f) => ({
            q: f.question,
            a: f.answer,
          })),
          description: data.description,
          seo: data.seo,
          priceRange: data.priceRange,
          type: data.type,
          status: data.status,
        };

        setBoutique(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBoutique();
  }, [slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading boutique details...
      </div>
    );

  if (!boutique)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Boutique not found.
      </div>
    );

  // ✅ Render same exact design using fetched data
  return (
    <section className="pt-40 md:pt-36 pb-24 bg-white text-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={boutique.logo || "/no-logo.png"}
              alt={boutique.title}
              width={120}
              height={120}
              className="rounded-full shadow-lg ring-2 ring-[var(--color-accent)]/30"
            />
          </motion.div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-3">
              {boutique.title}
              {boutique.verified && (
                <CheckCircle className="text-green-500 drop-shadow-sm" size={26} />
              )}
            </h1>
            <p className="text-gray-500 text-lg mt-3 max-w-2xl">
              {boutique.tagline}
            </p>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {boutique.images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all duration-500"
            >
              <img
                src={img}
                alt={`Boutique image ${i + 1}`}
                className="object-cover w-full h-[320px] transform transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>

        {/* Location & Video Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <MapPin className="text-[var(--color-accent)]" />
              <span className="font-medium">{boutique.location.name}</span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-5 mb-10">
              {boutique.social.instagram && (
                <a
                  href={boutique.social.instagram}
                  target="_blank"
                  className="hover:text-[var(--color-accent)] transition"
                >
                  <Instagram size={22} />
                </a>
              )}
              {boutique.social.facebook && (
                <a
                  href={boutique.social.facebook}
                  target="_blank"
                  className="hover:text-[var(--color-accent)] transition"
                >
                  <Facebook size={22} />
                </a>
              )}
              {boutique.social.twitter && (
                <a
                  href={boutique.social.twitter}
                  target="_blank"
                  className="hover:text-[var(--color-accent)] transition"
                >
                  <Twitter size={22} />
                </a>
              )}
              {boutique.social.youtube && (
                <a
                  href={boutique.social.youtube}
                  target="_blank"
                  className="hover:text-[var(--color-accent)] transition"
                >
                  <Youtube size={22} />
                </a>
              )}
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-3xl shadow-md border border-gray-100">
              <iframe
                width="100%"
                height="260"
                loading="lazy"
                className="rounded-3xl"
                src={`https://www.google.com/maps?q=${boutique.location.lat},${boutique.location.lng}&z=15&output=embed`}
              ></iframe>
            </div>
          </motion.div>

          {/* Right: Video */}
          {boutique.videoUrl && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100"
            >
              <iframe
                width="100%"
                height="350"
                src={boutique.videoUrl}
                title="Boutique Promo"
                allowFullScreen
                className="rounded-3xl"
              ></iframe>
            </motion.div>
          )}
        </div>

        {/* Business Hours */}
        {boutique.businessHours && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">
              Business Hours
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-700">
              {Object.entries(boutique.businessHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex justify-between bg-gray-50 rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition-all"
                >
                  <span className="font-medium">{day}</span>
                  <span className="text-gray-600">{hours}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ Section */}
        {boutique.faqs?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-semibold text-gray-900 mb-8">
              Frequently Asked Questions
            </h3>
            <div className="space-y-5">
              {boutique.faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border border-gray-100 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.06)] transition-all"
                >
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">
                    {faq.q}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}