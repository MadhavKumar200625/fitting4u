import Image from "next/image";
import Hero from "./Home/Hero";
import ServicesSection from "./Home/ServicesSection";
import BoutiquesSection from "./Home/BoutiquesSection";
import FabricsSection from "./Home/FabricSection";
import HomeMeasurementSection from "./Home/HomeMeasurementSection";
import WhyChooseUs from "./Home/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <ServicesSection></ServicesSection>
      <BoutiquesSection></BoutiquesSection>
      <FabricsSection></FabricsSection>
      <HomeMeasurementSection></HomeMeasurementSection>
      <WhyChooseUs></WhyChooseUs>
    </div>
  );
}
