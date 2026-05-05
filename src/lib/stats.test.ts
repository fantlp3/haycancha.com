import { describe, it, expect } from "vitest";
import { deriveHomeStats } from "./stats";

const EMPTY_BUCKETS = { tenis: 0, padel: 0, pickleball: 0 };
const EMPTY_SPORT_COUNTRY_BUCKETS = { tenis: [], padel: [], pickleball: [] };

describe("deriveHomeStats", () => {
  it("returns zeros for empty input", () => {
    expect(deriveHomeStats([])).toEqual({
      totalClubes: 0,
      totalCanchas: 0,
      totalCiudades: 0,
      countsBySport: EMPTY_BUCKETS,
      countsByCountry: [],
      countsBySportByCountry: EMPTY_SPORT_COUNTRY_BUCKETS,
    });
  });

  it("counts a single club with one sport", () => {
    expect(
      deriveHomeStats([
        { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 4 }] },
      ])
    ).toEqual({
      totalClubes: 1,
      totalCanchas: 4,
      totalCiudades: 1,
      countsBySport: EMPTY_BUCKETS,
      countsByCountry: [],
      countsBySportByCountry: EMPTY_SPORT_COUNTRY_BUCKETS,
    });
  });

  it("counts city once when multiple clubs share it", () => {
    const stats = deriveHomeStats([
      { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 3 }] },
      { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 5 }] },
      { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 2 }] },
    ]);
    expect(stats.totalClubes).toBe(3);
    expect(stats.totalCanchas).toBe(10);
    expect(stats.totalCiudades).toBe(1);
  });

  it("counts distinct cities across clubs", () => {
    const stats = deriveHomeStats([
      { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 3 }] },
      { ciudad: "rosario", clubes_deportes: [{ cantidad_canchas: 2 }] },
      { ciudad: "cordoba", clubes_deportes: [{ cantidad_canchas: 1 }] },
    ]);
    expect(stats.totalClubes).toBe(3);
    expect(stats.totalCanchas).toBe(6);
    expect(stats.totalCiudades).toBe(3);
  });

  it("treats null cantidad_canchas as 0 alongside numeric values", () => {
    const stats = deriveHomeStats([
      {
        ciudad: "caba",
        clubes_deportes: [
          { cantidad_canchas: 4 },
          { cantidad_canchas: null },
          { cantidad_canchas: 2 },
        ],
      },
    ]);
    expect(stats.totalCanchas).toBe(6);
  });

  it("accepts ciudad as either an id string or an expanded object", () => {
    const stats = deriveHomeStats([
      { ciudad: "caba", clubes_deportes: [] },
      { ciudad: { id: "caba" }, clubes_deportes: [] },
      { ciudad: { id: "rosario" }, clubes_deportes: [] },
    ]);
    expect(stats.totalCiudades).toBe(2);
  });

  describe("countsBySport", () => {
    it("counts a club with both tenis and padel in BOTH buckets", () => {
      const stats = deriveHomeStats([
        {
          ciudad: { id: "caba" },
          clubes_deportes: [
            { cantidad_canchas: 4, deporte: { slug: "tenis" } },
            { cantidad_canchas: 2, deporte: { slug: "padel" } },
          ],
        },
      ]);
      expect(stats.countsBySport).toEqual({ tenis: 1, padel: 1, pickleball: 0 });
    });

    it("keeps pickleball at 0 when no club has it", () => {
      const stats = deriveHomeStats([
        {
          ciudad: { id: "caba" },
          clubes_deportes: [{ cantidad_canchas: 4, deporte: { slug: "tenis" } }],
        },
        {
          ciudad: { id: "caba" },
          clubes_deportes: [{ cantidad_canchas: 2, deporte: { slug: "padel" } }],
        },
      ]);
      expect(stats.countsBySport.pickleball).toBe(0);
    });

    it("counts a club only once per sport even if it has multiple junction rows for it", () => {
      const stats = deriveHomeStats([
        {
          ciudad: { id: "caba" },
          clubes_deportes: [
            { cantidad_canchas: 2, deporte: { slug: "tenis" } },
            { cantidad_canchas: 3, deporte: { slug: "tenis" } },
          ],
        },
      ]);
      expect(stats.countsBySport.tenis).toBe(1);
    });

    it("ignores unknown sport slugs", () => {
      const stats = deriveHomeStats([
        {
          ciudad: { id: "caba" },
          clubes_deportes: [{ cantidad_canchas: 4, deporte: { slug: "futbol" } }],
        },
      ]);
      expect(stats.countsBySport).toEqual(EMPTY_BUCKETS);
    });
  });

  describe("countsByCountry", () => {
    const ar = { id: "ar-id", slug: "argentina", nombre: "Argentina", bandera_emoji: "🇦🇷" };
    const mx = { id: "mx-id", slug: "mexico", nombre: "México", bandera_emoji: "🇲🇽" };
    const cl = { id: "cl-id", slug: "chile", nombre: "Chile", bandera_emoji: "🇨🇱" };

    it("groups clubs by country and exposes flag + nombre + slug", () => {
      const stats = deriveHomeStats([
        { ciudad: { id: "caba", pais: ar }, clubes_deportes: [] },
        { ciudad: { id: "cdmx", pais: mx }, clubes_deportes: [] },
        { ciudad: { id: "rosario", pais: ar }, clubes_deportes: [] },
      ]);
      expect(stats.countsByCountry).toEqual([
        { paisSlug: "argentina", paisNombre: "Argentina", paisBandera: "🇦🇷", totalClubes: 2 },
        { paisSlug: "mexico", paisNombre: "México", paisBandera: "🇲🇽", totalClubes: 1 },
      ]);
    });

    it("does not invent countries with 0 active clubs", () => {
      const stats = deriveHomeStats([
        { ciudad: { id: "caba", pais: ar }, clubes_deportes: [] },
      ]);
      expect(stats.countsByCountry.map((c) => c.paisSlug)).toEqual(["argentina"]);
    });

    it("handles ciudad/pais defensively (string ids, missing expansion)", () => {
      const stats = deriveHomeStats([
        { ciudad: "caba", clubes_deportes: [] },
        { ciudad: { id: "caba", pais: "ar-id" }, clubes_deportes: [] },
        { ciudad: { id: "caba", pais: ar }, clubes_deportes: [] },
      ]);
      expect(stats.countsByCountry).toEqual([
        { paisSlug: "argentina", paisNombre: "Argentina", paisBandera: "🇦🇷", totalClubes: 1 },
      ]);
    });

    it("sorts desc by totalClubes with alphabetical tiebreak on paisNombre", () => {
      const stats = deriveHomeStats([
        { ciudad: { id: "caba", pais: ar }, clubes_deportes: [] },
        { ciudad: { id: "cdmx", pais: mx }, clubes_deportes: [] },
        { ciudad: { id: "stgo", pais: cl }, clubes_deportes: [] },
        { ciudad: { id: "stgo2", pais: cl }, clubes_deportes: [] },
        { ciudad: { id: "cdmx2", pais: mx }, clubes_deportes: [] },
        { ciudad: { id: "rosario", pais: ar }, clubes_deportes: [] },
      ]);
      expect(stats.countsByCountry.map((c) => c.paisSlug)).toEqual([
        "argentina",
        "chile",
        "mexico",
      ]);
    });

    it("returns null bandera when missing", () => {
      const stats = deriveHomeStats([
        {
          ciudad: { id: "x", pais: { slug: "uruguay", nombre: "Uruguay" } },
          clubes_deportes: [],
        },
      ]);
      expect(stats.countsByCountry[0].paisBandera).toBeNull();
    });
  });

  describe("countsBySportByCountry", () => {
    const ar = { id: "ar-id", slug: "argentina", nombre: "Argentina", bandera_emoji: "🇦🇷" };
    const mx = { id: "mx-id", slug: "mexico", nombre: "México", bandera_emoji: "🇲🇽" };

    it("buckets a club into every sport's country map", () => {
      const stats = deriveHomeStats([
        {
          ciudad: { id: "caba", pais: ar },
          clubes_deportes: [
            { deporte: { slug: "tenis" } },
            { deporte: { slug: "padel" } },
          ],
        },
      ]);
      expect(stats.countsBySportByCountry.tenis).toEqual([
        { paisSlug: "argentina", paisNombre: "Argentina", paisBandera: "🇦🇷", totalClubes: 1 },
      ]);
      expect(stats.countsBySportByCountry.padel).toEqual([
        { paisSlug: "argentina", paisNombre: "Argentina", paisBandera: "🇦🇷", totalClubes: 1 },
      ]);
      expect(stats.countsBySportByCountry.pickleball).toEqual([]);
    });

    it("sums multiple clubs in the same country and sport", () => {
      const stats = deriveHomeStats([
        { ciudad: { id: "caba", pais: ar }, clubes_deportes: [{ deporte: { slug: "tenis" } }] },
        { ciudad: { id: "rosario", pais: ar }, clubes_deportes: [{ deporte: { slug: "tenis" } }] },
      ]);
      expect(stats.countsBySportByCountry.tenis).toEqual([
        { paisSlug: "argentina", paisNombre: "Argentina", paisBandera: "🇦🇷", totalClubes: 2 },
      ]);
    });

    it("counts a club only once per (sport, country) even with duplicate junction rows", () => {
      const stats = deriveHomeStats([
        {
          ciudad: { id: "caba", pais: ar },
          clubes_deportes: [
            { deporte: { slug: "tenis" } },
            { deporte: { slug: "tenis" } },
          ],
        },
      ]);
      expect(stats.countsBySportByCountry.tenis[0].totalClubes).toBe(1);
    });

    it("sorts desc by totalClubes with alphabetical tiebreak", () => {
      const stats = deriveHomeStats([
        { ciudad: { id: "caba", pais: ar }, clubes_deportes: [{ deporte: { slug: "padel" } }] },
        { ciudad: { id: "cdmx", pais: mx }, clubes_deportes: [{ deporte: { slug: "padel" } }] },
        { ciudad: { id: "rosario", pais: ar }, clubes_deportes: [{ deporte: { slug: "padel" } }] },
      ]);
      expect(stats.countsBySportByCountry.padel.map((c) => c.paisSlug)).toEqual([
        "argentina",
        "mexico",
      ]);
    });

    it("does not include countries with 0 clubs for that sport", () => {
      const stats = deriveHomeStats([
        { ciudad: { id: "caba", pais: ar }, clubes_deportes: [{ deporte: { slug: "tenis" } }] },
      ]);
      expect(stats.countsBySportByCountry.padel).toEqual([]);
      expect(stats.countsBySportByCountry.pickleball).toEqual([]);
    });

    it("ignores clubs without an expanded pais", () => {
      const stats = deriveHomeStats([
        { ciudad: "caba", clubes_deportes: [{ deporte: { slug: "tenis" } }] },
      ]);
      expect(stats.countsBySportByCountry.tenis).toEqual([]);
    });
  });
});
