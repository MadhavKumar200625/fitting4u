import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { getSiteConfig } from "@/lib/getSiteConfig";
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
  title: "Fitting4u",
  description: "This is fitting4u dev version",
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
          <Footer></Footer>
        </SiteConfigProvider>
        
        <ChatWidget />
      </body>
    </html>
  );
}
