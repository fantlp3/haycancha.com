import { X } from "lucide-react";
import { SportBadge } from "@/components/brand/SportBadge";
import type { SearchCourt } from "@/data/courts";

interface Props {
  court: SearchCourt;
  onClose: () => void;
}

export const MapPopup = ({ court, onClose }: Props) => (
  <div
    className="absolute z-30 w-[260px] -translate-x-1/2 -translate-y-[calc(100%+18px)] bg-white rounded-[10px] shadow-card-hover border border-border p-3 animate-in fade-in zoom-in-95"
    style={{ left: `${court.x}%`, top: `${court.y}%` }}
  >
    <button
      onClick={onClose}
      aria-label="Cerrar"
      className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-light flex items-center justify-center text-gray hover:text-dark"
    >
      <X size={14} />
    </button>
    <h4 className="font-bold text-[14px] text-dark pr-6 leading-tight">{court.name}</h4>
    <p className="text-[12px] text-gray mt-0.5">{court.neighborhood}</p>
    <div className="flex flex-wrap gap-1 mt-2">
      {court.sports.map((s) => (
        <SportBadge key={s} sport={s} />
      ))}
    </div>
    <button className="mt-3 w-full bg-orange text-white text-[12px] font-semibold uppercase tracking-wider rounded-md py-2 hover:brightness-90 transition">
      Ver ficha
    </button>
    {/* Tail */}
    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-3 h-3 bg-white border-r border-b border-border rotate-45 -mt-1.5" />
  </div>
);
