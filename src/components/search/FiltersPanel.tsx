import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CtaButton } from "@/components/brand/CtaButton";
import { cn } from "@/lib/utils";

const sports = [
  { id: "tenis", emoji: "🎾", label: "Tenis", active: "bg-yellow border-yellow text-dark" },
  { id: "padel", emoji: "🏓", label: "Pádel", active: "bg-celeste border-celeste text-dark" },
  { id: "pickleball", emoji: "🏸", label: "Pickleball", active: "bg-lime border-lime text-white" },
];

const surfaces = ["Todos", "Polvo de ladrillo", "Cemento", "Césped sintético", "Multipiso", "Madera"];

const services = [
  "Iluminación nocturna",
  "Vestuarios",
  "Estacionamiento",
  "Clases disponibles",
  "Reserva online",
  "Bar / Restaurante",
];

const sortOptions = ["Relevancia", "Más cercano", "Nombre A-Z", "Más canchas"];

export interface FiltersState {
  sports: string[];
  surface: string;
  services: string[];
  sort: string;
  country: string;
}

interface Props {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  onApply?: () => void;
  onClear?: () => void;
}

export const FiltersPanel = ({ value, onChange, onApply, onClear }: Props) => {
  const [sortOpen, setSortOpen] = useState(false);

  const toggleSport = (id: string) => {
    const next = value.sports.includes(id)
      ? value.sports.filter((s) => s !== id)
      : [...value.sports, id];
    onChange({ ...value, sports: next });
  };
  const toggleService = (s: string) => {
    const next = value.services.includes(s)
      ? value.services.filter((x) => x !== s)
      : [...value.services, s];
    onChange({ ...value, services: next });
  };

  return (
    <div className="bg-white border-b border-border p-4 space-y-5">
      {/* Country — currently driven by URL (/canchas/:pais), so this dropdown
          isn't wired up yet. Disabled with a "Próximamente" hint until we
          decide how it should interact with the path-based filter. */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="label-meta uppercase text-gray">País</p>
          <span className="text-[10px] uppercase tracking-wider text-gray/70 font-semibold">
            Próximamente
          </span>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Próximamente"
          className="w-full flex items-center justify-between bg-light/60 border border-border rounded-md px-3 h-10 text-[13px] font-medium text-gray/60 cursor-not-allowed"
        >
          {value.country}
          <ChevronDown size={16} />
        </button>
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
                <span>{s.emoji}</span> {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface — needs per-club superficie (clubes_deportes.superficie),
          not yet projected through the list queries. Disabled with a
          "Próximamente" hint to make the no-op state explicit. */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="label-meta uppercase text-gray">Superficie</p>
          <span className="text-[10px] uppercase tracking-wider text-gray/70 font-semibold">
            Próximamente
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5" aria-disabled="true" title="Próximamente">
          {surfaces.map((s) => (
            <button
              key={s}
              type="button"
              disabled
              className="px-2.5 py-1 rounded-md text-[12px] font-medium border bg-light/60 border-border text-gray/60 cursor-not-allowed"
            >
              {s}
            </button>
          ))}
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

      {/* Sort */}
      <div className="space-y-2">
        <p className="label-meta uppercase text-gray">Ordenar por</p>
        <div className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="w-full flex items-center justify-between bg-light border border-border rounded-md px-3 h-10 text-[13px] font-medium text-dark hover:border-orange/40"
          >
            {value.sort}
            <ChevronDown size={16} className={cn("transition", sortOpen && "rotate-180")} />
          </button>
          {sortOpen && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-border rounded-md shadow-card-hover overflow-hidden">
              {sortOptions.map((o) => (
                <button
                  key={o}
                  onClick={() => {
                    onChange({ ...value, sort: o });
                    setSortOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-[13px] hover:bg-light",
                    value.sort === o && "text-orange font-semibold"
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <CtaButton onClick={onApply} className="w-full">
          Aplicar filtros
        </CtaButton>
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
