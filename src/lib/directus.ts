import { createDirectus, rest } from "@directus/sdk";
import type { HayCanchaSchema } from "./directus-types";

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL;

if (!DIRECTUS_URL) {
  throw new Error("VITE_DIRECTUS_URL is not set in .env");
}

export const directus = createDirectus<HayCanchaSchema>(DIRECTUS_URL).with(rest());

/**
 * Build a public asset URL for a Directus file id.
 * Optionally pass transform params (?width=…&height=…&fit=cover&quality=…).
 */
export function assetUrl(
  fileId: string,
  params?: { width?: number; height?: number; fit?: "cover" | "contain" | "inside" | "outside"; quality?: number }
): string {
  const url = new URL(`/assets/${fileId}`, DIRECTUS_URL);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}
