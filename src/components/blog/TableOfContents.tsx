import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ArticuloTocEntry } from "@/lib/directus-types";

interface Props {
  entries: ArticuloTocEntry[];
  className?: string;
}

/**
 * Renders the article TOC with scroll-spy highlighting.
 * Mobile: collapsed `<details>` accordion at the top of the body.
 * Desktop (xl+): sticky sidebar list.
 *
 * Anchors come from `articulos.table_of_contents[].anchor` and are expected
 * to match `id` attributes already present in the rendered `contenido_html`.
 */
export const TableOfContents = ({ entries, className }: Props) => {
  const [activeAnchor, setActiveAnchor] = useState<string | null>(
    entries[0]?.anchor ?? null
  );

  // Same pattern as LegalPageLayout: observe headings, pick the topmost
  // visible one as "active".
  useEffect(() => {
    if (entries.length === 0) return;
    const observer = new IntersectionObserver(
      (intersecting) => {
        const visible = intersecting
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveAnchor(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    entries.forEach((t) => {
      const el = document.getElementById(t.anchor);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <>
      {/* Mobile: collapsed accordion inline with the body. */}
      <details className={cn("xl:hidden mb-8 bg-light rounded-md border border-border", className)}>
        <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-semibold text-dark flex items-center gap-2">
          <span>📑 Tabla de contenidos</span>
          <span className="text-gray font-normal text-[12px]">({entries.length})</span>
        </summary>
        <ul className="px-4 pb-4 space-y-2 border-t border-border pt-3">
          {entries.map((t) => (
            <li key={t.anchor} className={t.level > 2 ? "pl-3" : undefined}>
              <a
                href={`#${t.anchor}`}
                className="text-[13px] text-gray hover:text-orange transition-colors"
              >
                {t.text}
              </a>
            </li>
          ))}
        </ul>
      </details>

      {/* Desktop: sticky sidebar list. */}
      <nav
        aria-label="Tabla de contenidos"
        className={cn("hidden xl:block", className)}
      >
        <div className="sticky top-24">
          <div className="text-orange font-semibold text-[11px] tracking-[3px] mb-4">
            📑 EN ESTE ARTÍCULO
          </div>
          <ul className="space-y-2 border-l border-border pl-4">
            {entries.map((t) => (
              <li key={t.anchor} className={t.level > 2 ? "pl-3" : undefined}>
                <a
                  href={`#${t.anchor}`}
                  className={cn(
                    "block text-[13px] leading-snug transition-colors",
                    activeAnchor === t.anchor
                      ? "text-orange font-medium"
                      : "text-gray hover:text-dark"
                  )}
                >
                  {t.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};
