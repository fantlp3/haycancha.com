/**
 * Regression test for the duplicated-head bug.
 *
 * index.html ships a generic <meta name="description"> and og:* set so that
 * non-JS crawlers get something. Before this fix those tags carried no
 * data-rh attribute, so react-helmet-async appended a SECOND description
 * instead of replacing the first — and the generic one, being first in the
 * document, is what Google and social scrapers read on all 2.887 pages.
 *
 * Marking the static tags data-rh="true" makes Helmet adopt them. These tests
 * seed a head exactly like index.html's and assert there is exactly one of
 * each tag afterwards, carrying the per-route value.
 */
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { beforeEach, describe, expect, it } from "vitest";
import { SeoMeta } from "./SeoMeta";

const GENERIC_DESC =
  "HayCancha.com: el directorio de canchas de tenis, pádel y pickleball de Latinoamérica.";

/** Mirrors the SEO block in index.html, data-rh markers included. */
function seedStaticHead() {
  document.head.innerHTML = `
    <title>HayCancha.com — Encontrá tu cancha perfecta en Latinoamérica</title>
    <meta data-rh="true" name="description" content="${GENERIC_DESC}" />
    <meta data-rh="true" property="og:title" content="HayCancha.com — Canchas de tenis, pádel y pickleball en LATAM" />
    <meta data-rh="true" property="og:image" content="https://haycancha.com/og-default.jpg" />
    <link rel="icon" href="/favicon.ico" />
  `;
}

const content = (sel: string) =>
  document.head.querySelector(sel)?.getAttribute("content") ?? null;

describe("SeoMeta over the static index.html head", () => {
  beforeEach(seedStaticHead);

  it("replaces the generic description instead of appending a second one", async () => {
    render(
      <HelmetProvider>
        <SeoMeta
          title="Orbit Club Tenis&Padel — Tenis en Córdoba"
          description="Club de tenis y pádel en Córdoba, Argentina."
          canonicalPath="/canchas/argentina/cordoba/orbit-club-tenis-padel-cordoba"
        />
      </HelmetProvider>
    );

    await waitFor(() =>
      expect(content('meta[name="description"]')).toBe(
        "Club de tenis y pádel en Córdoba, Argentina."
      )
    );
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  });

  it("replaces og:title rather than leaving the generic one first", async () => {
    render(
      <HelmetProvider>
        <SeoMeta title="Canchas de pádel en Lima" description="Pádel en Lima." canonicalPath="/canchas/peru/lima" />
      </HelmetProvider>
    );

    await waitFor(() =>
      expect(content('meta[property="og:title"]')).toBe("Canchas de pádel en Lima | HayCancha")
    );
    expect(document.head.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
  });

  it("emits exactly one canonical, and does not double-prefix an absolute one", async () => {
    render(
      <HelmetProvider>
        <SeoMeta
          title="Medidas de cancha"
          description="Medidas oficiales."
          canonicalPath="https://haycancha.com/blog/medidas-de-canchas-tenis-padel-pickleball"
          ogType="article"
        />
      </HelmetProvider>
    );

    await waitFor(() =>
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
        "https://haycancha.com/blog/medidas-de-canchas-tenis-padel-pickleball"
      )
    );
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  });

  it("leaves non-SEO head tags (favicon) alone", async () => {
    render(
      <HelmetProvider>
        <SeoMeta title="Inicio" description="Directorio." canonicalPath="/" />
      </HelmetProvider>
    );
    await waitFor(() => expect(content('meta[name="description"]')).toBe("Directorio."));
    expect(document.head.querySelector('link[rel="icon"]')).not.toBeNull();
  });
});
