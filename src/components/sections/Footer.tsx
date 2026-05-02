import { Logo } from "@/components/brand/Logo";

const cols = [
  {
    title: "Navegación",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Buscar canchas", href: "/canchas" },
      { label: "¿Tu cancha no aparece? Agregala", href: "/agregar-cancha" },
      { label: "Blog", href: "#" },
      { label: "FAQ", href: "#" },
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
    title: "Contacto",
    links: [
      { label: "contacto@haycancha.com", href: "mailto:contacto@haycancha.com" },
      { label: "Instagram: @haycancha", href: "#" },
    ],
  },
];

export const Footer = () => (
  <footer style={{ backgroundColor: "#1A1B22" }} className="text-white/60">
    <div className="max-w-container mx-auto px-6 lg:px-10 py-12 md:py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div className="col-span-2 md:col-span-1 space-y-3">
          <Logo variant="light" size={28} />
          <p className="text-[14px] text-white/60 max-w-[220px]">
            El directorio de tenis de Latinoamérica.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div className="label-meta uppercase text-orange mb-4">{col.title}</div>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[14px] font-normal text-white/60 hover:text-orange transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
      <div className="max-w-container mx-auto px-6 lg:px-10 py-4 text-center text-[11px] text-white/50">
        © 2025 HayCancha<span className="text-orange">.</span>com · Hecho con ❤️ para el tenis latinoamericano
      </div>
    </div>
  </footer>
);
