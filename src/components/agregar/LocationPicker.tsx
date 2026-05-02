import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon paths (Vite-friendly)
const orangeIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#E8632A;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
    <div style="width:8px;height:8px;background:white;border-radius:50%;"></div>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  /** "country, province, city, address" — used to geocode on blur */
  geocodeQuery?: string;
  height?: number;
}

export const LocationPicker = ({ lat, lng, onChange, geocodeQuery, height = 300 }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [manualMode, setManualMode] = useState(false);

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const initLat = lat ?? -34.6037;
    const initLng = lng ?? -58.3816;
    const map = L.map(mapRef.current, { zoomControl: true }).setView([initLat, initLng], lat ? 16 : 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    if (lat && lng) {
      const m = L.marker([lat, lng], { icon: orangeIcon, draggable: true }).addTo(map);
      m.on("dragend", () => {
        const p = m.getLatLng();
        onChange(p.lat, p.lng);
      });
      markerRef.current = m;
    }

    map.on("click", (e: L.LeafletMouseEvent) => {
      placePin(e.latlng.lat, e.latlng.lng);
    });

    mapInstance.current = map;
    return () => {
      map.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placePin = (newLat: number, newLng: number) => {
    if (!mapInstance.current) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([newLat, newLng]);
    } else {
      const m = L.marker([newLat, newLng], { icon: orangeIcon, draggable: true }).addTo(mapInstance.current);
      m.on("dragend", () => {
        const p = m.getLatLng();
        onChange(p.lat, p.lng);
      });
      markerRef.current = m;
    }
    mapInstance.current.setView([newLat, newLng], 16);
    onChange(newLat, newLng);
  };

  // Geocode when query changes (debounced via Nominatim)
  useEffect(() => {
    if (!geocodeQuery || geocodeQuery.length < 8) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(geocodeQuery)}`,
          { signal: ctrl.signal, headers: { "Accept-Language": "es" } }
        );
        const data = await res.json();
        if (data?.[0]) {
          placePin(parseFloat(data[0].lat), parseFloat(data[0].lon));
        }
      } catch {
        /* ignore */
      }
    }, 800);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geocodeQuery]);

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden border border-border z-0"
        style={{ height: `${height}px` }}
        aria-label="Mapa para confirmar ubicación. Hacé clic o arrastrá el pin."
        role="application"
      />
      <div className="flex items-center justify-between gap-3 text-[12px] text-gray flex-wrap">
        <span>Arrastrá el pin para ajustar la ubicación exacta.</span>
        <button
          type="button"
          onClick={() => setManualMode((m) => !m)}
          className="text-orange font-semibold hover:underline"
        >
          {manualMode ? "Ocultar coordenadas" : "Ingresar coordenadas manualmente"}
        </button>
      </div>
      {manualMode && (
        <div className="grid grid-cols-2 gap-3 pt-1">
          <label className="block">
            <span className="block text-[11px] uppercase tracking-wider text-gray font-semibold mb-1">Latitud</span>
            <input
              type="number"
              step="0.000001"
              defaultValue={lat ?? ""}
              onBlur={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && lng != null) placePin(v, lng);
              }}
              className="w-full h-10 px-3 border border-border rounded-md text-[14px]"
            />
          </label>
          <label className="block">
            <span className="block text-[11px] uppercase tracking-wider text-gray font-semibold mb-1">Longitud</span>
            <input
              type="number"
              step="0.000001"
              defaultValue={lng ?? ""}
              onBlur={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && lat != null) placePin(lat, v);
              }}
              className="w-full h-10 px-3 border border-border rounded-md text-[14px]"
            />
          </label>
        </div>
      )}
      {lat != null && lng != null && (
        <p className="text-[11px] text-gray">
          📍 {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      )}
    </div>
  );
};
