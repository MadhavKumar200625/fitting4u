"use client";

import { motion } from "framer-motion";
import { Scissors, Ruler, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-32 bg-gradient-to-b from-[#f6f9ff] to-white font-[Poppins]">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 text-center mb-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-[#003466] leading-tight"
        >
          Redefining Fashion  
          <span className="text-[var(--color-accent)]"> Tailored for You</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Fitting4U is India’s first smart tailoring ecosystem — connecting boutiques, premium fabrics, and home measurement services into one seamless experience.
        </motion.p>
      </section>


      {/* 2-COLUMN STORY SECTION */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 mb-28 items-center">
        
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
          className="rounded-3xl shadow-xl object-cover w-full h-[420px]"
        />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-[#003466] mb-4">
            The Mission Behind Fitting4U
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Tailoring is personal — it reflects your story, your fit, and your identity.  
            Yet, the industry remained old-fashioned, unorganized, and disconnected.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            We built Fitting4U to bring **clarity, convenience, and quality**.  
            Whether you’re buying fabric, choosing a boutique, or getting measured at home — we’re here to offer a frictionless modern experience.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed">
            Our platform empowers boutiques, simplifies decisions for customers,  
            and elevates tailoring to match today’s digital expectations.
          </p>
        </motion.div>
      </section>


      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <h2 className="text-center text-3xl font-bold text-[#003466] mb-14">
          What Makes Fitting4U Different?
        </h2>

        <div className="grid md:grid-cols-4 gap-10">
          {[
            { icon: Scissors, title: "Premium Boutique Network", text: "Handpicked tailors known for precision, creativity, and trust." },
            { icon: Sparkles, title: "Curated Fabrics", text: "Access a wide range of luxury fabrics from the best suppliers." },
            { icon: Ruler, title: "Home Measurement", text: "Comfort-first measuring services with trained experts." },
            { icon: Users, title: "Personalized Design", text: "Design Now lets you visualize your outfit and customize instantly." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center border border-[#003466]/10"
            >
              <f.icon className="mx-auto text-[#003466]" size={40} />
              <h3 className="text-xl mt-4 font-semibold text-[#003466]">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* VISION SECTION */}
      <section className="bg-[#003466] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Our Vision
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed opacity-90"
          >
            To build India’s most trusted fashion ecosystem where  
            **fabric quality, tailoring skill, and customer comfort** come together —  
            redefining how people experience custom-made clothing.
          </motion.p>
        </div>
      </section>


      {/* TEAM SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-center text-3xl font-bold text-[#003466] mb-14">
          The Team Behind Fitting4U
        </h2>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 text-lg">
          We are a passionate group of technologists, designers, and fashion experts  
          who believe in merging craftsmanship with technology.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-40 h-40 mx-auto rounded-full bg-gray-200 shadow-lg"></div>
              <h3 className="mt-5 text-xl font-semibold text-[#003466]">Team Member</h3>
              <p className="text-gray-500 text-sm">Role / Expertise</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* CTA SECTION */}
      <section className="text-center py-20 bg-gradient-to-r from-[#003466] via-[#004a80] to-[#003466] text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Ready to Experience Tailoring the Modern Way?
        </motion.h2>

        <motion.a
          href="/fabrics"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="px-10 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-[#003466] font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-all inline-block"
        >
          Explore Fabrics
        </motion.a>
      </section>
    </div>
  );
}