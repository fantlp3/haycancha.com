import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FiltersState } from "./FiltersPanel";

const SPORTS = [
  { id: "tenis", label: "🎾 Tenis" },
  { id: "padel", label: "🏓 Pádel" },
  { id: "pickleball", label: "🏸 Pickleball" },
];
const SORTS = ["Relevancia", "Más cercano", "Nombre A-Z", "Más canchas"];

interface Props {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  onClear?: () => void;
  resultsLabel: string;
}

/** Horizontal chip filter bar used in Grid + List views. */
export const FiltersChipBar = ({ value, onChange, onClear, resultsLabel }: Props) => {
  const [openMenu, setOpenMenu] = useState<"sort" | null>(null);

  const toggleSport = (id: string) => {
    const next = value.sports.includes(id)
      ? value.sports.filter((s) => s !== id)
      : [...value.sports, id];
    onChange({ ...value, sports: next });
  };

  const activeCount = value.sports.length + value.services.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[14px] text-dark font-medium">{resultsLabel}</p>
        <DropdownChip
          label={`Ordenar: ${value.sort}`}
          open={openMenu === "sort"}
          onToggle={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
        >
          {SORTS.map((o) => (
            <MenuItem
              key={o}
              active={value.sort === o}
              onClick={() => {
                onChange({ ...value, sort: o });
                setOpenMenu(null);
              }}
            >
              {o}
            </MenuItem>
          ))}
        </DropdownChip>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Country (próximamente — driven by URL today) */}
        <DisabledChip label="País · Próximamente" />

        {/* Sports */}
        {SPORTS.map((s) => (
          <Chip
            key={s.id}
            active={value.sports.includes(s.id)}
            onClick={() => toggleSport(s.id)}
          >
            {s.label}
          </Chip>
        ))}

        {/* Surface (próximamente — needs per-club superficie projection) */}
        <DisabledChip label="Superficie · Próximamente" />

        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="shrink-0 inline-flex items-center gap-1 h-9 px-3 rounded-full text-[13px] font-medium text-gray hover:text-orange transition"
          >
            <X size={14} /> Limpiar ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
};

const Chip = ({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "shrink-0 inline-flex items-center gap-1 h-9 px-3 rounded-full border text-[13px] font-medium transition whitespace-nowrap",
      active
        ? "bg-orange border-orange text-white"
        : "bg-white border-border text-dark hover:border-orange/40"
    )}
  >
    {children}
  </button>
);

const DisabledChip = ({ label }: { label: string }) => (
  <span
    aria-disabled="true"
    title="Próximamente"
    className="shrink-0 inline-flex items-center gap-1 h-9 px-3 rounded-full border bg-light/60 border-border text-gray/60 text-[13px] font-medium whitespace-nowrap cursor-not-allowed"
  >
    {label}
  </span>
);

const DropdownChip = ({
  label,
  active,
  open,
  onToggle,
  children,
}: {
  label: string;
  active?: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="relative shrink-0">
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1 h-9 px-3 rounded-full border text-[13px] font-medium transition whitespace-nowrap",
        active
          ? "bg-orange border-orange text-white"
          : "bg-white border-border text-dark hover:border-orange/40"
      )}
    >
      {label}
      <ChevronDown size={14} className={cn("transition", open && "rotate-180")} />
    </button>
    {open && (
      <div className="absolute z-30 mt-1 min-w-[180px] bg-white border border-border rounded-md shadow-card-hover overflow-hidden">
        {children}
      </div>
    )}
  </div>
);

const MenuItem = ({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left px-3 py-2 text-[13px] hover:bg-light whitespace-nowrap",
      active && "text-orange font-semibold"
    )}
  >
    {children}
  </button>
);
