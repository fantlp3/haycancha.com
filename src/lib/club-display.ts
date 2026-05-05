import type { ClubCard } from "./directus-types";
import type { Sport } from "@/components/brand/SportBadge";

const KNOWN_SPORTS: Sport[] = ["tenis", "padel", "pickleball"];

/**
 * Builds the canonical detail URL for a club: /canchas/:pais/:ciudad/:barrio/:slug.
 * The route requires four segments — when a club has no barrio, ciudad.slug is
 * reused as the 4th segment so the URL stays valid (the detail page only uses
 * `:slug` for lookup).
 */
export const buildClubHref = (
  c: Pick<ClubCard, "slug"> & {
    pais: { slug: string };
    ciudad: { slug: string };
    barrio?: { slug: string } | null;
  }
): string =>
  `/canchas/${c.pais.slug}/${c.ciudad.slug}/${c.barrio?.slug ?? c.ciudad.slug}/${c.slug}`;

/** Filters a club's clubes_deportes to the three sports we render badges for. */
export const clubSports = (
  cd: ClubCard["clubes_deportes"]
): Sport[] =>
  (cd ?? [])
    .map((row) => row.deporte.slug)
    .filter((s): s is Sport => KNOWN_SPORTS.includes(s as Sport));
