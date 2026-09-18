/**
 * Parses `clubes.horario_texto` into schema.org OpeningHoursSpecification.
 *
 * Why this exists: the structured `horario_apertura` / `horario_cierre` columns
 * are filled on 2 of 2.297 active clubs (0,1 %), so SchemaOrgClub was emitting
 * opening hours almost never. `horario_texto` is filled on 1.447 (63 %), and
 * 1.430 of those (98,8 %) use the per-day shape Google Places returns:
 *
 *     lunes: 7:00–2:00          Monday: 8:00 AM – 10:00 PM
 *     martes: 7:00–2:00         Tuesday: 8:00 AM – 10:00 PM
 *     …                         …
 *
 * with four special values across the whole corpus: "Abierto 24 horas",
 * "Cerrado", "Open 24 hours", "Closed".
 *
 * Anything this parser does not recognise returns null — the page still shows
 * `horario_texto` verbatim, we just don't claim structured hours we aren't
 * sure of. Never guess: a wrong openingHoursSpecification is worse than none.
 */

/** Day names as schema.org expects them. */
export type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: DayName[];
  opens: string;
  closes: string;
}

const DAY_ORDER: DayName[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_LOOKUP: Record<string, DayName> = {
  lunes: "Monday",
  martes: "Tuesday",
  miercoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sabado: "Saturday",
  domingo: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** Lowercase and strip accents so "miércoles" and "miercoles" both match. */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const CLOSED = /^(cerrado|closed)$/;
const ALL_DAY = /^(abierto\s+24\s+horas|open\s+24\s+hours)$/;

/** Any dash variant Google Places uses, with optional surrounding spaces. */
const RANGE_SEPARATOR = /\s*[–—−-]\s*/;

/**
 * "7:00" → "07:00"  ·  "8:00 AM" → "08:00"  ·  "10:00 PM" → "22:00"
 * "24:00" → "23:59" (schema.org validators reject hour 24).
 */
function parseTime(raw: string): string | null {
  const s = normalize(raw).replace(/\./g, "").replace(/\s+/g, " ");
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m|p\.m)?$/);
  if (!m) return null;

  let hour = Number(m[1]);
  const minute = Number(m[2] ?? "0");
  const meridiem = m[3]?.[0];

  if (Number.isNaN(hour) || Number.isNaN(minute) || minute > 59) return null;

  if (meridiem === "p" && hour < 12) hour += 12;
  if (meridiem === "a" && hour === 12) hour = 0;

  if (hour === 24 && minute === 0) return "23:59";
  if (hour > 23) return null;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

interface DayRange {
  day: DayName;
  opens: string;
  closes: string;
}

/** Splits one day's value into ranges; returns [] for a closed day. */
function parseValue(value: string): Array<{ opens: string; closes: string }> | null {
  const v = normalize(value);
  if (v.length === 0) return null;
  if (CLOSED.test(v)) return [];
  if (ALL_DAY.test(v)) return [{ opens: "00:00", closes: "23:59" }];

  const out: Array<{ opens: string; closes: string }> = [];
  for (const chunk of value.split(",")) {
    const parts = chunk.split(RANGE_SEPARATOR).filter((p) => p.trim().length > 0);
    if (parts.length !== 2) return null;
    const opens = parseTime(parts[0]);
    const closes = parseTime(parts[1]);
    if (!opens || !closes) return null;
    out.push({ opens, closes });
  }
  return out.length > 0 ? out : null;
}

/**
 * Parse the whole field. Returns null when no line is recognisable, so the
 * caller can simply omit the property.
 */
export function parseHorarioTexto(
  text: string | null | undefined
): OpeningHoursSpecification[] | null {
  if (!text) return null;

  const ranges: DayRange[] = [];
  let sawDayLine = false;

  for (const line of text.split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;

    const day = DAY_LOOKUP[normalize(line.slice(0, colon))];
    if (!day) continue;

    sawDayLine = true;
    const parsed = parseValue(line.slice(colon + 1));
    if (parsed === null) return null; // an unparseable day makes the whole field untrustworthy
    for (const r of parsed) ranges.push({ day, ...r });
  }

  if (!sawDayLine || ranges.length === 0) return null;

  // Collapse days that share the same hours into one entry, keeping Mon–Sun order.
  const byHours = new Map<string, DayName[]>();
  for (const { day, opens, closes } of ranges) {
    const key = `${opens}|${closes}`;
    const days = byHours.get(key);
    if (days) {
      if (!days.includes(day)) days.push(day);
    } else {
      byHours.set(key, [day]);
    }
  }

  return [...byHours.entries()].map(([key, days]) => {
    const [opens, closes] = key.split("|");
    return {
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: DAY_ORDER.filter((d) => days.includes(d)),
      opens,
      closes,
    };
  });
}
