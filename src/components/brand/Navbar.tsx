import { Logo } from "./Logo";

const links = [
  { label: "Buscar canchas", href: "#" },
  { label: "Por zona", href: "#" },
  { label: "Tenis", href: "#" },
  { label: "Pádel", href: "#" },
  { label: "Blog", href: "#" },
];

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-[1000] bg-dark border-b border-white/10">
      <div className="max-w-container mx-auto px-6 lg:px-10 h-[60px] flex items-center justify-between">
        <a href="/" aria-label="HayCancha inicio">
          <Logo variant="light" size={28} />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[14px] font-medium text-white/80 hover:text-orange transition-colors"
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
