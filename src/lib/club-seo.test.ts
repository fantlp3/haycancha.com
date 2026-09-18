import { describe, expect, it } from "vitest";
import { buildClubSeoDescription } from "./club-seo";

const base = {
  nombre: "Orbit Club Tenis&Padel",
  descripcion: null,
  telefono: "0351 380-3903",
  horario_texto: "lunes: 7:00–23:00",
  ciudad: { nombre: "Córdoba" },
  pais: { nombre: "Argentina" },
  barrio: null,
  clubes_deportes: [
    { superficie: "polvo_de_ladrillo" as const, cantidad_canchas: 3, deporte: { nombre: "Tenis" } },
    { superficie: "cemento" as const, cantidad_canchas: 2, deporte: { nombre: "Pádel" } },
  ],
};

describe("buildClubSeoDescription", () => {
  it("composes sports, place, court count, surfaces and what the page holds", () => {
    const d = buildClubSeoDescription(base);
    expect(d).toBe(
      "Orbit Club Tenis&Padel: Tenis y Pádel en Córdoba, Argentina. 5 canchas. Polvo de ladrillo y cemento. Horarios, teléfono y cómo llegar."
    );
    expect(d.length).toBeLessThanOrEqual(160);
  });

  it("includes the barrio when there is one", () => {
    const d = buildClubSeoDescription({ ...base, barrio: { nombre: "Palermo" }, ciudad: { nombre: "Buenos Aires" } });
    expect(d).toContain("Palermo, Buenos Aires");
  });

  it("degrades gracefully when only the name and place are known", () => {
    const d = buildClubSeoDescription({
      ...base,
      telefono: null,
      horario_texto: null,
      clubes_deportes: [],
    });
    expect(d).toBe("Orbit Club Tenis&Padel, en Córdoba, Argentina. Ubicación y cómo llegar.");
  });

  it("says phone only when there are no hours", () => {
    expect(buildClubSeoDescription({ ...base, horario_texto: null })).toContain(
      "Teléfono y cómo llegar."
    );
  });

  it("uses the real descripcion when Directus has one", () => {
    const d = buildClubSeoDescription({ ...base, descripcion: "Complejo con seis canchas de polvo de ladrillo y escuela para chicos." });
    expect(d).toBe("Complejo con seis canchas de polvo de ladrillo y escuela para chicos.");
  });

  it("never exceeds 160 characters and never cuts a word in half", () => {
    const d = buildClubSeoDescription({
      ...base,
      nombre: "Club Atlético y Social de Deportes de Raqueta de la Ciudad de Córdoba",
      barrio: { nombre: "Nueva Córdoba" },
      clubes_deportes: [
        { superficie: "polvo_de_ladrillo" as const, cantidad_canchas: 8, deporte: { nombre: "Tenis" } },
        { superficie: "cesped_sintetico" as const, cantidad_canchas: 4, deporte: { nombre: "Pádel" } },
        { superficie: "pista_dura" as const, cantidad_canchas: 2, deporte: { nombre: "Pickleball" } },
      ],
    });
    expect(d.length).toBeLessThanOrEqual(160);
    expect(d).not.toMatch(/\s$/);
  });

  it("truncates a long descripcion on a word boundary", () => {
    const long = "Palabra ".repeat(40).trim();
    const d = buildClubSeoDescription({ ...base, descripcion: long });
    expect(d.length).toBeLessThanOrEqual(160);
    expect(d.endsWith("…")).toBe(true);
    expect(d).not.toContain("Palab…");
  });
});
