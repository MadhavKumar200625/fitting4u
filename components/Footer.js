"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#001a33] text-white pt-20 pb-10 overflow-hidden">

      {/* Top curved gradient line */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ffc1cc] via-white/30 to-transparent"></div>

      {/* Glow background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-[#ffc1cc] blur-[140px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 sm:grid-cols-2 gap-14 relative">
        
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-4xl font-extrabold mb-4">
            <span className="text-[#ffc1cc]">Fitting</span>
            <span className="text-white">4U</span>
          </h3>

          <p className="text-gray-300 text-sm leading-relaxed">
            Elevating fabrics, design and luxury tailoring — crafted to perfection,
            made uniquely for you.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h4 className="text-xl font-semibold mb-4 text-[#ffc1cc]">Explore</h4>
          <ul className="space-y-3 text-white/90">
            {[
              ["Home", "/"],
              ["Boutiques", "/boutiques"],
              ["Fabric Store", "/fabric-store"],
              ["Home Measurement", "/home-measurement"],
              ["Design Now", "/design-now"],
            ].map(([name, href]) => (
              <li key={name}>
                <Link
                  href={href}
                  className="hover:text-[#ffc1cc] transition-all duration-300"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 className="text-xl font-semibold mb-4 text-[#ffc1cc]">Contact</h4>
          <ul className="space-y-4 text-gray-300 text-sm">
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-[#ffc1cc]" />
              support@fitting4u.com
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-[#ffc1cc]" />
              +91 9876543210
            </li>
          </ul>
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="text-xl font-semibold mb-4 text-[#ffc1cc]">Follow Us</h4>

          <div className="flex gap-4">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-3 rounded-full bg-white/10 border border-white/10 
                           backdrop-blur-md hover:bg-[#ffc1cc] hover:text-[#001a33]
                           transition-all duration-300 hover:scale-110"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 mt-14 border-t border-white/20 pt-6 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center gap-3">
        <p>© {new Date().getFullYear()} Fitting4U — All Rights Reserved.</p>

        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:text-[#ffc1cc] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:text-[#ffc1cc] transition-colors">
            Refund Policy
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-[#ffc1cc] transition-colors">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}