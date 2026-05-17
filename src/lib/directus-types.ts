// ============================================
// Base entity types — match Directus collections
// ============================================

export interface Pais {
  id: string;
  nombre: string;
  slug: string;
  codigo_iso: string;
  bandera_emoji: string;
  latitud_centro: number;
  longitud_centro: number;
  descripcion_seo: string | null;
  meta_title: string | null;
  meta_description: string | null;
  activo: boolean;
}

export interface Deporte {
  id: string;
  nombre: string;
  slug: string;
  nombres_alternativos: string[];
  color_hex: string;
  color_badge_bg: string;
  color_badge_text: string;
  color_badge_border: string;
  icono: string | null;
  descripcion_corta: string | null;
  descripcion_seo: string | null;
  meta_title: string | null;
  meta_description: string | null;
  activo: boolean;
}

export interface Ciudad {
  id: string;
  nombre: string;
  slug: string;
  pais: string | Pais;
  provincia_estado: string | null;
  latitud: number;
  longitud: number;
  zoom_default: number;
  descripcion_seo: string | null;
  meta_title: string | null;
  meta_description: string | null;
  es_destacada: boolean;
  activo: boolean;
}

export interface Barrio {
  id: string;
  nombre: string;
  slug: string;
  ciudad: string | Ciudad;
  codigo_postal: string | null;
  latitud_centro: number | null;
  longitud_centro: number | null;
  zoom_default: number;
  descripcion_seo: string | null;
  meta_title: string | null;
  meta_description: string | null;
  es_destacado: boolean;
  activo: boolean;
}

export type ClubTipo = "club" | "cancha_publica" | "complejo" | "hotel" | "academia";

export type Moneda =
  | "ARS" | "BOB" | "CLP" | "COP" | "CRC" | "CUP" | "USD" | "GTQ"
  | "HNL" | "MXN" | "NIO" | "PYG" | "PEN" | "DOP" | "UYU" | "VES";

export interface DirectusFile {
  id: string;
  filename_disk: string;
  filename_download: string;
  type: string;
  filesize: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  title: string | null;
  description: string | null;
  tags: string[] | null;
}

export interface Club {
  id: string;
  nombre: string;
  slug: string;
  tipo: ClubTipo;

  pais: string | Pais;
  ciudad: string | Ciudad;
  barrio: string | Barrio | null;

  direccion: string;
  codigo_postal: string | null;
  ubicacion: {
    type: "Point";
    coordinates: [number, number];
  };
  /** Google Place ID for high-precision directions (preferred over coords). */
  google_place_id: string | null;

  telefono: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  whatsapp: string | null;

  horario_apertura: string | null;
  horario_cierre: string | null;
  horario_texto: string | null;

  iluminacion: boolean;
  vestuarios: boolean;
  estacionamiento: boolean;
  bar_restaurante: boolean;
  clases: boolean;
  alquiler_raquetas: boolean;
  accesibilidad: boolean;

  foto_portada: string | DirectusFile | null;

  descripcion: string | null;
  meta_title: string | null;
  meta_description: string | null;

  es_premium: boolean;
  reserva_online: boolean;
  url_reserva: string | null;
  precio_por_hora: number | null;
  moneda: Moneda | null;

  activo: boolean;
}

export type Superficie =
  | "polvo_de_ladrillo" | "cemento" | "cesped_sintetico" | "cesped_natural"
  | "pista_dura" | "cristal" | "hormigon_poroso" | "sintetico_indoor"
  | "parquet" | "otro";

export interface ClubDeporte {
  id: string;
  club: string | Club;
  deporte: string | Deporte;
  cantidad_canchas: number | null;
  superficie: Superficie | null;
  indoor: boolean;
  iluminacion: boolean;
  notas: string | null;
}

export interface HayCanchaSchema {
  paises: Pais[];
  deportes: Deporte[];
  ciudades: Ciudad[];
  barrios: Barrio[];
  clubes: Club[];
  clubes_deportes: ClubDeporte[];
  clubes_pending: ClubPendingSubmission[];
  // Editorial collections (paquete editorial, schema en español)
  articulos: Articulo[];
  autores: Autor[];
  categorias: Categoria[];
  tags: Tag[];
  slots_monetizacion: SlotMonetizacion[];
}

// ============================================
// Submission types — Agregá tu cancha
// ============================================

export type RelacionConClub = "dueño" | "empleado" | "socio" | "usuario_general";

export interface ClubPendingSubmission {
  // Identity
  nombre: string;
  tipo: ClubTipo;
  direccion: string;

  // Location (text, not normalized — admin will resolve to FKs on approval)
  pais_texto: string;
  ciudad_texto: string;
  barrio_texto?: string;
  latitud?: number;
  longitud?: number;

