import { useState } from "react";
import { Link2, Linkedin, Twitter, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  url: string;
  title: string;
  className?: string;
  /** When "stacked", lays buttons vertically (sidebar). Default = inline. */
  variant?: "inline" | "stacked";
}

// Inline WhatsApp glyph (no lucide brand icon).
const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M17.6 6.31A7.85 7.85 0 0 0 12.05 4a7.93 7.93 0 0 0-6.87 11.9L4 20l4.21-1.1a7.9 7.9 0 0 0 3.83.99h.01a7.93 7.93 0 0 0 7.93-7.93 7.88 7.88 0 0 0-2.38-5.65zM12.05 18.5h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.44-.16-.25a6.6 6.6 0 0 1 10.21-8.13 6.55 6.55 0 0 1 1.93 4.66 6.6 6.6 0 0 1-6.54 6.57zm3.62-4.93c-.2-.1-1.18-.58-1.36-.65-.18-.07-.31-.1-.45.1-.13.2-.51.65-.62.78-.12.13-.23.15-.43.05a5.4 5.4 0 0 1-1.59-.98 6 6 0 0 1-1.1-1.37c-.12-.2 0-.3.09-.4.09-.1.2-.23.3-.35.1-.12.13-.2.2-.33.06-.13.03-.25-.02-.35-.05-.1-.45-1.09-.62-1.49-.16-.39-.33-.34-.45-.34h-.39c-.13 0-.35.05-.53.25-.18.2-.7.69-.7 1.68 0 1 .72 1.96.82 2.1.1.13 1.42 2.16 3.43 3.03.48.2.85.33 1.15.42.48.15.92.13 1.27.08.39-.06 1.18-.48 1.35-.95.17-.47.17-.87.12-.95-.05-.08-.18-.13-.38-.23z" />
  </svg>
);

export const SharePanel = ({ url, title, className, variant = "inline" }: Props) => {
  const [copied, setCopied] = useState(false);

  const enc = (s: string) => encodeURIComponent(s);
  const shareTitle = title.length > 80 ? title.slice(0, 77) + "…" : title;

  const links = [
    {
      label: "Compartir en X (Twitter)",
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(shareTitle)}`,
      icon: Twitter,
    },
    {
      label: "Compartir en LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      icon: Linkedin,
    },
    {
      label: "Compartir en WhatsApp",
      href: `https://wa.me/?text=${enc(`${shareTitle} — ${url}`)}`,
      icon: WhatsAppIcon,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el link");
    }
  };

  const stacked = variant === "stacked";

  return (
    <div
      aria-label="Compartir este artículo"
      className={cn(
        stacked
          ? "flex flex-col gap-2 sticky top-24"
          : "flex flex-wrap items-center gap-2",
        className
      )}
    >
      {stacked && (
        <p className="text-orange font-semibold text-[11px] tracking-[3px] mb-1">
          📤 COMPARTIR
        </p>
      )}
      {links.map((l) => {
        const Icon = l.icon;
        return (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.label}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-gray hover:text-orange hover:border-orange transition"
          >
            <Icon size={16} />
          </a>
        );
      })}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar link al artículo"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-gray hover:text-orange hover:border-orange transition"
      >
        {copied ? <Check size={16} className="text-orange" /> : <Link2 size={16} />}
      </button>
    </div>
  );
};
