import { Navbar } from "@/components/brand/Navbar";
import { Hero } from "@/components/sections/Hero";
import { SportSection } from "@/components/sections/SportSection";
import { FeaturedCourts } from "@/components/sections/FeaturedCourts";
import { MapSection } from "@/components/sections/MapSection";
import { ZoneSection } from "@/components/sections/ZoneSection";
import { ClubsCta } from "@/components/sections/ClubsCta";
import { Footer } from "@/components/sections/Footer";
import { AdSlot } from "@/components/brand/AdSlot";
import { PromoSlot } from "@/components/promo/PromoSlot";
import { SeoMeta } from "@/components/SeoMeta";

const Index = () => {
  return (
    <div className="min-h-screen bg-light">
      <SeoMeta
        title="HayCancha.com — Encontrá tu cancha perfecta en Latinoamérica"
        description="Directorio gratuito de canchas y clubes de tenis, pádel y pickleball en Latinoamérica. Superficie, iluminación, dirección y contacto directo del club. Sin reservas ni comisiones."
        canonicalPath="/"
      />
      <Navbar />
      <main>
        <Hero />
        <div className="max-w-container mx-auto px-6 lg:px-10 mt-12">
          <PromoSlot variant="leaderboard" />
        </div>
        <SportSection />
        <FeaturedCourts />
        {/* Slot 2 — home-between-sections (in-article, between editorial blocks) */}
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <AdSlot slot="home-between-sections" format="in-article" />
        </div>
        <MapSection />
        <ZoneSection />
        <ClubsCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
