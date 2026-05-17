/**
 * Centralized human-facing date format for the blog: month name + year only.
 * Examples: "Mayo 2026", "Enero 2027".
 *
 * Capitalizes the first letter because `toLocaleDateString('es', …)` returns
 * lowercase month names ("mayo 2026" → "Mayo 2026").
 *
 * Do NOT use for Schema.org datePublished / dateModified — those are
 * machine-readable ISO 8601 and stay as `articulo.fecha_publicacion` raw.
 */
export function formatBlogDate(iso: string | undefined | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const s = d.toLocaleDateString("es", { month: "long", year: "numeric" });
    return s.replace(/^\w/, (c) => c.toUpperCase());
  } catch {
    return "";
  }
}
