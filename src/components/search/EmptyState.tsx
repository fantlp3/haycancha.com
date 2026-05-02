import { SearchX } from "lucide-react";

export const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="p-10 text-center">
    <div className="w-16 h-16 mx-auto rounded-full bg-light flex items-center justify-center text-gray mb-4">
      <SearchX size={28} />
    </div>
    <h3 className="font-semibold text-[15px] text-dark">
      No encontramos canchas con esos filtros
    </h3>
    <p className="text-[13px] text-gray mt-1.5 max-w-xs mx-auto">
      Intentá ampliar la zona de búsqueda o cambiar los filtros.
    </p>
    <button
      onClick={onClear}
      className="mt-5 inline-flex items-center justify-center px-5 py-2 rounded-md bg-orange text-white text-[12px] font-semibold uppercase tracking-wider hover:brightness-90 transition"
    >
      Limpiar filtros
    </button>
  </div>
);
