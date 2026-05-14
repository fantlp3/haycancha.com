import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CtaButton } from "@/components/brand/CtaButton";
import { SportIcon } from "@/components/ui/SportIcon";
import { cn } from "@/lib/utils";
import { LATAM_COUNTRIES } from "@/lib/geo";

const sports: { id: "tenis" | "padel" | "pickleball"; label: string; active: string }[] = [
  { id: "tenis", label: "Tenis", active: "bg-yellow border-yellow text-dark" },
  { id: "padel", label: "Pádel", active: "bg-celeste border-celeste text-dark" },
  { id: "pickleball", label: "Pickleball", active: "bg-lime border-lime text-white" },
];

// TODO: surface options are hardcoded. Move to a config or a Directus enum
// endpoint so the list stays in sync with the `Superficie` schema enum and
// new surfaces (cesped_natural, hormigon_poroso, sintetico_indoor, otro) can
// be enabled without a code change.
const surfaces: { id: string; label: string }[] = [
  { id: "polvo_de_ladrillo", label: "Polvo de ladrillo" },
  { id: "cemento",           label: "Cemento" },
  { id: "cesped_sintetico",  label: "Césped sintético" },
  { id: "pista_dura",        label: "Pista dura" },
  { id: "cristal",           label: "Cristal" },
  { id: "parquet",           label: "Parquet" },
];

const services = [
  "Iluminación nocturna",
  "Vestuarios",
  "Estacionamiento",
  "Clases disponibles",
  "Reserva online",
  "Bar / Restaurante",
];

export interface FiltersState {
  sports: string[];
  surfaces: string[];
  services: string[];
  sort: string;
  country: string;
}

interface Props {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  /** Mobile-only close affordance. Filters apply on-change; this just dismisses the panel. */
  onClose?: () => void;
  /** Used to label the mobile close button "Ver resultados (N)". */
  resultsCount?: number;
  onClear?: () => void;
  /** Selecting a country navigates the URL — handled by SearchPage. */
  onCountryChange?: (countryName: string) => void;
}

export const FiltersPanel = ({
  value,
  onChange,
  onClose,
  resultsCount,
  onClear,
  onCountryChange,
}: Props) => {
  const [countryOpen, setCountryOpen] = useState(false);

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

  return (
    <div className="bg-white border-b border-border p-4 space-y-5">
      {/* Country — drives the URL via onCountryChange (/canchas/:slug). */}
      <div className="space-y-2">
        <p className="label-meta uppercase text-gray">País</p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setCountryOpen((o) => !o)}
            className="w-full flex items-center justify-between bg-light border border-border rounded-md px-3 h-10 text-[13px] font-medium text-dark hover:border-orange/40"
          >
            {value.country}
            <ChevronDown size={16} className={cn("transition", countryOpen && "rotate-180")} />
          </button>
          {countryOpen && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-border rounded-md shadow-card-hover overflow-hidden max-h-72 overflow-y-auto">
              <button
                onClick={() => {
                  setCountryOpen(false);
                  onCountryChange?.("Todos los países");
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-[13px] hover:bg-light",
                  value.country === "Todos los países" && "text-orange font-semibold"
                )}
              >
                Todos los países
              </button>
              {LATAM_COUNTRIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => {
                    setCountryOpen(false);
                    onCountryChange?.(c.name);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-[13px] hover:bg-light",
                    value.country === c.name && "text-orange font-semibold"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sports */}
      <div className="space-y-2">
        <p className="label-meta uppercase text-gray">Deportes</p>
        <div className="flex flex-wrap gap-2">
          {sports.map((s) => {
            const isActive = value.sports.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSport(s.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] font-semibold transition-all",
                  isActive ? s.active : "bg-light border-border text-dark hover:border-orange/40"
                )}
              >
                <SportIcon sport={s.id} size={18} /> {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface — multi-select, OR semantics. */}
      <div className="space-y-2">
        <p className="label-meta uppercase text-gray">Superficie</p>
        <div className="flex flex-wrap gap-1.5">
          {surfaces.map((s) => {
            const isActive = value.surfaces.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSurface(s.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[12px] font-medium border transition",
                  isActive
                    ? "bg-orange border-orange text-white"
                    : "bg-light border-border text-dark hover:border-orange/40"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Services */}
      <div className="space-y-2">
        <p className="label-meta uppercase text-gray">Servicios</p>
        <div className="grid grid-cols-2 gap-2">
          {services.map((s) => {
            const isOn = value.services.includes(s);
            return (
              <label
                key={s}
                className="flex items-center gap-2 text-[13px] text-dark cursor-pointer select-none"
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition",
                    isOn ? "bg-orange border-orange text-white" : "bg-white border-border"
                  )}
                  onClick={() => toggleService(s)}
                >
                  {isOn && <Check size={12} strokeWidth={3} />}
                </span>
                <span onClick={() => toggleService(s)}>{s}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Actions — filters apply on-change, so there's no "Apply" button.
          The CTA below only appears on mobile to dismiss the drawer. */}
      <div className="space-y-2 pt-1">
        {onClose && (
          <CtaButton onClick={onClose} className="w-full md:hidden">
            Ver resultados
            {typeof resultsCount === "number"
              ? ` (${resultsCount.toLocaleString("es-AR")})`
              : ""}
          </CtaButton>
        )}
        <button
          onClick={onClear}
          className="w-full text-center text-[13px] text-gray hover:text-orange transition"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};
