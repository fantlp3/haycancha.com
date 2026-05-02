import { Navbar } from "@/components/brand/Navbar";
import { Hero } from "@/components/sections/Hero";
import { SportSection } from "@/components/sections/SportSection";
import { FeaturedCourts } from "@/components/sections/FeaturedCourts";
import { MapSection } from "@/components/sections/MapSection";
import { ZoneSection } from "@/components/sections/ZoneSection";
import { ClubsCta } from "@/components/sections/ClubsCta";
import { Footer } from "@/components/sections/Footer";
import { AdSlot } from "@/components/brand/AdSlot";

const Index = () => {
  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <main>
        <Hero />
        <SportSection />
        <FeaturedCourts />
        {/* Slot 2 — home-between-sections (in-article, between editorial blocks) */}
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <AdSlot slot="home-between-sections" format="in-article" />
        </div>
        <MapSection />
        {/* Slot 1 — home-mid-leaderboard (after hero block, before "Buscá por zona") */}
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <AdSlot slot="home-mid-leaderboard" format="leaderboard" />
        </div>
        <ZoneSection />
        <ClubsCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
