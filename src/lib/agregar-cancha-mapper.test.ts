import { describe, expect, it } from "vitest";
import { toSubmission, type SubmissionFormInput } from "./agregar-cancha-mapper";

const baseForm = (
  overrides: Partial<SubmissionFormInput> = {}
): SubmissionFormInput => ({
  submitter_role: "owner",
  nombre: "Club Atlético Test",
  tipo: "Club",
  descripcion: "",
  deportes: {
    tenis: { cantidad: 2, superficies: ["Cemento"] },
  },
  iluminacion: false,
  tipo_instalacion: null,
  servicios: {},
  url_reserva: "",
  ubicacion: {
    pais: "Argentina",
    provincia: "Buenos Aires",
    ciudad: "CABA",
    barrio: "",
    direccion: "Av. Santa Fe 1234",
    entre_calle_1: "",
    entre_calle_2: "",
    lat: -34.6,
    lng: -58.4,
  },
  contacto: {
    nombre_apellido: "Juan Pérez",
    email: "juan@example.com",
    telefono: "+54 11 1234 5678",
    whatsapp: "",
    website: "",
    instagram: "",
  },
  horarios: {
    lunes: { abierto: true, desde: "08:00", hasta: "22:00" },
    martes: { abierto: true, desde: "08:00", hasta: "22:00" },
    miercoles: { abierto: true, desde: "08:00", hasta: "22:00" },
    jueves: { abierto: true, desde: "08:00", hasta: "22:00" },
    viernes: { abierto: true, desde: "08:00", hasta: "22:00" },
    sabado: { abierto: true, desde: "08:00", hasta: "20:00" },
    domingo: { abierto: false, desde: "09:00", hasta: "18:00" },
    notas: "",
  },
  ...overrides,
});

describe("toSubmission — enum mappings", () => {
  it.each([
    ["Club", "club"],
    ["Complejo deportivo", "complejo"],
    ["Cancha pública", "cancha_publica"],
    ["Hotel con canchas", "hotel"],
    ["Otro", "complejo"],
  ] as const)("tipo label %s → enum %s", (label, expected) => {
    const out = toSubmission(baseForm({ tipo: label }));
    expect(out.tipo).toBe(expected);
  });

  it("unknown tipo falls back to complejo", () => {
    const out = toSubmission(baseForm({ tipo: "Garbage value not in map" }));
    expect(out.tipo).toBe("complejo");
  });

  it("submitter_role owner → dueño", () => {
    const out = toSubmission(baseForm({ submitter_role: "owner" }));
    expect(out.relacion_con_club).toBe("dueño");
  });

  it("submitter_role player → usuario_general", () => {
    const out = toSubmission(baseForm({ submitter_role: "player" }));
    expect(out.relacion_con_club).toBe("usuario_general");
  });
});

describe("toSubmission — deportes_indicados", () => {
  it("includes only selected sports, in canonical order tenis,padel,pickleball", () => {
    const out = toSubmission(
      baseForm({
        deportes: {
          pickleball: { cantidad: 1, superficies: ["Cemento"] },
          tenis: { cantidad: 1, superficies: ["Cemento"] },
        },
      })
    );
    expect(out.deportes_indicados).toEqual(["tenis", "pickleball"]);
  });

  it("includes all three when all selected", () => {
    const out = toSubmission(
      baseForm({
        deportes: {
          tenis: { cantidad: 1, superficies: ["Cemento"] },
          padel: { cantidad: 1, superficies: ["Cemento"] },
          pickleball: { cantidad: 1, superficies: ["Cemento"] },
        },
      })
    );
    expect(out.deportes_indicados).toEqual(["tenis", "padel", "pickleball"]);
  });

  it("omits deportes_indicados entirely when no sport is selected", () => {
    const out = toSubmission(baseForm({ deportes: {} }));
    expect("deportes_indicados" in out).toBe(false);
  });
});

