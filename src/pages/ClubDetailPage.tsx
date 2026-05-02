import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Share2,
  Navigation,
  Star,
  Clock,
  Check,
  Images,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/brand/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Breadcrumb } from "@/components/search/Breadcrumb";
import { CtaButton } from "@/components/brand/CtaButton";
import { SportBadge } from "@/components/brand/SportBadge";
import { CourtCard } from "@/components/brand/CourtCard";
import { AdSlot } from "@/components/brand/AdSlot";
import { cn } from "@/lib/utils";
import court1 from "@/assets/court-1.jpg";
import court2 from "@/assets/court-2.jpg";
import court3 from "@/assets/court-3.jpg";
import mapPreview from "@/assets/map-preview.jpg";

/*
  meta:
  title: "Club Atlético Palermo — Canchas de Tenis y Pádel en Palermo, Buenos Aires | HayCancha.com"
  description: "Club Atlético Palermo: 6 canchas de tenis (polvo de ladrillo) + 3 de pádel en Palermo, CABA. Vestuarios, estacionamiento, bar y clases. Contacto y horarios."
*/

const services = [
  "Vestuarios",
  "Estacionamiento",
  "Bar / Restaurante",
  "Clases grupales",
  "Clases individuales",
  "Alquiler de raquetas",
];

const schedule = [
  { day: "Lun – Vie", hours: "8:00 — 22:00" },
  { day: "Sábado", hours: "8:00 — 20:00" },
  { day: "Domingo", hours: "9:00 — 18:00" },
];

const nearby = [
  { name: "Asociación Tenis Belgrano", neighborhood: "Belgrano", city: "CABA", image: court2, sports: ["tenis"] as const, pricePerHour: "$6.200" },
  { name: "Complejo Tenis Recoleta", neighborhood: "Recoleta", city: "CABA", image: court3, sports: ["tenis", "padel"] as const, pricePerHour: "$7.400" },
  { name: "Pádel Norte", neighborhood: "Vicente López", city: "GBA Norte", image: court3, sports: ["padel"] as const, pricePerHour: "$5.800" },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="label-meta uppercase text-orange tracking-[3px] mb-3">{children}</p>
);

