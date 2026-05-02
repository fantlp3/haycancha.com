import { MapPin } from "lucide-react";
import { SportBadge, type Sport } from "./SportBadge";
import { cn } from "@/lib/utils";

export interface CourtCardProps {
  name: string;
  neighborhood: string;
  city: string;
  image: string;
  sports: Sport[];
  premium?: boolean;
  pricePerHour?: string;
}

export const CourtCard = ({
  name,
  neighborhood,
  city,
  image,
  sports,
  premium,
  pricePerHour,
}: CourtCardProps) => (
  <article
    className={cn(
      "group bg-card rounded-xl border border-border shadow-card overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover cursor-pointer",
      premium && "border-l-[3px] border-l-orange"
    )}
  >
    <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
        {sports.map((s) => (
          <SportBadge key={s} sport={s} />
        ))}
        {premium && <SportBadge sport="premium" />}
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-body font-bold text-[16px] text-dark leading-tight">{name}</h3>
      <p className="mt-1 flex items-center gap-1 text-[13px] text-gray">
        <MapPin size={14} className="text-orange shrink-0" />
        {neighborhood} · {city}
      </p>
      {pricePerHour && (
        <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between">
          <span className="label-meta text-gray uppercase">Desde</span>
          <span className="font-display text-[26px] text-dark leading-none">
            {pricePerHour}
            <span className="text-[12px] text-gray font-body not-italic font-medium ml-1">/h</span>
          </span>
        </div>
      )}
    </div>
  </article>
);
