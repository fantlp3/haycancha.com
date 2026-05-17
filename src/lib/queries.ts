import { directus } from "./directus";
import { readItems as _readItems, aggregate as _aggregate } from "@directus/sdk";
import type {
  Barrio,
  ClubCard,
  ClubFull,
  ClubTipo,
  Pais,
  Articulo,
  ArticuloCard,
  ArticuloFull,
  Autor,
  Categoria,
  Deporte,
  Tag,
} from "./directus-types";
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
export interface SportStats {
  clubes: number;
  ciudades: number;
  premium: number;
  paises: number;
}

/**
 * Per-sport landing-page stats. Three lightweight aggregate queries in parallel
 * instead of pulling the full club list and counting client-side.
 */
export async function fetchSportStats(deporteSlug: string): Promise<SportStats> {
  const filterActivoSport = {
    activo: { _eq: true },
    clubes_deportes: { deporte: { slug: { _eq: deporteSlug } } },
  };

  const [clubesRes, ciudadesRes, premiumRes, paisesRes] = await Promise.all([
    directus.request(
      aggregate("clubes", {
        aggregate: { count: "*" },
        query: { filter: filterActivoSport },
      })
    ),
    directus.request(
      aggregate("clubes", {
        aggregate: { countDistinct: "ciudad" },
        query: { filter: filterActivoSport },
      })
    ),
    directus.request(
      aggregate("clubes", {
        aggregate: { count: "*" },
        query: {
          filter: { ...filterActivoSport, es_premium: { _eq: true } },
        },
      })
    ),
    directus.request(
      aggregate("clubes", {
        aggregate: { countDistinct: "pais" },
        query: { filter: filterActivoSport },
      })
    ),
  ]);

  return {
    clubes: Number((clubesRes[0] as any).count) || 0,
    ciudades: Number((ciudadesRes[0] as any).countDistinct?.ciudad ?? (ciudadesRes[0] as any).count) || 0,
    premium: Number((premiumRes[0] as any).count) || 0,
    paises: Number((paisesRes[0] as any).countDistinct?.pais ?? (paisesRes[0] as any).count) || 0,
  };
}

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

// ============================================
// EDITORIAL — articulos, autores, categorias, tags
// ============================================

/**
 * Filter clause used by every PUBLIC article query to reveal items that
 * are either already published OR scheduled with a `fecha_publicacion` in
 * the past. Lets editorial pre-load `scheduled` rows that "go live"
 * automatically as their date passes, without any cron job.
 *
 * `new Date().toISOString()` is evaluated per call so the bar moves forward
 * over time. The query key in react-query does NOT include this timestamp
 * (it's only the filter), so the cache stays stable across re-renders.
 *
 * Do NOT use in admin/preview tooling — those should see `scheduled`/`draft`.
 */
function publishedOrDueFilter(): Record<string, unknown> {
  return {
    _or: [
      { estado: { _eq: "published" } },
      {
        _and: [
          { estado: { _eq: "scheduled" } },
          { fecha_publicacion: { _lte: new Date().toISOString() } },
        ],
      },
    ],
  };
}

// Field projections — kept here (not exported) since they're query-internal.
//
// We use dot-notation strings (not nested objects) for relation expansion.
// The SDK's `readItems` is cast to `any` at the top of this file, which makes
// the nested-object form unreliable: in practice it can serialize so Directus
// drops the related field entirely, leaving `autor` undefined and crashing
// downstream component access. Dot-strings serialize as `?fields=autor.slug,…`
// every time.
const ARTICULO_CARD_FIELDS = [
  "id",
  "slug",
  "titulo",
  "excerpt",
  "lead",
  "imagen_destacada_url",
  "imagen_destacada_alt",
  "tiempo_lectura_min",
  "fecha_publicacion",
  "estado",
  "deportes",
  "tags",
  "autor.id",
  "autor.slug",
  "autor.nombre",
  "autor.rol",
  "autor.avatar_url",
  "categoria_principal.id",
  "categoria_principal.slug",
  "categoria_principal.nombre",
  "categoria_principal.color_hex",
];

// Detail-page projection — `*` for every articulo top-level field (body,
// SEO, schema_*_jsonld, monetization flags, etc.) plus explicit dot-strings
// for M2O expansion. We can't just do `autor.*` because the SDK-cast-to-any
// has the same nested-object reliability issue when generating URL params.
const ARTICULO_FULL_FIELDS = [
  "*",
  "autor.id",
  "autor.slug",
  "autor.nombre",
  "autor.rol",
  "autor.avatar_url",
  "autor.bio_corta",
  "autor.bio_larga",
  "autor.credenciales",
  "autor.social",
  "autor.expertise",
  "autor.email",
  "categoria_principal.id",
  "categoria_principal.slug",
  "categoria_principal.nombre",
  "categoria_principal.color_hex",
  "categoria_principal.seo_descripcion",
];

export interface FetchArticulosOptions {
  limit?: number;
  offset?: number;
  /** Filter by `categoria_principal.slug`. */
  categoriaSlug?: string;
  /** Filter by `deportes` JSON array containing the deporte with this slug. */
  deporteSlug?: string;
  /** Filter by `tags` JSON array containing the tag with this slug. */
  tagSlug?: string;
}

/**
 * Detail-page payload: `ArticuloFull` with `tags` and `deportes` already
 * hydrated from JSON-of-UUIDs into expanded rows. Pages never see the raw
 * UUID arrays.
 */
export type ArticuloDetail = Omit<ArticuloFull, "tags" | "deportes"> & {
  tags: Tag[];
  deportes: Deporte[];
};

