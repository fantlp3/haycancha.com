import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useSportStats } from "@/hooks/useClubes";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

const nfAR = new Intl.NumberFormat("es-AR");

export const SportStats = ({ sport }: Props) => {
  const { data, isLoading, isError } = useSportStats(sport.key);
  const text = `text-${sport.color}`;

  const renderValue = (raw: number | undefined): string | null => {
    if (isError) return null;
    if (isLoading || raw === undefined) return null;
    return nfAR.format(raw);
  };

  const stats = [
    { value: renderValue(data?.clubes), label: `Clubes con ${sport.ofName}` },
    { value: renderValue(data?.ciudades), label: "Ciudades" },
    { value: renderValue(data?.premium), label: "Clubes Premium" },
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
              <div
                className={cn(
                  "font-display text-[44px] md:text-[56px] leading-none min-h-[44px] md:min-h-[56px] flex items-center justify-center",
                  text
                )}
              >
                {s.value !== null ? (
                  s.value
                ) : isLoading ? (
                  <Skeleton className="h-10 md:h-12 w-24" />
                ) : (
                  <span aria-hidden className="opacity-0">—</span>
                )}
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
