/**
 * Cloudflare Pages Function — handles GET /sitemap.xml.
 *
 * Pulls the live list of active clubes from Directus and emits a fresh sitemap
 * including all geo-level pages (país, ciudad, barrio) plus every club detail URL.
 *
 * Why a Function instead of static public/sitemap.xml?
 *   - The sitemap reflects whatever is in Directus right now — adding a club in the
 *     CMS shows up in the sitemap on the next Googlebot crawl, no rebuild needed.
 *   - Same edge runtime as the rest of Pages — no separate Worker to maintain.
 *
 * Resilience: if Directus is unreachable the function still returns a valid (minimal)
 * sitemap with the static routes, so Googlebot never sees a 5xx on /sitemap.xml.
 */
import { buildSitemapXml, fetchClubsForSitemap } from "../src/lib/sitemap";

interface Env {
  VITE_DIRECTUS_URL: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const directusUrl = context.env.VITE_DIRECTUS_URL;

  if (!directusUrl) {
    // Misconfiguration — emit a minimal sitemap with just static routes
    // and log so the deploy alerts surface the issue.
    console.error("[sitemap] VITE_DIRECTUS_URL is not set in Pages env vars");
    return xmlResponse(buildSitemapXml([]), 60);
  }

  try {
    const clubs = await fetchClubsForSitemap(directusUrl);
    const xml = buildSitemapXml(clubs);
    // Cache 1h at the edge — Googlebot rarely hits more than that.
    return xmlResponse(xml, 3600);
  } catch (err) {
    console.error("[sitemap] Directus fetch failed:", err);
    // Fallback: minimal sitemap with static routes only. Short cache so
    // a recovery in Directus surfaces quickly.
    return xmlResponse(buildSitemapXml([]), 60);
  }
};

function xmlResponse(xml: string, maxAgeSeconds: number): Response {
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAgeSeconds}, s-maxage=${maxAgeSeconds}`,
    },
  });
}
