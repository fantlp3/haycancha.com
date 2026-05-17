import { ArticuloCard } from "./ArticuloCard";
import type { ArticuloCard as ArticuloCardData } from "@/lib/directus-types";

interface Props {
  articulos: ArticuloCardData[];
}

/**
 * "Seguí leyendo" section at the bottom of the article detail page. Reuses
 * the same ArticuloCard component from /blog so the visual is consistent.
 */
export const RelatedArticles = ({ articulos }: Props) => {
  if (articulos.length === 0) return null;
  return (
    <section aria-label="Artículos relacionados" className="mt-16 md:mt-20">
      <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <p className="label-meta uppercase text-orange tracking-[3px] mb-2">
            Seguí leyendo
          </p>
          <h2 className="font-display text-dark text-[28px] md:text-[36px] leading-tight">
            Más artículos<span className="text-orange">.</span>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {articulos.map((a) => (
          <ArticuloCard key={a.id} articulo={a} />
        ))}
      </div>
    </section>
  );
};
