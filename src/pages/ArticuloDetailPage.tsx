import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { Navbar } from "@/components/brand/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SeoMeta } from "@/components/SeoMeta";
import { Breadcrumb } from "@/components/search/Breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useArticuloBySlug, useArticulosRelacionados } from "@/hooks/useArticulos";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticuloContent } from "@/components/blog/ArticuloContent";
import { EditorialTeamCard } from "@/components/blog/EditorialTeamCard";
import { EDITORIAL_TEAM } from "@/lib/editorial";
import { formatBlogDate } from "@/lib/date";
import { SharePanel } from "@/components/blog/SharePanel";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ArticuloSchemaJsonLd } from "@/components/blog/ArticuloSchemaJsonLd";
import NotFound from "./NotFound";

const SITE_URL = "https://haycancha.com";

const ArticuloDetailPage = () => {
  const { slug } = useParams();
  const { data: articulo, isLoading, isError } = useArticuloBySlug(slug);
  const relacionados = useArticulosRelacionados(
    articulo?.id,
    typeof articulo?.categoria_principal === "string"
      ? articulo?.categoria_principal
      : articulo?.categoria_principal.id,
    3
  );

  if (isLoading) return <ArticuloLoadingSkeleton />;
  if (isError || !articulo) return <NotFound />;

  const url = `${SITE_URL}/blog/${articulo.slug}`;
  const cat = articulo.categoria_principal;
  const toc = articulo.table_of_contents ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <ReadingProgressBar />
      <SeoMeta
        title={articulo.meta_titulo || articulo.titulo}
        description={articulo.meta_descripcion || articulo.excerpt}
        canonicalPath={articulo.url_canonical || `/blog/${articulo.slug}`}
        ogImage={articulo.og_imagen_url || articulo.imagen_destacada_url || undefined}
        ogType="article"
      />
      <ArticuloSchemaJsonLd articulo={articulo} url={url} />

      <Navbar />

      {/* HERO — Medium-style: image first, then text block in a single
          container below. No dark band overlay. */}
      <HeroImage
        src={articulo.imagen_destacada_url}
        alt={articulo.imagen_destacada_alt}
        fallbackColor={cat.color_hex}
        fallbackTitle={articulo.titulo}
      />
      {articulo.imagen_destacada_url && articulo.imagen_destacada_credito && (
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <p className="text-xs text-muted-foreground text-right italic mt-2">
            {articulo.imagen_destacada_credito}
          </p>
        </div>
      )}

      <header className="max-w-container mx-auto px-6 lg:px-10 pt-8 md:pt-12">
        <div className="max-w-[860px] mx-auto">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Blog", href: "/blog" },
              {
                label: cat.nombre,
                href: `/blog?categoria=${cat.slug}`,
              },
            ]}
          />
          <div className="mt-5">
            <Badge
              variant="secondary"
              className="bg-orange/10 text-dark hover:bg-orange/15 border-0 font-semibold text-[11px] uppercase tracking-wider"
              style={cat.color_hex ? { boxShadow: `inset 3px 0 0 ${cat.color_hex}` } : undefined}
            >
              {cat.nombre}
            </Badge>
          </div>
          <h1 className="font-display text-dark text-[34px] md:text-[44px] lg:text-[56px] leading-[1.05] mt-5">
            {articulo.titulo}
          </h1>
          {articulo.lead && (
            <p className="text-[18px] md:text-[20px] text-gray mt-6 leading-[1.55]">
              {articulo.lead}
            </p>
          )}
          {/* Meta row: author + date + read time + share. Stacked on mobile. */}
          <div className="mt-8 pb-6 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-gray">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    className="text-[11px] font-semibold"
                    style={{
                      backgroundColor: EDITORIAL_TEAM.avatar_color_bg,
                      color: EDITORIAL_TEAM.avatar_color_text,
                    }}
                  >
                    {EDITORIAL_TEAM.avatar_initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-dark font-semibold">{EDITORIAL_TEAM.name}</span>
              </div>
              <span aria-hidden className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} />
                {formatBlogDate(articulo.fecha_publicacion)}
              </span>
              {articulo.tiempo_lectura_min != null && (
                <>
                  <span aria-hidden className="text-border">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} />
                    {articulo.tiempo_lectura_min} min de lectura
                  </span>
                </>
              )}
            </div>
            <SharePanel url={url} title={articulo.titulo} />
          </div>
        </div>
      </header>

      {/* MAIN — grid: [TOC sidebar | article | share] on xl+, single col below */}
      <main className="flex-1">
        <div className="max-w-container mx-auto px-6 lg:px-10 pt-8 md:pt-10 pb-12 md:pb-14">
          <div className="xl:grid xl:grid-cols-[220px_minmax(0,1fr)_70px] xl:gap-10">
            {/* Left: TOC (xl+ only) — mobile version renders inline below */}
            <aside className="hidden xl:block">
              <TableOfContents entries={toc} />
            </aside>

            {/* Center: article */}
            <article className="max-w-[760px] mx-auto xl:mx-0">
              {/* Mobile TOC accordion */}
              <div className="xl:hidden">
                <TableOfContents entries={toc} />
              </div>

              <ArticuloContent html={articulo.contenido_html} />

              {/* FAQ section (also emitted as FAQPage JSON-LD elsewhere) */}
              {articulo.faq_blocks && articulo.faq_blocks.length > 0 && (
                <section aria-label="Preguntas frecuentes" className="mt-12">
                  <h2 className="font-display text-dark text-[28px] md:text-[32px] leading-tight mb-6">
                    Preguntas frecuentes<span className="text-orange">.</span>
                  </h2>
                  <div className="space-y-3">
                    {articulo.faq_blocks.map((q, i) => (
                      <details
                        key={i}
                        className="bg-white rounded-lg border border-border group"
                      >
                        <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-dark text-[15px] flex items-start justify-between gap-3">
                          <span>{q.question}</span>
                          <span aria-hidden className="text-orange text-[20px] leading-none shrink-0 group-open:rotate-45 transition-transform">
                            +
                          </span>
                        </summary>
                        <div className="px-5 pb-5 text-[14px] text-dark leading-relaxed">
                          {q.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Tags + deportes chips */}
              {(articulo.tags.length > 0 || articulo.deportes.length > 0) && (
                <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-2">
                  {articulo.deportes.map((d) => (
                    <Link
                      key={d.id}
                      to={`/${d.slug}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange/10 text-orange text-[12px] font-semibold uppercase tracking-wider hover:bg-orange hover:text-white transition"
                    >
                      {d.nombre}
                    </Link>
                  ))}
                  {articulo.tags.map((t) => (
                    <Link
                      key={t.id}
                      to={`/blog?tag=${t.slug}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-light border border-border text-gray text-[12px] hover:border-orange hover:text-orange transition"
                    >
                      #{t.nombre}
                    </Link>
                  ))}
                </div>
              )}

              {/* Bottom share — visible on all viewports for end-of-read prompt */}
              <div className="mt-10 pt-6 border-t border-border xl:hidden">
                <p className="label-meta uppercase text-orange tracking-[3px] text-[10px] mb-3">
                  ¿Te gustó? Compartilo
                </p>
                <SharePanel url={url} title={articulo.titulo} />
              </div>
            </article>

            {/* Right: sticky share rail (xl+ only) */}
            <aside className="hidden xl:block">
              <SharePanel
                url={url}
                title={articulo.titulo}
                variant="stacked"
              />
            </aside>
          </div>

          {/* Author bio */}
          <div className="max-w-[920px] mx-auto mt-12 md:mt-16">
            <EditorialTeamCard />
          </div>

          {/* Related */}
          {relacionados.data && relacionados.data.length > 0 && (
            <div className="max-w-container mx-auto mt-8">
              <RelatedArticles articulos={relacionados.data} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ArticuloLoadingSkeleton = () => (
  <div className="min-h-screen flex flex-col bg-light">
    <Navbar />
    <section className="bg-dark py-12 md:py-16">
      <div className="max-w-container mx-auto px-6 lg:px-10 space-y-4">
        <div className="h-3 w-48 bg-white/10 animate-pulse rounded" />
        <div className="h-6 w-32 bg-white/10 animate-pulse rounded" />
        <div className="h-12 w-3/4 bg-white/10 animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-white/10 animate-pulse rounded" />
      </div>
    </section>
    <div className="max-w-container mx-auto px-6 lg:px-10 py-12">
      <div className="max-w-[760px] mx-auto space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-muted animate-pulse rounded"
            style={{ width: `${60 + ((i * 7) % 35)}%` }}
          />
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

/**
 * Hero image. Renders the featured image as the page's first element (LCP),
 * full-width-ish capped by the container. Falls back to a solid block in the
 * category color with the title centered when:
 *   - `src` is null/empty
 *   - the image fails to load (onError)
 */
interface HeroImageProps {
  src: string | null | undefined;
  alt: string;
  fallbackColor?: string | null;
  fallbackTitle: string;
}
const HeroImage = ({ src, alt, fallbackColor, fallbackTitle }: HeroImageProps) => {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  // Aspect + max-height combo. The aspect-ratio sets baseline proportions
  // and max-height caps how tall the hero can be on any viewport so it
  // never eats the whole first scroll. `object-cover` crops the overflow.
  const sizeClass =
    "w-full aspect-[4/3] md:aspect-[16/9] max-h-[240px] md:max-h-[280px] xl:max-h-[380px]";

  if (showFallback) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center px-6 lg:px-10 overflow-hidden`}
        style={{ backgroundColor: fallbackColor || "#1A1B22" }}
        aria-label={alt}
      >
        <span className="font-display text-white text-[24px] md:text-[36px] lg:text-[44px] leading-[1.05] text-center max-w-3xl">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      onError={() => setFailed(true)}
      className={`${sizeClass} object-cover`}
    />
  );
};

export default ArticuloDetailPage;
