import { directus } from "./directus";
import { readItems as _readItems, aggregate as _aggregate } from "@directus/sdk";
import type { Barrio, ClubCard, ClubFull, ClubTipo, Pais } from "./directus-types";
import { deriveHomeStats, type HomeStats } from "./stats";

// The SDK's generated field-types are too strict for nested file/relation expansion
// (e.g. it doesn't know `foto_portada` accepts subfields). We cast the options arg
// to `any` here — return values are still typed via `as ClubCard[]` etc.
const readItems: any = _readItems;
const aggregate: any = _aggregate;

// ============================================
// LIST: clubes by barrio
// ============================================
export async function fetchClubesByBarrio(barrioSlug: string): Promise<ClubCard[]> {
  const result = await directus.request(
    readItems("clubes", {
      fields: [
        "id", "nombre", "slug", "tipo", "es_premium", "ubicacion",
        "telefono", "website",
        "iluminacion", "vestuarios", "estacionamiento",
        "bar_restaurante", "clases", "alquiler_raquetas",
        "accesibilidad", "reserva_online",
        { foto_portada: ["id", "filename_download"] },
        { pais: ["nombre", "slug"] },
        { barrio: ["nombre", "slug"] },
        { ciudad: ["nombre", "slug"] },
        { clubes_deportes: ["es_primario", "superficie", "cantidad_canchas", { deporte: ["slug", "nombre"] }] },
      ],
      filter: {
        barrio: { slug: { _eq: barrioSlug } },
        activo: { _eq: true },
      },
      sort: ["-es_premium", "nombre"],
      limit: 100,
    })
  );
  return result as unknown as ClubCard[];
}

// ============================================
// LIST: clubes by ciudad
// ============================================
export async function fetchClubesByCiudad(ciudadSlug: string): Promise<ClubCard[]> {
  const result = await directus.request(
    readItems("clubes", {
      fields: [
        "id", "nombre", "slug", "tipo", "es_premium", "ubicacion",
        "telefono", "website",
        "iluminacion", "vestuarios", "estacionamiento",
        "bar_restaurante", "clases", "alquiler_raquetas",
        "accesibilidad", "reserva_online",
        { foto_portada: ["id", "filename_download"] },
        { pais: ["nombre", "slug"] },
        { barrio: ["nombre", "slug"] },
        { ciudad: ["nombre", "slug"] },
        { clubes_deportes: ["es_primario", "superficie", "cantidad_canchas", { deporte: ["slug", "nombre"] }] },
      ],
      filter: {
        ciudad: { slug: { _eq: ciudadSlug } },
        activo: { _eq: true },
      },
      sort: ["-es_premium", "nombre"],
      limit: 200,
    })
  );
  return result as unknown as ClubCard[];
}

// ============================================
// LIST: clubes by pais
// ============================================
export async function fetchClubesByPais(paisSlug: string): Promise<ClubCard[]> {
  const result = await directus.request(
    readItems("clubes", {
      fields: [
        "id", "nombre", "slug", "tipo", "es_premium", "ubicacion",
        "telefono", "website",
        "iluminacion", "vestuarios", "estacionamiento",
        "bar_restaurante", "clases", "alquiler_raquetas",
        "accesibilidad", "reserva_online",
        { foto_portada: ["id", "filename_download"] },
        { pais: ["nombre", "slug"] },
        { barrio: ["nombre", "slug"] },
        { ciudad: ["nombre", "slug"] },
        { clubes_deportes: ["es_primario", "superficie", "cantidad_canchas", { deporte: ["slug", "nombre"] }] },
      ],
      filter: {
        pais: { slug: { _eq: paisSlug } },
        activo: { _eq: true },
      },
      sort: ["-es_premium", "nombre"],
      limit: 200,
    })
  );
  return result as unknown as ClubCard[];
}

