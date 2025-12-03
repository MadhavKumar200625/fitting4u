"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Clock,
  MapPin,
  Store,
  RefreshCw,
  ShieldCheck
} from "lucide-react";

export default function Page() {
  const sections = [
    {
      title: "Shipping Coverage",
      icon: MapPin,
      text: `
Fitting4U currently ships across most major regions within India. Orders placed for boutique pickup are prepared at the selected boutique location, while home delivery orders are dispatched directly to your provided shipping address.
      `
    },
    {
      title: "Order Processing Time",
      icon: Clock,
      text: `
All orders are processed within 24–48 hours after successful payment confirmation. Custom tailoring or measurement-based services may require additional processing time as notified during checkout.
      `
    },
    {
      title: "Delivery Timelines",
      icon: Truck,
      text: `
Home delivery typically takes 3–7 business days depending on your location and courier service coverage. Boutique pickup orders are usually ready within 2–4 business days after confirmation.
      `
    },
    {
      title: "Boutique Pickup",
      icon: Store,
      text: `
When you choose the boutique pickup option, you will receive notification once your order is ready for collection. Please carry valid order confirmation while visiting the boutique.
      `
    },
    {
      title: "Delays & Exceptions",
      icon: RefreshCw,
      text: `
Unexpected delays can occur due to weather conditions, transport disruptions, festive seasons, or regional restrictions. We proactively notify customers in such cases to minimize inconvenience.
      `
    },
    {
      title: "Shipment Safety",
      icon: ShieldCheck,
      text: `
Every shipment is carefully packed and quality checked before dispatch. We partner only with trusted logistics providers to ensure safe and trackable deliveries for every customer.
      `
    }
  ];

  return (
    <div className="relative min-h-screen pt-36 pb-20 overflow-hidden font-[Poppins]">

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-[8%] w-[600px] h-[600px] bg-[#003466]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-[8%] w-[700px] h-[700px] bg-[#ffc1cc]/30 blur-[170px] rounded-full" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-12">

        {/* ================= LEFT NAV ================= */}
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

        {/* ================= CONTENT ================= */}
        <div className="lg:w-[78%] space-y-16">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#003466] mb-4">
              Shipping Policy
            </h1>

            <p className="text-gray-600 max-w-3xl mx-auto text-lg md:text-xl">
              Everything you need to know about how your orders travel from us to you.
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
                className="
                  relative
                  bg-white/60
                  backdrop-blur-xl
                  shadow-2xl
                  border border-white/40
                  rounded-[32px]
                  p-8 sm:p-10 lg:p-14
                "
              >
                {/* LEFT BORDER STRIPE */}
                <div className="absolute left-0 top-0 h-full w-[6px] bg-gradient-to-b from-[#003466] to-[#ffc1cc] rounded-r-lg" />

                {/* GLOW ORB */}
                <div className="absolute -top-10 -right-10 w-56 h-56 bg-[#003466]/10 blur-3xl rounded-full" />

                {/* CONTENT */}
                <div className="flex items-start gap-6">
                  <div className="bg-[#003466]/10 p-5 rounded-2xl shrink-0">
                    <Icon size={38} className="text-[#003466]" />
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#003466] mb-3">
                      {sec.title}
                    </h2>

                    <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-line">
                      {sec.text.trim()}
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