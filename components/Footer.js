"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Top wave overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-transparent opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 sm:grid-cols-2 gap-12">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-4">
            <span className="text-[var(--color-accent)]">Fitting</span>
            <span className="text-white">4U</span>
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Experience the perfect blend of craftsmanship, comfort, and luxury.
            Your fit, your fabric, your style.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h4 className="text-xl font-semibold mb-4 text-[var(--color-accent)]">
            Quick Links
          </h4>
          <ul className="space-y-3 text-white">
            {["Home", "Boutiques", "Fabric Store", "Home Measurement"].map(
              (link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-[var(--color-accent)] text-white transition-colors duration-300"
                  >
                    {link}
                  </Link>
                </li>
              )
            )}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 className="text-xl font-semibold mb-4 text-[var(--color-accent)]">
            Contact
          </h4>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <Mail size={18} /> support@fitting4u.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> +91 something
            </li>
          </ul>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="text-xl font-semibold mb-4 text-[var(--color-accent)]">
            Follow Us
          </h4>
          <div className="flex gap-4 text-gray-300">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] transition-all duration-300"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 mt-12 border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Fitting4U. All rights reserved.</p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <Link
            href="/privacy-policy"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>

      {/* Subtle glowing background accent */}
      <div className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 w-[600px] h-[200px] bg-[var(--color-accent)] blur-3xl opacity-20"></div>
    </footer>
  );
}