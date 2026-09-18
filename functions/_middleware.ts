/**
 * Real 404s for the SPA.
 *
 * Cloudflare Pages falls back to index.html with HTTP 200 for any path that
 * doesn't match an asset. Combined with client-side routing that means every
 * nonexistent URL — /pagina-que-no-existe, /wp-admin, the legacy *.php URLs
 * Google still has indexed — answers 200 with the app shell. Search Console
 * reports 363 pages as Soft 404, and each one burns crawl budget that should
 * go to the club pages.
 *
 * This middleware leaves the response untouched for every path the router
 * actually serves, and rewrites the status to 404 for everything else. The
 * body is unchanged, so the SPA still boots and renders its NotFound view —
 * only the status line differs, which is exactly what crawlers read.
 *
 * Deliberately pattern-only: no Directus lookup, no cache, no added latency
 * and no new failure mode on the hot path. A URL shaped like a real club or
 * post but with an unknown slug still answers 200 and renders NotFound; those
 * come almost entirely from our own sitemap, so they are a much smaller
 * bucket than the arbitrary-path traffic this catches. Tightening that needs
 * a slug lookup — see redirects-worker.js for the cached-lookup pattern.
 */

/** Routes declared in src/App.tsx that take no parameters. */
const STATIC_ROUTES = new Set([
  "/",
  "/agregar-cancha",
  "/tenis",
  "/padel",
  "/pickleball",
  "/privacidad",
  "/terminos",
  "/atribucion-osm",
  "/sobre",
  "/sobre-haycancha",
  "/contacto",
  "/blog",
  "/canchas",
]);

/** Slug shape used across Directus: lowercase ASCII, digits, single hyphens. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isKnownRoute(pathname: string): boolean {
  // Normalise a single trailing slash, except for the root itself.
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (STATIC_ROUTES.has(path)) return true;

  const segments = path.split("/").filter(Boolean);

  // /blog/<slug>
  if (segments.length === 2 && segments[0] === "blog") {
    return SLUG.test(segments[1]);
  }

  // /canchas/<pais>[/<ciudad>[/<barrio-o-slug>[/<slug>]]]
  if (segments[0] === "canchas" && segments.length >= 2 && segments.length <= 5) {
    return segments.slice(1).every((s) => SLUG.test(s));
  }

  return false;
}

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  const { pathname } = new URL(context.request.url);

  // Only navigation responses are candidates. Assets, API routes and anything
  // that already carries a non-200 status are passed through untouched.
  if (response.status !== 200) return response;
  if (pathname.startsWith("/api/")) return response;

  // Real assets (sitemap.xml, robots.txt, favicons, /assets/*) come back with
  // their own content type, so this single check covers them — no extension
  // allow-list needed. An HTML 200 for a path with an extension means Pages
  // fell through to index.html, i.e. the asset does NOT exist: that is exactly
  // the legacy *.php case and it must 404.
  if (!response.headers.get("content-type")?.includes("text/html")) return response;

  if (isKnownRoute(pathname)) return response;

  return new Response(response.body, {
    status: 404,
    statusText: "Not Found",
    headers: response.headers,
  });
};
