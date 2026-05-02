/**
 * Sitemap generator for HayCancha — emits URLs for all 5 levels:
 *   /canchas
 *   /canchas/:pais
 *   /canchas/:pais/:ciudad
 *   /canchas/:pais/:ciudad/:barrio
 *   /canchas/:pais/:ciudad/:barrio/:slug
 *
 * Run with: bun run scripts/generate-sitemap.ts
 * Writes to: public/sitemap.xml
 */
import { writeFileSync } from "node:fs";
import { LATAM_COUNTRIES, toSlug } from "../src/lib/geo";

const SITE_URL = "https://haycancha.com";

// In production, fetch from DB. Demo dataset for now.
const GEO: Record<
  string,
  { slug: string; cities: { slug: string; barrios: string[]; clubs: { barrio: string; slug: string }[] }[] }
> = {
  argentina: {
    slug: "argentina",
    cities: [
      {
        slug: "buenos-aires",
        barrios: ["palermo", "belgrano", "recoleta", "caballito"],
        clubs: [
          { barrio: "palermo", slug: "club-atletico-palermo" },
          { barrio: "belgrano", slug: "asociacion-tenis-belgrano" },
        ],
      },
    ],
  },
  mexico: {
    slug: "mexico",
    cities: [
      {
        slug: "ciudad-de-mexico",
        barrios: ["polanco", "condesa", "roma"],
        clubs: [{ barrio: "polanco", slug: "club-deportivo-polanco" }],
      },
    ],
  },
  colombia: {
    slug: "colombia",
    cities: [
      {
        slug: "bogota",
        barrios: ["chapinero", "usaquen"],
        clubs: [{ barrio: "chapinero", slug: "club-tenis-chapinero" }],
      },
    ],
  },
  chile: {
    slug: "chile",
    cities: [
      {
        slug: "santiago",
        barrios: ["providencia", "las-condes"],
        clubs: [{ barrio: "providencia", slug: "club-providencia-tenis" }],
      },
    ],
  },
};

const urls: string[] = ["/", "/canchas"];

for (const country of LATAM_COUNTRIES) {
  urls.push(`/canchas/${country.slug}`);
  const data = GEO[country.slug];
  if (!data) continue;
  for (const city of data.cities) {
    urls.push(`/canchas/${country.slug}/${city.slug}`);
    for (const barrio of city.barrios) {
      urls.push(`/canchas/${country.slug}/${city.slug}/${toSlug(barrio)}`);
    }
    for (const club of city.clubs) {
      urls.push(`/canchas/${country.slug}/${city.slug}/${toSlug(club.barrio)}/${club.slug}`);
    }
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE_URL}${u}</loc><changefreq>weekly</changefreq><priority>${u === "/" ? "1.0" : "0.7"}</priority></url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`Wrote public/sitemap.xml — ${urls.length} URLs`);
