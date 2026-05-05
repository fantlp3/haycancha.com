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
};

export type ClubCard = Pick<Club, "id" | "nombre" | "slug" | "tipo" | "es_premium"> & {
  foto_portada: Pick<DirectusFile, "id" | "filename_download"> | null;
  pais: Pick<Pais, "nombre" | "slug">;
  barrio: Pick<Barrio, "nombre" | "slug"> | null;
  ciudad: Pick<Ciudad, "nombre" | "slug">;
  clubes_deportes?: Array<{
    es_primario?: boolean;
    deporte: { slug: string; nombre?: string };
  }>;
};

export function isExpanded<T>(field: string | T | null): field is T {
  return field !== null && typeof field !== "string";
}
