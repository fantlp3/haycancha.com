import { describe, expect, it } from "vitest";
import { filterClubs, EMPTY_FACETS } from "./filter";
import type { ClubCard } from "./directus-types";

const baseClub = (overrides: Partial<ClubCard>): ClubCard =>
  ({
    id: "1",
    nombre: "Club X",
    slug: "club-x",
    tipo: "club",
    es_premium: false,
    iluminacion: false,
    vestuarios: false,
    estacionamiento: false,
    bar_restaurante: false,
    clases: false,
    alquiler_raquetas: false,
    accesibilidad: false,
    reserva_online: false,
    foto_portada: null,
    pais: { nombre: "Argentina", slug: "argentina" },
    barrio: null,
    ciudad: { nombre: "Buenos Aires", slug: "buenos-aires" },
    clubes_deportes: [],
    ...overrides,
  } as ClubCard);

describe("filterClubs", () => {
  it("OR semantics within surfaces — at least one matching superficie passes the club", () => {
    const club = baseClub({
      id: "c1",
      clubes_deportes: [
        { deporte: { slug: "tenis" }, superficie: "polvo_de_ladrillo" },
        { deporte: { slug: "tenis" }, superficie: "cemento" },
      ],
    });

    const matched = filterClubs([club], {
      ...EMPTY_FACETS,
      surfaces: ["cemento"],
    });
    expect(matched).toHaveLength(1);

    const notMatched = filterClubs([club], {
      ...EMPTY_FACETS,
      surfaces: ["cristal"],
    });
    expect(notMatched).toHaveLength(0);
  });

  it("AND semantics within services — every selected flag must be true on the club", () => {
    const club = baseClub({
      id: "c2",
      iluminacion: true,
      vestuarios: false,
    });

    const both = filterClubs([club], {
      ...EMPTY_FACETS,
      services: ["Iluminación nocturna", "Vestuarios"],
    });
    expect(both).toHaveLength(0);

    const onlyOne = filterClubs([club], {
      ...EMPTY_FACETS,
      services: ["Iluminación nocturna"],
    });
    expect(onlyOne).toHaveLength(1);
  });

  it("Sport + Surface combined: requires the SAME junction row to match both", () => {
    const club = baseClub({
      id: "c3",
      clubes_deportes: [
        { deporte: { slug: "tenis" }, superficie: "polvo_de_ladrillo" },
        { deporte: { slug: "padel" }, superficie: "cristal" },
      ],
    });
    const result = filterClubs([club], {
      ...EMPTY_FACETS,
      sports: ["tenis"],
      surfaces: ["cristal"],
    });
    expect(result).toHaveLength(0);
  });

  it("Sport + Surface combined: matches when a single row has both", () => {
    const club = baseClub({
      id: "c4",
      clubes_deportes: [
        { deporte: { slug: "tenis" }, superficie: "cristal" },
      ],
    });
    const result = filterClubs([club], {
      ...EMPTY_FACETS,
      sports: ["tenis"],
      surfaces: ["cristal"],
    });
    expect(result).toHaveLength(1);
  });

  it("Sport-only filter accepts any surface on the matching sport row", () => {
    const club = baseClub({
      id: "c5",
      clubes_deportes: [
        { deporte: { slug: "tenis" }, superficie: "cemento" },
      ],
    });
    const result = filterClubs([club], { ...EMPTY_FACETS, sports: ["tenis"] });
    expect(result).toHaveLength(1);
  });

  it("returns all clubs when no facets are selected", () => {
    const clubs = [
      baseClub({ id: "a" }),
      baseClub({ id: "b", iluminacion: true }),
      baseClub({ id: "c", clubes_deportes: [{ deporte: { slug: "padel" }, superficie: "cristal" }] }),
    ];
    const result = filterClubs(clubs, EMPTY_FACETS);
    expect(result).toHaveLength(3);
    expect(result.map((c) => c.id)).toEqual(["a", "b", "c"]);
  });
});
