import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHomeStats } from "@/hooks/useClubes";
import { SportIcon } from "@/components/ui/SportIcon";

const nfAR = new Intl.NumberFormat("es-AR");

interface SportCardProps {
  title: string;
  count: string;
  variant: "tenis" | "padel" | "pickleball";
}

const SportCard = ({ title, count, variant }: SportCardProps) => {
  const dark = variant === "tenis";
  const accent =
    variant === "tenis" ? "border-l-yellow" : variant === "padel" ? "border-l-celeste" : "border-l-lime";
  const linkColor =
    variant === "tenis" ? "text-yellow" : variant === "padel" ? "text-celeste" : "text-lime";
  const landing = variant === "tenis" ? "/tenis" : variant === "padel" ? "/padel" : "/pickleball";
  const seeAll = `/canchas?deporte=${variant}`;
  return (
    <a
      href={landing}
      className={cn(
        "group relative rounded-xl p-8 border-l-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer block",
        accent,
        dark ? "bg-dark text-white" : "bg-white border border-border text-dark hover:shadow-card-hover"
      )}
    >
      {/* TODO: revisar size si se ve chico */}
      <div className="mb-6">
        <SportIcon sport={variant} size={20} />
      </div>
      <h3 className={cn("font-display text-[36px] leading-none", dark ? "text-white" : "text-dark")}>
        {title}
      </h3>
      <p className={cn("mt-2 text-[14px]", dark ? "text-white/60" : "text-gray")}>
        {count}
      </p>
      <a
        href={seeAll}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "mt-6 inline-flex items-center gap-1 text-[14px] font-semibold uppercase tracking-wide group-hover:underline",
          linkColor
        )}
      >
        Ver todas <ArrowRight size={14} />
      </a>
    </a>
  );
};

export const SportSection = () => {
  const { countsBySport, isLoading } = useHomeStats();
  const fmt = (n: number | undefined): string =>
    isLoading || n === undefined ? "— canchas" : `${nfAR.format(n)} canchas`;

  return (
    <section className="bg-light py-16 md:py-20">
      <div className="max-w-container mx-auto px-6 lg:px-10 space-y-10">
        <div className="section-divider">Encontrá por deporte</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SportCard title="TENIS" count={fmt(countsBySport?.tenis)} variant="tenis" />
          <SportCard title="PÁDEL" count={fmt(countsBySport?.padel)} variant="padel" />
          <SportCard title="PICKLEBALL" count={fmt(countsBySport?.pickleball)} variant="pickleball" />
        </div>
      </div>
    </section>
  );
};
