import type { ClubCard } from "./directus-types";

export interface ClubFilterFacets {
  sports: string[];
  surfaces: string[];
  services: string[];
  query: string;
}

// Service-label → club boolean field. Labels match what FiltersPanel renders
// so the UI string is the source of truth and we don't drift on either side.
export const SERVICE_FIELD_MAP: Record<string, keyof ClubCard> = {
  "Iluminación nocturna": "iluminacion",
  "Vestuarios":           "vestuarios",
  "Estacionamiento":      "estacionamiento",
  "Clases disponibles":   "clases",
  "Reserva online":       "reserva_online",
  "Bar / Restaurante":    "bar_restaurante",
};

export const EMPTY_FACETS: ClubFilterFacets = {
  sports: [],
  surfaces: [],
  services: [],
  query: "",
};

/**
 * Filters a list of clubs by the chosen facets.
 *
 * Semantics (locked in by tests in filter.test.ts):
 *   - sports:   OR within facet — match if any junction row's deporte.slug is selected
 *   - surfaces: OR within facet — match if any junction row's superficie is selected
 *   - sports + surfaces (both active): junction-coupled — a single clubes_deportes
 *               row must satisfy both, so "tenis + cristal" only matches clubs
 *               that actually have a tennis court on cristal.
 *   - services: AND within facet — every selected flag must be true on the club
 *   - query:    case-insensitive substring match against name / barrio / ciudad
 * An empty facet array (or empty query) is treated as "no constraint" for that facet.
 */
export function filterClubs(clubs: ClubCard[], facets: ClubFilterFacets): ClubCard[] {
  const q = facets.query.trim().toLowerCase();
  return clubs.filter((c) => {
    const sportsActive = facets.sports.length > 0;
    const surfacesActive = facets.surfaces.length > 0;

    if (sportsActive && surfacesActive) {
      const has = (c.clubes_deportes ?? []).some(
        (cd) =>
          facets.sports.includes(cd.deporte.slug) &&
          cd.superficie != null &&
          facets.surfaces.includes(cd.superficie)
      );
      if (!has) return false;
    } else if (sportsActive) {
      const has = (c.clubes_deportes ?? []).some((cd) =>
        facets.sports.includes(cd.deporte.slug)
      );
      if (!has) return false;
    } else if (surfacesActive) {
      const has = (c.clubes_deportes ?? []).some(
        (cd) => cd.superficie && facets.surfaces.includes(cd.superficie)
      );
      if (!has) return false;
    }

    if (facets.services.length) {
      const allOn = facets.services.every((label) => {
        const field = SERVICE_FIELD_MAP[label];
        return field ? Boolean(c[field]) : true;
      });
      if (!allOn) return false;
    }
    if (q) {
      const haystack = `${c.nombre} ${c.barrio?.nombre ?? ""} ${c.ciudad.nombre}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
