export type SportKey = "tenis" | "padel" | "pickleball" | "default";

/**
 * Returns the sport context implied by a URL pathname:
 *   /tenis*      -> "tenis"
 *   /padel*      -> "padel"
 *   /pickleball* -> "pickleball"
 *   anything else -> "default"
 *
 * Used by LogoCircular in the footer to theme its outer arcs by route.
 */
export function getSportFromPath(pathname: string): SportKey {
  if (pathname.startsWith("/tenis")) return "tenis";
  if (pathname.startsWith("/padel")) return "padel";
  if (pathname.startsWith("/pickleball")) return "pickleball";
  return "default";
}
