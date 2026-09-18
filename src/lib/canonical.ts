const SITE_URL = "https://haycancha.com";

/**
 * Resolve a canonical URL from a value that may be a path OR already absolute.
 *
 * This used to be a bare `${SITE_URL}${path}` concatenation inside SeoMeta.
 * Blog posts pass `articulos.url_canonical`, which Directus stores fully
 * qualified, so every post emitted the malformed
 * `https://haycancha.comhttps://haycancha.com/blog/<slug>` — reported by
 * Search Console as "Duplicate, user has not indicated a canonical version"
 * across the whole blog.
 */
export function resolveCanonical(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      // Keep the root's trailing slash (the sitemap lists `https://haycancha.com/`);
      // strip it everywhere else so canonicals are byte-identical across pages.
      return url.pathname === "/" ? url.toString() : url.toString().replace(/\/$/, "");
    } catch {
      return undefined;
    }
  }

  // Protocol-relative (`//haycancha.com/x`).
  if (trimmed.startsWith("//")) {
    return resolveCanonical(`https:${trimmed}`);
  }

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${SITE_URL}${path}`;
}
