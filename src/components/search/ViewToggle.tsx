import { useRef } from "react";
import { Map as MapIcon, LayoutGrid, List as ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "map" | "grid" | "list";

interface Option {
  id: ViewMode;
  label: string;
  Icon: typeof MapIcon;
}

const OPTIONS: Option[] = [
  { id: "map", label: "Mapa", Icon: MapIcon },
  { id: "grid", label: "Grilla", Icon: LayoutGrid },
  { id: "list", label: "Lista", Icon: ListIcon },
];

interface Props {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
  /** When true, full-width with labels under icons (mobile). */
  stacked?: boolean;
  className?: string;
}

export const ViewToggle = ({ value, onChange, stacked = false, className }: Props) => {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = (idx + dir + OPTIONS.length) % OPTIONS.length;
      refs.current[next]?.focus();
      onChange(OPTIONS[next].id);
    }
  };

  return (
    <div
      role="group"
      aria-label="Modo de vista"
      className={cn(
        "inline-flex rounded-md border border-border overflow-hidden bg-white",
        stacked && "w-full",
        className
      )}
    >
      {OPTIONS.map((opt, idx) => {
        const isActive = value === opt.id;
        const isFirst = idx === 0;
        const isLast = idx === OPTIONS.length - 1;
        return (
          <button
            key={opt.id}
            ref={(el) => (refs.current[idx] = el)}
            type="button"
            aria-pressed={isActive}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => onChange(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              "transition-colors flex items-center justify-center gap-1 outline-none",
              "focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:z-10",
              !isFirst && "border-l border-border",
              isActive
                ? "bg-orange text-white"
                : "bg-white text-dark hover:bg-light",
              stacked
                ? "flex-1 flex-col py-2 h-auto"
                : "h-9 w-11"
            )}
          >
            <opt.Icon size={18} strokeWidth={2} />
            {stacked && (
              <span className="text-[10px] font-semibold uppercase tracking-[1px]">
                {opt.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
