import { ArrowRight, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SportBadge } from "@/components/brand/SportBadge";
import type { SportConfig } from "@/lib/sports";
import court1 from "@/assets/court-1.jpg";
import court2 from "@/assets/court-2.jpg";
import court3 from "@/assets/court-3.jpg";

interface Props {
  sport: SportConfig;
}

// TODO: replace with API call:
// GET /items/clubes?filter[tiene_<deporte>]=true&sort=-es_premium,-created_at&limit=6
const MOCK_CLUBS = [
  { name: "Club Deportivo Palermo", neighborhood: "Palermo", city: "Buenos Aires", image: court1, premium: true },
  { name: "Asociación Belgrano", neighborhood: "Belgrano", city: "Buenos Aires", image: court2, premium: true },
  { name: "Complejo Recoleta", neighborhood: "Recoleta", city: "Buenos Aires", image: court3, premium: true },
  { name: "Club Polanco", neighborhood: "Polanco", city: "Ciudad de México", image: court1, premium: false },
  { name: "Tenis Las Condes", neighborhood: "Las Condes", city: "Santiago", image: court2, premium: false },
  { name: "Sport Chapinero", neighborhood: "Chapinero", city: "Bogotá", image: court3, premium: false },
];

export const SportFeatured = ({ sport }: Props) => {
  const text = `text-${sport.color}`;
  const borderL = `border-l-${sport.color}`;
  return (
    <section className="bg-white py-16">
      <div className="max-w-container mx-auto px-6 lg:px-10 space-y-10">
        <div
          className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[3px]"
          style={{ color: sport.hex }}
        >
          <span className="flex-1 h-px" style={{ backgroundColor: sport.hex, opacity: 0.5 }} />
          <span>Canchas destacadas de {sport.ofName}</span>
          <span className="flex-1 h-px" style={{ backgroundColor: sport.hex, opacity: 0.5 }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_CLUBS.map((c) => (
            <article
              key={c.name}
              className={cn(
                "group bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 cursor-pointer hover:shadow-card-hover",
                c.premium && cn("border-l-[3px] shadow-[0_6px_20px_rgba(0,0,0,0.10)]", borderL)
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <SportBadge sport={sport.key} />
                </div>
                {c.premium && (
                  <span
                    className="absolute top-3 right-3 inline-flex items-center gap-1 text-dark px-2 py-1 rounded text-[10px] font-bold uppercase tracking-[1px] shadow-md"
                    style={{ backgroundColor: sport.hex }}
                  >
                    <Star size={10} fill="currentColor" strokeWidth={0} />
                    Premium
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[16px] text-dark leading-tight">{c.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-[13px] text-gray">
                  <MapPin size={14} className="text-orange shrink-0" />
                  {c.neighborhood} · {c.city}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href={`/canchas?deporte=${sport.key}`}
            className={cn(
              "inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wider hover:underline",
              text
            )}
          >
            Ver todas las canchas de {sport.ofName} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
