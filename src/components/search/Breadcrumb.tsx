import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export const Breadcrumb = ({ items }: { items: Crumb[] }) => (
  <nav
    aria-label="Breadcrumb"
    className="flex items-center gap-1.5 text-[12px] text-gray flex-wrap"
  >
    <a href="/" className="inline-flex items-center hover:text-orange transition">
      <Home size={12} />
    </a>
    {items.map((item, i) => (
      <span key={i} className="inline-flex items-center gap-1.5">
        <ChevronRight size={12} className="opacity-50" />
        {item.href && i < items.length - 1 ? (
          <a href={item.href} className="hover:text-orange transition">
            {item.label}
          </a>
        ) : (
          <span className="text-dark font-medium">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);
