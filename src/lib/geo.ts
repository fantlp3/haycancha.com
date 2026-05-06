// LATAM countries — slug ↔ display name mapping.
// Slugs: lowercase, kebab-case, ASCII only (no accents, no ñ).

export const LATAM_COUNTRIES: { slug: string; name: string }[] = [
  { slug: "argentina", name: "Argentina" },
  { slug: "mexico", name: "México" },
  { slug: "colombia", name: "Colombia" },
  { slug: "chile", name: "Chile" },
  { slug: "peru", name: "Perú" },
  { slug: "uruguay", name: "Uruguay" },
  { slug: "venezuela", name: "Venezuela" },
  { slug: "ecuador", name: "Ecuador" },
  { slug: "paraguay", name: "Paraguay" },
  { slug: "bolivia", name: "Bolivia" },
  { slug: "costa-rica", name: "Costa Rica" },
  { slug: "republica-dominicana", name: "República Dominicana" },
];

const slugToName = new Map(LATAM_COUNTRIES.map((c) => [c.slug, c.name]));
const nameToSlug = new Map(LATAM_COUNTRIES.map((c) => [c.name, c.slug]));

export const countrySlugToName = (slug: string): string =>
  slugToName.get(slug) ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const countryNameToSlug = (name: string): string =>
  nameToSlug.get(name) ?? toSlug(name);

/** Generic slugifier: lowercase, ASCII, kebab-case. */
export const toSlug = (input: string): string =>
  input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/gi, "n")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Great-circle distance in km between two {lat,lng} points (Haversine). */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}
