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

export function heroImageUrl(fileId: string): string {
  return `${DIRECTUS_URL}/assets/${fileId}?width=2000&quality=80&format=webp`;
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
