/**
 * Sitemap generator for HayCancha.
 *
 * Pulls live geo + clubes from Directus and emits public/sitemap.xml.
 * Wired as the `prebuild` script so it runs on every `npm run build`,
 * including the Cloudflare Pages CI build. `public/` is copied to `dist/`
 * by Vite, so the output ends up at the deployed `/sitemap.xml`.
 *
 * Failure policy: if Directus is unreachable or returns an error, this
 * script exits non-zero so the build fails — Cloudflare Pages keeps the
 * last good deploy and we don't ship an empty sitemap that would un-list
 * every URL we currently have indexed.
 *
 * Run with: npx tsx scripts/generate-sitemap.ts
 */
import { writeFileSync } from "node:fs";

const DIRECTUS_URL = process.env.VITE_DIRECTUS_URL ?? "https://api.haycancha.com";
const SITE_URL = "https://haycancha.com";
const OUTPUT_PATH = "public/sitemap.xml";

interface PaisRow {
  slug: string | null;
  date_updated: string | null;
}
interface CiudadRow {
  slug: string | null;
  date_updated: string | null;
  pais: { slug: string | null } | null;
}
interface BarrioRow {
  slug: string | null;
  date_updated: string | null;
  ciudad: { slug: string | null; pais: { slug: string | null } | null } | null;
}
interface ClubRow {
  slug: string | null;
  date_updated: string | null;
  pais: { slug: string | null } | null;
  ciudad: { slug: string | null } | null;
  barrio: { slug: string | null } | null;
}

type Url = {
  loc: string;
  lastmod?: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
};

async function fetchCollection<T>(collection: string, fields: string): Promise<T[]> {
  const params = new URLSearchParams({
    "filter[activo][_eq]": "true",
    fields,
    limit: "-1",
  });
  const url = `${DIRECTUS_URL}/items/${collection}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "<unreadable>");
    throw new Error(`Directus ${collection} fetch failed: HTTP ${res.status} — ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as { data: T[] };
  return json.data;
}

const isoOrUndef = (s: string | null | undefined): string | undefined =>
  s ? s : undefined;

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const renderUrl = (u: Url): string => {
  const parts = [
    `<loc>${escapeXml(u.loc)}</loc>`,
    u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "",
    `<changefreq>${u.changefreq}</changefreq>`,
    `<priority>${u.priority}</priority>`,
  ].filter(Boolean);
  return `  <url>${parts.join("")}</url>`;
};

async function main() {
  console.log(`[sitemap] DIRECTUS_URL = ${DIRECTUS_URL}`);
  console.log("[sitemap] Fetching paises, ciudades, barrios, clubes…");

  const [paises, ciudades, barrios, clubes] = await Promise.all([
    fetchCollection<PaisRow>("paises", "slug,date_updated"),
    fetchCollection<CiudadRow>("ciudades", "slug,date_updated,pais.slug"),
    fetchCollection<BarrioRow>("barrios", "slug,date_updated,ciudad.slug,ciudad.pais.slug"),
    fetchCollection<ClubRow>("clubes", "slug,date_updated,pais.slug,ciudad.slug,barrio.slug"),
  ]);

  console.log(
    `[sitemap] Got ${paises.length} paises · ${ciudades.length} ciudades · ${barrios.length} barrios · ${clubes.length} clubes`
  );

  const urls: Url[] = [];

  // 1. Home
  urls.push({ loc: `${SITE_URL}/`, changefreq: "daily", priority: "1.0" });

  // 2. Sport landings
  for (const sport of ["tenis", "padel", "pickleball"]) {
    urls.push({ loc: `${SITE_URL}/${sport}`, changefreq: "weekly", priority: "0.9" });
  }

  // 3. Search hub
  urls.push({ loc: `${SITE_URL}/canchas`, changefreq: "daily", priority: "0.8" });

  // 4. Add-a-club CTA
  urls.push({ loc: `${SITE_URL}/agregar-cancha`, changefreq: "monthly", priority: "0.6" });

  // 5. Sobre
  urls.push({ loc: `${SITE_URL}/sobre`, changefreq: "monthly", priority: "0.5" });

  // 6. Geo level 1: /canchas/:pais
  for (const p of paises) {
    if (!p.slug) continue;
    urls.push({
      loc: `${SITE_URL}/canchas/${p.slug}`,
      lastmod: isoOrUndef(p.date_updated),
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  // 7. Geo level 2: /canchas/:pais/:ciudad
  for (const c of ciudades) {
    const paisSlug = c.pais?.slug;
    if (!c.slug || !paisSlug) continue;
    urls.push({
      loc: `${SITE_URL}/canchas/${paisSlug}/${c.slug}`,
      lastmod: isoOrUndef(c.date_updated),
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  // 8. Geo level 3: /canchas/:pais/:ciudad/:barrio
  for (const b of barrios) {
    const ciudadSlug = b.ciudad?.slug;
    const paisSlug = b.ciudad?.pais?.slug;
    if (!b.slug || !ciudadSlug || !paisSlug) continue;
    urls.push({
      loc: `${SITE_URL}/canchas/${paisSlug}/${ciudadSlug}/${b.slug}`,
      lastmod: isoOrUndef(b.date_updated),
      changefreq: "weekly",
      priority: "0.6",
    });
  }

  // 9. Club detail pages — canonical URL matches buildClubHref()
  let clubsEmitted = 0;
  let clubsSkipped = 0;
  for (const club of clubes) {
    const paisSlug = club.pais?.slug;
    const ciudadSlug = club.ciudad?.slug;
    const barrioSlug = club.barrio?.slug ?? null;
    if (!club.slug || !paisSlug || !ciudadSlug) {
      clubsSkipped++;
      continue;
    }
    const path = barrioSlug
      ? `/canchas/${paisSlug}/${ciudadSlug}/${barrioSlug}/${club.slug}`
      : `/canchas/${paisSlug}/${ciudadSlug}/${club.slug}`;
    urls.push({
      loc: `${SITE_URL}${path}`,
      lastmod: isoOrUndef(club.date_updated),
      changefreq: "weekly",
      priority: "0.7",
    });
    clubsEmitted++;
  }
  if (clubsSkipped > 0) {
    console.warn(`[sitemap] Skipped ${clubsSkipped} clubes with missing pais/ciudad/slug`);
  }

  // 10. Legal pages
  for (const legal of ["privacidad", "terminos", "atribucion-osm"]) {
    urls.push({
      loc: `${SITE_URL}/${legal}`,
      changefreq: "yearly",
      priority: "0.3",
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(renderUrl).join("\n")}
</urlset>
`;

  writeFileSync(OUTPUT_PATH, xml);
  console.log(
    `[sitemap] Wrote ${OUTPUT_PATH} — ${urls.length} URLs (${clubsEmitted} clubes)`
  );
}

main().catch((err) => {
  console.error("[sitemap] FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
});
