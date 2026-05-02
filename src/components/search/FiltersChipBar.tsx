import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES, type FiltersState } from "./FiltersPanel";

const SPORTS = [
  { id: "tenis", label: "🎾 Tenis" },
  { id: "padel", label: "🏓 Pádel" },
  { id: "pickleball", label: "🏸 Pickleball" },
];
const SURFACES = ["Polvo de ladrillo", "Cemento", "Césped sintético", "Multipiso", "Madera"];
const SORTS = ["Relevancia", "Más cercano", "Nombre A-Z", "Más canchas"];

interface Props {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  onClear?: () => void;
  resultsLabel: string;
}

/** Horizontal chip filter bar used in Grid + List views. */
export const FiltersChipBar = ({ value, onChange, onClear, resultsLabel }: Props) => {
  const [openMenu, setOpenMenu] = useState<"country" | "surface" | "sort" | null>(null);

  const toggleSport = (id: string) => {
    const next = value.sports.includes(id)
      ? value.sports.filter((s) => s !== id)
      : [...value.sports, id];
    onChange({ ...value, sports: next });
  };

  const activeCount =
    value.sports.length +
    value.services.length +
    (value.surface !== "Todos" ? 1 : 0) +
    (value.country !== "Todos los países" ? 1 : 0);

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
        {/* Country */}
        <DropdownChip
          label={value.country === "Todos los países" ? "País" : value.country}
          active={value.country !== "Todos los países"}
          open={openMenu === "country"}
          onToggle={() => setOpenMenu(openMenu === "country" ? null : "country")}
        >
          <div className="max-h-64 overflow-y-auto">
            {COUNTRIES.map((c) => (
              <MenuItem
                key={c}
                active={value.country === c}
                onClick={() => {
                  onChange({ ...value, country: c });
                  setOpenMenu(null);
                }}
              >
                {c}
              </MenuItem>
            ))}
          </div>
        </DropdownChip>

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

        {/* Surface */}
        <DropdownChip
          label={value.surface === "Todos" ? "Superficie" : value.surface}
          active={value.surface !== "Todos"}
          open={openMenu === "surface"}
          onToggle={() => setOpenMenu(openMenu === "surface" ? null : "surface")}
        >
          <MenuItem
            active={value.surface === "Todos"}
            onClick={() => {
              onChange({ ...value, surface: "Todos" });
              setOpenMenu(null);
            }}
          >
            Todas
          </MenuItem>
          {SURFACES.map((s) => (
            <MenuItem
              key={s}
              active={value.surface === s}
              onClick={() => {
                onChange({ ...value, surface: s });
                setOpenMenu(null);
              }}
            >
              {s}
            </MenuItem>
          ))}
        </DropdownChip>

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
