import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LATAM_COUNTRIES, countrySlugToName } from "@/lib/geo";
import type { FiltersState } from "./FiltersPanel";

const SPORTS = [
  { id: "tenis", label: "🎾 Tenis" },
  { id: "padel", label: "🏓 Pádel" },
  { id: "pickleball", label: "🏸 Pickleball" },
];
const SORTS = ["Relevancia", "Más cercano", "Nombre A-Z", "Más canchas"];

// TODO: surface options are hardcoded. Move to a config or a Directus enum
// endpoint so the list stays in sync with the `Superficie` schema enum.
const SURFACES = [
  { id: "polvo_de_ladrillo", label: "Polvo de ladrillo" },
  { id: "cemento",           label: "Cemento" },
  { id: "cesped_sintetico",  label: "Césped sintético" },
  { id: "pista_dura",        label: "Pista dura" },
  { id: "cristal",           label: "Cristal" },
  { id: "parquet",           label: "Parquet" },
];
const SERVICES = [
  "Iluminación nocturna",
  "Vestuarios",
  "Estacionamiento",
  "Clases disponibles",
  "Reserva online",
  "Bar / Restaurante",
];

interface Props {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  onClear?: () => void;
  resultsLabel: string;
  /** Country is URL-driven; pass the current pais slug from useParams. */
  paisSlug?: string;
  onCountryChange?: (countryName: string) => void;
}

/** Horizontal chip filter bar used in Grid + List views. */
export const FiltersChipBar = ({
  value,
  onChange,
  onClear,
  resultsLabel,
  paisSlug,
  onCountryChange,
}: Props) => {
  const [openMenu, setOpenMenu] = useState<"sort" | "country" | "surface" | "service" | null>(null);
  const closeMenu = () => setOpenMenu(null);

  const toggleSport = (id: string) => {
    const next = value.sports.includes(id)
      ? value.sports.filter((s) => s !== id)
      : [...value.sports, id];
    onChange({ ...value, sports: next });
  };
  const toggleSurface = (id: string) => {
    const next = value.surfaces.includes(id)
      ? value.surfaces.filter((s) => s !== id)
      : [...value.surfaces, id];
    onChange({ ...value, surfaces: next });
  };
  const toggleService = (s: string) => {
    const next = value.services.includes(s)
      ? value.services.filter((x) => x !== s)
      : [...value.services, s];
    onChange({ ...value, services: next });
  };

  const currentCountry = paisSlug ? countrySlugToName(paisSlug) : null;
  const activeCount =
    value.sports.length +
    value.services.length +
    value.surfaces.length +
    (paisSlug ? 1 : 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[14px] text-dark font-medium">{resultsLabel}</p>
        <DropdownChip
          label={`Ordenar: ${value.sort}`}
          open={openMenu === "sort"}
          onToggle={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
          onClose={closeMenu}
        >
          {SORTS.map((o) => (
            <MenuItem
              key={o}
              active={value.sort === o}
              onClick={() => {
                onChange({ ...value, sort: o });
                closeMenu();
              }}
            >
              {o}
            </MenuItem>
          ))}
        </DropdownChip>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Country — URL-driven. */}
        <DropdownChip
          label={currentCountry ? `País: ${currentCountry}` : "País"}
          active={!!currentCountry}
          open={openMenu === "country"}
          onToggle={() => setOpenMenu(openMenu === "country" ? null : "country")}
          onClose={closeMenu}
        >
          <MenuItem
            active={!currentCountry}
            onClick={() => {
              closeMenu();
              onCountryChange?.("Todos los países");
            }}
          >
            Todos los países
          </MenuItem>
          {LATAM_COUNTRIES.map((c) => (
            <MenuItem
              key={c.slug}
              active={paisSlug === c.slug}
              onClick={() => {
                closeMenu();
                onCountryChange?.(c.name);
              }}
            >
              {c.name}
            </MenuItem>
          ))}
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

        {/* Surface — multi-select OR. */}
        <DropdownChip
          label={value.surfaces.length ? `Superficie · ${value.surfaces.length}` : "Superficie"}
          active={value.surfaces.length > 0}
          open={openMenu === "surface"}
          onToggle={() => setOpenMenu(openMenu === "surface" ? null : "surface")}
          onClose={closeMenu}
        >
          {SURFACES.map((s) => (
            <MenuItem
              key={s.id}
              active={value.surfaces.includes(s.id)}
              onClick={() => toggleSurface(s.id)}
            >
              {s.label}
            </MenuItem>
          ))}
        </DropdownChip>

        {/* Services — multi-select AND. */}
        <DropdownChip
          label={value.services.length ? `Servicios · ${value.services.length}` : "Servicios"}
          active={value.services.length > 0}
          open={openMenu === "service"}
          onToggle={() => setOpenMenu(openMenu === "service" ? null : "service")}
          onClose={closeMenu}
        >
          {SERVICES.map((s) => (
            <MenuItem
              key={s}
              active={value.services.includes(s)}
              onClick={() => toggleService(s)}
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

const MENU_WIDTH = 220; // matches w-[220px] on the portal menu
const MENU_VIEWPORT_MARGIN = 8;

/**
 * Anchors a fixed-position portal menu to a trigger button.
 *
 * Why portal: `FiltersChipBar` lives inside an `overflow-x-auto` scroll strip,
 * which (per CSS spec) also clips the y-axis. An inline absolutely-positioned
 * menu gets clipped. Rendering via portal with `position: fixed` sidesteps
 * every overflow ancestor.
 *
 * Closes on outside click, Escape, page scroll, and viewport resize. Position
 * is computed once on open — once visible, scroll/resize close rather than
 * follow, which avoids drift fragility.
 */
function usePortalMenu(open: boolean, onClose: () => void) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const top = rect.bottom + 4;
    // Clamp to viewport so the rightmost chip's menu (e.g. Servicios) doesn't
    // overflow the right edge on narrow screens. The outer Math.max also
    // guards against very-narrow viewports (foldables, embedded contexts)
    // where the right-edge clamp would otherwise produce a negative left.
    const left = Math.max(
      MENU_VIEWPORT_MARGIN,
      Math.min(rect.left, window.innerWidth - MENU_WIDTH - MENU_VIEWPORT_MARGIN)
    );
    setPos({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // We listen on `mousedown` (not `click`) so this fires BEFORE the
    // trigger's onClick handler. When the user clicks an open trigger to
    // close it, the listener sees the trigger contains the target and does
    // nothing — then the subsequent `click` fires onToggle, which closes.
    // Switching to `click` here would race with onToggle and reopen the menu.
    const onDocPointerDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onScrollOrResize = () => onClose();

    document.addEventListener("mousedown", onDocPointerDown);
    document.addEventListener("keydown", onKey);
    // Capture phase so nested scroll containers also dismiss.
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onDocPointerDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, onClose]);

  return { triggerRef, menuRef, pos };
}

const DropdownChip = ({
  label,
  active,
  open,
  onToggle,
  onClose,
  children,
}: {
  label: string;
  active?: boolean;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const { triggerRef, menuRef, pos } = usePortalMenu(open, onClose);

  return (
    <div className="shrink-0">
      <button
        ref={triggerRef}
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
      {open && pos !== null &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            className="z-50 w-[220px] max-h-72 overflow-y-auto bg-white border border-border rounded-md shadow-card-hover"
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  );
};

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