  // Club contact
  telefono?: string;
  email_club?: string;
  website?: string;

  // Submitter info
  nombre_remitente: string;
  email_remitente: string;
  relacion_con_club: RelacionConClub;
  deportes_indicados?: string[];
  cantidad_canchas?: number;
  notas_remitente?: string;
}

export type ClubFull = Omit<Club, "pais" | "ciudad" | "barrio" | "foto_portada"> & {
  pais: Pais;
  ciudad: Ciudad;
  barrio: (Barrio & { ciudad: Ciudad & { pais: Pais } }) | null;
  foto_portada: DirectusFile | null;
  clubes_deportes: Array<{
    es_primario: boolean | null;
    cantidad_canchas: number | null;
    superficie: Superficie | null;
    indoor: boolean | null;
    iluminacion: boolean | null;
    deporte: { slug: string; nombre: string };
  }>;
};

export type ClubCard = Pick<
  Club,
  | "id" | "nombre" | "slug" | "tipo" | "es_premium"
  | "iluminacion" | "vestuarios" | "estacionamiento"
  | "bar_restaurante" | "clases" | "alquiler_raquetas"
  | "accesibilidad" | "reserva_online"
> & {
  foto_portada: Pick<DirectusFile, "id" | "filename_download"> | null;
  pais: Pick<Pais, "nombre" | "slug">;
  barrio: Pick<Barrio, "nombre" | "slug"> | null;
  ciudad: Pick<Ciudad, "nombre" | "slug">;
  /** Used by sort scoring ("completitud") and Más cercano. */
  telefono?: string | null;
  website?: string | null;
  clubes_deportes?: Array<{
    es_primario?: boolean;
    superficie?: Superficie | null;
    cantidad_canchas?: number | null;
    deporte: { slug: string; nombre?: string };
  }>;
  ubicacion?: { type: "Point"; coordinates: [number, number] } | null;
};

export function isExpanded<T>(field: string | T | null): field is T {
  return field !== null && typeof field !== "string";
}

// ============================================
// Editorial collections — blog
//
// Schema source of truth: editorial/setup-directus-collections.js
// Patterns mirror Club/Pais/Ciudad above: FK fields are `string | T` so the
// same shape covers both raw rows (UUIDs) and rows fetched with `.fields`
// expansion. Use `isExpanded()` to narrow.
//
// Caveat — JSON-of-UUIDs vs. M2M:
//   `articulos.deportes`, `articulos.tags`, `articulos.categorias_secundarias`
//   and `articulos.articulos_relacionados` are typed as JSON columns
//   (interface "tags" in Directus), not M2M relations with junction tables.
//   They store arrays of UUID strings and Directus does NOT expand them via
//   `.fields=tags.*` dot-notation. To render their related rows you have to
//   fetch the target collection by id list in a separate query.
// ============================================

export type EditorialEstado = "draft" | "scheduled" | "published" | "archived";

export type SearchIntent =
  | "informational"
  | "navigational"
  | "transactional"
  | "commercial";

export type SlotType =
  | "adsense"
  | "affiliate"
  | "ttp_cta"
  | "premium_listing"
  | "newsletter";

export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  /** Self-reference for sub-categories. UUID of another Categoria. */
  parent_category: string | Categoria | null;
  seo_titulo: string | null;
  seo_descripcion: string | null;
  color_hex: string | null;
  orden: number;
  activo: boolean;
}

export interface Autor {
  id: string;
  slug: string;
  nombre: string;
  rol: string | null;
  bio_corta: string | null;
  bio_larga: string | null;
  avatar_url: string | null;
  avatar_prompt: string | null;
  /** JSON array of expertise tags (free strings, not FK). */
  expertise: string[] | null;
  credenciales: string | null;
  /** JSON object with social handles, e.g. { instagram, twitter, linkedin }. */
  social: Record<string, string> | null;
  email: string | null;
  /** Raw Schema.org Person JSON-LD object. */
  schema_jsonld: Record<string, unknown> | null;
  activo: boolean;
}

export interface Tag {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export interface SlotMonetizacion {
  id: string;
  slot_code: string;
  slot_type: SlotType;
  posicion_default: string | null;
  html_template: string | null;
  activo: boolean;
}

/** ToC entry shape used in articulos.table_of_contents JSON. The `anchor`
 *  matches an `id="..."` attribute already present in `contenido_html` headings. */
export interface ArticuloTocEntry {
  anchor: string;
  text: string;
  level: number;
}

/** Optional FAQ entry shape used in articulos.faq_blocks JSON. */
export interface ArticuloFaqEntry {
  question: string;
  answer: string;
}

export interface Articulo {
  id: string;

