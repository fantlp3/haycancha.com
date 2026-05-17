import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fetchArticuloBySlug } from "@/lib/queries";
import { EDITORIAL_TEAM } from "@/lib/editorial";
import { formatBlogDate } from "@/lib/date";
import type { ArticuloCard as ArticuloCardData } from "@/lib/directus-types";

interface Props {
  articulo: ArticuloCardData;
  className?: string;
}

export const ArticuloCard = ({ articulo, className }: Props) => {
  const { titulo, slug, excerpt, lead, imagen_destacada_url, imagen_destacada_alt } = articulo;
  const dek = excerpt || lead || "";
  const fecha = formatBlogDate(articulo.fecha_publicacion);
  const minutos = articulo.tiempo_lectura_min;
  const cat = articulo.categoria_principal;
  // Byline is unified to the editorial team — `articulo.autor` is intentionally
  // not rendered here (data stays in Directus; only the rendering is masked).
  const queryClient = useQueryClient();

  // Warm the detail-page cache on hover/touch so the navigation feels instant.
  // react-query dedupes identical keys, so this is safe to call repeatedly.
  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["articulo", slug],
      queryFn: () => fetchArticuloBySlug(slug),
      staleTime: 10 * 60 * 1000,
    });
  };

  return (
    <Link
      to={`/blog/${slug}`}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
        className
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {imagen_destacada_url ? (
          <img
            src={imagen_destacada_url}
            alt={imagen_destacada_alt || titulo}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-light" aria-hidden />
        )}
        {cat && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/95 text-dark hover:bg-white border-0 font-semibold text-[11px] uppercase tracking-wider"
              style={cat.color_hex ? { boxShadow: `inset 3px 0 0 ${cat.color_hex}` } : undefined}
            >
              {cat.nombre}
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-display text-[20px] md:text-[22px] leading-tight text-dark group-hover:text-orange transition-colors line-clamp-2">
          {titulo}
        </h3>
        {dek && (
          <p className="text-[14px] text-gray leading-relaxed line-clamp-3">{dek}</p>
        )}

        {/* Footer: editorial team byline + meta */}
        <div className="mt-auto pt-4 flex items-center gap-3 border-t border-border">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback
              className="text-[11px] font-semibold"
              style={{
                backgroundColor: EDITORIAL_TEAM.avatar_color_bg,
                color: EDITORIAL_TEAM.avatar_color_text,
              }}
            >
              {EDITORIAL_TEAM.avatar_initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-dark truncate">{EDITORIAL_TEAM.name}</div>
            <div className="flex items-center gap-2 text-[11px] text-gray">
              {fecha && <span>{fecha}</span>}
              {fecha && minutos != null && <span aria-hidden>·</span>}
              {minutos != null && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} />
                  {minutos} min
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ArticuloCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card">
    <div className="aspect-[16/9] bg-muted animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
      <div className="h-4 w-full bg-muted animate-pulse rounded" />
      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
      <div className="pt-4 mt-2 flex items-center gap-3 border-t border-border">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
          <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  </div>
);
