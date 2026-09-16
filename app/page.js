import { getSiteConfig } from "@/lib/getSiteConfig"; // Server helper
import Hero from "./Home/Hero";
import FabricsSection from "./Home/FabricsSection";
import BoutiqueSection from "./Home/BoutiqueSection";
import HomeMeasurementSection from "./Home/HomeMeasurementSection";
import WhyChooseUs from "./Home/WhyChooseUs";
import PartnerSection from "./Home/PartnerSection";

export const revalidate = 0;            // 🔥 Do NOT cache – always fresh
export const dynamic = "force-dynamic"; // 🔥 Bypass Vercel static caching

export default async function Home() {
  const config = await getSiteConfig();

  const sections = config?.sections || {};

  return (
    <div>
      {/* 🔵 HERO – always visible */}
      <Hero config={config.homePage} />

      {/* 🩵 FABRIC SECTION */}
      {sections.fabricStore && <FabricsSection config={config.homePage} />}

      {/* 💖 BOUTIQUE SECTION */}
      {sections.boutiques && <BoutiqueSection config={config.homePage} />}

      {/* 🟢 HOME MEASUREMENT */}
      {sections.homeMeasurement && (
        <HomeMeasurementSection config={config.homePage} />
      )}

      <PartnerSection />

      {/* ⭐ ALWAYS VISIBLE */}
      <WhyChooseUs />
    </div>
  );
}