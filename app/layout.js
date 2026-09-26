import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { getSiteConfig } from "@/lib/getSiteConfig";
import Script from "next/script";
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.fitting4u.com"),
  title: {
    default: "Fitting4U | Premium Fabrics, Boutiques & Tailoring in Bengaluru",
    template: "%s | Fitting4U",
  },
  description:
    "Fitting4U connects shoppers with premium fabrics, trusted boutiques, custom tailoring, and at-home measurement services in Bengaluru.",
  keywords: [
    "Fitting4U",
    "boutiques Bengaluru",
    "designer boutique",
    "premium fabric store",
    "custom tailoring",
    "home measurement Bengaluru",
    "wedding wear boutique",
    "ethnic fashion Bengaluru",
  ],
  alternates: {
    canonical: "https://www.fitting4u.com",
  },
  openGraph: {
    title: "Fitting4U | Premium Fabrics, Boutiques & Tailoring in Bengaluru",
    description:
      "Discover curated boutique studios, premium fabrics, and professional tailoring experiences designed around your style.",
    url: "https://www.fitting4u.com",
    siteName: "Fitting4U",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitting4U | Premium Fabrics, Boutiques & Tailoring in Bengaluru",
    description:
      "Shop premium fabrics and connect with trusted boutique partners for custom tailoring and styling in Bengaluru.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }) {
  const config = await getSiteConfig();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <SiteConfigProvider initialConfig={config}>
          <Header></Header>
          {children}
          <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="afterInteractive"
/>
          <Footer></Footer>
        </SiteConfigProvider>
        
        <ChatWidget />
      </body>
    </html>
  );
}
