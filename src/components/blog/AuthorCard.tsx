import { Instagram, Linkedin, Twitter, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Autor } from "@/lib/directus-types";

interface Props {
  autor: Autor;
  className?: string;
}

const initialsFrom = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

interface SocialLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

function socialLinks(autor: Autor): SocialLink[] {
  const out: SocialLink[] = [];
  const s = autor.social ?? {};
  if (s.instagram) {
    const handle = s.instagram.replace(/^@/, "");
    out.push({
      href: `https://instagram.com/${handle}`,
      label: `Instagram de ${autor.nombre}`,
      icon: Instagram,
    });
  }
  if (s.twitter) {
    const handle = s.twitter.replace(/^@/, "");
    out.push({
      href: `https://twitter.com/${handle}`,
      label: `Twitter de ${autor.nombre}`,
      icon: Twitter,
    });
  }
  if (s.linkedin) {
    const path = s.linkedin.replace(/^@/, "");
    out.push({
      href: path.startsWith("http") ? path : `https://linkedin.com/in/${path}`,
      label: `LinkedIn de ${autor.nombre}`,
      icon: Linkedin,
    });
  }
  if (autor.email) {
    out.push({ href: `mailto:${autor.email}`, label: `Email a ${autor.nombre}`, icon: Mail });
  }
  return out;
}

export const AuthorCard = ({ autor, className }: Props) => {
  const socials = socialLinks(autor);

  return (
    <section
      aria-label="Sobre el autor"
      className={cn(
        "bg-white rounded-xl border border-border p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-6 shadow-card",
        className
      )}
    >
      <Avatar className="h-20 w-20 md:h-24 md:w-24 shrink-0">
        {autor.avatar_url && <AvatarImage src={autor.avatar_url} alt={autor.nombre} />}
        <AvatarFallback className="bg-orange/10 text-orange font-semibold text-[20px]">
          {initialsFrom(autor.nombre)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="label-meta uppercase text-orange tracking-[3px] text-[10px] mb-1">
          Sobre el autor
        </p>
        <h3 className="font-display text-dark text-[24px] md:text-[28px] leading-tight">
          {autor.nombre}
        </h3>
        {autor.rol && (
          <p className="text-[13px] text-gray font-medium mt-1">{autor.rol}</p>
        )}
        {autor.bio_larga && (
          <p className="text-[14px] text-dark mt-3 leading-relaxed">
            {autor.bio_larga}
          </p>
        )}
        {autor.credenciales && (
          <p className="text-[12px] text-gray mt-3 leading-relaxed">
            <span className="font-semibold text-dark">Credenciales: </span>
            {autor.credenciales}
          </p>
        )}
        {socials.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border text-gray hover:text-orange hover:border-orange transition"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
