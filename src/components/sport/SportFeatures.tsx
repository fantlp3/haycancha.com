import { cn } from "@/lib/utils";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

export const SportFeatures = ({ sport }: Props) => {
  const text = `text-${sport.color}`;
  const borderL = `border-l-${sport.color}`;
  return (
    <section className="bg-white py-16">
      <div className="max-w-container mx-auto px-6 lg:px-10 space-y-10">
        <h2 className="font-display text-dark text-[32px] md:text-[40px] leading-none">
          POR QUÉ {sport.name} EN HAYCANCHA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sport.features.map((f) => (
            <div
              key={f.title}
              className={cn(
                "bg-light rounded-md border-l-[3px] p-6 transition-shadow hover:shadow-card",
                borderL
              )}
            >
              <f.icon size={32} className={cn("mb-4", text)} strokeWidth={2} />
              <h3 className="font-bold text-[18px] text-dark leading-tight">{f.title}</h3>
              <p className="mt-2 text-[14px] text-gray leading-[1.6]">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
