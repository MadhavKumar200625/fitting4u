"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ruler,
  Clock,
  User,
  MapPin,
  Star,
  ShieldCheck,
  MessageCircle,
  AlertTriangle
} from "lucide-react";

export default function HomeMeasurementPage() {
  // 👉 CHANGE THIS NUMBER
  const WA_NUMBER = "919999999999"; // replace with real number

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendWhatsapp = () => {
    if (!name.trim()) {
      setError("Please enter your name before submitting.");
      return;
    }

    setError("");

    const prefix = `Hi, this is an enquiry for home measurement - ${name}\n\n`;
    const finalMessage =
      prefix +
      (message ||
        "I would like to book a home measurement appointment.");

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
      finalMessage
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-gradient-to-br from-[#f6f9ff] to-white">

      {/* Ambient glow blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-[10%] w-[600px] h-[600px] bg-[#003466]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-[10%] w-[700px] h-[700px] bg-[#ffc1cc]/30 blur-[170px] rounded-full" />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 space-y-24">

        {/* ================== FORM HEADER ================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-white/80 backdrop-blur-xl
            border border-white/40
            shadow-2xl rounded-[32px]
            p-8 sm:p-10 lg:p-14
          "
        >

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#003466] mb-4">
              Home Measurement Service
            </h1>

            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Get precise garment measurements from the comfort of your home.
              Our trained experts visit you at your convenience and ensure a
              perfect tailoring fit.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* ================= FORM ================= */}
            <div className="space-y-6">

              <Input
                icon={<User size={18} />}
                placeholder="Your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                hasError={!!error}
              />

              {/* INLINE ERROR */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="
                      flex items-center gap-2
                      text-sm text-red-600
                      bg-red-50 border border-red-200
                      rounded-xl px-4 py-2
                    "
                  >
                    <AlertTriangle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                rows={5}
                placeholder="Describe your requirement (e.g. number of outfits, preferred date, city, etc.)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-white
                  border border-gray-200
                  text-gray-800
                  placeholder-gray-400
                  shadow-inner
                  outline-none
                  resize-none
                  focus:ring-2 focus:ring-[#ffc1cc]
                  focus:border-[#ffc1cc]
                  transition
                "
              />

              <button
                onClick={sendWhatsapp}
                className={` 
                  w-full flex items-center justify-center gap-3
                  py-4 px-8 rounded-full
                  bg-gradient-to-r from-[#003466] to-[#002850]
                  text-white font-semibold text-lg
                  shadow-xl
                  transition
                  ${
                    !name.trim()
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:scale-[1.02] active:scale-[0.98]"
                  }
                `}
              >
                <MessageCircle size={22} />
                Send WhatsApp Enquiry
              </button>

              <p className="text-xs text-gray-500 text-center">
                This sends your enquiry directly to our team via WhatsApp.
              </p>
            </div>

            {/* ================= INFO PANEL ================= */}
            <div className="flex flex-col justify-center gap-6">

              <Feature
                icon={<Ruler />}
                title="Professional Measurements"
                text="All measurements are taken by trained specialists using garment-industry standards."
              />

              <Feature
                icon={<Clock />}
                title="Fast Turnaround"
                text="Appointments usually scheduled within 24 hours of enquiry."
              />

              <Feature
                icon={<MapPin />}
                title="Doorstep Convenience"
                text="Service available across metro cities and nearby locations."
              />

              <Feature
                icon={<ShieldCheck />}
                title="100% Fit Guarantee"
                text="We stand behind our accuracy and support refits when required."
              />
            </div>

          </div>

        </motion.div>

        {/* ================== INFO SECTIONS ================== */}
        <Section
          icon={<Star />}
          title="Why Choose Home Measurement?"
          text="Avoid boutique queues and travel time. Enjoy the same professional fitting experience right at home."
        />

        <Section
          icon={<Clock />}
          title="How It Works"
          text="Submit your enquiry → We confirm your appointment → A measurement expert visits your home → Your details are recorded securely → Tailoring begins."
        />

        <Section
          icon={<ShieldCheck />}
          title="Your Privacy & Safety"
          text="Every visit is pre-confirmed. Our experts follow strict hygiene and privacy protocols."
        />

      </div>
    </div>
  );
}

/* ================== COMPONENTS ================== */

function Input({ icon, hasError, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003466]">
        {icon}
      </div>

      <input
        {...props}
        className={`
          w-full pl-12 pr-4 py-3 text-black rounded-xl bg-white
          border transition shadow-inner outline-none
          ${hasError
            ? "border-red-400 focus:ring-red-300 focus:border-red-400"
            : "border-gray-200 focus:ring-[#ffc1cc] focus:border-[#ffc1cc]"
          }
        `}
      />
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="bg-[#003466]/10 p-3 rounded-xl text-[#003466]">
        {icon}
      </div>

      <div>
        <h4 className="font-semibold text-[#003466]">
          {title}
        </h4>
        <p className="text-sm text-gray-600">
          {text}
        </p>
      </div>
    </div>
  );
}

function Section({ icon, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
        bg-white/60 backdrop-blur-xl
        shadow-2xl border border-white/40
        rounded-[32px]
        p-8 sm:p-10 lg:p-14
        flex gap-6
      "
    >
      <div className="bg-[#003466]/10 p-5 rounded-2xl shrink-0 text-[#003466]">
        {icon}
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#003466] mb-3">
          {title}
        </h2>

        <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
          {text}
        </p>
      </div>
    </motion.div>
  );
}