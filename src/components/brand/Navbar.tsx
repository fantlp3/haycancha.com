import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { withDefaultView } from "@/lib/view-mode";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] bg-dark border-b border-white/10">
      <div className="max-w-container mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between gap-3">
        {/* Mobile hamburger — left side */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú de navegación"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 -ml-2 text-white/90 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 bg-dark border-r border-white/10 text-white">
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/10 text-left">
              <SheetTitle className="text-white">
                <Logo variant="light" size={28} />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col px-2 py-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-md text-[15px] font-medium text-white/85 ${l.hover} hover:bg-white/5 transition-colors`}
                >
                  {l.label}
                </a>
              ))}
              <div className="my-3 mx-4 h-px bg-white/10" />
              <a
                href="/agregar-cancha"
                onClick={() => setMobileOpen(false)}
                className="mx-4 mt-1 inline-flex items-center justify-center h-11 rounded-md bg-celeste text-dark text-[13px] font-semibold uppercase tracking-wider hover:brightness-95 transition-colors"
              >
                Agregá tu cancha
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        <a href="/" aria-label="HayCancha inicio" className="shrink-0">
          <Logo variant="light" size={28} />
        </a>

        <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
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
          className="hidden md:inline-flex text-[13px] font-semibold uppercase tracking-wider text-celeste border-2 border-celeste rounded-md px-4 py-2 hover:bg-celeste hover:text-dark transition-colors"
        >
          Agregá tu cancha
        </a>
      </div>
    </header>
  );
};
