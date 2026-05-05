export interface HomeStatsClubInput {
  ciudad: string | { id: string } | null | undefined;
  clubes_deportes?: Array<{ cantidad_canchas: number | null }> | null;
}

export interface HomeStats {
  totalClubes: number;
  totalCanchas: number;
  totalCiudades: number;
}

export function deriveHomeStats(clubs: HomeStatsClubInput[]): HomeStats {
  let totalCanchas = 0;
  const ciudades = new Set<string>();

  for (const club of clubs) {
    const ciudadId =
      typeof club.ciudad === "string" ? club.ciudad : club.ciudad?.id;
    if (ciudadId) ciudades.add(ciudadId);
    for (const cd of club.clubes_deportes ?? []) {
      totalCanchas += cd.cantidad_canchas ?? 0;
    }
  }

  return {
    totalClubes: clubs.length,
    totalCanchas,
    totalCiudades: ciudades.size,
  };
}
