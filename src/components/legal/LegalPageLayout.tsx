import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Navbar } from "@/components/brand/Navbar";
import { Footer } from "@/components/sections/Footer";
import { cn } from "@/lib/utils";

export interface TocEntry {
  id: string;
  label: string;
}

interface LegalPageLayoutProps {
  title: string;
  breadcrumb: { label: string; href?: string }[];
  lastUpdated?: string;
  toc?: TocEntry[];
  /** When false the content container keeps its standard width. Used by 404. */
  withContainer?: boolean;
  children: ReactNode;
}

/**
 * Shared layout for /privacidad, /terminos, /atribucion-osm, /sobre,
 * /contacto and the 404 page.
 */
export const LegalPageLayout = ({
  title,
  breadcrumb,
  lastUpdated,
  toc,
  withContainer = true,
  children,
}: LegalPageLayoutProps) => {
  const [activeId, setActiveId] = useState<string | undefined>(toc?.[0]?.id);

  // Scroll-spy for the sticky desktop TOC.
  useEffect(() => {
    if (!toc || toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />

      {/* HERO STRIP */}
      <section className="bg-dark text-white">
        <div className="max-w-container mx-auto px-6 lg:px-10 h-[240px] flex flex-col justify-center">
          <nav aria-label="breadcrumb" className="text-[13px] text-white/60 mb-3">
            {breadcrumb.map((b, i) => (
              <span key={`${b.label}-${i}`}>
                {b.href ? (
                  <a href={b.href} className="hover:text-orange transition-colors">
                    {b.label}
                  </a>
                ) : (
                  <span aria-current="page">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span className="mx-2 text-white/30">/</span>}
              </span>
            ))}
          </nav>
          <h1 className="font-display italic text-[40px] md:text-[56px] leading-[0.95] text-white">
            {title}
          </h1>
          {lastUpdated && (
            <div className="mt-3 text-[13px] text-white/60">Última actualización: {lastUpdated}</div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <main className="flex-1">
        {withContainer ? (
          <div className="max-w-container mx-auto px-4 md:px-10 py-8 md:py-12 relative">
            <div
              className={cn(
                "grid gap-8",
                toc && toc.length > 0
                  ? "xl:grid-cols-[1fr_220px] xl:gap-12"
                  : "grid-cols-1"
              )}
            >
              <article className="bg-white rounded-lg max-w-[760px] w-full mx-auto px-6 py-8 md:px-12 md:py-12 shadow-card">
                {toc && toc.length > 0 && <MobileToc toc={toc} />}
                {children}
              </article>

              {toc && toc.length > 0 && (
                <aside className="hidden xl:block">
                  <div className="sticky top-24">
                    <div className="text-orange font-semibold text-[11px] tracking-[3px] mb-4">
                      📑 ÍNDICE
                    </div>
                    <ul className="space-y-2 border-l border-border pl-4">
                      {toc.map((t) => (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            className={cn(
                              "block text-[13px] leading-snug transition-colors",
                              activeId === t.id
                                ? "text-orange font-medium"
                                : "text-gray hover:text-dark"
                            )}
                          >
                            {t.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-container mx-auto px-6 lg:px-10 py-12 md:py-20">{children}</div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const MobileToc = ({ toc }: { toc: TocEntry[] }) => (
  <details className="xl:hidden mb-8 bg-light rounded-md border border-border">
    <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-semibold text-dark flex items-center gap-2">
      <span>📑 Índice</span>
      <span className="text-gray font-normal text-[12px]">({toc.length} secciones)</span>
    </summary>
    <ul className="px-4 pb-4 space-y-2 border-t border-border pt-3">
      {toc.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="text-[13px] text-gray hover:text-orange transition-colors">
            {t.label}
          </a>
        </li>
      ))}
    </ul>
  </details>
);

/* ---------- Reusable typographic atoms for legal content ---------- */

export const LegalH2 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h2
    id={id}
    className="text-[24px] font-bold text-dark mt-12 mb-4 leading-tight scroll-mt-24 relative"
  >
    {children}
    <span aria-hidden className="block w-10 h-[3px] bg-orange mt-3 rounded-full" />
  </h2>
);

export const LegalH3 = ({ children }: { children: ReactNode }) => (
  <h3 className="text-[18px] font-bold text-dark mt-8 mb-3 leading-snug">{children}</h3>
);

export const LegalP = ({ children }: { children: ReactNode }) => (
  <p className="text-[16px] text-dark leading-[1.7] mb-4">{children}</p>
);

export const LegalUl = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc pl-6 text-[16px] text-dark leading-[1.7] mb-4 space-y-2">{children}</ul>
);

export const LegalA = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    className="text-orange font-medium hover:underline"
    target={href.startsWith("http") ? "_blank" : undefined}
    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
  >
    {children}
  </a>
);

export const LegalStrong = ({ children }: { children: ReactNode }) => (
  <strong className="text-dark font-bold">{children}</strong>
);

export const LegalEmDash = () => <span className="text-gray"> — </span>;

/** Helper that turns an array of LegalH2 ids+labels into the TOC array. */
export const useToc = (entries: TocEntry[]) => useMemo(() => entries, [entries]);
