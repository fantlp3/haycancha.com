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
