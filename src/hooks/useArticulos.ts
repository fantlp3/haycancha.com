import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { directus } from "@/lib/directus";
import { readItems as _readItems, aggregate as _aggregate } from "@directus/sdk";
import {
  fetchArticulos,
  fetchArticuloBySlug,
  fetchCategorias,
  fetchArticulosRelacionados,
  type FetchArticulosOptions,
} from "@/lib/queries";
import type { Tag } from "@/lib/directus-types";

const readItems: any = _readItems;
const aggregate: any = _aggregate;

const PAGE_SIZE = 12;

type ArticulosFilters = Omit<FetchArticulosOptions, "limit" | "offset">;

/**
 * Paginated infinite-scroll feed of articles. Each page is `PAGE_SIZE` rows;
 * `fetchNextPage()` from the returned query pulls the next slice.
 *
 * Re-fetches automatically when the filter object changes (different
 * categoria/deporte/tag). The query key is structurally compared.
 */
export function useArticulosInfinite(filters: ArticulosFilters = {}) {
  return useInfiniteQuery({
    queryKey: ["articulos", "infinite", filters],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchArticulos({ ...filters, limit: PAGE_SIZE, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE,
    staleTime: 5 * 60 * 1000,
  });
}

export function useArticuloBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["articulo", slug],
    queryFn: () => fetchArticuloBySlug(slug!),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
    staleTime: 30 * 60 * 1000,
  });
}

/** Same as `useCategorias()` but filters out categories that don't have at
 *  least one publicly-visible article (published OR scheduled-due). The
 *  filter chip bar uses this to avoid offering dead-end facets.
 *
 *  Implementation: two parallel queries — full categoria list + an aggregate
 *  count of articulos grouped by categoria_principal under the public filter.
 *  Categories not present in the count are filtered out client-side. */
export function useCategoriasConContenido() {
  return useQuery({
    queryKey: ["categorias", "with-content"],
    queryFn: async () => {
      const nowIso = new Date().toISOString();
      const [categorias, counts] = await Promise.all([
        fetchCategorias(),
        directus.request(
          aggregate("articulos", {
            aggregate: { count: "*" },
            groupBy: ["categoria_principal"],
            query: {
              filter: {
                _or: [
                  { estado: { _eq: "published" } },
                  {
                    _and: [
                      { estado: { _eq: "scheduled" } },
                      { fecha_publicacion: { _lte: nowIso } },
                    ],
                  },
                ],
              },
            },
          })
        ) as Promise<Array<{ categoria_principal: string; count: string | number }>>,
      ]);
      const withContent = new Set(
        counts
          .filter((row) => Number(row.count) > 0)
          .map((row) => row.categoria_principal)
      );
      return categorias.filter((c) => withContent.has(c.id));
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Looks up a single tag by slug to render its display name in the active
 *  filter pill on /blog. Returns null until the slug is provided. */
export function useTagBySlug(slug: string | null | undefined) {
  return useQuery({
    queryKey: ["tag", "by-slug", slug],
    queryFn: async (): Promise<Tag | null> => {
      const rows = (await directus.request(
        readItems("tags", {
          fields: ["id", "slug", "nombre"],
          filter: { slug: { _eq: slug } },
          limit: 1,
        })
      )) as Tag[];
      return rows[0] ?? null;
    },
    enabled: Boolean(slug),
    staleTime: 30 * 60 * 1000,
  });
}

export function useArticulosRelacionados(
  articuloId: string | undefined,
  categoriaId: string | undefined,
  limit = 3
) {
  return useQuery({
    queryKey: ["articulos", "relacionados", articuloId, categoriaId, limit],
    queryFn: () => fetchArticulosRelacionados(articuloId!, categoriaId!, limit),
    enabled: Boolean(articuloId && categoriaId),
    staleTime: 10 * 60 * 1000,
  });
}
