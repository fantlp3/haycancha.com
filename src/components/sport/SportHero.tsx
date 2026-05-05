import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

export const SportHero = ({ sport }: Props) => {
  const text = `text-${sport.color}`;
  return (
    <section className="relative bg-dark overflow-hidden">
      {/* Decorative blurred sport-color circle */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: sport.hex, opacity: 0.08 }}
      />

      <div className="relative max-w-container mx-auto px-6 lg:px-10 py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[60fr_40fr] gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div className="space-y-6 lg:space-y-7">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[3px]", text)}>
              {sport.eyebrow}
            </p>
            <h1 className="font-display text-white leading-[0.85] text-[72px] md:text-[96px] lg:text-[120px]">
              {sport.name}
              <br />
              <span className={text}>{sport.taglineWord}.</span>
            </h1>
            <p className="text-white/70 text-[16px] md:text-[18px] max-w-[480px] leading-relaxed">
              {sport.subtitle}
            </p>

            {/* Search bar with locked sport chip */}
            <form
              action="/canchas"
              method="get"
              className="bg-white rounded-lg p-2 flex items-center gap-2 max-w-xl shadow-card focus-within:shadow-focus-orange transition-shadow"
            >
              {/* Locked sport chip — submitted as ?deporte=X */}
              <input type="hidden" name="deporte" value={sport.key} />
              <span
                className={cn(
                  "shrink-0 inline-flex items-center gap-1 h-9 px-3 rounded-md text-[12px] font-semibold uppercase tracking-wider text-dark",
                  `bg-${sport.color}`
                )}
                aria-label={`Filtrando por ${sport.ofName}`}
              >
                {sport.emoji} {sport.name}
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

          {/* Right — illustration placeholder */}
          <div className="relative hidden lg:block">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${sport.hex}22 0%, transparent 70%), hsl(var(--dark-2))`,
              }}
            >
              <div className="text-center">
                <div className="text-[120px] leading-none mb-4">{sport.emoji}</div>
                <div className={cn("text-[11px] font-semibold uppercase tracking-[3px]", text)}>
                  [{sport.ofName} image]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