// ============================================
// LIST: all active clubes (top-level /canchas)
// ============================================
export async function fetchAllClubes(limit = -1): Promise<ClubCard[]> {
  const result = await directus.request(
    readItems("clubes", {
      fields: [
        "id", "nombre", "slug", "tipo", "es_premium", "ubicacion",
        "telefono", "website",
        "iluminacion", "vestuarios", "estacionamiento",
        "bar_restaurante", "clases", "alquiler_raquetas",
        "accesibilidad", "reserva_online",
        { foto_portada: ["id", "filename_download"] },
        { pais: ["nombre", "slug"] },
        { barrio: ["nombre", "slug"] },
        { ciudad: ["nombre", "slug"] },
        { clubes_deportes: ["es_primario", "superficie", "cantidad_canchas", { deporte: ["slug", "nombre"] }] },
      ],
      filter: { activo: { _eq: true } },
      sort: ["-es_premium", "nombre"],
      limit,
    })
  );
  return result as unknown as ClubCard[];
}

// ============================================
// DETAIL: barrio by slug (scoped to ciudad)
// ============================================
export async function fetchBarrioBySlug(
  slug: string,
  ciudadSlug: string
): Promise<Barrio | null> {
  const res = await directus.request(
    readItems("barrios", {
      filter: {
        slug: { _eq: slug },
        ciudad: { slug: { _eq: ciudadSlug } },
      },
      fields: ["id", "nombre", "slug"],
      limit: 1,
    })
  );
  return ((res?.[0] as unknown) as Barrio) ?? null;
}

// ============================================
// DETAIL: club by slug
// ============================================
export async function fetchClubBySlug(slug: string): Promise<ClubFull | null> {
  const result = await directus.request(
    readItems("clubes", {
      fields: [
        "*",
        { pais: ["*"] },
        { ciudad: ["*"] },
        { barrio: ["*", { ciudad: ["*", { pais: ["*"] }] }] },
        { foto_portada: ["*"] },
        {
          clubes_deportes: [
            "es_primario",
            "cantidad_canchas",
            "superficie",
            "indoor",
            "iluminacion",
            { deporte: ["slug", "nombre"] },
          ],
        },
      ],
      filter: {
        slug: { _eq: slug },
        activo: { _eq: true },
      },
      limit: 1,
    })
  );
  return ((result[0] as unknown) as ClubFull) ?? null;
}

// ============================================
// FILTER: clubes by deporte (junction-first)
// ============================================
export async function fetchClubesByDeporte(deporteSlug: string): Promise<ClubCard[]> {
  const rows = await directus.request(
    readItems("clubes_deportes", {
      fields: [
        {
          club: [
            "id", "nombre", "slug", "tipo", "es_premium", "ubicacion",
            "telefono", "website",
        "iluminacion", "vestuarios", "estacionamiento",
            "bar_restaurante", "clases", "alquiler_raquetas",
            "accesibilidad", "reserva_online",
            { foto_portada: ["id", "filename_download"] },
            { pais: ["nombre", "slug"] },
            { barrio: ["nombre", "slug"] },
            { ciudad: ["nombre", "slug"] },
            { clubes_deportes: ["es_primario", "superficie", "cantidad_canchas", { deporte: ["slug", "nombre"] }] },
          ],
        },
      ],
      filter: {
        deporte: { slug: { _eq: deporteSlug } },
        club: { activo: { _eq: true } },
      },
      limit: 200,
    })
  );

  return (rows as any[])
    .filter((row) => row.club)
    .map((row) => row.club as ClubCard);
}

