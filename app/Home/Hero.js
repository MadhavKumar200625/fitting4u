// components/HeroSlider/HeroSliderServer.jsx
import { getSiteConfig } from "@/lib/getSiteConfig";
import HeroSliderClient from "./HeroClient";

export default async function HeroSliderServer() {
  const config = await getSiteConfig();

  const slides = config?.homePage?.banners?.filter(b => b.visible) || [];

  return <HeroSliderClient slides={slides} />;
}