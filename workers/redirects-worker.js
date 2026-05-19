/**
 * redirects-worker.js
 *
 * Cloudflare Worker that issues 301 permanent redirects from legacy
 * WordPress / pre-React URLs to their new SPA equivalents. Replaces the
 * static `public/_redirects` file (which had the additional benefit of
 * being silently wrong about /contacto, see history).
 *
 * Behaviour:
 *   - Matches a path → 301 to the new destination
 *   - Special case: /cancha.php?url=<slug> → Directus lookup → 301 to the
 *     canonical /canchas/<pais>/<ciudad>/<barrio>/<slug>. Cached 24h per
 *     slug. On lookup failure / unknown slug / Directus error: 301 to
 *     /canchas (SEO-friendly fallback).
 *   - No match → passthrough (fetch the same request, which falls through
 *     to Pages or the OG meta worker on /blog/* and /canchas/* routes).
 *
 * The OG meta worker lives on more specific routes (haycancha.com/blog/*
 * and haycancha.com/canchas/*). Cloudflare's route resolution picks the
 * most specific route, so the OG worker handles those paths and never
 * conflicts with this one in practice. The matchLegacy() function below
 * intentionally returns null for /blog/... and /canchas/... too — belt
 * and suspenders if the route priorities ever drift.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * Lifecycle / how to disable
 * ───────────────────────────────────────────────────────────────────────────
 * These redirects are 301 (permanent), so browsers and search engines
 * cache them indefinitely. The intent is to keep the worker running until
 * Google has fully re-crawled the new structure (~6 months from launch).
 * After that, the worker can be removed by:
 *   - `wrangler delete --name haycancha-redirects --config wrangler.redirects.toml`
 *   - or just removing the route mapping in the Cloudflare dashboard
 * Removing it after 6+ months is safe; any traffic still hitting legacy
 * URLs will get a generic Pages 404, which is fine SEO-wise once Google
 * has updated its index.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * Extending — adding a new legacy pattern
 * ───────────────────────────────────────────────────────────────────────────
 * 1. Static (path → fixed URL):  add an entry to STATIC_REDIRECTS.
 *    Keys are matched in order; first match wins.
 * 2. Dynamic (needs Directus / per-request logic): add a handler that
 *    returns a Response, and call it from the main fetch() based on a
 *    regex match. Reuse `resolveClubBySlug` if the lookup is by club slug.
 *
 * Avoid baking the `/blog/...` or `/canchas/...` prefixes into legacy
 * patterns — those are handled by the SPA + OG meta worker.
 */

const DIRECTUS_URL = "https://api.haycancha.com";
const SITE_ORIGIN = "https://haycancha.com";

/** Cache TTL for Directus club-slug lookups. 24h per spec. */
const CLUB_RESOLVE_CACHE_TTL = 60 * 60 * 24;

/** Lookup timeout — never block the redirect more than this on Directus. */
const DIRECTUS_TIMEOUT_MS = 6000;

/** Where /cancha.php → falls back when no slug is provided or lookup fails. */
const CANCHAS_FALLBACK = "/canchas";

/**
 * Static redirect table. Each entry is matched in order; first match wins.
 * `match` is either:
 *   - an exact pathname string (case-insensitive comparison)
 *   - a RegExp tested against the lowercased pathname
 *
 * The legacy `_redirects` file rule `/contacto → /sobre` is intentionally
 * NOT here — /contacto is a real SPA route now (src/App.tsx:41).
 */
const STATIC_REDIRECTS = [
  { match: "/busqueda.php",              target: "/canchas" },
  { match: "/cancha_comentarios.php",    target: "/canchas" },
  { match: "/barrios.php",               target: "/canchas" },
  { match: "/galeria.php",               target: "/" },
  { match: "/haycancha.php",             target: "/" },
  { match: "/form_agregar_complejo.php", target: "/agregar-cancha" },
  { match: "/promociones",               target: "/canchas" },
  // /torneos and anything under /torneos/...
  { match: /^\/torneos(\/.*)?$/,         target: "/canchas" },
  // Any *.htm (NOT *.html — those are real SPA assets). The pre-WP site
  // used .htm. Matches paths only — never /a/b/foo.htm.bar.
  { match: /^\/[^/]+\.htm$/,             target: "/" },
];

