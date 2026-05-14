/**
 * Builds a Google Maps directions URL, preferring high-precision sources
 * (Place ID > business-name + address > raw coords > name only).
 *
 * Why this matters: clubs imported from Google Places sometimes have
 * coords that point to the middle of the block rather than the building
 * entrance. When we have a Place ID, Google routes to the official pin,
 * which is reliably the front door of the business.
 */
export interface DirectionsClub {
  nombre: string;
  direccion?: string | null;
  ciudad?: { nombre: string } | null;
  google_place_id?: string | null;
  /** PostGIS GeoJSON Point — coordinates are [lng, lat]. */
  ubicacion?: { coordinates: [number, number] } | null;
}

const BASE = "https://www.google.com/maps/dir/?api=1";

export function getDirectionsUrl(club: DirectionsClub): string {
  // Tier 1 — Place ID (routes to the verified business pin)
  if (club.google_place_id) {
    const dest = encodeURIComponent(club.nombre);
    return `${BASE}&destination=${dest}&destination_place_id=${club.google_place_id}`;
  }

  // Tier 2 — business name + address (Maps geocodes the named POI)
  if (club.direccion) {
    const ciudadStr = club.ciudad?.nombre ? `, ${club.ciudad.nombre}` : "";
    const dest = encodeURIComponent(`${club.nombre}, ${club.direccion}${ciudadStr}`);
    return `${BASE}&destination=${dest}`;
  }

  // Tier 3 — raw coords (may land mid-block on imported Places data)
  if (club.ubicacion?.coordinates) {
    const [lng, lat] = club.ubicacion.coordinates;
    return `${BASE}&destination=${lat},${lng}`;
  }

  // Tier 4 — name-only fallback
  return `${BASE}&destination=${encodeURIComponent(club.nombre)}`;
}

const SEARCH_BASE = "https://www.google.com/maps/search/?api=1";

/**
 * Builds a Google Maps "search" URL (drops the user on the place card, doesn't
 * start navigation). Same precision cascade as getDirectionsUrl.
 */
export function getMapsSearchUrl(club: DirectionsClub): string {
  if (club.google_place_id) {
    const q = encodeURIComponent(club.nombre);
    return `${SEARCH_BASE}&query=${q}&query_place_id=${club.google_place_id}`;
  }
  if (club.direccion) {
    const ciudadStr = club.ciudad?.nombre ? `, ${club.ciudad.nombre}` : "";
    const q = encodeURIComponent(`${club.nombre}, ${club.direccion}${ciudadStr}`);
    return `${SEARCH_BASE}&query=${q}`;
  }
  if (club.ubicacion?.coordinates) {
    const [lng, lat] = club.ubicacion.coordinates;
    return `${SEARCH_BASE}&query=${lat},${lng}`;
  }
  return `${SEARCH_BASE}&query=${encodeURIComponent(club.nombre)}`;
}

/**
 * Builds a Waze deep link. Waze has no Place ID equivalent, so the cascade
 * is one tier shorter than the Maps variants.
 */
export function getWazeUrl(club: DirectionsClub): string {
  if (club.direccion) {
    const ciudadStr = club.ciudad?.nombre ? `, ${club.ciudad.nombre}` : "";
    const q = encodeURIComponent(`${club.nombre}, ${club.direccion}${ciudadStr}`);
    return `https://www.waze.com/ul?q=${q}&navigate=yes`;
  }
  if (club.ubicacion?.coordinates) {
    const [lng, lat] = club.ubicacion.coordinates;
    return `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  }
  return `https://www.waze.com/ul?q=${encodeURIComponent(club.nombre)}&navigate=yes`;
}