export async function fetchClubesByDeportes(deporteSlugs: string[]): Promise<ClubCard[]> {
  if (deporteSlugs.length === 0) return [];

  const rows = await directus.request(
    readItems("clubes_deportes", {
      fields: [
        {
          club: [
            "id", "nombre", "slug", "tipo", "es_premium", "ubicacion",
            "telefono", "website",
        "iluminacion", "vestuarios", "estacionamiento",
            "bar_restaurante", "clases", "alquiler_raquetas",
            "accesibilidad", "reserva_online",
            { foto_portada: ["id", "filename_download"] },
            { pais: ["nombre", "slug"] },
            { barrio: ["nombre", "slug"] },
            { ciudad: ["nombre", "slug"] },
            { clubes_deportes: ["es_primario", "superficie", "cantidad_canchas", { deporte: ["slug", "nombre"] }] },
          ],
        },
      ],
      filter: {
        deporte: { slug: { _in: deporteSlugs } },
        club: { activo: { _eq: true } },
      },
      limit: 500,
    })
  );

  const seen = new Set<string>();
  const unique: ClubCard[] = [];
  for (const row of rows as any[]) {
    if (row.club && !seen.has(row.club.id)) {
      seen.add(row.club.id);
      unique.push(row.club);
    }
  }
  return unique;
}

// ============================================
// FEATURED: premium clubes
// ============================================
export async function fetchClubesPremium(limit = 6): Promise<ClubCard[]> {
  const result = await directus.request(
    readItems("clubes", {
      fields: [
        "id", "nombre", "slug", "tipo", "es_premium", "ubicacion",
        "telefono", "website",
        "iluminacion", "vestuarios", "estacionamiento",
        "bar_restaurante", "clases", "alquiler_raquetas",
        "accesibilidad", "reserva_online",
        { foto_portada: ["id", "filename_download"] },
        { pais: ["nombre", "slug"] },
        { barrio: ["nombre", "slug"] },
        { ciudad: ["nombre", "slug"] },
        { clubes_deportes: ["es_primario", "superficie", "cantidad_canchas", { deporte: ["slug", "nombre"] }] },
      ],
      filter: {
        es_premium: { _eq: true },
        activo: { _eq: true },
      },
      sort: ["nombre"],
      limit,
    })
  );
  return result as unknown as ClubCard[];
}

// ============================================
// SEARCH by name
// ============================================
export async function searchClubes(query: string, limit = 20): Promise<ClubCard[]> {
  if (query.trim().length < 2) return [];

  const results = await directus.request(
    readItems("clubes", {
      fields: [
        "id", "nombre", "slug", "tipo", "es_premium", "ubicacion",
        "telefono", "website",
        "iluminacion", "vestuarios", "estacionamiento",
        "bar_restaurante", "clases", "alquiler_raquetas",
        "accesibilidad", "reserva_online",
        { foto_portada: ["id", "filename_download"] },
        { pais: ["nombre", "slug"] },
        { barrio: ["nombre", "slug"] },
        { ciudad: ["nombre", "slug"] },
        { clubes_deportes: ["es_primario", "superficie", "cantidad_canchas", { deporte: ["slug", "nombre"] }] },
      ],
      filter: {
        nombre: { _icontains: query },
        activo: { _eq: true },
      },
      limit,
    })
  );

  return (results as unknown as ClubCard[]).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );
}

// ============================================
// STATS
// ============================================
export interface ClubStats {
  total: number;
  porTipo: Record<ClubTipo, number>;
}

export async function fetchClubStats(): Promise<ClubStats> {
  const totalResult = await directus.request(
    aggregate("clubes", {
      aggregate: { count: "*" },
      query: { filter: { activo: { _eq: true } } },
    })
  );
  const total = Number((totalResult[0] as any).count) || 0;

  const byTipoResult = await directus.request(
    aggregate("clubes", {
      aggregate: { count: "*" },
      groupBy: ["tipo"],
      query: { filter: { activo: { _eq: true } } },
    })
  );

  const porTipo: Record<string, number> = {};
  for (const row of byTipoResult as any[]) {
    porTipo[row.tipo] = Number(row.count);
  }

  return { total, porTipo: porTipo as Record<ClubTipo, number> };
}

export interface PaisStats {
  pais: Pick<Pais, "nombre" | "slug" | "bandera_emoji">;
  count: number;
}

