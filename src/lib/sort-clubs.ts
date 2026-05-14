import { haversineKm } from "./geo";
import type { ClubCard } from "./directus-types";

export type SortKey = "relevancia" | "cercano" | "nombre" | "canchas";

export const SORT_LABELS: Record<SortKey, string> = {
  relevancia: "Relevancia",
  cercano: "Más cercano",
  nombre: "Nombre A-Z",
  canchas: "Más canchas",
};

export const isSortKey = (v: string | null): v is SortKey =>
  v === "relevancia" || v === "cercano" || v === "nombre" || v === "canchas";

/** Completeness score 0-4: photo 2pts, website 1pt, phone 1pt. */
const completenessScore = (c: ClubCard): number => {
  let s = 0;
  if (c.foto_portada) s += 2;
  if (c.website) s += 1;
  if (c.telefono) s += 1;
  return s;
};

const totalCanchas = (c: ClubCard): number | null => {
  if (!c.clubes_deportes || c.clubes_deportes.length === 0) return null;
  let any = false;
  let sum = 0;
  for (const cd of c.clubes_deportes) {
    if (cd.cantidad_canchas != null) {
      sum += cd.cantidad_canchas;
      any = true;
    }
  }
  return any ? sum : null;
};

const nameCmp = (a: ClubCard, b: ClubCard) =>
  a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });

/**
 * Sorts a club list. Pure — never mutates `clubs`.
 *
 * - `relevancia`: premium → completitud → deportes count → nombre
 * - `cercano`: requires `userCoords`; clubs without `ubicacion` fall to the end
 * - `nombre`: alphabetical (Spanish locale, accent-insensitive)
 * - `canchas`: sum of `clubes_deportes[].cantidad_canchas` desc, nulls last
 */
export function sortClubs(
  clubs: ClubCard[],
  sortKey: SortKey,
  userCoords?: { lat: number; lng: number } | null
): ClubCard[] {
  const arr = clubs.slice();

  switch (sortKey) {
    case "relevancia":
      return arr.sort((a, b) => {
        const ap = a.es_premium ? 1 : 0;
        const bp = b.es_premium ? 1 : 0;
        if (ap !== bp) return bp - ap;
        const sa = completenessScore(a);
        const sb = completenessScore(b);
        if (sa !== sb) return sb - sa;
        const da = a.clubes_deportes?.length ?? 0;
        const db = b.clubes_deportes?.length ?? 0;
        if (da !== db) return db - da;
        return nameCmp(a, b);
      });

    case "cercano": {
      if (!userCoords) return arr;
      const distanceOf = (c: ClubCard): number | null => {
        if (!c.ubicacion?.coordinates) return null;
        const [lng, lat] = c.ubicacion.coordinates;
        return haversineKm(userCoords, { lat, lng });
      };
      return arr.sort((a, b) => {
        const da = distanceOf(a);
        const db = distanceOf(b);
        if (da == null && db == null) return nameCmp(a, b);
        if (da == null) return 1;
        if (db == null) return -1;
        if (da !== db) return da - db;
        return nameCmp(a, b);
      });
    }

    case "nombre":
      return arr.sort(nameCmp);

    case "canchas":
      return arr.sort((a, b) => {
        const ca = totalCanchas(a);
        const cb = totalCanchas(b);
        if (ca == null && cb == null) return nameCmp(a, b);
        if (ca == null) return 1;
        if (cb == null) return -1;
        if (ca !== cb) return cb - ca;
        return nameCmp(a, b);
      });
  }
}

/** Distance from user to club in km, or null if either side is missing. */
export function distanceFromUser(
  club: Pick<ClubCard, "ubicacion">,
  userCoords: { lat: number; lng: number } | null
): number | null {
  if (!userCoords || !club.ubicacion?.coordinates) return null;
  const [lng, lat] = club.ubicacion.coordinates;
  return haversineKm(userCoords, { lat, lng });
}
