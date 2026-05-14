import { Skeleton } from "@/components/ui/skeleton";
import { useHomeStats } from "@/hooks/useClubes";

const nfAR = new Intl.NumberFormat("es-AR");

// LATAM canonical country count for the "X/19" denominator.
const LATAM_TOTAL = 19;

interface Stat {
  label: string;
  /** Final string when data is available; null while loading or on error. */
  value: string | null;
}

export const StatsStrip = () => {
  const { totalClubes, totalCiudades, totalPaises, isLoading, isError } = useHomeStats();

  const renderValue = (raw: number | undefined): string | null => {
    if (isError) return null; // intentionally blank — no "—" fallback
    if (isLoading || raw === undefined) return null;
    return nfAR.format(raw);
  };

  const renderPaises = (raw: number | undefined): string | null => {
    if (isError) return null;
    if (isLoading || raw === undefined) return null;
    return `${raw}/${LATAM_TOTAL}`;
  };

  const stats: Stat[] = [
    { label: "Clubes activos", value: renderValue(totalClubes) },
    { label: "Países LATAM", value: renderPaises(totalPaises) },
    { label: "Ciudades cubiertas", value: renderValue(totalCiudades) },
  ];

  return (
    <div className="relative bg-dark-2 border-t border-white/5">
      <div className="max-w-container mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {stats.map((s) => (
          <div key={s.label} className="py-6 md:py-8 px-4 text-center">
            <div className="font-display text-orange text-[36px] md:text-[42px] leading-none min-h-[36px] md:min-h-[42px] flex items-center justify-center">
              {s.value !== null ? (
                s.value
              ) : isLoading ? (
                <Skeleton className="h-8 md:h-10 w-20 bg-white/10" />
              ) : (
                // Error → leave the row blank to preserve layout without "—"
                <span aria-hidden className="opacity-0">—</span>
              )}
            </div>
            <div className="text-white/60 text-[13px] md:text-[14px] mt-2">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
