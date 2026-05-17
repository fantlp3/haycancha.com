import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdSlotMarker,
  AffiliateMarker,
  PremiumListingMarker,
  TtpCtaMarker,
} from "./ArticuloMarkers";

interface Props {
  /** Raw `articulos.contenido_html` from Directus. May contain editorial
   *  markers (`<!-- AD_SLOT_N -->`, `[[AFFILIATE_BLOCK:tipo]]`, etc.). */
  html: string;
}

type Token =
  | { kind: "html"; html: string }
  | { kind: "ad"; n: string }
  | { kind: "affiliate"; tipo: string }
  | { kind: "ttp"; contexto: string }
  | { kind: "premium" };

// Inline `[[INTERNAL_LINK:slug|texto]]` markers get rewritten to real <a>
// tags BEFORE block-level splitting, because they live inside paragraphs and
// would tear the HTML structure if we tokenized them.
const INTERNAL_LINK_RE = /\[\[INTERNAL_LINK:([^|\]]+)\|([^\]]+)\]\]/g;

function inlineInternalLinks(html: string): string {
  return html.replace(
    INTERNAL_LINK_RE,
    (_match, slug: string, text: string) =>
      `<a href="/blog/${slug.trim()}" data-internal-link="1" class="text-orange hover:underline">${text}</a>`
  );
}

// Block-level markers split the document. The order in the regex doesn't
// matter — order in the source is preserved by `String.split` with capturing
// groups.
const BLOCK_MARKER_RE =
  /(<!--\s*AD_SLOT_(\d+)\s*-->|\[\[AFFILIATE_BLOCK:([^\]]+)\]\]|\[\[CTA_TTP:([^\]]+)\]\]|\[\[CTA_PREMIUM_LISTING\]\])/g;

function tokenize(html: string): Token[] {
  // String.split with a capturing regex returns alternating segments:
  //   [textBefore, fullMatch, capture1, capture2, …, textAfter, …]
  // We walk the parts in chunks of (1 + N captures) and emit tokens.
  const parts = html.split(BLOCK_MARKER_RE);
  const tokens: Token[] = [];
  // Number of captures in BLOCK_MARKER_RE = 4 (the outer + 3 inner).
  const CAPTURES = 4;
  // Single-render guard for the premium listing CTA: editorial may include
  // [[CTA_PREMIUM_LISTING]] multiple times by accident; we only emit one.
  let premiumEmitted = false;
  let i = 0;
  while (i < parts.length) {
    const text = parts[i];
    if (text && text.length > 0) tokens.push({ kind: "html", html: text });
    i += 1;
    if (i >= parts.length) break;
    // Next CAPTURES slots are the regex captures for one match.
    const full = parts[i];
    const adN = parts[i + 1];
    const affTipo = parts[i + 2];
    const ttpCtx = parts[i + 3];
    if (adN) tokens.push({ kind: "ad", n: adN });
    else if (affTipo) tokens.push({ kind: "affiliate", tipo: affTipo });
    else if (ttpCtx) tokens.push({ kind: "ttp", contexto: ttpCtx });
    else if (full === "[[CTA_PREMIUM_LISTING]]" && !premiumEmitted) {
      tokens.push({ kind: "premium" });
      premiumEmitted = true;
    }
    i += CAPTURES;
  }
  return tokens;
}

const PROSE_CLASS = [
  "prose prose-neutral max-w-none",
  "prose-headings:font-display prose-headings:text-dark prose-headings:scroll-mt-24",
  "prose-h2:text-[28px] md:prose-h2:text-[32px] prose-h2:mt-10 prose-h2:leading-tight",
  "prose-h3:text-[20px] md:prose-h3:text-[22px] prose-h3:mt-8",
  "prose-p:text-[16px] prose-p:leading-[1.75] prose-p:text-dark",
  "prose-a:text-orange prose-a:no-underline hover:prose-a:underline",
  "prose-strong:text-dark prose-strong:font-semibold",
  "prose-ul:my-4 prose-li:my-1.5",
  "prose-img:rounded-lg prose-img:my-6",
  // Inline editorial figures (<figure data-inline="true"><figcaption>).
  // Typography's default styles inherit too much italic + max-width; we
  // override for: full-width, generous vertical rhythm, rounded image,
  // small centered muted caption.
  "[&_figure]:my-8 [&_figure]:w-full [&_figure]:mx-0",
  "[&_figure_img]:rounded-lg [&_figure_img]:w-full [&_figure_img]:h-auto [&_figure_img]:my-0",
  "[&_figure_figcaption]:text-xs [&_figure_figcaption]:text-muted-foreground [&_figure_figcaption]:text-center [&_figure_figcaption]:mt-2 [&_figure_figcaption]:not-italic",
  "[&_.lead]:text-[18px] [&_.lead]:leading-[1.6] [&_.lead]:text-dark [&_.lead]:font-medium [&_.lead]:mb-6",
  "[&_.snippet-target]:bg-orange/5 [&_.snippet-target]:border-l-4 [&_.snippet-target]:border-orange [&_.snippet-target]:p-4 [&_.snippet-target]:rounded-r-md [&_.snippet-target]:my-6 [&_.snippet-target]:text-[15px]",
].join(" ");

const HtmlChunk = ({ html }: { html: string }) => (
  <div className={PROSE_CLASS} dangerouslySetInnerHTML={{ __html: html }} />
);

const renderToken = (t: Token, idx: number): ReactNode => {
  switch (t.kind) {
    case "html":
      return <HtmlChunk key={idx} html={t.html} />;
    case "ad":
      return <AdSlotMarker key={idx} n={t.n} />;
    case "affiliate":
      return <AffiliateMarker key={idx} tipo={t.tipo} />;
    case "ttp":
      return <TtpCtaMarker key={idx} contexto={t.contexto} />;
    case "premium":
      return <PremiumListingMarker key={idx} />;
  }
};

/**
 * Renders article body HTML with editorial markers replaced by React
 * components. Uses a single-pass tokenizer; per-chunk dangerouslySetInnerHTML.
 * Internal links rewritten inline so they live inside paragraphs.
 */
export const ArticuloContent = ({ html }: Props) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const tokens = useMemo(() => tokenize(inlineInternalLinks(html)), [html]);

  // Event delegation: intercept clicks on internal-link <a> tags emitted by
  // inlineInternalLinks and route them through react-router instead of a
  // hard page reload.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a[data-internal-link]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      // Respect modifier keys (open-in-new-tab, etc.).
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const href = anchor.getAttribute("href");
      if (href) navigate(href);
    };
    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [navigate]);

  return (
    <div ref={containerRef}>
      {tokens.map((t, i) => renderToken(t, i))}
    </div>
  );
};
