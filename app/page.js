import { getSiteConfig } from "@/lib/getSiteConfig"; // Server helper
import Hero from "./Home/Hero";
import FabricsSection from "./Home/FabricsSection";
import AdditionalFabricsSection from "./Home/AdditionalFabricsSection";
import BoutiqueSection from "./Home/BoutiqueSection";
import ReviewsSection from "./Home/ReviewsSection";
import HomeMeasurementSection from "./Home/HomeMeasurementSection";
import WhyChooseUs from "./Home/WhyChooseUs";
import PartnerSection from "./Home/PartnerSection";

export const revalidate = 0;            // 🔥 Do NOT cache – always fresh
export const dynamic = "force-dynamic"; // 🔥 Bypass Vercel static caching

export const metadata = {
  title: "Fitting4U | Boutique Shopping, Premium Fabrics & Tailoring in Bengaluru",
  description:
    "Fitting4U helps you discover premium fabrics, trusted boutiques, custom tailoring, and at-home measurement services in Bengaluru and beyond.",
  keywords: [
    "Fitting4U",
    "boutiques in Bengaluru",
    "designer boutiques",
    "premium fabrics",
    "custom tailoring",
    "home measurement service",
    "fashion boutique",
    "ethnic wear boutique",
    "bridal boutique Bengaluru",
  ],
  alternates: {
    canonical: "https://www.fitting4u.com/",
  },
  openGraph: {
    title: "Fitting4U | Boutique Shopping, Premium Fabrics & Tailoring in Bengaluru",
    description:
      "Explore curated boutique studios, premium fabrics, home measurement services, and custom tailoring for your next perfect fit.",
    url: "https://www.fitting4u.com/",
    siteName: "Fitting4U",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitting4U | Boutique Shopping, Premium Fabrics & Tailoring in Bengaluru",
    description:
      "Find trusted boutiques, premium fabrics, and custom tailoring solutions designed around your style.",
  },
};

export default async function Home() {
  const config = await getSiteConfig();

  const sections = config?.sections || {};

  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fitting4U",
    url: "https://www.fitting4u.com/",
    description:
      "Boutique discovery, premium fabrics, home measurement, and tailor-made fashion services in Bengaluru.",
    publisher: {
      "@type": "Organization",
      name: "Fitting4U",
      sameAs: ["https://www.fitting4u.com"],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.fitting4u.com/boutiques?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />

      <div>
        {/* 🔵 HERO – always visible */}
        <Hero config={config.homePage} />

        {/* 🩵 FABRIC SECTION */}
        {sections.fabricStore && <FabricsSection config={config.homePage} />}

        {sections.additionalFabrics !== false && (
          <AdditionalFabricsSection config={config.homePage} />
        )}

        {/* 💖 BOUTIQUE SECTION */}
        {sections.boutiques && <BoutiqueSection config={config.homePage} />}

        <ReviewsSection />

        {/* 🟢 HOME MEASUREMENT */}
        {sections.homeMeasurement && (
          <HomeMeasurementSection config={config.homePage} />
        )}

        <PartnerSection />

        {/* ⭐ ALWAYS VISIBLE */}
        <WhyChooseUs />
      </div>
    </>
  );
}