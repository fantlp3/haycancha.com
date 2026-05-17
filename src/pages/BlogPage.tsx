import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/brand/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SeoMeta } from "@/components/SeoMeta";
import {
  ArticuloCard,
  ArticuloCardSkeleton,
} from "@/components/blog/ArticuloCard";
import { CategoriaFilterBar } from "@/components/blog/CategoriaFilterBar";
import { ActiveFilterPills } from "@/components/blog/ActiveFilterPills";
import {
  useArticulosInfinite,
  useCategoriasConContenido,
  useTagBySlug,
} from "@/hooks/useArticulos";
import { CtaButton } from "@/components/brand/CtaButton";

const SKELETON_COUNT = 6;

const BlogPage = () => {
  const [params, setParams] = useSearchParams();
  const categoriaSlug = params.get("categoria");
  const tagSlug = params.get("tag");

  const filters = useMemo(
    () => ({
      categoriaSlug: categoriaSlug ?? undefined,
      tagSlug: tagSlug ?? undefined,
    }),
    [categoriaSlug, tagSlug]
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticulosInfinite(filters);

  // Only render chips for categories that currently have at least one
  // publicly-visible article (published or scheduled-due).
  const { data: categorias = [], isLoading: catsLoading } =
    useCategoriasConContenido();

  // Tag lookup for the active filter pill — only fires when `?tag=` is set.
  const { data: activeTag } = useTagBySlug(tagSlug);

  const articulos = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p),
    [data]
  );

  // Generic param mutator (used by both pills and the categoria filter bar).
  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: false });
  };

  const handleCategoriaSelect = (slug: string | null) => setParam("categoria", slug);

  const activeCategoria = categoriaSlug
    ? categorias.find((c) => c.slug === categoriaSlug)
    : null;

  // Compose active filter pills. Order matters only for visual flow.
  const pills = [
    ...(activeCategoria
      ? [
          {
            key: "cat",
            prefix: "Categoría:",
            label: activeCategoria.nombre,
            onClear: () => setParam("categoria", null),
          },
        ]
      : []),
    ...(tagSlug
      ? [
          {
            key: "tag",
            prefix: "Tag:",
            label: activeTag?.nombre ?? tagSlug,
            onClear: () => setParam("tag", null),
          },
        ]
      : []),
  ];

  // SEO: most specific first. Tag wins over categoria if both are present
  // since the tag filter narrows the list more.
  const seoTitle = tagSlug
    ? `Tag: ${activeTag?.nombre ?? tagSlug} — Blog`
    : activeCategoria
    ? `${activeCategoria.nombre} — Blog`
    : "Blog";

  // Canonical path encodes all active facets, preserving order.
  const canonicalQuery = new URLSearchParams();
  if (categoriaSlug) canonicalQuery.set("categoria", categoriaSlug);
  if (tagSlug) canonicalQuery.set("tag", tagSlug);
  const canonicalPath = canonicalQuery.toString()
    ? `/blog?${canonicalQuery.toString()}`
    : "/blog";

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <SeoMeta
        title={seoTitle}
        description={
          activeCategoria?.seo_descripcion ||
          "Artículos sobre tenis, pádel y pickleball. Técnica, equipamiento, lesiones, torneos y comunidad para jugadores de Latinoamérica."
        }
        canonicalPath={canonicalPath}
        ogType="website"
      />

      <Navbar />

      {/* Page header */}
      <section className="bg-dark text-white">
        <div className="max-w-container mx-auto px-6 lg:px-10 py-12 md:py-16">
          <p className="label-meta uppercase text-orange tracking-[3px] mb-3">
            Blog
          </p>
          <h1 className="font-display text-white text-[40px] md:text-[56px] leading-[0.95]">
            {activeCategoria
              ? activeCategoria.nombre.toUpperCase()
              : "DEPORTES DE RAQUETA EN LATINOAMÉRICA"}
            <span className="text-orange">.</span>
          </h1>
          <p className="text-white/70 text-[16px] md:text-[18px] max-w-2xl mt-4 leading-relaxed">
            {activeCategoria?.descripcion ||
              "Técnica, equipamiento, salud, torneos y comunidad. Para jugadores que quieren mejorar y entender mejor su deporte."}
          </p>
        </div>
      </section>

      {/* Filter bar — sticky under the navbar */}
      <section className="border-b border-border bg-white sticky top-[60px] z-20">
        <div className="max-w-container mx-auto px-6 lg:px-10 py-3 space-y-3">
          <CategoriaFilterBar
            categorias={categorias}
            selectedSlug={categoriaSlug}
            onSelect={handleCategoriaSelect}
            loading={catsLoading}
          />
          {/* Active filter pills row — only renders when ≥1 facet is on */}
          <ActiveFilterPills pills={pills} />
        </div>
      </section>

      {/* Grid */}
      <main className="flex-1">
        <div className="max-w-container mx-auto px-6 lg:px-10 py-10 md:py-12">
          {isError ? (
            <div className="text-center py-16">
              <p className="text-[15px] text-gray">
                No pudimos cargar los artículos. Intentá refrescar la página.
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ArticuloCardSkeleton key={i} />
              ))}
            </div>
          ) : articulos.length === 0 ? (
            <EmptyState
              filterLabel={
                activeTag?.nombre ?? tagSlug ?? activeCategoria?.nombre ?? null
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {articulos.map((a) => (
                  <ArticuloCard key={a.id} articulo={a} />
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center mt-12">
                  <CtaButton
                    type="button"
                    variant="secondary"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Cargando…" : "Cargar más"}
                  </CtaButton>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const EmptyState = ({ filterLabel }: { filterLabel: string | null }) => (
  <div className="text-center py-16 max-w-md mx-auto">
    <h2 className="font-display text-dark text-[28px] leading-tight mb-3">
      Sin artículos por ahora<span className="text-orange">.</span>
    </h2>
    <p className="text-[14px] text-gray">
      {filterLabel
        ? `Todavía no publicamos nada para "${filterLabel}". Probá con otro filtro.`
        : "Todavía no hay artículos publicados. Volvé pronto."}
    </p>
  </div>
);

export default BlogPage;
