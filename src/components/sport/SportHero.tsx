import { Search } from "lucide-react";
import { SportIcon } from "@/components/ui/SportIcon";
import { HeroRotator } from "@/components/hero/HeroRotator";
import { cn } from "@/lib/utils";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

export const SportHero = ({ sport }: Props) => {
  const text = `text-${sport.color}`;
  return (
    <HeroRotator deporte={sport.key} overlayGradient="left">
      <div className="max-w-container mx-auto px-6 lg:px-10 py-16 md:py-20 lg:py-24">
        <div className="space-y-6 lg:space-y-7 max-w-2xl">
          <p className={cn("text-[11px] font-semibold uppercase tracking-[3px] inline-flex items-center gap-2", text)}>
            <SportIcon sport={sport.key} size={26} />
            {sport.eyebrow}
          </p>
          <h1 className="font-display text-white leading-[0.85] text-[72px] md:text-[96px] lg:text-[120px]">
            {sport.name}
            <br />
            <span className={text}>{sport.taglineWord}.</span>
          </h1>
          <p className="text-white/85 text-[16px] md:text-[18px] max-w-[480px] leading-relaxed">
            {sport.subtitle}
          </p>

          {/* Search bar with locked sport chip */}
          <form
            action="/canchas"
            method="get"
            className="bg-white rounded-lg p-2 flex items-center gap-2 max-w-xl shadow-card focus-within:shadow-focus-orange transition-shadow"
          >
            <input type="hidden" name="deporte" value={sport.key} />
            <span
              className={cn(
                "shrink-0 inline-flex items-center gap-1 h-9 px-3 rounded-md text-[12px] font-semibold uppercase tracking-wider text-dark",
                `bg-${sport.color}`
              )}
              aria-label={`Filtrando por ${sport.ofName}`}
            >
              <SportIcon sport={sport.key} size={14} /> {sport.name}
            </span>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <Search size={18} className="text-orange shrink-0" />
              <input
                name="q"
                type="text"
                placeholder="Barrio, ciudad o nombre del club..."
                className="w-full h-10 md:h-11 bg-transparent border-0 outline-none text-dark placeholder:text-gray text-[14px] font-medium min-w-0"
              />
            </div>
            <button
              type="submit"
              className="hidden sm:inline-flex items-center justify-center h-10 md:h-11 px-5 bg-orange text-white font-semibold text-[13px] uppercase tracking-[1px] leading-none rounded-md hover:brightness-90 transition shrink-0"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
    </HeroRotator>
  );
};
