import { X } from "lucide-react";

interface FilterPill {
  /** Stable key per pill. */
  key: string;
  /** Visible label, e.g. "Técnica" or "raquetas". */
  label: string;
  /** Optional prefix, e.g. "Filtrando por:" or "Tag:". */
  prefix?: string;
  /** Click handler for the ✕ button. */
  onClear: () => void;
}

interface Props {
  pills: FilterPill[];
}

/**
 * Sticky-friendly row of active filter pills. Renders nothing if no filters
 * are active. Designed to sit below the CategoriaFilterBar on /blog so the
 * user always sees which constraints are narrowing the list.
 */
export const ActiveFilterPills = ({ pills }: Props) => {
  if (pills.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Filtros activos">
      <span className="text-[12px] uppercase tracking-wider text-gray font-semibold mr-1">
        Filtrando por:
      </span>
      {pills.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={p.onClear}
          aria-label={`Quitar filtro ${p.label}`}
          className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full bg-orange text-white text-[13px] font-semibold hover:brightness-95 transition"
        >
          {p.prefix && <span className="opacity-80 font-normal">{p.prefix}</span>}
          {p.label}
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15">
            <X size={12} />
          </span>
        </button>
      ))}
    </div>
  );
};
