import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useClubesInBBox } from "@/hooks/useClubes";
import { buildClubHref } from "@/lib/club-display";
import type { BBox } from "@/lib/queries";

const orangeIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#E8632A;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
    <div style="width:8px;height:8px;background:white;border-radius:50%;"></div>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

// Initial bboxes — fetchClubesInBBox uses _intersects_bbox on PostGIS Point.
// Big enough to cover all active clubs at the requested level; map fitBounds
// adjusts to the actual data once it loads.
const LATAM_BBOX: BBox = { minLat: -56, maxLat: 33, minLng: -120, maxLng: -34 };
const COUNTRY_BBOX: Record<string, BBox> = {
  argentina: { minLat: -56, maxLat: -22, minLng: -74, maxLng: -53 },
  // TODO: extend for the other LATAM countries as they get clubs, or read
  // bbox/center from Directus `paises` (latitud_centro/longitud_centro).
};
const INITIAL_VIEW: Record<string, { lat: number; lng: number; zoom: number }> = {
  __default__: { lat: -15, lng: -60, zoom: 3 }, // LATAM
  argentina: { lat: -38.4, lng: -63.6, zoom: 4 },
};

type ClubMarkerData = {
  id: string;
  nombre: string;
  slug: string;
  pais: { nombre: string; slug: string };
  ciudad: { nombre: string; slug: string };
  barrio?: { nombre: string; slug: string } | null;
  ubicacion?: { type: "Point"; coordinates: [number, number] } | null;
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

export const MapView = () => {
  const { pais } = useParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const bbox = (pais && COUNTRY_BBOX[pais]) ?? LATAM_BBOX;
  const initial = (pais && INITIAL_VIEW[pais]) ?? INITIAL_VIEW.__default__;
  const { data: clubs } = useClubesInBBox(bbox);

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { zoomControl: true }).setView(
      [initial.lat, initial.lng],
      initial.zoom
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
    mapInstance.current = map;
    return () => {
      map.remove();
      mapInstance.current = null;
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render markers when clubs change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !clubs) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const latlngs: L.LatLngExpression[] = [];
    for (const c of clubs as unknown as ClubMarkerData[]) {
      const coords = c.ubicacion?.coordinates;
      if (!coords) continue;
      const [lng, lat] = coords; // GeoJSON order
      const location = c.barrio?.nombre
        ? `${c.barrio.nombre} · ${c.ciudad.nombre}`
        : c.ciudad.nombre;
      const href = buildClubHref(c);
      const html = `
        <div style="min-width:200px">
          <strong style="display:block;font-size:14px;color:#1a1a1a">${escapeHtml(c.nombre)}</strong>
          <div style="font-size:12px;color:#6b6b6b;margin-top:2px">${escapeHtml(location)}</div>
          <a href="${href}"
             style="display:inline-block;margin-top:8px;font-size:12px;font-weight:600;color:#E8632A;text-decoration:none">
             Ver ficha →
          </a>
        </div>`;
      const marker = L.marker([lat, lng], { icon: orangeIcon }).addTo(map).bindPopup(html);
      markersRef.current.push(marker);
      latlngs.push([lat, lng]);
    }

    if (latlngs.length > 0) {
      map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 13 });
    }
  }, [clubs]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full z-0"
      role="application"
      aria-label="Mapa de clubes"
    />
  );
};
