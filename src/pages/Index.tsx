import { Navbar } from "@/components/brand/Navbar";
import { CtaButton } from "@/components/brand/CtaButton";
import { SearchBar } from "@/components/brand/SearchBar";
import { CourtCard } from "@/components/brand/CourtCard";
import { SportBadge } from "@/components/brand/SportBadge";

const sampleCourt = {
  name: "Club Atlético Palermo",
  neighborhood: "Palermo",
  city: "CABA",
  image:
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
  sports: ["tenis", "padel"] as const,
  pricePerHour: "$8.500",
};

const Index = () => {
  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <main className="max-w-container mx-auto px-6 lg:px-10 py-12 lg:py-20 space-y-16">
        {/* Hero preview */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <p className="label-meta uppercase text-orange">Sistema de diseño · v1</p>
          <h1 className="font-display text-[48px] md:text-[72px] leading-[0.95] text-dark">
            Encontrá tu<br />cancha perfecta<span className="text-orange">.</span>
          </h1>
          <p className="text-gray text-[15px] max-w-xl mx-auto">
            Directorio de canchas de tenis y pádel en toda Argentina. Buscá por barrio,
            compará precios y reservá en segundos.
          </p>
          <div className="max-w-2xl mx-auto pt-2">
            <SearchBar />
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <CtaButton>Buscar canchas</CtaButton>
            <CtaButton variant="secondary">Cómo funciona</CtaButton>
          </div>
        </section>

        {/* Component preview: badges */}
        <section className="space-y-6">
          <div className="section-divider">Badges de deporte</div>
          <div className="flex flex-wrap gap-3 justify-center">
            <SportBadge sport="tenis" />
            <SportBadge sport="padel" />
            <SportBadge sport="pickleball" />
            <SportBadge sport="gratuito" />
            <SportBadge sport="premium" />
          </div>
        </section>

        {/* Card preview grid */}
        <section className="space-y-6">
          <div className="section-divider">Canchas destacadas</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <CourtCard {...sampleCourt} premium />
            <CourtCard
              name="Pádel Norte"
              neighborhood="Belgrano"
              city="CABA"
              image="https://images.unsplash.com/photo-1591491634026-77cd1e3d9d2e?auto=format&fit=crop&w=1200&q=80"
              sports={["padel"]}
              pricePerHour="$6.200"
            />
            <CourtCard
              name="Plaza Tenis Club"
              neighborhood="Vicente López"
              city="GBA Norte"
              image="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80"
              sports={["tenis"]}
              pricePerHour="$5.800"
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center label-meta text-gray uppercase">
        HayCancha<span className="text-orange">.</span>com — sistema de diseño listo
      </footer>
    </div>
  );
};

export default Index;
