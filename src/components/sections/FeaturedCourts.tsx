import { ArrowRight } from "lucide-react";
import { CourtCard, type CourtCardProps } from "@/components/brand/CourtCard";
import court1 from "@/assets/court-1.jpg";
import court2 from "@/assets/court-2.jpg";
import court3 from "@/assets/court-3.jpg";

const courts: CourtCardProps[] = [
  {
    name: "Club Deportivo Palermo",
    neighborhood: "Palermo",
    city: "CABA",
    image: court1,
    sports: ["tenis", "padel"],
    premium: true,
    pricePerHour: "$8.500",
  },
  {
    name: "Asociación Tenis Belgrano",
    neighborhood: "Belgrano",
    city: "CABA",
    image: court2,
    sports: ["tenis"],
    pricePerHour: "$6.200",
  },
  {
    name: "Complejo Tenis Recoleta",
    neighborhood: "Recoleta",
    city: "CABA",
    image: court3,
    sports: ["tenis", "padel"],
    pricePerHour: "$7.400",
  },
];

export const FeaturedCourts = () => (
  <section className="bg-white py-16 md:py-20">
    <div className="max-w-container mx-auto px-6 lg:px-10 space-y-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-dark text-[32px] md:text-[40px] leading-none">
          CANCHAS DESTACADAS
        </h2>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-orange font-medium text-[14px] hover:underline shrink-0"
        >
          Ver todas <ArrowRight size={14} />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courts.map((c) => (
          <CourtCard key={c.name} {...c} />
        ))}
      </div>
    </div>
  </section>
);
