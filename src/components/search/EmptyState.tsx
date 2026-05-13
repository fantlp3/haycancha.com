import { SearchX, Plus } from "lucide-react";

interface Props {
  onClear: () => void;
  /** When set, the empty state is framed as a "no matches for this search" instead of a generic filter-mismatch. */
  query?: string;
}

export const EmptyState = ({ onClear, query }: Props) => (
  <div className="p-10 text-center">
    <div className="w-16 h-16 mx-auto rounded-full bg-light flex items-center justify-center text-gray mb-4">
      <SearchX size={28} />
    </div>
    <h3 className="font-semibold text-[15px] text-dark">
      {query
        ? <>No se encontraron clubes que coincidan con &ldquo;{query}&rdquo;</>
        : "No encontramos canchas con esos filtros"}
    </h3>
    <p className="text-[13px] text-gray mt-1.5 max-w-xs mx-auto">
      {query
        ? "Probá con otra palabra o explorá las ciudades populares."
        : "Intentá ampliar la zona de búsqueda o cambiar los filtros."}
    </p>
    <button
      onClick={onClear}
      className="mt-5 inline-flex items-center justify-center px-5 py-2 rounded-md bg-orange text-white text-[12px] font-semibold uppercase tracking-wider hover:brightness-90 transition"
    >
      {query ? "Limpiar búsqueda" : "Limpiar filtros"}
    </button>

    {/* Permanent UGC banner */}
    <div
      className="mt-8 mx-auto max-w-sm rounded-md p-4 flex items-start gap-3 text-left"
      style={{ background: "rgba(232,99,42,0.08)", borderLeft: "3px solid #E8632A" }}
    >
      <Plus size={18} className="text-orange shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-dark">¿Conocés un club que no está?</p>
        <a
          href="/agregar-cancha"
          className="text-[12px] text-orange font-semibold hover:underline mt-0.5 inline-block"
        >
          Sumalo al directorio →
        </a>
      </div>
    </div>
  </div>
);
