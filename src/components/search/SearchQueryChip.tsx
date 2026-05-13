import { Search, X } from "lucide-react";

interface Props {
  query: string;
  onClear: () => void;
}

export const SearchQueryChip = ({ query, onClear }: Props) => (
  <div className="inline-flex items-center gap-2 max-w-full pl-3 pr-1.5 py-1.5 rounded-full bg-orange/10 border border-orange/30 text-dark text-[13px]">
    <Search size={13} className="text-orange shrink-0" />
    <span className="truncate">
      Buscando: <span className="font-semibold">&ldquo;{query}&rdquo;</span>
    </span>
    <button
      type="button"
      onClick={onClear}
      aria-label={`Quitar búsqueda "${query}"`}
      className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-orange/15 text-gray hover:text-dark transition"
    >
      <X size={13} />
    </button>
  </div>
);
