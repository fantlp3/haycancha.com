import { MapPin, Star } from "lucide-react";
import { SportBadge, type Sport } from "./SportBadge";
import { ClubPhoto } from "@/components/ClubPhoto";
import { cn } from "@/lib/utils";

export interface CourtCardProps {
  name: string;
  neighborhood: string;
  city: string;
  fileId: string | null;
  primarySportSlug?: "tenis" | "padel" | "pickleball" | null;
  sports: Sport[];
  premium?: boolean;
  pricePerHour?: string;
}

export const CourtCard = ({
  name,
  neighborhood,
  city,
  fileId,
  primarySportSlug,
  sports,
  premium,
  pricePerHour,
}: CourtCardProps) => (
  <article
    className={cn(
      "group bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 cursor-pointer",
      premium
        ? "border-l-[3px] border-l-orange shadow-[0_6px_20px_rgba(0,0,0,0.10)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
        : "shadow-card hover:shadow-card-hover"
    )}
  >
    <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
      <ClubPhoto
        clubName={name}
        fileId={fileId}
        primarySportSlug={primarySportSlug}
        width={400}
        height={250}
        size="md"
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
        {sports.map((s) => (
          <SportBadge key={s} sport={s} />
        ))}
      </div>
      {premium && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-orange text-white px-2 py-1 rounded text-[10px] font-semibold uppercase leading-none tracking-[1px] shadow-md">
          <Star size={10} fill="currentColor" strokeWidth={0} />
          Premium
        </span>
      )}
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