/** Slug pattern that mirrors src/lib/geo.ts toSlug() output. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default {
  /**
   * @param {Request} request
   * @param {{ DIRECTUS_TOKEN?: string }} env
   * @param {ExecutionContext} ctx
   */
  async fetch(request, env, ctx) {
    // Only intercept GETs and HEADs. Don't redirect form POSTs from the
    // legacy site (they'd lose body), don't redirect API preflights.
    if (request.method !== "GET" && request.method !== "HEAD") {
      return fetch(request);
    }

    const url = new URL(request.url);
    // Normalise: lowercase + strip a single trailing slash. We compare
    // against lowercased pathname patterns. The trailing-slash strip
    // keeps `/promociones` and `/promociones/` matching the same rule.
    const pathname = url.pathname.toLowerCase().replace(/\/+$/, "") || "/";

    // Hard passthrough for paths owned by the SPA / OG worker. Even if
    // route specificity in CF ever changes, these never get hijacked.
    if (pathname === "/blog" || pathname.startsWith("/blog/")) {
      return fetch(request);
    }
    if (pathname === "/canchas" || pathname.startsWith("/canchas/")) {
      return fetch(request);
    }

    // /cancha.php — special case (the only dynamic rule).
    if (pathname === "/cancha.php") {
      return handleCanchaPhp(url, env, ctx);
    }

    // Static rules.
    for (const { match, target } of STATIC_REDIRECTS) {
      if (typeof match === "string") {
        if (pathname === match) return redirect(target);
      } else if (match.test(pathname)) {
        return redirect(target);
      }
    }

    // Nothing matched — let the SPA serve this URL (or 404).
    return fetch(request);
  },
};

/**
 * Build a 301 response. Always uses an absolute Location anchored to
 * SITE_ORIGIN so the redirect works under any host header (incl. www).
 * Adds an `x-redirects-worker` header for prod debugging.
 */
function redirect(target, { source = "static" } = {}) {
  const location = target.startsWith("http")
    ? target
    : `${SITE_ORIGIN}${target}`;
  return new Response(null, {
    status: 301,
    headers: {
      location,
      "cache-control": "public, max-age=86400",
      "x-redirects-worker": source,
    },
  });
}

/**
 * /cancha.php handler.
 *
 *   - ?url=<slug> with a valid slug → resolve to canonical club path
 *   - missing/invalid ?url, or slug unknown / Directus error → /canchas
 *
 * Resolution is cached for 24h via Cache API; cache key encodes only the
 * slug, so the same club resolves from cache regardless of the legacy URL
 * shape.
 */
async function handleCanchaPhp(url, env, ctx) {
  const rawSlug = (url.searchParams.get("url") || "").trim().toLowerCase();

  if (!rawSlug || !SLUG_PATTERN.test(rawSlug)) {
    return redirect(CANCHAS_FALLBACK, { source: "cancha.php-no-slug" });
  }

  try {
    const canonical = await resolveClubBySlug(rawSlug, env.DIRECTUS_TOKEN, ctx);
    if (canonical) {
      return redirect(canonical, { source: "cancha.php-resolved" });
    }
  } catch (err) {
    // Swallow + log; never break a redirect because Directus had a hiccup.
    console.error("redirects-worker cancha.php error", err);
  }

  return redirect(CANCHAS_FALLBACK, { source: "cancha.php-fallback" });
}

/**
 * Resolve a club slug to its canonical SPA path
 * `/canchas/<pais>/<ciudad>/<barrio>/<slug>` (or 3-seg when the club has
 * no barrio).
 *
 * Hits Directus on cache miss. Cache key is keyed only on slug, so the
 * same club resolves identically regardless of host/query/casing.
 * Returns null when the slug isn't a known active club.
 */
async function resolveClubBySlug(slug, token, ctx) {
  const cache = caches.default;
  const cacheKey = new Request(
    `https://cache.haycancha.internal/club-slug/${slug}`,
    { method: "GET" }
  );

  const hit = await cache.match(cacheKey);
  if (hit) {
    const text = await hit.text();
    // Empty body sentinel = "we already looked this up and it doesn't exist"
    return text === "" ? null : text;
  }

  const endpoint = new URL("/items/clubes", DIRECTUS_URL);
  endpoint.searchParams.set("filter[slug][_eq]", slug);
  endpoint.searchParams.set("filter[activo][_eq]", "true");
  endpoint.searchParams.set(
    "fields",
    "slug,pais.slug,ciudad.slug,barrio.slug"
  );
  endpoint.searchParams.set("limit", "1");

  const headers = { accept: "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DIRECTUS_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(endpoint.toString(), {
      headers,
      signal: controller.signal,
      cf: { cacheTtl: 60, cacheEverything: true },
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) return null;
  const payload = await res.json();
  const row = payload?.data?.[0];

  let canonical = null;
  if (row?.slug && row.pais?.slug && row.ciudad?.slug) {
    canonical = row.barrio?.slug
      ? `/canchas/${row.pais.slug}/${row.ciudad.slug}/${row.barrio.slug}/${row.slug}`
      : `/canchas/${row.pais.slug}/${row.ciudad.slug}/${row.slug}`;
  }

  // Cache the result — both hits and misses — so we don't re-hit Directus
  // for the same bad slug repeatedly.
  const body = canonical ?? "";
  const cacheResponse = new Response(body, {
    headers: {
      "cache-control": `public, max-age=${CLUB_RESOLVE_CACHE_TTL}`,
      "content-type": "text/plain; charset=utf-8",
    },
  });
  ctx.waitUntil(cache.put(cacheKey, cacheResponse));

  return canonical;
}