const ClubDetailPage = () => {
  const { slug } = useParams();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Open status check (demo: always open during the day)
  const isOpenNow = true;

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-border">
          <div className="max-w-container mx-auto px-6 lg:px-10 py-3">
            <Breadcrumb
              items={[
                { label: "Canchas", href: "/canchas" },
                { label: "Buenos Aires", href: "/canchas/buenos-aires" },
                { label: "Palermo", href: "/canchas/buenos-aires/palermo" },
                { label: "Club Atlético Palermo" },
              ]}
            />
          </div>
        </div>

        {/* Gallery */}
        <section className="bg-light">
          <div className="max-w-container mx-auto px-6 lg:px-10 pt-6">
            <div className="relative grid grid-cols-1 md:grid-cols-[60%_40%] gap-3 rounded-xl overflow-hidden h-[280px] md:h-[400px]">
              <div className="relative bg-dark-2 overflow-hidden md:rounded-l-xl">
                <img src={court1} alt="Cancha principal Club Atlético Palermo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:grid grid-rows-2 gap-3">
                <div className="relative bg-dark-2 overflow-hidden rounded-tr-xl">
                  <img src={court3} alt="Cancha de pádel" className="w-full h-full object-cover" />
                </div>
                <div className="relative bg-dark-2 overflow-hidden rounded-br-xl">
                  <img src={court2} alt="Vista del club al atardecer" className="w-full h-full object-cover" />
                </div>
              </div>
              <button className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-black/60 backdrop-blur text-white text-[12px] font-semibold uppercase tracking-wider px-3 py-2 rounded-md hover:bg-black/80 transition">
                <Images size={14} /> Ver todas las fotos
              </button>
            </div>
          </div>
        </section>

        {/* Slot 5 — club-after-gallery (in-article, between gallery and practical info) */}
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <AdSlot slot="club-after-gallery" format="in-article" />
        </div>

        <section className="max-w-container mx-auto px-6 lg:px-10 mt-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <SportBadge sport="tenis" />
                <SportBadge sport="padel" />
                <SportBadge sport="premium" />
              </div>
              <h1 className="font-display text-dark text-[36px] md:text-[56px] leading-[0.95]">
                CLUB ATLÉTICO PALERMO
              </h1>
              <p className="mt-3 flex items-start gap-2 text-gray text-[15px]">
                <MapPin size={16} className="text-orange shrink-0 mt-0.5" />
                Av. Santa Fe 3456, Palermo, Buenos Aires
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-yellow">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                  <Star size={16} className="text-border" fill="currentColor" />
                </div>
                <span className="text-[13px] text-dark font-semibold">4.2</span>
                <span className="text-[13px] text-gray">(38 reviews)</span>
              </div>
            </div>

            {/* Action card sticky on desktop */}
            <aside className="lg:sticky lg:top-20">
              <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-3">
                <CtaButton className="w-full">Contactar</CtaButton>
                <CtaButton variant="secondary" className="w-full">Reservar online</CtaButton>
                <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-dark hover:text-orange transition">
                  <Navigation size={15} /> Cómo llegar
                </button>
                <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-dark hover:text-orange transition">
                  <Share2 size={15} /> Compartir
                </button>
              </div>
            </aside>
          </div>
        </section>

        {/* Info 3-cols */}
        <section className="max-w-container mx-auto px-6 lg:px-10 mt-12 lg:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {/* Canchas */}
            <div>
              <SectionLabel>Canchas</SectionLabel>
              <ul className="space-y-4 text-[14px] text-dark">
                <li>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-xl">🎾</span> 6 canchas de tenis
                  </div>
                  <p className="text-gray text-[13px] mt-1 ml-7">
                    Polvo de ladrillo · 4 sin iluminación · 2 con iluminación nocturna
                  </p>
                </li>
                <li>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-xl">🏓</span> 3 canchas de pádel
                  </div>
                  <p className="text-gray text-[13px] mt-1 ml-7">Indoor</p>
                </li>
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <SectionLabel>Servicios</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {services.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 bg-light border border-border rounded text-[12px] font-medium text-dark px-2.5 py-1.5"
                  >
                    <Check size={12} className="text-orange" strokeWidth={3} />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Horarios */}
            <div>
              <SectionLabel>Horarios</SectionLabel>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider",
                    isOpenNow
                      ? "bg-sport-gratis-bg text-sport-gratis-fg"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isOpenNow ? "bg-sport-gratis-fg" : "bg-red-700"
                    )}
                  />
                  {isOpenNow ? "Abierto ahora" : "Cerrado"}
                </span>
                <Clock size={14} className="text-gray" />
              </div>
              <ul className="space-y-1.5 text-[14px] text-dark">
                {schedule.map((s) => (
                  <li key={s.day} className="flex justify-between gap-3">
                    <span className="text-gray">{s.day}</span>
                    <span className="font-semibold">{s.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="max-w-container mx-auto px-6 lg:px-10 mt-12 lg:mt-16">
          <SectionLabel>Ubicación</SectionLabel>
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img src={mapPreview} alt="Mapa de ubicación" className="w-full h-[280px] object-cover" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <MapPin size={36} className="text-orange drop-shadow-lg" fill="currentColor" />
                <span className="absolute inset-0 rounded-full bg-orange/30 animate-ping" />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
            <p className="text-[14px] text-dark">Av. Santa Fe 3456, Palermo, Buenos Aires</p>
            <div className="flex gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[13px] text-gray hover:text-orange transition"
              >
                Ver en Google Maps <ExternalLink size={12} />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[13px] text-gray hover:text-orange transition"
              >
                Ver en Waze <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-container mx-auto px-6 lg:px-10 mt-12 lg:mt-16">
          <SectionLabel>Contacto</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Phone, label: "(011) 4832-1234", href: "tel:+541148321234" },
              { icon: Mail, label: "info@clubatleticopalermo.com.ar", href: "mailto:info@clubatleticopalermo.com.ar" },
              { icon: Globe, label: "www.clubatleticopalermo.com.ar", href: "https://www.clubatleticopalermo.com.ar" },
              { icon: Instagram, label: "@clubatleticopalermo", href: "https://instagram.com/clubatleticopalermo" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="inline-flex items-center gap-2 bg-white border border-border rounded-md px-3 py-2 text-[13px] font-medium text-dark hover:border-orange hover:text-orange transition"
              >
                <c.icon size={14} className="text-orange" />
                {c.label}
              </a>
            ))}
          </div>
        </section>

        {/* Nearby */}
        <section className="max-w-container mx-auto px-6 lg:px-10 mt-16">
          <h2 className="font-display text-dark text-[28px] md:text-[32px] leading-none mb-6">
            CANCHAS CERCANAS EN PALERMO
          </h2>
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0 snap-x">
            {nearby.map((c) => (
              <div key={c.name} className="min-w-[280px] md:min-w-0 snap-start">
                <CourtCard {...c} sports={[...c.sports]} />
              </div>
            ))}
          </div>
        </section>

        {/* SEO breadcrumb links */}
        <section className="bg-light mt-16">
          <div className="max-w-container mx-auto px-6 lg:px-10 py-10">
            <p className="label-meta uppercase text-gray mb-3">Más canchas en</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Palermo", count: 24, href: "/canchas/buenos-aires/palermo" },
                { label: "Buenos Aires", count: 480, href: "/canchas/buenos-aires" },
                { label: "Argentina", count: 1500, href: "/canchas" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="inline-flex items-center gap-2 bg-white border border-border rounded-md px-4 py-2 text-[13px] text-dark hover:border-orange hover:text-orange transition"
                >
                  <span className="font-semibold">{l.label}</span>
                  <span className="text-gray">({l.count} canchas)</span>
                  <ArrowRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating sticky sidebar (desktop) */}
      {scrolled && (
        <aside className="hidden lg:block fixed top-24 right-6 w-[300px] z-40 animate-in fade-in slide-in-from-right-4">
          <div className="bg-white rounded-xl border border-border shadow-card-hover p-4 space-y-3">
            <div className="flex items-center gap-3">
              <img src={court1} alt="" className="w-12 h-12 rounded-md object-cover" />
              <div className="min-w-0">
                <div className="font-semibold text-[13px] text-dark truncate">Club Atlético Palermo</div>
                <div className="text-[11px] text-gray truncate">Palermo · CABA</div>
              </div>
            </div>
            <CtaButton className="w-full !py-2.5 !text-[12px]">Contactar</CtaButton>
            <a href="tel:+541148321234" className="flex items-center gap-2 text-[13px] text-dark hover:text-orange transition">
              <Phone size={13} className="text-orange" />
              (011) 4832-1234
            </a>
            <div className="flex items-center justify-between text-[12px] pt-2 border-t border-border">
              <span className="text-gray">Hoy</span>
              <span className="font-semibold text-dark">8:00 — 22:00</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-orange font-semibold">
              <MapPin size={12} /> 3,2 km de tu ubicación
            </div>
          </div>
        </aside>
      )}

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-3 flex gap-2">
        <button className="flex-1 inline-flex items-center justify-center gap-2 h-12 border-2 border-orange text-orange font-semibold text-[13px] uppercase tracking-wider rounded-md">
          <Navigation size={15} /> Cómo llegar
        </button>
        <button className="flex-[1.2] inline-flex items-center justify-center gap-2 h-12 bg-orange text-white font-semibold text-[13px] uppercase tracking-wider rounded-md">
          <Phone size={15} /> Contactar
        </button>
      </div>
      {/* Spacer so footer not hidden behind sticky bar on mobile */}
      <div className="lg:hidden h-16" aria-hidden />

      {/* Hidden slug ref for SEO/debug */}
      <span className="sr-only">{slug}</span>
    </div>
  );
};

export default ClubDetailPage;
