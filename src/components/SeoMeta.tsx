import { Helmet } from "react-helmet-async";

interface SeoMetaProps {
  title: string;
  description?: string;
  /**
   * Path (`/blog/foo`) or a full absolute URL. Directus fields such as
   * `articulos.url_canonical` store absolute URLs, so both shapes must work.
   */
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
}

const SITE_NAME = "HayCancha";
const SITE_URL = "https://haycancha.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

/**
 * Resolve a canonical value that may already be absolute.
 *
 * Previously this was a bare `${SITE_URL}${canonicalPath}` concatenation. When
 * the caller passed an absolute URL (every blog post does — `url_canonical`
 * comes out of Directus fully qualified) the result was the malformed
 * `https://haycancha.comhttps://haycancha.com/blog/<slug>`, which Search
 * Console reported as "Duplicate, user has not indicated a canonical version"
 * across the whole blog.
 */
export function resolveCanonical(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;

  // Already absolute — trust it, but normalise away any trailing slash noise.
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

/**
 * Page-level SEO meta tags. Use once per route.
 *
 * Every route must render this: the static tags in `index.html` are marked
 * `data-rh="true"`, so react-helmet-async takes ownership of them on mount. A
 * route without `SeoMeta` would be left with no description at all.
 */
export function SeoMeta({
  title,
  description,
  canonicalPath,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: SeoMetaProps) {
  const fullTitle =
    title.length > 0 && !title.includes(SITE_NAME) ? `${title} | ${SITE_NAME}` : title;

  const canonical = resolveCanonical(canonicalPath);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_AR" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
