import { cn } from "@/lib/utils";
import type { Categoria } from "@/lib/directus-types";

interface Props {
  categorias: Categoria[];
  selectedSlug: string | null;
  /** Called with `null` for the "Todas" chip, slug otherwise. */
  onSelect: (slug: string | null) => void;
  loading?: boolean;
  className?: string;
}

/**
 * Horizontal scrolling chip bar for filtering articles by category. Mobile
 * is scroll-snap-x, desktop wraps. The active chip lifts and inherits the
 * category's `color_hex`.
 */
export const CategoriaFilterBar = ({
  categorias,
  selectedSlug,
  onSelect,
  loading,
  className,
}: Props) => {
  if (loading) {
    return (
      <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 h-9 w-24 rounded-full bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label="Filtrar por categoría"
      className={cn(
        "flex gap-2 overflow-x-auto md:flex-wrap pb-2 -mx-6 px-6 md:mx-0 md:px-0",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <Chip
        active={selectedSlug === null}
        onClick={() => onSelect(null)}
        label="Todas"
      />
      {categorias.map((c) => (
        <Chip
          key={c.id}
          active={selectedSlug === c.slug}
          onClick={() => onSelect(c.slug)}
          label={c.nombre}
          colorHex={c.color_hex}
        />
      ))}
    </div>
  );
};

interface ChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
  colorHex?: string | null;
}

const Chip = ({ active, onClick, label, colorHex }: ChipProps) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={cn(
      "shrink-0 inline-flex items-center h-9 px-4 rounded-full border text-[13px] font-medium whitespace-nowrap transition",
      active
        ? "bg-orange border-orange text-white"
        : "bg-white border-border text-dark hover:border-orange/40"
    )}
    style={active && colorHex ? { backgroundColor: colorHex, borderColor: colorHex } : undefined}
  >
    {label}
  </button>
);
