import { directus } from "./directus";
import { readItems as _readItems } from "@directus/sdk";

const readItems: any = _readItems;

export type HeroSport = "tenis" | "padel" | "pickleball";

export interface HeroImage {
  id: string;
  deporte: HeroSport;
  imagen: string;
  unsplash_url: string;
  unsplash_author: string;
  unsplash_author_url: string;
  orden: number;
}

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL as string;

/**
 * Anchos servidos para el hero. El navegador elige según viewport y DPR vía
 * `srcset`, así que un teléfono baja ~640–828 px en vez de 2000.
 *
 * Antes se pedía SIEMPRE width=2000: el home descargaba 29 imágenes de hero
 * a 2000 px = 9,5 MB en móvil, y el LCP se iba a 14,5 s. Ver HeroRotator,
 * que además ahora monta sólo una ventana de 3 imágenes en vez de todas.
 */
const HERO_WIDTHS = [640, 960, 1280, 1600, 2000] as const;

/** Ancho por defecto del `src` (fallback si el navegador ignora srcset). */
const HERO_DEFAULT_WIDTH = 1280;

export function heroImageUrl(fileId: string, width: number = HERO_DEFAULT_WIDTH): string {
  return `${DIRECTUS_URL}/assets/${fileId}?width=${width}&quality=80&format=webp`;
}

/** `srcset` con los anchos de HERO_WIDTHS, para usar junto a `sizes="100vw"`. */
export function heroImageSrcSet(fileId: string): string {
  return HERO_WIDTHS.map((w) => `${heroImageUrl(fileId, w)} ${w}w`).join(", ");
}

export async function fetchHeroImages(deporte?: HeroSport): Promise<HeroImage[]> {
  try {
    const result = await directus.request(
      readItems("hero_images", {
        fields: [
          "id",
          "deporte",
          "imagen",
          "unsplash_url",
          "unsplash_author",
          "unsplash_author_url",
          "orden",
        ],
        filter: {
          activo: { _eq: true },
          ...(deporte ? { deporte: { _eq: deporte } } : {}),
        },
        sort: ["orden"],
        limit: -1,
      })
    );
    return (result ?? []) as HeroImage[];
  } catch (err) {
    console.error("[hero-images] fetch failed:", err);
    return [];
  }
}
