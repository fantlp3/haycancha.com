import { useHomeStats } from "@/hooks/useClubes";

const nfAR = new Intl.NumberFormat("es-AR");

const fmt = (value: number | undefined, isLoading: boolean): string =>
  isLoading || value === undefined ? "—" : nfAR.format(value);

export const StatsStrip = () => {
  const { totalClubes, totalCanchas, totalCiudades, isLoading } = useHomeStats();

  const stats = [
    { n: fmt(totalClubes, isLoading), l: "Clubes activos" },
    { n: fmt(totalCanchas, isLoading), l: "Canchas totales" },
    { n: fmt(totalCiudades, isLoading), l: "Ciudades cubiertas" },
  ];

  return (
    <div className="relative bg-dark-2 border-t border-white/5">
      <div className="max-w-container mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {stats.map((s) => (
          <div key={s.l} className="py-6 md:py-8 px-4 text-center">
            <div className="font-display text-orange text-[36px] md:text-[42px] leading-none">
              {s.n}
            </div>
            <div className="text-white/60 text-[13px] md:text-[14px] mt-2">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
