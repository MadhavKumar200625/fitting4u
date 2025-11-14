import Hero from "./Home/Hero";
import FabricsSection from "./Home/FabricsSection";
import BoutiqueSection from "./Home/BoutiqueSection";
import HomeMeasurementSection from "./Home/HomeMeasurementSection";
import WhyChooseUs from "./Home/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <FabricsSection></FabricsSection>
      <BoutiqueSection></BoutiqueSection>
      <HomeMeasurementSection></HomeMeasurementSection>
      <WhyChooseUs></WhyChooseUs>
    </div>
  );
}
