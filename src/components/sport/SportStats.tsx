import { cn } from "@/lib/utils";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

export const SportStats = ({ sport }: Props) => {
  const text = `text-${sport.color}`;
  return (
    <section
      className="py-12"
      style={{
        background: `linear-gradient(0deg, ${sport.hex}14, ${sport.hex}14), hsl(var(--light))`,
      }}
    >
      <div className="max-w-container mx-auto px-6 lg:px-10">
        <div
          className={cn(
            "grid gap-8 text-center",
            sport.stats.length === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"
          )}
        >
          {sport.stats.map((s) => (
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
