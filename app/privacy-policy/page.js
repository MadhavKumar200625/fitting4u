"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Globe, Smartphone } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Introduction",
      icon: ShieldCheck,
      text: `Your privacy is important to us. This Privacy Policy explains how Fitting4U collects, uses, and protects your personal information while providing our services.`,
    },
    {
      title: "Information We Collect",
      icon: Eye,
      text: `We may collect your name, phone number, address, order details, measurement data, and interactions with boutiques and fabric listings.`,
    },
    {
      title: "How We Use Your Data",
      icon: Lock,
      text: `Your data is used to process orders, manage boutique connections, provide home measurements, improve user experience, and enhance platform reliability.`,
    },
    {
      title: "Third-Party Sharing",
      icon: Globe,
      text: `We may share relevant data with boutiques, delivery partners, and payment gateways—strictly for order fulfillment. We never sell your data.`,
    },
    {
      title: "Security Measures",
      icon: ShieldCheck,
      text: `Your data is protected using encryption, secured authentication, and industry-standard data protection techniques.`,
    },
    {
      title: "Your Rights",
      icon: Smartphone,
      text: `You may request data deletion, correction, or download at any time by contacting our support team.`,
    },
  ];

  return (
    <div className="relative min-h-screen pt-36 pb-20 overflow-hidden font-[Poppins]">

      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-[8%] w-[600px] h-[600px] bg-[#003466]/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 right-[8%] w-[700px] h-[700px] bg-[#ffc1cc]/30 blur-[170px] rounded-full"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-12">

        {/* LEFT NAV */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-[22%] hidden lg:block sticky top-32 h-fit"
        >
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40">
            <h3 className="text-xl font-semibold text-[#003466] mb-4">
              On this page
            </h3>
            <ul className="space-y-3 text-gray-700">
              {sections.map((s) => (
                <li key={s.title}>
                  <a
                    href={`#${s.title.replace(/\s+/g, "-")}`}
                    className="hover:text-[#003466] transition font-medium"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CONTENT */}
        <div className="lg:w-[78%] space-y-16">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#003466] mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg md:text-xl">
              Your trust matters. Here’s how we protect your data.
            </p>
          </motion.div>

          {sections.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={i}
                id={sec.title.replace(/\s+/g, "-")}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="relative bg-white/60 backdrop-blur-xl shadow-2xl border border-white/40 rounded-[32px] p-8 sm:p-10 lg:p-14"
              >
                <div className="absolute left-0 top-0 h-full w-[6px] bg-gradient-to-b from-[#003466] to-[#ffc1cc] rounded-r-lg"></div>
                <div className="absolute -top-10 -right-10 w-56 h-56 bg-[#003466]/10 blur-3xl rounded-full"></div>

                <div className="flex items-start gap-6">
                  <div className="bg-[#003466]/10 p-5 rounded-2xl">
                    <Icon size={38} className="text-[#003466]" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#003466] mb-3">
                      {sec.title}
                    </h2>
                    <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                      {sec.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}