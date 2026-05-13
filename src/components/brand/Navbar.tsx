import { useMemo } from "react";
import { withDefaultView } from "@/lib/view-mode";
import { Logo } from "./Logo";

const baseLinks = [
  { label: "Buscar canchas", href: "/canchas", hover: "hover:text-orange" },
  { label: "Mapa", href: "/canchas?view=map", hover: "hover:text-orange" },
  { label: "Tenis", href: "/tenis", hover: "hover:text-yellow" },
  { label: "Pádel", href: "/padel", hover: "hover:text-celeste" },
  { label: "Pickleball", href: "/pickleball", hover: "hover:text-lime" },
];

export const Navbar = () => {
  // "Buscar canchas" gets its default view (grid/list) injected once at mount.
  // "Mapa" already pins view=map, so withDefaultView leaves it alone.
  const links = useMemo(
    () =>
      baseLinks.map((l) =>
        l.href.startsWith("/canchas") ? { ...l, href: withDefaultView(l.href) } : l
      ),
    []
  );

  return (
    <header className="sticky top-0 z-[1000] bg-dark border-b border-white/10">
      <div className="max-w-container mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">
        <a href="/" aria-label="HayCancha inicio">
          <Logo variant="light" size={28} />
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-[14px] font-medium text-white/80 ${l.hover} transition-colors`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="/agregar-cancha"
          className="text-[13px] font-semibold uppercase tracking-wider text-celeste border-2 border-celeste rounded-md px-4 py-2 hover:bg-celeste hover:text-dark transition-colors"
        >
          Agregá tu cancha
        </a>
      </div>
    </header>
  );
};
