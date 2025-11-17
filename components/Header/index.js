// components/Header/index.js
import { getSiteConfig } from "@/lib/getSiteConfig";
import HeaderClient from "./HeaderClient";

export const dynamic = "force-dynamic";

export default async function Header() {
  const config = await getSiteConfig(); // 🔥 SSR fetch

  return <HeaderClient config={config} />;
}