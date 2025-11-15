"use client";

import { useSiteConfig } from "@/context/SiteConfigContext";
import Hero from "./Home/Hero";
import FabricsSection from "./Home/FabricsSection";
import BoutiqueSection from "./Home/BoutiqueSection";
import HomeMeasurementSection from "./Home/HomeMeasurementSection";
import WhyChooseUs from "./Home/WhyChooseUs";

export default function Home() {
  const config = useSiteConfig();

  // Still loading config (first render)
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading website...
      </div>
    );
  }

  const sections = config.sections || {};

  return (
    <div>

      {/* 🔹 HERO — Always visible (has its own config for banners inside it) */}
      <Hero />

      {/* 🔹 FABRIC SECTION */}
      {sections.fabricStore && <FabricsSection />}

      {/* 🔹 BOUTIQUE SECTION */}
      {sections.boutiques && <BoutiqueSection />}

      {/* 🔹 HOME MEASUREMENT */}
      {sections.homeMeasurement && <HomeMeasurementSection />}

      {/* 🔹 WHY CHOOSE US (Keep always visible or add a toggle if needed) */}
      <WhyChooseUs />

    </div>
  );
}