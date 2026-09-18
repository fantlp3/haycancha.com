import type { ClubFull, Superficie } from "./directus-types";

export const SURFACE_LABELS: Record<Superficie, string> = {
  polvo_de_ladrillo: "polvo de ladrillo",
  cemento: "cemento",
  cesped_sintetico: "césped sintético",
  cesped_natural: "césped natural",
  pista_dura: "pista dura",
  cristal: "cristal",
  hormigon_poroso: "hormigón poroso",
  sintetico_indoor: "sintético indoor",
  parquet: "parquet",
  otro: "otra superficie",
};

/** "a, b y c" */
function joinEs(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

const MAX = 160;

type ClubForSeo = Pick<ClubFull, "nombre" | "descripcion" | "telefono" | "horario_texto"> & {
  ciudad: { nombre: string };
  pais: { nombre: string };
  barrio?: { nombre: string } | null;
  clubes_deportes: Array<{
    superficie: Superficie | null;
    cantidad_canchas: number | null;
    indoor?: boolean | null;
    deporte: { nombre: string };
  }>;
};

/**
 * Meta description for a club page.
 *
 * The old fallback was `"{nombre}: {deportes} en {ciudad}."` — around 50
 * characters, and identical in shape across 2.297 pages. `descripcion` would
 * have been the natural source but it is filled on 16 clubs (0,7 %), so this
 * composes a real sentence out of the fields that ARE populated: sports,
 * surfaces and court counts from clubes_deportes, the barrio, and whether we
 * hold hours and a phone number.
 *
 * Adds one clause at a time and stops before the 160-character mark, so the
 * result is never truncated mid-word.
 */
export function buildClubSeoDescription(club: ClubForSeo): string {
  if (club.descripcion?.trim()) {
    const d = club.descripcion.trim();
    return d.length <= MAX ? d : `${d.slice(0, MAX - 1).replace(/\s+\S*$/, "")}…`;
  }

  const sports = joinEs([
    ...new Set(club.clubes_deportes.map((cd) => cd.deporte.nombre).filter(Boolean)),
  ]);
  // Barrio → ciudad → país, comma separated. Not joinEs(): "Córdoba y
  // Argentina" reads as two peers, "Córdoba, Argentina" as a place.
  const place = [club.barrio?.nombre, club.ciudad.nombre, club.pais.nombre]
    .filter((v): v is string => Boolean(v))
    .join(", ");

  let out = sports
    ? `${club.nombre}: ${sports} en ${place}.`
    : `${club.nombre}, en ${place}.`;

  const add = (clause: string) => {
    if (out.length + 1 + clause.length <= MAX) out += ` ${clause}`;
  };

  const courts = club.clubes_deportes.reduce(
    (n, cd) => n + (cd.cantidad_canchas ?? 0),
    0
  );
  if (courts > 0) add(`${courts} ${courts === 1 ? "cancha" : "canchas"}.`);

  const surfaces = joinEs([
    ...new Set(
      club.clubes_deportes
        .map((cd) => (cd.superficie ? SURFACE_LABELS[cd.superficie] : null))
        .filter((v): v is string => Boolean(v))
    ),
  ]);
  if (surfaces) add(`${surfaces.charAt(0).toUpperCase()}${surfaces.slice(1)}.`);

  if (club.horario_texto && club.telefono) add("Horarios, teléfono y cómo llegar.");
  else if (club.horario_texto) add("Horarios y cómo llegar.");
  else if (club.telefono) add("Teléfono y cómo llegar.");
  else add("Ubicación y cómo llegar.");

  return out;
}
