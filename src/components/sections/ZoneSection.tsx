import { ArrowRight } from "lucide-react";

const zones = [
  { name: "Argentina", count: 720 },
  { name: "México", count: 310 },
  { name: "Colombia", count: 180 },
  { name: "Chile", count: 145 },
  { name: "Perú", count: 98 },
  { name: "Uruguay", count: 67 },
  { name: "Venezuela", count: 58 },
  { name: "Ecuador", count: 52 },
  { name: "Paraguay", count: 38 },
  { name: "Bolivia", count: 27 },
];

export const ZoneSection = () => (
  <section className="bg-light py-16 md:py-20">
    <div className="max-w-container mx-auto px-6 lg:px-10 space-y-10">
      <h2 className="font-display text-dark text-[32px] md:text-[40px] leading-none">
        EXPLORÁ POR PAÍS
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {zones.map((z) => (
          <a
            key={z.slug}
            href={`/canchas/${z.slug}`}
            className="group bg-white border border-border rounded-lg p-5 flex items-center justify-between gap-3 transition-all hover:bg-orange hover:border-orange hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div>
              <div className="font-semibold text-[14px] text-dark group-hover:text-white">
                {z.name}
              </div>
              <div className="text-[12px] text-gray group-hover:text-white/80 mt-0.5">
                {z.count} canchas
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-orange group-hover:text-white transition-transform group-hover:translate-x-0.5"
            />
          </a>
        ))}
      </div>
    </div>
  </section>
);
