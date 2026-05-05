import { describe, it, expect } from "vitest";
import { deriveHomeStats } from "./stats";

describe("deriveHomeStats", () => {
  it("returns zeros for empty input", () => {
    expect(deriveHomeStats([])).toEqual({
      totalClubes: 0,
      totalCanchas: 0,
      totalCiudades: 0,
    });
  });

  it("counts a single club with one sport", () => {
    expect(
      deriveHomeStats([
        { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 4 }] },
      ])
    ).toEqual({ totalClubes: 1, totalCanchas: 4, totalCiudades: 1 });
  });

  it("counts city once when multiple clubs share it", () => {
    const stats = deriveHomeStats([
      { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 3 }] },
      { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 5 }] },
      { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 2 }] },
    ]);
    expect(stats).toEqual({
      totalClubes: 3,
      totalCanchas: 10,
      totalCiudades: 1,
    });
  });

  it("counts distinct cities across clubs", () => {
    const stats = deriveHomeStats([
      { ciudad: "caba", clubes_deportes: [{ cantidad_canchas: 3 }] },
      { ciudad: "rosario", clubes_deportes: [{ cantidad_canchas: 2 }] },
      { ciudad: "cordoba", clubes_deportes: [{ cantidad_canchas: 1 }] },
    ]);
    expect(stats).toEqual({
      totalClubes: 3,
      totalCanchas: 6,
      totalCiudades: 3,
    });
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
});
