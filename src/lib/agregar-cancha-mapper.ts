import type {
  ClubPendingSubmission,
  ClubTipo,
  RelacionConClub,
} from "./directus-types";
import { SERVICIOS, DIAS } from "./agregar-cancha-config";

export interface SportDetail {
  cantidad: number;
  superficies: string[];
}

/**
 * Shape of the Agregar Cancha form state consumed by `toSubmission`.
 * Structurally compatible with the page's `FormData` (z.infer<formSchema>).
 *
 * A sport is "selected" iff its key is present (truthy) in `deportes`.
 */
export interface SubmissionFormInput {
  submitter_role: "owner" | "player";
  nombre: string;
  tipo: string;
  descripcion?: string;
  deportes: {
    tenis?: SportDetail;
    padel?: SportDetail;
    pickleball?: SportDetail;
  };
  iluminacion: boolean;
  tipo_instalacion: "outdoor" | "indoor" | "mixto" | null;
  servicios: Record<string, boolean>;
  url_reserva?: string;
  ubicacion: {
    pais: string;
    provincia: string;
    ciudad: string;
    barrio?: string;
    direccion: string;
    entre_calle_1?: string;
    entre_calle_2?: string;
    lat: number | null;
    lng: number | null;
  };
  contacto: {
    nombre_apellido: string;
    email: string;
    telefono: string;
    whatsapp?: string;
    website?: string;
    instagram?: string;
  };
  horarios: {
    lunes: { abierto: boolean; desde: string; hasta: string };
    martes: { abierto: boolean; desde: string; hasta: string };
    miercoles: { abierto: boolean; desde: string; hasta: string };
    jueves: { abierto: boolean; desde: string; hasta: string };
    viernes: { abierto: boolean; desde: string; hasta: string };
    sabado: { abierto: boolean; desde: string; hasta: string };
    domingo: { abierto: boolean; desde: string; hasta: string };
    notas?: string;
  };
}

const SPORT_KEYS = ["tenis", "padel", "pickleball"] as const;
type SportKey = (typeof SPORT_KEYS)[number];

const SPORT_LABEL: Record<SportKey, string> = {
  tenis: "Tenis",
  padel: "Pádel",
  pickleball: "Pickleball",
};

// "Otro" falls back to "complejo" per locked decision.
const TIPO_MAP: Record<string, ClubTipo> = {
  Club: "club",
  "Complejo deportivo": "complejo",
  "Cancha pública": "cancha_publica",
  "Hotel con canchas": "hotel",
  Otro: "complejo",
};

const RELACION_MAP: Record<"owner" | "player", RelacionConClub> = {
  owner: "dueño",
  player: "usuario_general",
};

const INSTALACION_LABEL: Record<"outdoor" | "indoor" | "mixto", string> = {
  outdoor: "Outdoor",
  indoor: "Indoor",
  mixto: "Mixto",
};

function trim(s: string | undefined | null): string | undefined {
  if (s == null) return undefined;
  const t = s.trim();
  return t.length > 0 ? t : undefined;
}

function composeNotas(data: SubmissionFormInput): string | undefined {
  const lines: string[] = [];

  const descripcion = trim(data.descripcion);
  if (descripcion) lines.push(`Descripción: ${descripcion}`);

  for (const k of SPORT_KEYS) {
    const detail = data.deportes[k];
    if (!detail) continue;
    const surfaces = detail.superficies.map((s) => s.toLowerCase()).join(", ");
    const word = detail.cantidad === 1 ? "cancha" : "canchas";
    lines.push(
      surfaces
        ? `${SPORT_LABEL[k]}: ${detail.cantidad} ${word} (${surfaces}).`
        : `${SPORT_LABEL[k]}: ${detail.cantidad} ${word}.`
    );
  }

  if (data.iluminacion) lines.push("Iluminación nocturna: sí");

  if (data.tipo_instalacion) {
    lines.push(`Tipo de instalación: ${INSTALACION_LABEL[data.tipo_instalacion]}`);
  }

  const activeServicios = SERVICIOS.filter((s) => data.servicios[s.key]).map(
    (s) => s.label
  );
  if (activeServicios.length > 0) {
    lines.push(`Servicios: ${activeServicios.join(", ")}`);
  }

  const urlReserva = trim(data.url_reserva);
  if (urlReserva) lines.push(`URL de reserva: ${urlReserva}`);

  const c1 = trim(data.ubicacion.entre_calle_1);
  const c2 = trim(data.ubicacion.entre_calle_2);
  if (c1 && c2) lines.push(`Entre calles: ${c1} y ${c2}`);
  else if (c1) lines.push(`Entre calle: ${c1}`);
  else if (c2) lines.push(`Entre calle: ${c2}`);

  const whatsapp = trim(data.contacto.whatsapp);
  if (whatsapp) lines.push(`WhatsApp: ${whatsapp}`);

  const instagram = trim(data.contacto.instagram);
  if (instagram) lines.push(`Instagram: @${instagram}`);

  const horarios = DIAS.map((d) => {
    const h = data.horarios[d.key];
    return h.abierto ? `${d.label} ${h.desde}-${h.hasta}` : `${d.label} cerrado`;
  }).join(", ");
  lines.push(`Horarios: ${horarios}`);

  const notasHorarios = trim(data.horarios.notas);
  if (notasHorarios) lines.push(`Notas de horarios: ${notasHorarios}`);

  return lines.length > 0 ? lines.join("\n") : undefined;
}

/**
 * Map form state to the Directus `clubes_pending` payload.
 *
 * - Drops empty/undefined optional fields (never sends "").
 * - Does NOT send `email_club` (form's contacto.email is the submitter's,
 *   not the club's — locked decision).
 * - `cantidad_canchas` is the SUM of per-sport cantidades. Per-sport
 *   breakdown (count + surfaces) is preserved in `notas_remitente`.
 * - `deportes_indicados` lists only the selected sport slugs in canonical
 *   order (tenis, padel, pickleball).
 */
export function toSubmission(data: SubmissionFormInput): ClubPendingSubmission {
  const selected = SPORT_KEYS.filter((k) => !!data.deportes[k]);

  const out: ClubPendingSubmission = {
    nombre: data.nombre.trim(),
    tipo: TIPO_MAP[data.tipo] ?? "complejo",
    direccion: data.ubicacion.direccion.trim(),
    pais_texto: data.ubicacion.pais.trim(),
    ciudad_texto: data.ubicacion.ciudad.trim(),
    nombre_remitente: data.contacto.nombre_apellido.trim(),
    email_remitente: data.contacto.email.trim(),
    relacion_con_club: RELACION_MAP[data.submitter_role],
  };

  const barrio = trim(data.ubicacion.barrio);
  if (barrio) out.barrio_texto = barrio;

  if (data.ubicacion.lat != null) out.latitud = data.ubicacion.lat;
  if (data.ubicacion.lng != null) out.longitud = data.ubicacion.lng;

  const telefono = trim(data.contacto.telefono);
  if (telefono) out.telefono = telefono;

  const website = trim(data.contacto.website);
  if (website) out.website = website;

  if (selected.length > 0) out.deportes_indicados = [...selected];

  const totalCanchas = selected.reduce(
    (sum, k) => sum + (data.deportes[k]?.cantidad ?? 0),
    0
  );
  if (totalCanchas > 0) out.cantidad_canchas = totalCanchas;

  const notas = composeNotas(data);
  if (notas) out.notas_remitente = notas;

  return out;
}
