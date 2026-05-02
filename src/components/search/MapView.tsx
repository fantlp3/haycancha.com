import { useState } from "react";
import { LocateFixed, Search as SearchIcon } from "lucide-react";
import { MapPopup } from "./MapPopup";
import { cn } from "@/lib/utils";
import type { SearchCourt } from "@/data/courts";

interface Props {
  courts: SearchCourt[];
  activeId?: string | null;
  onSelect?: (id: string | null) => void;
}

export const MapView = ({ courts, activeId, onSelect }: Props) => {
  const [showResearch, setShowResearch] = useState(false);
  const active = courts.find((c) => c.id === activeId) ?? null;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: "#E8E0D8" }}
      onClick={() => onSelect?.(null)}
    >
      {/* Faux map grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#cfc4b6 1px, transparent 1px), linear-gradient(90deg, #cfc4b6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Faux roads */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute left-0 right-0 top-[40%] h-1.5 bg-white/70" />
        <div className="absolute left-0 right-0 top-[68%] h-1 bg-white/60" />
        <div className="absolute top-0 bottom-0 left-[35%] w-1 bg-white/60" />
        <div className="absolute top-0 bottom-0 left-[62%] w-1.5 bg-white/70" />
      </div>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-[#7a6f5e] max-w-xs px-4">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="font-semibold text-[13px] uppercase tracking-[2px]">Mapa interactivo</div>
          <div className="text-[12px] mt-1 opacity-70">Leaflet + OpenStreetMap</div>
          <div className="text-[11px] opacity-60">(se conecta con datos reales)</div>
        </div>
      </div>

      {/* Markers */}
      {courts.map((c) => {
        const isActive = c.id === activeId;
        return (
          <button
            key={c.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(c.id);
            }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-orange text-white text-[12px] font-bold flex items-center justify-center shadow-md border-2 border-white transition-all hover:scale-110",
              isActive && "scale-125 z-20 ring-4 ring-orange/30"
            )}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
            aria-label={c.name}
          >
            {c.id}
          </button>
        );
      })}

      {/* Popup */}
      {active && (
        <div onClick={(e) => e.stopPropagation()}>
          <MapPopup court={active} onClose={() => onSelect?.(null)} />
        </div>
      )}

      {/* Toolbar */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          className="bg-white shadow-card hover:shadow-card-hover rounded-md h-10 px-3 inline-flex items-center gap-2 text-[13px] font-medium text-dark transition"
          onClick={(e) => e.stopPropagation()}
        >
          <LocateFixed size={16} className="text-orange" />
          Usar mi ubicación
        </button>
        {showResearch && (
          <button
            className="bg-orange text-white shadow-card-hover rounded-md h-10 px-3 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider transition hover:brightness-90"
            onClick={(e) => {
              e.stopPropagation();
              setShowResearch(false);
            }}
          >
            <SearchIcon size={16} />
            Buscar en esta zona
          </button>
        )}
      </div>

      {/* Demo trigger for "search this area" — small floating hint */}
      {!showResearch && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowResearch(true);
          }}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-[11px] font-medium text-gray px-2 py-1 rounded shadow z-10"
        >
          (demo) mover mapa
        </button>
      )}
    </div>
  );
};
