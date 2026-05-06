import type { ClubCard } from "./directus-types";
import type { Sport } from "@/components/brand/SportBadge";

const KNOWN_SPORTS: Sport[] = ["tenis", "padel", "pickleball"];

/**
 * Builds the canonical detail URL for a club.
 *   With barrio:    /canchas/:pais/:ciudad/:barrio/:slug  → ClubDetailPage
 *   Without barrio: /canchas/:pais/:ciudad/:slug          → GeoRouterPage
 * GeoRouterPage disambiguates the 3-seg form between a club and a barrio.
 */
export const buildClubHref = (
  c: Pick<ClubCard, "slug"> & {
    pais: { slug: string };
    ciudad: { slug: string };
    barrio?: { slug: string } | null;
  }
): string =>
  c.barrio
    ? `/canchas/${c.pais.slug}/${c.ciudad.slug}/${c.barrio.slug}/${c.slug}`
    : `/canchas/${c.pais.slug}/${c.ciudad.slug}/${c.slug}`;

/** Filters a club's clubes_deportes to the three sports we render badges for. */
export const clubSports = (
  cd: ClubCard["clubes_deportes"]
): Sport[] =>
  (cd ?? [])
    .map((row) => row.deporte.slug)
    .filter((s): s is Sport => KNOWN_SPORTS.includes(s as Sport));
