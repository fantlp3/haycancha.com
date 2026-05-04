import { Helmet } from "react-helmet-async";

interface SeoMetaProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
}

const SITE_NAME = "HayCancha";
const SITE_URL = "https://haycancha.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

/**
 * Page-level SEO meta tags. Use once per route.
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

  const canonical = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;

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
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