/** Resolves a slug → UUID for a given collection, or null when missing. */
async function resolveSlugToId(
  collection: "deportes" | "tags",
  slug: string
): Promise<string | null> {
  const rows = (await directus.request(
    readItems(collection, {
      fields: ["id"],
      filter: { slug: { _eq: slug } },
      limit: 1,
    })
  )) as Array<{ id: string }>;
  return rows[0]?.id ?? null;
}

/**
 * Lists published articles, newest first. Supports filtering by category
 * (FK slug, native dot-notation) and by deporte/tag (JSON UUID arrays — we
 * resolve the slug to UUID first, then use `_contains` against the JSON
 * column).
 */
export async function fetchArticulos(
  options: FetchArticulosOptions = {}
): Promise<ArticuloCard[]> {
  const { limit = 12, offset = 0, categoriaSlug, deporteSlug, tagSlug } = options;

  // Build filter conjunctively. We resolve slug→UUID for JSON-array facets
  // before composing the filter, since Directus can't dot-walk into JSON.
  const filter: Record<string, unknown> = {
    ...publishedOrDueFilter(),
  };
  if (categoriaSlug) {
    filter.categoria_principal = { slug: { _eq: categoriaSlug } };
  }
  if (deporteSlug) {
    const id = await resolveSlugToId("deportes", deporteSlug);
    if (!id) return [];
    filter.deportes = { _contains: id };
  }
  if (tagSlug) {
    const id = await resolveSlugToId("tags", tagSlug);
    if (!id) return [];
    filter.tags = { _contains: id };
  }

  const result = await directus.request(
    readItems("articulos", {
      fields: ARTICULO_CARD_FIELDS,
      filter,
      sort: ["-fecha_publicacion"],
      limit,
      offset,
    })
  );
  return result as unknown as ArticuloCard[];
}

/**
 * Detail-page fetch. Returns the full article with M2O relations expanded
 * AND the JSON-of-UUID arrays (`tags`, `deportes`) hydrated into full rows.
 * Returns null when the slug doesn't exist or isn't published.
 */
export async function fetchArticuloBySlug(
  slug: string
): Promise<ArticuloDetail | null> {
  const rows = await directus.request(
    readItems("articulos", {
      fields: ARTICULO_FULL_FIELDS,
      filter: {
        slug: { _eq: slug },
        ...publishedOrDueFilter(),
      },
      limit: 1,
    })
  );
  const list = rows as unknown as ArticuloFull[];
  if (list.length === 0) return null;
  const articulo = list[0];

  // Hydrate JSON-of-UUID arrays. Empty/null arrays skip the round-trip.
  const [tagsHydrated, deportesHydrated] = await Promise.all([
    hydrateByIds<Tag>("tags", articulo.tags ?? []),
    hydrateByIds<Deporte>("deportes", articulo.deportes ?? []),
  ]);

  return {
    ...articulo,
    tags: tagsHydrated,
    deportes: deportesHydrated,
  };
}

/** Bulk-fetches rows for a JSON-of-UUIDs array. Preserves insertion order. */
async function hydrateByIds<T extends { id: string }>(
  collection: "tags" | "deportes",
  ids: string[]
): Promise<T[]> {
  if (ids.length === 0) return [];
  const rows = (await directus.request(
    readItems(collection, {
      fields: ["*"],
      filter: { id: { _in: ids } },
      limit: ids.length,
    })
  )) as T[];
  // Restore the original order — `_in` returns in DB order, not request order.
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((r): r is T => Boolean(r));
}

/** Active categories, ordered by `orden` ascending. */
export async function fetchCategorias(): Promise<Categoria[]> {
  const result = await directus.request(
    readItems("categorias", {
      fields: ["*"],
      filter: { activo: { _eq: true } },
      sort: ["orden"],
      limit: -1,
    })
  );
  return result as unknown as Categoria[];
}

/**
 * Related articles for the detail page. Strategy:
 *   1. Read `articulos_relacionados` (JSON UUIDs) from the source article.
 *   2. If it has entries, fetch those (preserving editorial-chosen order).
 *   3. Otherwise, fall back to other published articles in the same category.
 * Always excludes the source article and caps at `limit`.
 */
export async function fetchArticulosRelacionados(
  articuloId: string,
  categoriaId: string,
  limit = 3
): Promise<ArticuloCard[]> {
  const sourceRow = (await directus.request(
    readItems("articulos", {
      fields: ["articulos_relacionados"],
      filter: { id: { _eq: articuloId } },
      limit: 1,
    })
  )) as Array<Pick<Articulo, "articulos_relacionados">>;

  const editorialPicks = sourceRow[0]?.articulos_relacionados ?? null;

  if (editorialPicks && editorialPicks.length > 0) {
    const result = await directus.request(
      readItems("articulos", {
        fields: ARTICULO_CARD_FIELDS,
        filter: {
          id: { _in: editorialPicks },
          ...publishedOrDueFilter(),
        },
        limit,
      })
    );
    // Preserve editorial order (the manual choice matters).
    const list = result as unknown as ArticuloCard[];
    const byId = new Map(list.map((a) => [a.id, a]));
    return editorialPicks
      .map((id) => byId.get(id))
      .filter((a): a is ArticuloCard => Boolean(a))
      .slice(0, limit);
  }

  // Fallback: same category, newest first, excluding the source.
  const result = await directus.request(
    readItems("articulos", {
      fields: ARTICULO_CARD_FIELDS,
      filter: {
        categoria_principal: { _eq: categoriaId },
        id: { _neq: articuloId },
        ...publishedOrDueFilter(),
      },
      sort: ["-fecha_publicacion"],
      limit,
    })
  );
  return result as unknown as ArticuloCard[];
}

// `Autor` lookup helpers can be added later when there's an author page;
// not exporting them now to keep the surface minimal.
