import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LATAM_COUNTRIES } from "@/lib/geo";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

// TODO: replace with API call to fetch only countries that have ≥1 club for this sport.
// GET /items/clubes/aggregate?groupBy=pais&filter[tiene_<deporte>]=true
const MOCK_COUNTS_BY_SPORT: Record<string, Record<string, number>> = {
  tenis: { argentina: 720, mexico: 280, colombia: 160, chile: 140, peru: 90, uruguay: 60 },
  padel: { argentina: 110, mexico: 75, colombia: 35, chile: 25, peru: 15 },
  pickleball: { argentina: 12, mexico: 18, colombia: 8, chile: 4, peru: 3 },
};

export const SportZones = ({ sport }: Props) => {
  const counts = MOCK_COUNTS_BY_SPORT[sport.key] ?? {};
  const zones = LATAM_COUNTRIES.filter((c) => counts[c.slug]).map((c) => ({
    ...c,
    count: counts[c.slug],
  }));

  return (
    <section className="bg-light py-16">
      <div className="max-w-container mx-auto px-6 lg:px-10 space-y-10">
        <h2 className="font-display text-dark text-[32px] md:text-[40px] leading-none">
          EXPLORÁ POR PAÍS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {zones.map((z) => (
            <a
              key={z.slug}
              href={`/canchas/${z.slug}?deporte=${sport.key}`}
              className={cn(
                "group bg-white border border-border rounded-lg p-5 flex items-center justify-between gap-3 transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
                `hover:border-${sport.color}`
              )}
              style={{ borderLeft: `3px solid ${sport.hex}` }}
            >
              <div>
                <div className="font-semibold text-[14px] text-dark">{z.name}</div>
                <div className="text-[12px] text-gray mt-0.5">
                  {z.count} {z.count === 1 ? "cancha" : "canchas"}
                </div>
              </div>
              <ArrowRight size={18} style={{ color: sport.hex }} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
