"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const boutique = {
  title: "Pretty Looks Boutique",
  tagline: "Where couture meets comfort — redefining Indian elegance.",
  logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
  verified: true,
  location: {
    name: "Milan, Italy",
    lat: 45.4642,
    lng: 9.19,
  },
  images: [
    "https://i.pinimg.com/736x/4b/3d/ce/4b3dce75b28f4fd0a45e3b7394339eec.jpg",
    "https://madhusha.in/cdn/shop/files/3_8_64ad834e-358f-426c-ab5c-57b06c3faf4f.jpg?v=1729861805&width=1445",
    "https://dylandavids.com/cdn/shop/files/DD1318-2110.jpg?format=webp&v=1739916635&width=900",
    "https://www.teutamatoshi.com/cdn/shop/files/BC8CF42D-D332-42A9-9FF4-AF18AEC67E3D.jpg?v=1707378617",
  ],
  videoUrl: "https://www.youtube.com/embed/NpEaa2P7qZI",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
  },
  businessHours: {
    Monday: "10:00 AM - 8:00 PM",
    Tuesday: "10:00 AM - 8:00 PM",
    Wednesday: "10:00 AM - 8:00 PM",
    Thursday: "10:00 AM - 8:00 PM",
    Friday: "10:00 AM - 8:00 PM",
    Saturday: "10:00 AM - 6:00 PM",
    Sunday: "Closed",
  },
  faqs: [
    {
      q: "Do you offer custom tailoring?",
      a: "Yes, we provide personalized tailoring services for all body types.",
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, worldwide shipping is available with express courier options.",
    },
    {
      q: "Can I book an appointment online?",
      a: "Absolutely! Use our online booking system to reserve a slot.",
    },
  ],
};

export default function BoutiquePage() {
  return (
    <section className="pt-36 pb-24 bg-white text-gray-800 relative overflow-hidden">
      {/* Soft Background Glows */}
      <div className="absolute top-0 right-[-100px] w-[400px] h-[400px] bg-[var(--color-accent)]/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-[-120px] w-[300px] h-[300px] bg-[var(--color-accent)]/15 blur-3xl rounded-full" />

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
              src={boutique.logo}
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
              <a href={boutique.social.instagram} target="_blank" className="hover:text-[var(--color-accent)] transition">
                <Instagram size={22} />
              </a>
              <a href={boutique.social.facebook} target="_blank" className="hover:text-[var(--color-accent)] transition">
                <Facebook size={22} />
              </a>
              <a href={boutique.social.twitter} target="_blank" className="hover:text-[var(--color-accent)] transition">
                <Twitter size={22} />
              </a>
              <a href={boutique.social.youtube} target="_blank" className="hover:text-[var(--color-accent)] transition">
                <Youtube size={22} />
              </a>
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
        </div>

        {/* Business Hours */}
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

        {/* FAQ Section */}
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
      </div>
    </section>
  );
}