describe("toSubmission — cantidad_canchas as per-sport sum", () => {
  it("is the SUM of every selected sport's cantidad", () => {
    const out = toSubmission(
      baseForm({
        deportes: {
          tenis: { cantidad: 4, superficies: ["Polvo de ladrillo"] },
          padel: { cantidad: 2, superficies: ["Cemento"] },
        },
      })
    );
    expect(out.cantidad_canchas).toBe(6);
  });

  it("equals the single-sport cantidad when only one sport selected", () => {
    const out = toSubmission(
      baseForm({
        deportes: { tenis: { cantidad: 3, superficies: ["Cemento"] } },
      })
    );
    expect(out.cantidad_canchas).toBe(3);
  });

  it("is omitted entirely when no sport is selected", () => {
    const out = toSubmission(baseForm({ deportes: {} }));
    expect("cantidad_canchas" in out).toBe(false);
  });
});

describe("toSubmission — notas_remitente per-sport breakdown", () => {
  it("emits the 4-tenis / 2-padel example with surfaces in lowercase", () => {
    const out = toSubmission(
      baseForm({
        deportes: {
          tenis: { cantidad: 4, superficies: ["Polvo de ladrillo"] },
          padel: { cantidad: 2, superficies: ["Cemento"] },
        },
      })
    );
    const notas = out.notas_remitente ?? "";
    expect(notas).toContain("Tenis: 4 canchas (polvo de ladrillo).");
    expect(notas).toContain("Pádel: 2 canchas (cemento).");
  });

  it("uses singular 'cancha' when cantidad is 1", () => {
    const out = toSubmission(
      baseForm({
        deportes: { padel: { cantidad: 1, superficies: ["Cemento"] } },
      })
    );
    expect(out.notas_remitente ?? "").toContain("Pádel: 1 cancha (cemento).");
  });

  it("joins multiple surfaces with comma-space inside the parens", () => {
    const out = toSubmission(
      baseForm({
        deportes: {
          tenis: {
            cantidad: 6,
            superficies: ["Polvo de ladrillo", "Cemento", "Césped sintético"],
          },
        },
      })
    );
    expect(out.notas_remitente ?? "").toContain(
      "Tenis: 6 canchas (polvo de ladrillo, cemento, césped sintético)."
    );
  });

  it("skips sports that are not selected (no zero-cantidad lines)", () => {
    const out = toSubmission(
      baseForm({
        deportes: { tenis: { cantidad: 4, superficies: ["Cemento"] } },
      })
    );
    const notas = out.notas_remitente ?? "";
    expect(notas).not.toContain("Pádel:");
    expect(notas).not.toContain("Pickleball:");
  });

  it("keeps the other notas_remitente lines alongside the per-sport breakdown", () => {
    const out = toSubmission(
      baseForm({
        descripcion: "Un lindo club",
        iluminacion: true,
        tipo_instalacion: "outdoor",
        servicios: { vestuarios: true, estacionamiento: true, bar: false },
        url_reserva: "https://reservas.example.com",
        ubicacion: {
          ...baseForm().ubicacion,
          entre_calle_1: "Callao",
          entre_calle_2: "Pueyrredón",
        },
        contacto: {
          ...baseForm().contacto,
          whatsapp: "+54 11 9876 5432",
          instagram: "miclub",
        },
        horarios: {
          ...baseForm().horarios,
          notas: "Cerrado feriados",
        },
      })
    );
    const notas = out.notas_remitente ?? "";
    expect(notas).toContain("Descripción: Un lindo club");
    expect(notas).toContain("Tenis: 2 canchas (cemento).");
    expect(notas).toContain("Iluminación nocturna: sí");
    expect(notas).toContain("Tipo de instalación: Outdoor");
    expect(notas).toContain("Servicios: Vestuarios, Estacionamiento");
    expect(notas).not.toContain("Bar / Restaurante");
    expect(notas).toContain("URL de reserva: https://reservas.example.com");
    expect(notas).toContain("Entre calles: Callao y Pueyrredón");
    expect(notas).toContain("WhatsApp: +54 11 9876 5432");
    expect(notas).toContain("Instagram: @miclub");
    expect(notas).toContain("Horarios:");
    expect(notas).toContain("Lun 08:00-22:00");
    expect(notas).toContain("Sáb 08:00-20:00");
    expect(notas).toContain("Dom cerrado");
    expect(notas).toContain("Notas de horarios: Cerrado feriados");
  });

  it("does NOT emit a 'Superficies:' aggregate line anymore", () => {
    const out = toSubmission(
      baseForm({
        deportes: {
          tenis: { cantidad: 4, superficies: ["Polvo de ladrillo"] },
        },
      })
    );
    expect(out.notas_remitente ?? "").not.toMatch(/^Superficies: /m);
  });

  it("always emits at least the horarios summary in notas_remitente", () => {
    const out = toSubmission(baseForm());
    expect(out.notas_remitente).toBeDefined();
    expect(out.notas_remitente).toContain("Horarios:");
  });

  it("omits iluminación line when false", () => {
    const out = toSubmission(baseForm({ iluminacion: false }));
    expect(out.notas_remitente ?? "").not.toContain("Iluminación nocturna");
  });

  it("handles a single entre_calle without crashing", () => {
    const out = toSubmission(
      baseForm({
        ubicacion: { ...baseForm().ubicacion, entre_calle_1: "Callao" },
      })
    );
    expect(out.notas_remitente ?? "").toContain("Entre calle: Callao");
  });
});

