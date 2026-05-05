import { cn } from "@/lib/utils";
import { useHomeStats } from "@/hooks/useClubes";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

const nfAR = new Intl.NumberFormat("es-AR");

const fmt = (n: number | undefined, isLoading: boolean): string =>
  isLoading || n === undefined ? "—" : nfAR.format(n);

export const SportStats = ({ sport }: Props) => {
  const { totalClubes, totalCiudades, countsBySport, isLoading } = useHomeStats();
  const text = `text-${sport.color}`;

  const stats = [
    {
      value: fmt(countsBySport?.[sport.key], isLoading),
      label: `Clubes con ${sport.ofName}`,
    },
    { value: fmt(totalClubes, isLoading), label: "Clubes activos" },
    { value: fmt(totalCiudades, isLoading), label: "Ciudades cubiertas" },
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
            <div key={s.label}>
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
