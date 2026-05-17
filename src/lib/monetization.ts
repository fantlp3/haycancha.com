/**
 * Centralized monetization config for the blog.
 *
 * AdSense is gated by env var: `VITE_ADSENSE_PUBLISHER_ID`. If it isn't set,
 * `adsense.enabled` is false and every Ad-related marker degrades to a
 * placeholder. Slot IDs are env-overridable so dev can mock without touching
 * code.
 *
 * TTP (TennisTrainingPro) and affiliates aren't gated — they're brand CTAs
 * with no third-party JS. Keep this file the single source of truth so the
 * markers in ArticuloMarkers.tsx, TrackedLink targets, and any future
 * sponsorship landing only need to update one map.
 */

interface AffiliateProduct {
  name: string;
  price: string;
  image: string;
  url: string;
}

export const MONETIZATION = {
  adsense: {
    enabled: Boolean(import.meta.env.VITE_ADSENSE_PUBLISHER_ID),
    publisherId: (import.meta.env.VITE_ADSENSE_PUBLISHER_ID as string | undefined) || null,
    slotIds: {
      AD_SLOT_1: (import.meta.env.VITE_ADSENSE_SLOT_1 as string | undefined) || null,
      AD_SLOT_2: (import.meta.env.VITE_ADSENSE_SLOT_2 as string | undefined) || null,
      AD_SLOT_3: (import.meta.env.VITE_ADSENSE_SLOT_3 as string | undefined) || null,
    },
  },

  ttp: {
    baseUrl: "https://tennistrainingpro.com",
    contextMap: {
      tecnica: "?utm_source=haycancha&utm_medium=blog&utm_campaign=tecnica",
      fisico: "?utm_source=haycancha&utm_medium=blog&utm_campaign=fisico",
      entrenamiento:
        "?utm_source=haycancha&utm_medium=blog&utm_campaign=entrenamiento",
      mental: "?utm_source=haycancha&utm_medium=blog&utm_campaign=mental",
    } as const satisfies Record<string, string>,
    copyMap: {
      tecnica: "Llevá tu técnica al siguiente nivel con TennisTrainingPro",
      fisico: "Sumá preparación física específica con TennisTrainingPro",
      entrenamiento: "Programas de entrenamiento estructurados",
      mental: "Trabajá el aspecto mental del juego",
    } as const satisfies Record<string, string>,
  },

  affiliates: {
    sampleProducts: {
      raquetas: [
        { name: "Wilson Pro Staff RF97", price: "USD 280", image: "/products/sample-racket-1.jpg", url: "#" },
        { name: "Babolat Pure Aero", price: "USD 250", image: "/products/sample-racket-2.jpg", url: "#" },
        { name: "Head Speed Pro", price: "USD 240", image: "/products/sample-racket-3.jpg", url: "#" },
      ],
      palas: [
        { name: "Bullpadel Vertex 03", price: "USD 280", image: "/products/sample-pala-1.jpg", url: "#" },
        { name: "Adidas Metalbone", price: "USD 300", image: "/products/sample-pala-2.jpg", url: "#" },
        { name: "Head Delta Pro", price: "USD 220", image: "/products/sample-pala-3.jpg", url: "#" },
      ],
      calzado: [
        { name: "Asics Gel Resolution", price: "USD 140", image: "/products/sample-shoe-1.jpg", url: "#" },
        { name: "Babolat Jet Mach", price: "USD 130", image: "/products/sample-shoe-2.jpg", url: "#" },
        { name: "Nike Vapor Pro", price: "USD 150", image: "/products/sample-shoe-3.jpg", url: "#" },
      ],
      encordados: [
        { name: "Luxilon Alu Power 125", price: "USD 18", image: "/products/sample-string-1.jpg", url: "#" },
        { name: "Babolat RPM Blast", price: "USD 16", image: "/products/sample-string-2.jpg", url: "#" },
        { name: "Wilson NXT", price: "USD 14", image: "/products/sample-string-3.jpg", url: "#" },
      ],
    } as const satisfies Record<string, readonly AffiliateProduct[]>,
  },
} as const;

export type TtpContext = keyof typeof MONETIZATION.ttp.contextMap;
export type AffiliateTipo = keyof typeof MONETIZATION.affiliates.sampleProducts;
export type AdSlotKey = keyof typeof MONETIZATION.adsense.slotIds;

export function ttpUrl(context: string): string {
  const suffix =
    (MONETIZATION.ttp.contextMap as Record<string, string>)[context] ?? "";
  return `${MONETIZATION.ttp.baseUrl}${suffix}`;
}

export function ttpCopy(context: string): string {
  return (
    (MONETIZATION.ttp.copyMap as Record<string, string>)[context] ??
    "Programas profesionales de TennisTrainingPro"
  );
}

export function affiliateProducts(tipo: string): readonly AffiliateProduct[] {
  return (
    (MONETIZATION.affiliates.sampleProducts as Record<string, readonly AffiliateProduct[]>)[
      tipo
    ] ?? []
  );
}
