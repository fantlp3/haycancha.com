import { useQuery } from "@tanstack/react-query";
import {
  fetchClubesByBarrio,
  fetchClubesByCiudad,
  fetchClubBySlug,
  fetchClubesByDeporte,
  fetchClubesByDeportes,
  fetchClubesPremium,
  searchClubes,
  fetchClubStats,
  fetchStatsByPais,
  fetchClubesInBBox,
  fetchHomeStats,
  type BBox,
} from "@/lib/queries";

export function useClubesByBarrio(barrioSlug: string | undefined) {
  return useQuery({
    queryKey: ["clubes", "barrio", barrioSlug],
    queryFn: () => fetchClubesByBarrio(barrioSlug!),
    enabled: Boolean(barrioSlug),
    staleTime: 10 * 60 * 1000,
  });
}

export function useClubesByCiudad(ciudadSlug: string | undefined) {
  return useQuery({
    queryKey: ["clubes", "ciudad", ciudadSlug],
    queryFn: () => fetchClubesByCiudad(ciudadSlug!),
    enabled: Boolean(ciudadSlug),
    staleTime: 10 * 60 * 1000,
  });
}

export function useClubBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["clubes", "detail", slug],
    queryFn: () => fetchClubBySlug(slug!),
    enabled: Boolean(slug),
    staleTime: 30 * 60 * 1000,
  });
}

export function useClubesByDeporte(deporteSlug: string | undefined) {
  return useQuery({
    queryKey: ["clubes", "deporte", deporteSlug],
    queryFn: () => fetchClubesByDeporte(deporteSlug!),
    enabled: Boolean(deporteSlug),
    staleTime: 10 * 60 * 1000,
  });
}

export function useClubesByDeportes(deporteSlugs: string[]) {
  return useQuery({
    queryKey: ["clubes", "deportes", [...deporteSlugs].sort()],
    queryFn: () => fetchClubesByDeportes(deporteSlugs),
    enabled: deporteSlugs.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

export function useClubesPremium(limit = 6) {
  return useQuery({
    queryKey: ["clubes", "premium", limit],
    queryFn: () => fetchClubesPremium(limit),
    staleTime: 30 * 60 * 1000,
  });
}

export function useSearchClubes(query: string) {
  return useQuery({
    queryKey: ["clubes", "search", query],
    queryFn: () => searchClubes(query),
    enabled: query.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}

export function useClubStats() {
  return useQuery({
    queryKey: ["stats", "clubes"],
    queryFn: fetchClubStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStatsByPais() {
  return useQuery({
    queryKey: ["stats", "pais"],
    queryFn: fetchStatsByPais,
    staleTime: 5 * 60 * 1000,
  });
}

export function useHomeStats() {
  const query = useQuery({
    queryKey: ["home-stats"],
    queryFn: fetchHomeStats,
    staleTime: 5 * 60 * 1000,
  });
  return {
    totalClubes: query.data?.totalClubes,
    totalCanchas: query.data?.totalCanchas,
    totalCiudades: query.data?.totalCiudades,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useClubesInBBox(bbox: BBox | null) {
  return useQuery({
    queryKey: [
      "clubes", "bbox",
      bbox ? `${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng}` : "none",
    ],
    queryFn: () => fetchClubesInBBox(bbox!),
    enabled: Boolean(bbox),
    staleTime: 60 * 1000,
  });
}
