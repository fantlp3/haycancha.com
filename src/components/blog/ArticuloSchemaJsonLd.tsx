import { Helmet } from "react-helmet-async";
import type { ArticuloDetail } from "@/lib/queries";

interface Props {
  articulo: ArticuloDetail;
  url: string;
}

const SITE_URL = "https://haycancha.com";
const ORG = {
  "@type": "Organization",
  name: "HayCancha",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/favicon-32x32.png`,
  },
};

/**
 * Emits four JSON-LD blocks into <head>:
 *   1. Article — base SEO + AI surfacing.
 *   2. FAQPage — when articulo.faq_blocks has entries.
 *   3. HowTo — when articulo.schema_howto_jsonld is pre-computed by editorial.
 *   4. BreadcrumbList — Inicio > Blog > Categoría > Título.
 *
 * If the article carries a pre-computed `schema_jsonld` we prefer that as
 * the Article block (it tends to be richer than what we'd derive on the fly).
 */
export const ArticuloSchemaJsonLd = ({ articulo, url }: Props) => {
  // Always build the Article schema from current data instead of trusting
  // `articulo.schema_jsonld` pre-computed by editorial — the pre-computed
  // blob may carry the fictional `author: Person` we currently keep hidden.
  // The local builder uses `author: Organization` consistently.
  const article = buildArticleSchema(articulo, url);
  const faq = buildFaqSchema(articulo);
  const howto = articulo.schema_howto_jsonld;
  const breadcrumb = buildBreadcrumbSchema(articulo);

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(article)}</script>
      {faq && <script type="application/ld+json">{JSON.stringify(faq)}</script>}
      {howto && <script type="application/ld+json">{JSON.stringify(howto)}</script>}
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
    </Helmet>
  );
};

function buildArticleSchema(a: ArticuloDetail, url: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.titulo,
    description: a.meta_descripcion || a.excerpt,
    image: a.imagen_destacada_url || undefined,
    datePublished: a.fecha_publicacion,
    dateModified: a.fecha_modificacion || a.fecha_publicacion,
    inLanguage: a.idioma,
    keywords: a.palabras_clave_secundarias?.join(", ") || undefined,
    wordCount: a.palabras || undefined,
    timeRequired: a.tiempo_lectura_min ? `PT${a.tiempo_lectura_min}M` : undefined,
    // Author is the editorial team (Organization) while fictional bylines
    // stay hidden in the rendering layer. Same identity as `publisher` here.
    author: ORG,
    publisher: ORG,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: a.categoria_principal.nombre,
  };
}

function buildFaqSchema(a: ArticuloDetail): Record<string, unknown> | null {
  // Prefer pre-computed if present, otherwise derive from faq_blocks.
  if (a.schema_faq_jsonld) return a.schema_faq_jsonld;
  if (!a.faq_blocks || a.faq_blocks.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: a.faq_blocks.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

function buildBreadcrumbSchema(a: ArticuloDetail): Record<string, unknown> {
  const items = [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    {
      "@type": "ListItem",
      position: 3,
      name: a.categoria_principal.nombre,
      item: `${SITE_URL}/blog?categoria=${a.categoria_principal.slug}`,
    },
    { "@type": "ListItem", position: 4, name: a.titulo },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
