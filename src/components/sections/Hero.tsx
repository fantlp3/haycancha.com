import { Search, MapPin } from "lucide-react";
import argentinaMap from "@/assets/argentina-map.jpg";
import { useClubStats, useStatsByPais } from "@/hooks/useClubes";

const nfAR = new Intl.NumberFormat("es-AR");

const quickChips: { label: string; href: string }[] = [
  { label: "Buenos Aires", href: "/canchas/argentina/buenos-aires" },
  { label: "Ciudad de México", href: "/canchas/mexico/ciudad-de-mexico" },
  { label: "Bogotá", href: "/canchas/colombia/bogota" },
  { label: "Santiago", href: "/canchas/chile/santiago" },
  { label: "Lima", href: "/canchas/peru/lima" },
];

export const Hero = () => {
  return (
    <section className="relative bg-dark overflow-hidden">
      {/* Diagonal lines pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)",
        }}
      />
      <div className="relative max-w-container mx-auto px-6 lg:px-10 py-16 lg:py-0 lg:min-h-[85vh] flex items-center">
        <div className="grid lg:grid-cols-[60fr_40fr] gap-12 lg:gap-16 items-center w-full">
          {/* Left */}
          <div className="space-y-6 lg:space-y-8">
            <p className="label-meta uppercase text-orange tracking-[3px]">
              🎾 El directorio de tenis de Latinoamérica
            </p>
            <h1 className="font-display text-white text-[56px] md:text-[72px] lg:text-[80px] leading-[0.9]">
              ENCONTRÁ<br />
              TU CANCHA<br />
              <span className="text-orange">PERFECTA.</span>
            </h1>
            <p className="text-white/70 text-[16px] md:text-[18px] max-w-xl leading-relaxed">
              Más de 1.500 clubes y canchas de tenis, pádel y pickleball en toda Latinoamérica. Gratis.
            </p>

            {/* Search */}
            <div className="bg-white rounded-lg p-2 flex items-center gap-2 max-w-xl shadow-card focus-within:shadow-focus-orange transition-shadow">
              <div className="flex-1 flex items-center gap-3 pl-3">
                <Search size={20} className="text-orange shrink-0" />
                <input
                  type="text"
                  placeholder="Barrio, ciudad o nombre del club..."
                  className="w-full h-10 md:h-12 bg-transparent border-0 outline-none text-dark placeholder:text-gray text-[15px] font-medium"
                />
              </div>
              <button className="hidden sm:inline-flex h-10 md:h-12 px-6 bg-orange text-white font-semibold text-[14px] uppercase tracking-[1px] rounded-md hover:brightness-90 transition">
                Buscar
              </button>
            </div>
            <button className="sm:hidden w-full h-[52px] bg-orange text-white font-bold text-[16px] uppercase tracking-[1px] rounded-md hover:brightness-90 transition">
              Buscar
            </button>

            {/* Chips — horizontal scroll on mobile, wrap on desktop */}
            <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-visible flex-nowrap -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none">
              {quickChips.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-[13px] font-medium border border-transparent hover:opacity-100 hover:border-orange hover:text-white transition whitespace-nowrap"
                >
                  <MapPin size={13} className="text-orange" />
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-card-hover">
              <img
                src={argentinaMap}
                alt="Mapa de canchas en Latinoamérica"
                width={1024}
                height={1024}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-dark/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/80 text-[11px] font-semibold uppercase tracking-[2px]">
                <span>Cobertura nacional</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                  En vivo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative bg-dark-2 border-t border-white/5">
        <div className="max-w-container mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {[
            { n: "1.500+", l: "Clubes y canchas en toda Latinoamérica" },
            { n: "15", l: "Países" },
            { n: "Gratis", l: "Para usuarios" },
          ].map((s) => (
            <div key={s.l} className="py-6 md:py-8 px-4 text-center">
              <div className="font-display text-orange text-[36px] md:text-[42px] leading-none">
                {s.n}
              </div>
              <div className="text-white/60 text-[13px] md:text-[14px] mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
