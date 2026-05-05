export interface ClubPaisInput {
  id?: string;
  slug?: string | null;
  nombre?: string | null;
  bandera_emoji?: string | null;
}

export interface ClubCiudadInput {
  id?: string;
  pais?: string | ClubPaisInput | null;
}

export interface ClubSportInput {
  cantidad_canchas?: number | null;
  deporte?: string | { slug?: string | null } | null;
}

export interface HomeStatsClubInput {
  ciudad: string | ClubCiudadInput | null | undefined;
  clubes_deportes?: ClubSportInput[] | null;
}

export interface CountryCount {
  paisSlug: string;
  paisNombre: string;
  paisBandera: string | null;
  totalClubes: number;
}

export interface HomeStats {
  totalClubes: number;
  totalCanchas: number;
  totalCiudades: number;
  countsBySport: { tenis: number; padel: number; pickleball: number };
  countsByCountry: CountryCount[];
}

export function deriveHomeStats(clubs: HomeStatsClubInput[]): HomeStats {
  let totalCanchas = 0;
  const ciudades = new Set<string>();
  const countsBySport = { tenis: 0, padel: 0, pickleball: 0 };
  const countryMap = new Map<string, CountryCount>();

  for (const club of clubs) {
    const ciudad =
      typeof club.ciudad === "string" ? null : club.ciudad ?? null;
    const ciudadId =
      typeof club.ciudad === "string" ? club.ciudad : ciudad?.id;
    if (ciudadId) ciudades.add(ciudadId);

    const pais =
      ciudad && typeof ciudad.pais !== "string" ? ciudad.pais ?? null : null;
    if (pais?.slug) {
      const existing = countryMap.get(pais.slug);
      if (existing) {
        existing.totalClubes += 1;
      } else {
        countryMap.set(pais.slug, {
          paisSlug: pais.slug,
          paisNombre: pais.nombre ?? pais.slug,
          paisBandera: pais.bandera_emoji ?? null,
          totalClubes: 1,
        });
      }
    }

    const seenSports = new Set<"tenis" | "padel" | "pickleball">();
    for (const cd of club.clubes_deportes ?? []) {
      totalCanchas += cd.cantidad_canchas ?? 0;
      const slug =
        typeof cd.deporte === "string" ? null : cd.deporte?.slug ?? null;
      if (slug === "tenis" || slug === "padel" || slug === "pickleball") {
        seenSports.add(slug);
      }
    }
    for (const slug of seenSports) {
      countsBySport[slug] += 1;
    }
  }

  const countsByCountry = Array.from(countryMap.values())
    .filter((c) => c.totalClubes > 0)
    .sort(
      (a, b) =>
        b.totalClubes - a.totalClubes ||
        a.paisNombre.localeCompare(b.paisNombre, "es", { sensitivity: "base" })
    );

  return {
    totalClubes: clubs.length,
    totalCanchas,
    totalCiudades: ciudades.size,
    countsBySport,
    countsByCountry,
  };
}
