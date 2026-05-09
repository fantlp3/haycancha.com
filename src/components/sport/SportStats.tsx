import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useClubesByDeporte } from "@/hooks/useClubes";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

const nfAR = new Intl.NumberFormat("es-AR");

export const SportStats = ({ sport }: Props) => {
  const { data, isLoading, isError } = useClubesByDeporte(sport.key);
  const text = `text-${sport.color}`;

  const { totalCanchas, totalCiudades, totalPremium } = useMemo(() => {
    const clubs = data ?? [];
    const ciudades = new Set<string>();
    let premium = 0;
    for (const c of clubs) {
      if (c.ciudad?.slug) ciudades.add(c.ciudad.slug);
      if (c.es_premium) premium += 1;
    }
    return {
      totalCanchas: clubs.length,
      totalCiudades: ciudades.size,
      totalPremium: premium,
    };
  }, [data]);

  if (isError) {
    // eslint-disable-next-line no-console
    console.warn("[SportStats] error loading clubes for", sport.key);
    return null;
  }

  const fmt = (n: number) => (isLoading ? "…" : nfAR.format(n));
  const isEmpty = !isLoading && (data?.length ?? 0) === 0;

  const stats = [
    { value: fmt(totalCanchas), label: `Clubes con ${sport.ofName}` },
    { value: fmt(totalCiudades), label: "Ciudades" },
    { value: fmt(totalPremium), label: "Clubes Premium" },
  ];

  return (
    <section
      className="py-12"
      style={{
        background: `linear-gradient(0deg, ${sport.hex}14, ${sport.hex}14), hsl(var(--light))`,
      }}
    >
      <div className="max-w-container mx-auto px-6 lg:px-10">
        <div className="grid gap-8 text-center grid-cols-1 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className={cn(isEmpty && "opacity-50")}>
              <div className={cn("font-display text-[44px] md:text-[56px] leading-none", text)}>
                {s.value}
              </div>
              <div className="text-[12px] font-semibold uppercase tracking-[3px] text-dark mt-3">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
