import { useEffect, useRef } from "react";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { TrackedLink } from "@/components/TrackedLink";
import {
  MONETIZATION,
  affiliateProducts,
  ttpCopy,
  ttpUrl,
  type AdSlotKey,
} from "@/lib/monetization";

/**
 * Inline article markers, wired with real monetization config.
 *
 * Marker → component table:
 *   <!-- AD_SLOT_N -->             → AdSlotMarker
 *   [[AFFILIATE_BLOCK:tipo]]        → AffiliateMarker
 *   [[CTA_TTP:contexto]]            → TtpCtaMarker
 *   [[CTA_PREMIUM_LISTING]]         → PremiumListingMarker
 *
 * Every marker reserves vertical space (min-height) so AdSense fills don't
 * cause CLS. Tracking goes through TrackedLink (dataLayer) for the external
 * CTAs (TTP, affiliates); the premium-listing CTA is internal so it uses
 * react-router's <Link>.
 */

const wrap = "my-6 md:my-8 rounded-xl border";

// ─── AdSlotMarker ────────────────────────────────────────────────────────────

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSlotMarkerProps {
  n: string;
}

export const AdSlotMarker = ({ n }: AdSlotMarkerProps) => {
  const enabled = MONETIZATION.adsense.enabled;
  const publisherId = MONETIZATION.adsense.publisherId;
  const slotKey = `AD_SLOT_${n}` as AdSlotKey;
  const slotId = MONETIZATION.adsense.slotIds[slotKey] ?? null;
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !publisherId || !slotId) return;
    if (pushedRef.current) return; // never push twice for the same <ins>
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // First push can race with the async script; AdSense recovers on its own.
    }
  }, [enabled, publisherId, slotId]);

  // Disabled (or missing slot id) → placeholder. Same min-height as the live
  // ad so swapping enabled/disabled doesn't shift layout.
  if (!enabled || !publisherId || !slotId) {
    return (
      <aside
        role="complementary"
        aria-label={`Publicidad ${n}`}
        className={`${wrap} border-dashed border-border bg-light px-4 py-6 text-center min-h-[250px] flex flex-col items-center justify-center`}
      >
        <p className="text-[10px] tracking-[3px] uppercase font-semibold text-gray select-none mb-1">
          Publicidad
        </p>
        <div className="text-[12px] text-gray">Slot AD_{n}</div>
      </aside>
    );
  }

  return (
    <aside
      role="complementary"
      aria-label={`Publicidad ${n}`}
      className={`${wrap} border-border bg-white px-2 py-2 min-h-[250px]`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 250 }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};

// ─── TtpCtaMarker ────────────────────────────────────────────────────────────

interface TtpCtaMarkerProps {
  contexto: string;
}

export const TtpCtaMarker = ({ contexto }: TtpCtaMarkerProps) => {
  const title = ttpCopy(contexto);
  const url = ttpUrl(contexto);

  return (
    <div
      className={`${wrap} border-yellow/40 bg-yellow/5 px-5 py-6 min-h-[200px]`}
      style={{ borderColor: "#E7E242", backgroundColor: "rgba(231, 226, 66, 0.05)" }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(231, 226, 66, 0.18)", color: "#7a7900" }}
        >
          <Sparkles size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="label-meta uppercase tracking-[3px] text-[10px] mb-1.5" style={{ color: "#7a7900" }}>
            TennisTrainingPro · {contexto}
          </p>
          <h3 className="font-display text-dark text-[20px] md:text-[22px] leading-tight mb-2">
            {title}
          </h3>
          <p className="text-[14px] text-dark leading-relaxed mb-4">
            Entrenamientos profesionales adaptados a tu nivel.
          </p>
          <TrackedLink
            href={url}
            target="_blank"
            rel="sponsored noopener"
            event="ttp_cta_click"
            payload={{ context: contexto }}
            className="inline-flex items-center gap-2 bg-dark text-white text-[13px] font-semibold uppercase tracking-wider px-4 py-2 rounded-md hover:brightness-110 transition"
          >
            Conocé más <ArrowRight size={14} />
          </TrackedLink>
        </div>
      </div>
    </div>
  );
};

// ─── AffiliateMarker ─────────────────────────────────────────────────────────

interface AffiliateMarkerProps {
  tipo: string;
}

export const AffiliateMarker = ({ tipo }: AffiliateMarkerProps) => {
  const products = affiliateProducts(tipo);
  if (products.length === 0) return null;

  return (
    <section
      aria-label={`Equipamiento recomendado de ${tipo}`}
      className={`${wrap} border-orange/20 bg-orange/5 p-5 md:p-6 min-h-[260px]`}
    >
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] tracking-[3px] uppercase font-semibold text-orange mb-1">
            <ShoppingBag size={12} className="inline mr-1" />
            Equipamiento recomendado
          </p>
          <h3 className="font-display text-dark text-[20px] md:text-[22px] leading-tight">
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-gray">Afiliado</span>
      </div>

      <div
        className="
          flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory
          md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {products.map((p) => (
          <TrackedLink
            key={p.url + p.name}
            href={p.url}
            target="_blank"
            rel="sponsored noopener"
            event="affiliate_click"
            payload={{ tipo, product: p.name }}
            className="shrink-0 w-[180px] md:w-auto snap-start bg-white rounded-lg border border-border overflow-hidden hover:shadow-card-hover transition group"
          >
            <div className="aspect-square bg-muted overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  // Sample paths point to /products/* which don't exist yet;
                  // collapse to a neutral block instead of a broken icon.
                  (e.currentTarget.style.visibility = "hidden");
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3">
              <p className="text-[13px] font-semibold text-dark line-clamp-2 leading-tight">
                {p.name}
              </p>
              <p className="text-[14px] text-orange font-bold mt-1">{p.price}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-dark group-hover:text-orange transition">
                Ver <ArrowRight size={12} />
              </span>
            </div>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
};

// ─── PremiumListingMarker ────────────────────────────────────────────────────

export const PremiumListingMarker = () => (
  <section
    aria-label="Sumar mi club a HayCancha"
    className="my-8 rounded-xl bg-orange text-white p-6 md:p-8 min-h-[160px] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    style={{ backgroundColor: "#E8632A" }}
  >
    <div className="flex-1 min-w-0">
      <h3 className="font-display text-white text-[22px] md:text-[26px] leading-tight">
        ¿Tenés un club o cancha?
      </h3>
      <p className="text-white/95 text-[14px] md:text-[15px] leading-relaxed mt-1">
        Sumalo gratis a HayCancha y llegá a miles de jugadores.
      </p>
    </div>
    <Link
      to="/agregar-cancha"
      className="inline-flex items-center justify-center gap-2 bg-white text-orange text-[13px] font-semibold uppercase tracking-wider px-5 py-3 rounded-md hover:brightness-95 transition shrink-0"
      style={{ color: "#E8632A" }}
    >
      Sumar mi cancha <ArrowRight size={14} />
    </Link>
  </section>
);
