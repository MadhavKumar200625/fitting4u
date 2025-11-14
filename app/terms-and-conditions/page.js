"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileText, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "Introduction",
      icon: FileText,
      text: `Fitting4U provides boutique discovery, custom stitching, fabric shopping, and home measurement services. By using our platform, you agree to follow these Terms & Conditions.`,
    },
    {
      title: "Accounts & Login",
      icon: ShieldCheck,
      text: `We verify users through mobile OTP authentication. You are responsible for maintaining the confidentiality of your login credentials.`,
    },
    {
      title: "Orders & Availability",
      icon: AlertTriangle,
      text: `All orders depend on fabric stock, boutique availability, and schedule. Fitting4U may cancel or adjust orders if required.`,
    },
    {
      title: "Measurement & Stitching Policies",
      icon: ShieldCheck,
      text: `Measurements must be accurate. If wrong measurements are provided by the customer, we are not responsible for fitting issues.`,
    },
    {
      title: "Payments & Pricing",
      icon: FileText,
      text: `All prices are subject to change. Payments must be made through secure payment gateways integrated on the platform.`,
    },
    {
      title: "Liability",
      icon: AlertTriangle,
      text: `We are not responsible for delays caused by shipping partners, boutique timelines, or incorrect user-provided measurements.`,
    },
    {
      title: "Changes to Terms",
      icon: FileText,
      text: `We reserve the right to update these terms at any time. Continued use of our services means you accept any changes.`,
    },
  ];

  return (
    <div className="relative min-h-screen pt-36 pb-20 overflow-hidden font-[Poppins]">

      {/* BACKGROUND ART */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-[5%] w-[600px] h-[600px] bg-[#003466]/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-[5%] w-[700px] h-[700px] bg-[#ffc1cc]/30 blur-[170px] rounded-full animate-pulse"></div>
      </div>

      {/* PAGE CONTAINER – 1600px max for 1920px screens */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-12">

        {/* LEFT SIDE NAVIGATION */}
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

        {/* MAIN CONTENT */}
        <div className="lg:w-[78%] space-y-16">

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 px-2"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#003466] mb-4 drop-shadow-sm leading-tight">
              Terms & Conditions
            </h1>

            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
              Our policies ensure trust, transparency & a smooth experience.
            </p>
          </motion.div>

          {/* SECTIONS */}
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
                className="relative bg-white/60 backdrop-blur-xl shadow-2xl border border-white/40 rounded-[32px] p-8 sm:p-10 lg:p-14 overflow-hidden"
              >
                {/* Side gradient bar */}
                <div className="absolute left-0 top-0 h-full w-[6px] bg-gradient-to-b from-[#003466] to-[#ffc1cc] rounded-r-lg"></div>

                {/* soft floating bubble */}
                <div className="absolute -top-10 -right-10 w-56 h-56 bg-[#003466]/10 blur-3xl rounded-full"></div>

                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="bg-[#003466]/10 p-4 sm:p-5 rounded-2xl shadow-lg">
                    <Icon size={40} className="text-[#003466]" />
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#003466] mb-4 leading-snug">
                      {sec.title}
                    </h2>
                    <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
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