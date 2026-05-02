import { Navbar } from "@/components/brand/Navbar";
import { Hero } from "@/components/sections/Hero";
import { SportSection } from "@/components/sections/SportSection";
import { FeaturedCourts } from "@/components/sections/FeaturedCourts";
import { MapSection } from "@/components/sections/MapSection";
import { ZoneSection } from "@/components/sections/ZoneSection";
import { ClubsCta } from "@/components/sections/ClubsCta";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <main>
        <Hero />
        <SportSection />
        <FeaturedCourts />
        <MapSection />
        <ZoneSection />
        <ClubsCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