export async function fetchStatsByPais(): Promise<PaisStats[]> {
  const result = await directus.request(
    aggregate("clubes", {
      aggregate: { count: "*" },
      groupBy: ["pais"],
      query: { filter: { activo: { _eq: true } } },
    })
  );

  const paisIds = (result as any[]).map((r) => r.pais).filter(Boolean);
  if (paisIds.length === 0) return [];

  const paises = await directus.request(
    readItems("paises", {
      fields: ["id", "nombre", "slug", "bandera_emoji"],
      filter: { id: { _in: paisIds } },
    })
  );

  const paisMap = new Map((paises as any[]).map((p) => [p.id, p]));

  return (result as any[])
    .map((row) => ({
      pais: paisMap.get(row.pais) as PaisStats["pais"] | undefined,
      count: Number(row.count),
    }))
    .filter((item): item is PaisStats => Boolean(item.pais))
    .sort((a, b) => b.count - a.count);
}

// ============================================
// GEO: bounding box
// ============================================
export interface BBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export async function fetchClubesInBBox(bbox: BBox): Promise<ClubCard[]> {
  const result = await directus.request(
    readItems("clubes", {
      fields: [
        "id", "nombre", "slug", "tipo", "es_premium", "ubicacion",
        "telefono", "website",
        "iluminacion", "vestuarios", "estacionamiento",
        "bar_restaurante", "clases", "alquiler_raquetas",
        "accesibilidad", "reserva_online",
        { foto_portada: ["id", "filename_download"] },
        { pais: ["nombre", "slug"] },
        { barrio: ["nombre", "slug"] },
        { ciudad: ["nombre", "slug"] },
        { clubes_deportes: ["es_primario", "superficie", "cantidad_canchas", { deporte: ["slug", "nombre"] }] },
      ],
      filter: {
        ubicacion: {
          _intersects_bbox: {
            type: "Polygon",
            coordinates: [[
              [bbox.minLng, bbox.minLat],
              [bbox.maxLng, bbox.minLat],
              [bbox.maxLng, bbox.maxLat],
              [bbox.minLng, bbox.maxLat],
              [bbox.minLng, bbox.minLat],
            ]],
          },
        },
        activo: { _eq: true },
      },
      limit: 200,
    })
  );
  return result as unknown as ClubCard[];
}

// ============================================
// HOME STATS: active clubs, courts, cities + per-sport / per-country counts
// ============================================
export async function fetchHomeStats(): Promise<HomeStats> {
  // Single fetch backs every count on the home page (StatsStrip,
  // SportSection, ZoneSection). Payload is bounded by active-club count
  // (~1.5k cap in practice). If it ever becomes a concern, switch to
  // server-side `aggregate` calls grouped by `pais` and a junction
  // aggregate over `clubes_deportes` for sport buckets.
  const result = await directus.request(
    readItems("clubes", {
      fields: [
        "id",
        {
          ciudad: [
            "id",
            { pais: ["id", "slug", "nombre", "bandera_emoji"] },
          ],
        },
        {
          clubes_deportes: [
            "cantidad_canchas",
            { deporte: ["slug"] },
          ],
        },
      ],
      filter: { activo: { _eq: true } },
      limit: -1,
    })
  );
  return deriveHomeStats(result as any[]);
}

/**
 * Returns the primary sport slug for a club based on its clubes_deportes
 * junction. Picks the entry where es_primario === true, falling back to
 * the first entry when no row carries the flag.
 */
export function getPrimarySportSlug(
  clubDeportes: Array<{ es_primario?: boolean | null; deporte: { slug: string } }>
): "tenis" | "padel" | "pickleball" | null {
  if (!clubDeportes || clubDeportes.length === 0) return null;
  const primary = clubDeportes.find((cd) => cd.es_primario === true);
  const slug = (primary ?? clubDeportes[0]).deporte?.slug;
  if (slug === "tenis" || slug === "padel" || slug === "pickleball") return slug;
  return null;
}
