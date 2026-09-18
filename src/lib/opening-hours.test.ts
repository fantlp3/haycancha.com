import { describe, expect, it } from "vitest";
import { parseHorarioTexto } from "./opening-hours";

const perDay = (hours: string) =>
  ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    .map((d) => `${d}: ${hours}`)
    .join("\n");

describe("parseHorarioTexto — Google Places, Spanish", () => {
  it("collapses seven identical days into one entry", () => {
    expect(parseHorarioTexto(perDay("9:00–21:00"))).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ]);
  });

  it("keeps an overnight range as-is", () => {
    // 7:00–2:00 means it closes after midnight; schema.org allows closes < opens.
    const [spec] = parseHorarioTexto(perDay("7:00–2:00"))!;
    expect(spec.opens).toBe("07:00");
    expect(spec.closes).toBe("02:00");
  });

  it("maps 24:00 to 23:59", () => {
    expect(parseHorarioTexto(perDay("8:00–24:00"))![0].closes).toBe("23:59");
  });

  it('expands "Abierto 24 horas"', () => {
    const [spec] = parseHorarioTexto(perDay("Abierto 24 horas"))!;
    expect(spec.opens).toBe("00:00");
    expect(spec.closes).toBe("23:59");
  });

  it('omits days marked "Cerrado"', () => {
    const text = [
      "lunes: 9:00–21:00",
      "martes: 9:00–21:00",
      "miércoles: 9:00–21:00",
      "jueves: 9:00–21:00",
      "viernes: 9:00–21:00",
      "sábado: 9:00–21:00",
      "domingo: Cerrado",
    ].join("\n");
    const specs = parseHorarioTexto(text)!;
    expect(specs).toHaveLength(1);
    expect(specs[0].dayOfWeek).not.toContain("Sunday");
    expect(specs[0].dayOfWeek).toHaveLength(6);
  });

  it("groups days that differ into separate entries, in Mon–Sun order", () => {
    const text = [
      "lunes: 7:00–23:00",
      "martes: 7:00–23:00",
      "miércoles: 7:00–23:00",
      "jueves: 7:00–23:00",
      "viernes: 7:00–23:00",
      "sábado: 8:00–22:00",
      "domingo: 8:00–22:00",
    ].join("\n");
    const specs = parseHorarioTexto(text)!;
    expect(specs).toHaveLength(2);
    expect(specs[0].dayOfWeek).toEqual([
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    ]);
    expect(specs[1].dayOfWeek).toEqual(["Saturday", "Sunday"]);
  });

  it("handles unaccented day names", () => {
    expect(parseHorarioTexto("miercoles: 9:00–21:00")![0].dayOfWeek).toEqual(["Wednesday"]);
  });
});

describe("parseHorarioTexto — Google Places, English", () => {
  it("converts 12-hour times", () => {
    const text = [
      "Monday: 8:00 AM – 10:00 PM",
      "Tuesday: 8:00 AM – 10:00 PM",
    ].join("\n");
    const [spec] = parseHorarioTexto(text)!;
    expect(spec.opens).toBe("08:00");
    expect(spec.closes).toBe("22:00");
    expect(spec.dayOfWeek).toEqual(["Monday", "Tuesday"]);
  });

  it("treats 12:00 AM as midnight and 12:00 PM as noon", () => {
    const [spec] = parseHorarioTexto("Monday: 12:00 AM – 12:00 PM")!;
    expect(spec.opens).toBe("00:00");
    expect(spec.closes).toBe("12:00");
  });

  it('expands "Open 24 hours"', () => {
    const [spec] = parseHorarioTexto("Monday: Open 24 hours")!;
    expect(spec.opens).toBe("00:00");
    expect(spec.closes).toBe("23:59");
  });

  it('omits days marked "Closed"', () => {
    expect(parseHorarioTexto("Monday: 9:00 AM – 5:00 PM\nSunday: Closed")![0].dayOfWeek)
      .toEqual(["Monday"]);
  });
});

describe("parseHorarioTexto — refuses what it cannot read", () => {
  const unreadable = [
    "Lun a Dom 8 a 23 hs",
    "Lun a Sáb 10 a 21 hs (Dom cerrado)",
    "Lun-Vie 7-23, Sáb 7-22, Dom 8-22",
    "Consultar por teléfono",
    "",
  ];
  it.each(unreadable)("%s → null", (text) => {
    expect(parseHorarioTexto(text)).toBeNull();
  });

  it("returns null for null/undefined", () => {
    expect(parseHorarioTexto(null)).toBeNull();
    expect(parseHorarioTexto(undefined)).toBeNull();
  });

  it("returns null when one day is unreadable, rather than publishing a partial week", () => {
    const text = "lunes: 9:00–21:00\nmartes: a convenir";
    expect(parseHorarioTexto(text)).toBeNull();
  });

  it("returns null for a day with an impossible time", () => {
    expect(parseHorarioTexto("lunes: 9:00–99:00")).toBeNull();
  });
});