describe("toSubmission — optional-field elision", () => {
  it("never sends email_club (locked decision: do not duplicate submitter email)", () => {
    const out = toSubmission(baseForm());
    expect("email_club" in out).toBe(false);
  });

  it("omits barrio_texto, website, telefono when empty strings", () => {
    const out = toSubmission(
      baseForm({
        ubicacion: { ...baseForm().ubicacion, barrio: "" },
        contacto: {
          ...baseForm().contacto,
          website: "",
          telefono: "",
        },
      })
    );
    expect("barrio_texto" in out).toBe(false);
    expect("website" in out).toBe(false);
    expect("telefono" in out).toBe(false);
  });

  it("treats whitespace-only optional strings as empty", () => {
    const out = toSubmission(
      baseForm({
        ubicacion: { ...baseForm().ubicacion, barrio: "   " },
      })
    );
    expect("barrio_texto" in out).toBe(false);
  });

  it("omits latitud/longitud when null", () => {
    const out = toSubmission(
      baseForm({
        ubicacion: { ...baseForm().ubicacion, lat: null, lng: null },
      })
    );
    expect("latitud" in out).toBe(false);
    expect("longitud" in out).toBe(false);
  });

  it("includes lat/lng when set, with correct field renames", () => {
    const out = toSubmission(
      baseForm({
        ubicacion: { ...baseForm().ubicacion, lat: -34.6, lng: -58.4 },
      })
    );
    expect(out.latitud).toBe(-34.6);
    expect(out.longitud).toBe(-58.4);
  });

  it("trims whitespace from required string fields", () => {
    const out = toSubmission(
      baseForm({
        nombre: "  Club X  ",
        ubicacion: {
          ...baseForm().ubicacion,
          direccion: "  Av. Test 123  ",
          pais: " Argentina ",
          ciudad: " CABA ",
        },
        contacto: {
          ...baseForm().contacto,
          nombre_apellido: "  Juan Pérez  ",
          email: "  juan@example.com  ",
        },
      })
    );
    expect(out.nombre).toBe("Club X");
    expect(out.direccion).toBe("Av. Test 123");
    expect(out.pais_texto).toBe("Argentina");
    expect(out.ciudad_texto).toBe("CABA");
    expect(out.nombre_remitente).toBe("Juan Pérez");
    expect(out.email_remitente).toBe("juan@example.com");
  });

  it("renames contacto.nombre_apellido → nombre_remitente and contacto.email → email_remitente", () => {
    const out = toSubmission(baseForm());
    expect(out.nombre_remitente).toBe("Juan Pérez");
    expect(out.email_remitente).toBe("juan@example.com");
    expect("nombre_apellido" in out).toBe(false);
    expect("email" in out).toBe(false);
  });
});
