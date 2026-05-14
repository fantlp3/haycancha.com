import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { useClubStats } from "@/hooks/useClubes";
import { SportIcon } from "@/components/ui/SportIcon";
import { HeroRotator } from "@/components/hero/HeroRotator";
import { getDefaultView, withDefaultView } from "@/lib/view-mode";
import { StatsStrip } from "./StatsStrip";

const nfAR = new Intl.NumberFormat("es-AR");

const quickChips: { label: string; href: string }[] = [
  { label: "Buenos Aires", href: "/canchas/argentina/buenos-aires" },
  { label: "Ciudad de México", href: "/canchas/mexico/ciudad-de-mexico" },
  { label: "Bogotá", href: "/canchas/colombia/bogota" },
  { label: "Santiago", href: "/canchas/chile/santiago" },
  { label: "Lima", href: "/canchas/peru/lima" },
];

export const Hero = () => {
  const { data: stats, isLoading: statsLoading, isError: statsError, error: statsErr } = useClubStats();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (statsError) console.error("[Hero] stats error:", statsErr, (statsErr as any)?.errors, (statsErr as any)?.response);
  }, [statsError, statsErr]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = searchValue.trim();
    if (!v) return;
    navigate(`/canchas?q=${encodeURIComponent(v)}&view=${getDefaultView()}`);
  };

  // Resolved once at mount so chip hrefs are device-appropriate without
  // recomputing on every re-render. Re-mounting on viewport rotation is rare
  // enough that we don't subscribe to matchMedia changes here.
  const chipsWithView = useMemo(
    () => quickChips.map((c) => ({ ...c, href: withDefaultView(c.href) })),
    []
  );

  const totalCanchas = stats?.total ?? 0;

  const totalDisplay = statsError
    ? "1.500+"
    : statsLoading
    ? "…"
    : nfAR.format(totalCanchas);

  return (
    <>
      <HeroRotator overlayGradient="left">
        <div className="max-w-container mx-auto px-6 lg:px-10 py-16 lg:py-0 lg:min-h-[85vh] flex items-center">
          <div className="space-y-6 lg:space-y-8 max-w-2xl">
            <p className="label-meta uppercase text-orange tracking-[3px] inline-flex items-center gap-2">
              <SportIcon sport="tenis" size={26} />
              El directorio de tenis de Latinoamérica
            </p>
            <h1 className="font-display text-white text-[56px] md:text-[72px] lg:text-[80px] leading-[0.9]">
              ENCONTRÁ<br />
              TU CANCHA<br />
              <span className="text-orange">PERFECTA.</span>
            </h1>
            <p className="text-white/85 text-[16px] md:text-[18px] max-w-xl leading-relaxed">
              Más de {totalDisplay} clubes y canchas de tenis, pádel y pickleball en toda Latinoamérica. Gratis.
            </p>

            {/* Search */}
            <form
              id="home-search"
              onSubmit={handleSubmit}
              className="bg-white rounded-lg p-2 flex items-center gap-2 max-w-xl shadow-card focus-within:shadow-focus-orange transition-shadow"
            >
              <div className="flex-1 flex items-center gap-3 pl-3 min-w-0">
                <Search size={20} className="text-orange shrink-0" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Barrio, ciudad o nombre del club..."
                  className="w-full h-10 md:h-12 bg-transparent border-0 outline-none text-dark placeholder:text-gray text-[15px] font-medium min-w-0"
                />
              </div>
              <button
                type="submit"
                className="hidden md:inline-flex items-center justify-center h-10 md:h-12 px-6 bg-orange text-white font-semibold text-[14px] uppercase tracking-[1px] leading-none rounded-md hover:brightness-90 transition"
              >
                Buscar
              </button>
            </form>
            <button
              type="submit"
              form="home-search"
              className="md:hidden w-full h-[52px] bg-orange text-white font-bold text-[16px] uppercase tracking-[1px] rounded-md hover:brightness-90 transition"
            >
              Buscar
            </button>

            {/* Chips — horizontal scroll on mobile, wrap on desktop */}
            <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-visible flex-nowrap -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {chipsWithView.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 min-h-[44px] md:min-h-0 md:py-1.5 rounded-full bg-white/15 text-white/90 text-[13px] font-medium border border-transparent hover:opacity-100 hover:border-orange hover:text-white transition whitespace-nowrap"
                >
                  <MapPin size={13} className="text-orange" />
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </HeroRotator>
      <StatsStrip />
    </>
  );
};
