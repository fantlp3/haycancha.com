import { useQuery } from "@tanstack/react-query";
import { fetchBarrioBySlug } from "@/lib/queries";

export function useBarrioBySlug(
  slug: string | undefined,
  ciudadSlug: string | undefined
) {
  return useQuery({
    queryKey: ["barrio", slug, ciudadSlug],
    queryFn: () => fetchBarrioBySlug(slug!, ciudadSlug!),
    enabled: Boolean(slug) && Boolean(ciudadSlug),
    staleTime: 60 * 60 * 1000,
  });
}
