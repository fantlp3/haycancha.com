import type { ViewMode } from "@/components/search/ViewToggle";

/**
 * Returns the device-appropriate default for /canchas: `grid` on desktop
 * (md+), `list` on mobile. SSR-safe — falls back to `list` if window is
 * unavailable. The active breakpoint matches Tailwind's `md` (768px).
 *
 * Use this at the call site of any navigation into /canchas (Hero search,
 * Navbar/Footer links, city chips) to inject `?view=grid|list`. Do not call
 * inside SearchPage itself — that's where the URL is consumed, not produced.
 */
export const getDefaultView = (): Exclude<ViewMode, "map"> => {
  if (typeof window === "undefined") return "list";
  return window.matchMedia("(min-width: 768px)").matches ? "grid" : "list";
};

/** Appends `?view=grid|list` (or merges into existing query) to a /canchas path. */
export const withDefaultView = (path: string): string => {
  const view = getDefaultView();
  const [base, existing] = path.split("?");
  const params = new URLSearchParams(existing ?? "");
  if (!params.has("view")) params.set("view", view);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
};
