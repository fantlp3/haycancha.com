/**
 * Sitemap generator for HayCancha — emits URLs for all 5 levels:
 *   /canchas
 *   /canchas/:pais
 *   /canchas/:pais/:ciudad
 *   /canchas/:pais/:ciudad/:barrio
 *   /canchas/:pais/:ciudad/:barrio/:slug
 *
 * Pulls live data from Directus (VITE_DIRECTUS_URL).
 *
 * Run with: bun run scripts/generate-sitemap.ts
 * Writes to: public/sitemap.xml
 *
 * Note: the production sitemap is served by `functions/sitemap.xml.ts`
 * (Pages Function). This script is here for local debugging and to
 * leave a fallback sitemap at build time in case the Pages Function
 * ever gets shadowed by static-file routing. The build/deploy does NOT
 * require this script to run.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildSitemapXml, fetchClubsForSitemap } from "../src/lib/sitemap";

const DIRECTUS_URL = process.env.VITE_DIRECTUS_URL ?? "https://api.haycancha.com";

async function main() {
  console.log(`Fetching active clubs from ${DIRECTUS_URL}…`);
  const clubs = await fetchClubsForSitemap(DIRECTUS_URL);
  console.log(`  → ${clubs.length} active clubs found`);

  const xml = buildSitemapXml(clubs);
  const outPath = resolve(process.cwd(), "public/sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");

  const sizeKb = (xml.length / 1024).toFixed(1);
  const lineCount = xml.split("\n").length;
  console.log(`Wrote ${outPath} (${sizeKb} KB, ${lineCount} lines)`);
}

main().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
