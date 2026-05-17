import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { EDITORIAL_TEAM } from "@/lib/editorial";

interface Props {
  className?: string;
}

/**
 * Static end-of-article bio block that replaces the per-author `AuthorCard`
 * while the three fictional authors stay hidden. Reads everything from
 * `EDITORIAL_TEAM` so revert is trivial: swap this back for `<AuthorCard
 * autor={articulo.autor} />` in `ArticuloDetailPage`.
 *
 * No social links, no link to /autor/:slug — both belong to the (currently
 * hidden) per-author flow.
 */
export const EditorialTeamCard = ({ className }: Props) => (
  <section
    aria-label="Equipo Editorial"
    className={cn(
      "bg-white rounded-xl border border-border p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-6 shadow-card",
      className
    )}
  >
    <Avatar className="h-20 w-20 md:h-24 md:w-24 shrink-0">
      <AvatarFallback
        className="font-semibold text-[20px]"
        style={{
          backgroundColor: EDITORIAL_TEAM.avatar_color_bg,
          color: EDITORIAL_TEAM.avatar_color_text,
        }}
      >
        {EDITORIAL_TEAM.avatar_initials}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="label-meta uppercase text-orange tracking-[3px] text-[10px] mb-1">
        Sobre este artículo
      </p>
      <h3 className="font-display text-dark text-[24px] md:text-[28px] leading-tight">
        {EDITORIAL_TEAM.name}
      </h3>
      <p className="text-[14px] text-dark mt-3 leading-relaxed">
        {EDITORIAL_TEAM.description}
      </p>
    </div>
  </section>
);
