import { ArrowRight } from "lucide-react";

const zones = [
  { name: "Buenos Aires Ciudad", count: 480 },
  { name: "Gran Buenos Aires", count: 320 },
  { name: "Córdoba", count: 180 },
  { name: "Rosario", count: 145 },
  { name: "Mendoza", count: 98 },
  { name: "Tucumán", count: 67 },
  { name: "La Plata", count: 58 },
  { name: "Mar del Plata", count: 52 },
];

export const ZoneSection = () => (
  <section className="bg-light py-16 md:py-20">
    <div className="max-w-container mx-auto px-6 lg:px-10 space-y-10">
      <h2 className="font-display text-dark text-[32px] md:text-[40px] leading-none">
        EXPLORÁ POR ZONA
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {zones.map((z) => (
          <a
            key={z.name}
            href="#"
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
