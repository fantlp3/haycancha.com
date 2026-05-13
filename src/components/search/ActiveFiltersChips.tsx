import { X } from "lucide-react";
import { countrySlugToName } from "@/lib/geo";
import { cn } from "@/lib/utils";
import type { FiltersState } from "./FiltersPanel";

const SPORT_LABELS: Record<string, string> = {
  tenis: "Tenis",
  padel: "Pádel",
  pickleball: "Pickleball",
};

const SURFACE_LABELS: Record<string, string> = {
  polvo_de_ladrillo: "Polvo de ladrillo",
  cemento: "Cemento",
  cesped_sintetico: "Césped sintético",
  pista_dura: "Pista dura",
  cristal: "Cristal",
  parquet: "Parquet",
};

interface Props {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  /** Country is URL-driven; if set, we render a country chip whose X navigates away. */
  paisSlug?: string;
  onCountryClear?: () => void;
  /** Wipes every facet (sports + surfaces + services + country). View and q stay. */
  onClearAll?: () => void;
  className?: string;
}

/**
 * Renders one chip per active filter facet. Empty when no filter is active.
 * Country chip lives here too (its X navigates away from /canchas/:pais).
 */
export const ActiveFiltersChips = ({
  value,
  onChange,
  paisSlug,
  onCountryClear,
  onClearAll,
  className,
}: Props) => {
  const removeSport = (id: string) =>
    onChange({ ...value, sports: value.sports.filter((s) => s !== id) });
  const removeSurface = (id: string) =>
    onChange({ ...value, surfaces: value.surfaces.filter((s) => s !== id) });
  const removeService = (s: string) =>
    onChange({ ...value, services: value.services.filter((x) => x !== s) });

  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (paisSlug && onCountryClear) {
    chips.push({
      key: `country:${paisSlug}`,
      label: countrySlugToName(paisSlug),
      onRemove: onCountryClear,
    });
  }
  for (const s of value.sports) {
    chips.push({
      key: `sport:${s}`,
      label: SPORT_LABELS[s] ?? s,
      onRemove: () => removeSport(s),
    });
  }
  for (const s of value.surfaces) {
    chips.push({
      key: `surface:${s}`,
      label: SURFACE_LABELS[s] ?? s,
      onRemove: () => removeSurface(s),
    });
  }
  for (const s of value.services) {
    chips.push({
      key: `service:${s}`,
      label: s,
      onRemove: () => removeService(s),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.onRemove}
          aria-label={`Quitar filtro ${c.label}`}
          className="inline-flex items-center gap-1.5 h-8 pl-3 pr-1.5 rounded-full bg-orange/10 border border-orange/30 text-dark text-[13px] hover:bg-orange/15 transition"
        >
          {c.label}
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-gray hover:text-dark">
            <X size={12} />
          </span>
        </button>
      ))}
      {chips.length >= 2 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center h-8 px-3 rounded-full text-[13px] font-medium text-gray hover:text-orange transition"
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
};
