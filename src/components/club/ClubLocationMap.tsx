import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface ClubLocationMapProps {
  lat: number;
  lng: number;
  name: string;
}

// Same orange teardrop pin used in the search MapView, inlined to avoid re-export.
const orangePinIcon = L.divIcon({
  className: "",
  html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#E8632A;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
    <div style="width:10px;height:10px;background:white;border-radius:50%;"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/**
 * Mapa de ubicación de la ficha de club.
 *
 * Vive en su propio módulo para que leaflet (~150 KB) salga del chunk de
 * entrada: antes se importaba en ClubDetailPage a nivel de módulo, así que lo
 * pagaba cualquier visitante de cualquier página. Se monta vía
 * LazyClubLocationMap, que espera a que la sección entre en viewport.
 */
export default function ClubLocationMap({ lat, lng, name }: ClubLocationMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([lat, lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
    L.marker([lat, lng], { icon: orangePinIcon }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng]);

  return (
    <div
      ref={ref}
      className={MAP_BOX_CLASS}
      role="application"
      aria-label={`Mapa de ${name}`}
    />
  );
}

/** Alto fijo compartido con el placeholder, para que cargar el mapa no mueva el layout. */
export const MAP_BOX_CLASS = "w-full h-[280px] z-0";
