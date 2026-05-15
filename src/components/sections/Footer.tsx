import { useMemo } from "react";
import { Logo } from "@/components/brand/Logo";
import { openCookiePreferences } from "@/lib/cookie-consent";
import { withDefaultView } from "@/lib/view-mode";

interface FooterLink {
  label: string;
  href?: string;
  /** When set, renders a button that triggers an action instead of a navigation link. */
  action?: "open-cookie-preferences";
}

interface FooterCol {
  title: string;
  links: FooterLink[];
}

const cols: FooterCol[] = [
  {
    title: "HayCancha",
    links: [
      { label: "Sobre HayCancha", href: "/sobre" },
      { label: "Contacto", href: "/contacto" },
      { label: "Agregá tu cancha", href: "/agregar-cancha" },
    ],
  },
  {
    title: "Deportes",
    links: [
      { label: "Tenis", href: "/tenis" },
      { label: "Pádel", href: "/padel" },
      { label: "Pickleball", href: "/pickleball" },
    ],
  },
  {
    title: "Navegación",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Buscar canchas", href: "/canchas" },
      { label: "¿Tu cancha no aparece? Agregala", href: "/agregar-cancha" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de Privacidad", href: "/privacidad" },
      { label: "Términos y Condiciones", href: "/terminos" },
      { label: "Atribución de Datos", href: "/atribucion-osm" },
      { label: "Configurar cookies", action: "open-cookie-preferences" },
    ],
  },
];

export const Footer = () => {
  // Inject device-default view into any /canchas href once at mount.
  const resolvedCols = useMemo(
    () =>
      cols.map((col) => ({
        ...col,
        links: col.links.map((l) =>
          l.href && l.href.startsWith("/canchas") ? { ...l, href: withDefaultView(l.href) } : l
        ),
      })),
    []
  );

  return (
    <footer style={{ backgroundColor: "#1A1B22" }} className="text-white/60">
    <div className="max-w-container mx-auto px-6 lg:px-10 py-12 md:py-14">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
        <div className="col-span-2 md:col-span-1 space-y-3">
          <Logo variant="light" size={28} />
          <p className="text-[14px] text-white/60 max-w-[220px]">
            El directorio de tenis de Latinoamérica.
          </p>
        </div>
        {resolvedCols.map((col) => (
          <div key={col.title}>
            <div className="label-meta uppercase text-orange mb-4">{col.title}</div>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.action === "open-cookie-preferences" ? (
                    <button
                      type="button"
                      onClick={openCookiePreferences}
                      className="text-[12px] font-normal text-gray hover:text-orange transition-colors text-left"
                    >
                      {l.label}
                    </button>
                  ) : (
                    <a
                      href={l.href}
                      className="text-[14px] font-normal text-white/60 hover:text-orange transition-colors"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* OSM attribution required by ODbL */}
      <div className="mt-10 pt-6 border-t border-white/10 text-[11px] text-gray">
        Algunos datos de ubicación ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange transition-colors underline"
        >
          OpenStreetMap
        </a>{" "}
        contributors (licencia ODbL)
      </div>
    </div>
    <div style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
      <div className="max-w-container mx-auto px-6 lg:px-10 py-4 text-center text-[11px] text-white/50">
        © 2025 HayCancha<span className="text-orange">.</span>com · Hecho con ❤️ para el tenis latinoamericano
        <div className="mt-1.5">
          Desarrollado por{" "}
          <a
            href="https://p3design.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange transition-colors"
          >
            P3Design.com
          </a>
        </div>
      </div>
    </div>
  </footer>
  );
};
