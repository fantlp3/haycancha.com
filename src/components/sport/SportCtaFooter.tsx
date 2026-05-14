import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CtaButton } from "@/components/brand/CtaButton";
import type { SportConfig } from "@/lib/sports";

interface Props {
  sport: SportConfig;
}

export const SportCtaFooter = ({ sport }: Props) => {
  const text = `text-${sport.color}`;
  return (
    <section className="relative bg-dark overflow-hidden">
      <div
        aria-hidden
        className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: sport.hex, opacity: 0.1 }}
      />
      <div className="relative max-w-container mx-auto px-6 lg:px-10 py-20 text-center space-y-6">
        <p className={cn("text-[11px] font-semibold uppercase tracking-[3px]", text)}>
          Empezá a buscar
        </p>
        <h2 className="font-display text-white text-[44px] md:text-[56px] leading-[0.95]">
          TODAS LAS CANCHAS DE {sport.name}
        </h2>
        <p className="text-white/70 text-[16px] max-w-xl mx-auto">
          Mapa interactivo, filtros por superficie, iluminación, ciudad y barrio. Sin cuentas, sin comisiones.
        </p>
        <div className="pt-2 flex flex-col items-center gap-4">
          <CtaButton asChild className="px-10 py-4 text-[15px]">
            <Link to={`/canchas?deporte=${sport.key}`}>Ver mapa y listado</Link>
          </CtaButton>
          <Link
            to="/agregar-cancha"
            className={cn("text-[13px] font-semibold uppercase tracking-wider hover:underline", text)}
          >
            ¿Tu cancha no aparece? Sumala →
          </Link>
        </div>
      </div>
    </section>
  );
};