  // ── Estado ──
  estado: EditorialEstado;

  // ── Identidad ──
  titulo: string;
  slug: string;
  url_canonical: string | null;

  // ── Contenido ──
  excerpt: string;
  lead: string | null;
  contenido_html: string;
  contenido_markdown: string | null;
  palabras: number | null;
  tiempo_lectura_min: number | null;
  table_of_contents: ArticuloTocEntry[] | null;

  // ── Media ──
  /** External image URL (e.g. Unsplash). Not a Directus File UUID. */
  imagen_destacada_url: string | null;
  imagen_destacada_alt: string;
  imagen_destacada_prompt: string | null;
  imagen_destacada_credito: string | null;
  inline_images: unknown[] | null;

  // ── Relaciones ──
  /** M2O → autores. UUID or expanded Autor. */
  autor: string | Autor;
  /** M2O → categorias. UUID or expanded Categoria. */
  categoria_principal: string | Categoria;
  /** JSON array of categoria UUIDs (not expanded via fields). */
  categorias_secundarias: string[] | null;
  /** JSON array of tag UUIDs (not expanded via fields). */
  tags: string[] | null;
  /** JSON array of deporte UUIDs (not expanded via fields). */
  deportes: string[] | null;
  /** JSON array of articulo UUIDs (not expanded via fields). */
  articulos_relacionados: string[] | null;
  /** Free JSON map of internal-linking anchors. */
  mapa_links_internos: Record<string, unknown> | null;

  // ── SEO básico ──
  meta_titulo: string;
  meta_descripcion: string;
  meta_keywords: string | null;
  robots_directives: string;

  // ── SEO avanzado ──
  palabra_clave_primaria: string;
  palabras_clave_secundarias: string[] | null;
  search_intent: SearchIntent | null;
  target_serp_features: string[] | null;
  snippet_target_text: string | null;
  faq_blocks: ArticuloFaqEntry[] | null;

  // ── Open Graph ──
  og_titulo: string | null;
  og_descripcion: string | null;
  og_imagen_url: string | null;
  og_imagen_alt: string | null;
  og_type: string;
  twitter_card: string;
  twitter_titulo: string | null;
  twitter_descripcion: string | null;
  twitter_imagen_url: string | null;
  social_share_text: Record<string, string> | null;

  // ── Schema.org / JSON-LD ──
  schema_jsonld: Record<string, unknown> | null;
  schema_faq_jsonld: Record<string, unknown> | null;
  schema_howto_jsonld: Record<string, unknown> | null;
  schema_video_jsonld: Record<string, unknown> | null;

  // ── AI / GEO ──
  ai_summary: string | null;
  ai_key_facts: string[] | null;
  ai_entities: string[] | null;
  ai_citations_suggested: Record<string, unknown> | null;

  // ── Monetización ──
  ad_slots_count: number | null;
  ad_slots_positions: Record<string, unknown> | null;
  affiliate_blocks: Record<string, unknown> | null;
  ttp_cta_present: boolean;
  ttp_cta_position: string | null;
  premium_listing_cta: boolean;

  // ── Publicación ──
  fecha_publicacion: string; // ISO timestamp
  fecha_modificacion: string | null;
  fecha_revision_proxima: string | null; // ISO date
  idioma: string;
  pais_target: string;
  regiones_target: string[] | null;

  // ── Métricas ──
  vistas: number;
  engagement_score: number;
  ctr_serp: number;
  posicion_serp_actual: number | null;
}

/**
 * Projection of `Articulo` returned by listing queries (`fetchArticulos`,
 * `fetchArticulosRelacionados`). Has the M2O relations expanded and the
 * heavy `contenido_html` / `contenido_markdown` fields omitted to keep
 * payloads small for card grids.
 */
export type ArticuloCard = Pick<
  Articulo,
  | "id"
  | "slug"
  | "titulo"
  | "excerpt"
  | "lead"
  | "imagen_destacada_url"
  | "imagen_destacada_alt"
  | "tiempo_lectura_min"
  | "fecha_publicacion"
  | "estado"
  | "deportes"
  | "tags"
> & {
  autor: Pick<Autor, "id" | "slug" | "nombre" | "avatar_url" | "rol">;
  categoria_principal: Pick<Categoria, "id" | "slug" | "nombre" | "color_hex">;
};

/**
 * Projection of `Articulo` returned by detail queries (`fetchArticuloBySlug`).
 * Full body included, M2O relations expanded with all their fields.
 */
export type ArticuloFull = Omit<Articulo, "autor" | "categoria_principal"> & {
  autor: Autor;
  categoria_principal: Categoria;
};
