import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Share2,
  Navigation,
  Clock,
  Check,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/brand/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Breadcrumb } from "@/components/search/Breadcrumb";
import { CtaButton } from "@/components/brand/CtaButton";
import { SportBadge, type Sport } from "@/components/brand/SportBadge";
import { CourtCard } from "@/components/brand/CourtCard";
import { AdSlot } from "@/components/brand/AdSlot";
import { ClubPhoto } from "@/components/ClubPhoto";
import { SeoMeta } from "@/components/SeoMeta";
import { SchemaOrgClub } from "@/components/SchemaOrgClub";
import { useClubBySlug, useClubesByBarrio, useClubesByCiudad } from "@/hooks/useClubes";
import { getPrimarySportSlug } from "@/lib/queries";
import { buildClubHref } from "@/lib/club-display";
import { assetUrl } from "@/lib/directus";
import { cn } from "@/lib/utils";
import type { ClubFull, Superficie } from "@/lib/directus-types";

const KNOWN_SPORTS: ReadonlyArray<Sport> = ["tenis", "padel", "pickleball"];

const SURFACE_LABELS: Record<Superficie, string> = {
  polvo_de_ladrillo: "Polvo de ladrillo",
  cemento: "Cemento",
  cesped_sintetico: "Césped sintético",
  cesped_natural: "Césped natural",
  pista_dura: "Pista dura",
  cristal: "Cristal",
  hormigon_poroso: "Hormigón poroso",
  sintetico_indoor: "Sintético indoor",
  parquet: "Parquet",
  otro: "Otro",
};

const SECTION_PAD = "max-w-container mx-auto px-6 lg:px-10";

// Mocked schedule (TODO: wire to club.horario_apertura/cierre/texto when DB has data)
const MOCK_SCHEDULE = [
  { day: "Lun – Vie", hours: "8:00 — 22:00" },
  { day: "Sábado", hours: "8:00 — 20:00" },
  { day: "Domingo", hours: "9:00 — 18:00" },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="label-meta uppercase text-orange tracking-[3px] mb-3">{children}</p>
);

// Same orange teardrop pin used in the search MapView, inlined to avoid re-export.
const orangePinIcon = L.divIcon({
  className: "",
  html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#E8632A;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
    <div style="width:10px;height:10px;background:white;border-radius:50%;"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const ClubLocationMap = ({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([lat, lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
    L.marker([lat, lng], { icon: orangePinIcon }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng]);

  return (
    <div
      ref={ref}
      className="w-full h-[280px] z-0"
      role="application"
      aria-label={`Mapa de ${name}`}
    />
  );
};

const buildContactHref = (club: ClubFull): string | null => {
  if (club.whatsapp) {
    const digits = club.whatsapp.replace(/[^0-9]/g, "");
    return `https://wa.me/${digits}`;
  }
  if (club.telefono) return `tel:${club.telefono}`;
  if (club.email) return `mailto:${club.email}`;
  return null;
};

const handleContactClick = (href: string | null) => () => {
  if (!href) return;
  window.open(href, "_blank", "noopener,noreferrer");
};

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-light flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const LoadingSkeleton = () => (
  <PageShell>
    <div className={`${SECTION_PAD} py-6 space-y-6 animate-pulse`}>
      <div className="h-4 w-64 bg-border rounded" />
      <div className="h-[280px] md:h-[400px] w-full bg-border rounded-xl" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-3">
          <div className="h-6 w-32 bg-border rounded" />
          <div className="h-12 w-3/4 bg-border rounded" />
          <div className="h-4 w-1/2 bg-border rounded" />
        </div>
        <div className="h-40 bg-white rounded-xl border border-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-border rounded" />
            <div className="h-24 w-full bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  </PageShell>
);

const NotFoundState = () => (
  <PageShell>
    <div className={`${SECTION_PAD} py-24 text-center`}>
      <h1 className="font-display text-dark text-[40px] md:text-[56px] leading-[0.95]">
        CLUB NO ENCONTRADO
      </h1>
      <p className="mt-4 text-gray text-[15px]">
        El club que buscás no existe o fue eliminado.
      </p>
      <Link
        to="/canchas"
        className="inline-flex items-center justify-center gap-2 mt-8 bg-orange text-white font-semibold text-[14px] uppercase tracking-[1px] rounded-md px-7 py-3 hover:brightness-90 transition"
      >
        Volver a Buscar canchas
      </Link>
    </div>
  </PageShell>
);

const ClubDetailPage = () => {
  const { slug } = useParams();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data: club, isLoading } = useClubBySlug(slug);

  // Both nearby hooks are called unconditionally to keep hook order stable.
  // Each is `enabled`-gated by its own slug; only one fires.
  const nearbyByBarrio = useClubesByBarrio(club?.barrio?.slug);
  const nearbyByCiudad = useClubesByCiudad(club?.barrio ? undefined : club?.ciudad.slug);

  if (isLoading) return <LoadingSkeleton />;
  if (!club) return <NotFoundState />;

  const sportSlugs: Sport[] = club.clubes_deportes
    .map((cd) => cd.deporte.slug)
    .filter((s): s is Sport => KNOWN_SPORTS.includes(s as Sport));
  const primarySportSlug = getPrimarySportSlug(club.clubes_deportes);

  const sportNames = club.clubes_deportes
    .map((cd) => cd.deporte.nombre)
    .filter(Boolean)
    .join(" y ");
  const seoTitle = sportNames
    ? `${club.nombre} — ${sportNames} en ${club.ciudad.nombre}`
    : `${club.nombre} en ${club.ciudad.nombre}`;
  const seoDescription = club.descripcion
    ? club.descripcion.slice(0, 160)
    : `${club.nombre}: ${sportNames || "Canchas"} en ${club.ciudad.nombre}.`;
  const canonicalPath = buildClubHref(club);

  const breadcrumbItems = [
    { label: "Canchas", href: "/canchas" },
    { label: club.pais.nombre, href: `/canchas/${club.pais.slug}` },
    {
      label: club.ciudad.nombre,
      href: `/canchas/${club.pais.slug}/${club.ciudad.slug}`,
    },
    ...(club.barrio
      ? [
          {
            label: club.barrio.nombre,
            href: `/canchas/${club.pais.slug}/${club.ciudad.slug}/${club.barrio.slug}`,
          },
        ]
      : []),
    { label: club.nombre },
  ];

  const services: { key: keyof ClubFull; label: string }[] = [
    { key: "vestuarios", label: "Vestuarios" },
    { key: "estacionamiento", label: "Estacionamiento" },
    { key: "bar_restaurante", label: "Bar / Restaurante" },
    { key: "clases", label: "Clases grupales" },
    { key: "alquiler_raquetas", label: "Alquiler de raquetas" },
    { key: "iluminacion", label: "Iluminación" },
    { key: "accesibilidad", label: "Accesibilidad" },
  ];
  const activeServices = services.filter((s) => club[s.key] === true);

  const contacts = [
    club.telefono && {
      icon: Phone,
      label: club.telefono,
      href: `tel:${club.telefono}`,
    },
    club.email && {
      icon: Mail,
      label: club.email,
      href: `mailto:${club.email}`,
    },
    club.website && {
      icon: Globe,
      label: club.website.replace(/^https?:\/\//, ""),
      href: club.website,
    },
    club.instagram && {
      icon: Instagram,
      label: `@${club.instagram}`,
      href: `https://instagram.com/${club.instagram}`,
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; href: string }[];

  const contactHref = buildContactHref(club);
  const onContactClick = handleContactClick(contactHref);

  // PostGIS GeoJSON: [lng, lat]. Leaflet wants [lat, lng].
  const [lng, lat] = club.ubicacion.coordinates;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const wazeUrl = `https://www.waze.com/ul?ll=${lat}%2C${lng}&navigate=yes`;

  // Open status (mocked — TODO: derive from club.horario_apertura/cierre)
  const isOpenNow = true;

  // Nearby clubs: prefer barrio, fall back to ciudad. Filter out current,
  // require a foto_portada (CourtCard takes a string URL with no placeholder),
  // and cap at 3.
  // TODO: support placeholder images in CourtCard so we can include
  // photo-less clubs here.
  const nearbyRaw = club.barrio ? nearbyByBarrio.data : nearbyByCiudad.data;
  const nearby =
    (nearbyRaw ?? [])
      .filter((c) => c.slug !== club.slug && c.foto_portada?.id)
      .slice(0, 3);
  const nearbyTitle = club.barrio
    ? `CANCHAS CERCANAS EN ${club.barrio.nombre.toUpperCase()}`
    : `MÁS CANCHAS EN ${club.ciudad.nombre.toUpperCase()}`;

  // Bottom "Más canchas en…" chips: counts deferred (TODO: real counts).
  const bottomChips = [
    club.barrio && {
      label: club.barrio.nombre,
      href: `/canchas/${club.pais.slug}/${club.ciudad.slug}/${club.barrio.slug}`,
    },
    {
      label: club.ciudad.nombre,
      href: `/canchas/${club.pais.slug}/${club.ciudad.slug}`,
    },
    { label: club.pais.nombre, href: `/canchas/${club.pais.slug}` },
    { label: "Latinoamérica", href: "/canchas" },
  ].filter(Boolean) as { label: string; href: string }[];

  const heroFileId = club.foto_portada?.id ?? null;

  return (
    <PageShell>
      <SeoMeta
        title={seoTitle}
        description={seoDescription}
        canonicalPath={canonicalPath}
        ogImage={heroFileId ? assetUrl(heroFileId, { width: 1200, height: 630, fit: "cover" }) : undefined}
        ogType="article"
      />
      <SchemaOrgClub club={club} url={`https://haycancha.com${canonicalPath}`} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className={`${SECTION_PAD} py-3`}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Gallery — single hero photo or placeholder */}
      <section className="bg-light">
        <div className={`${SECTION_PAD} pt-6`}>
          <ClubPhoto
            clubName={club.nombre}
            fileId={heroFileId}
            primarySportSlug={primarySportSlug}
            width={1200}
            height={400}
            size="lg"
            loading="eager"
            className="w-full h-[280px] md:h-[400px] object-cover rounded-xl"
            alt={`Foto principal de ${club.nombre}`}
          />
        </div>
      </section>

      {/* Slot 5 — club-after-gallery */}
      <div className={SECTION_PAD}>
        <AdSlot slot="club-after-gallery" format="in-article" />
      </div>

      <section className={`${SECTION_PAD} mt-8`}>
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {sportSlugs.map((s) => (
                <SportBadge key={s} sport={s} />
              ))}
              {club.es_premium && <SportBadge sport="premium" />}
            </div>
            <h1 className="font-display text-dark text-[36px] md:text-[56px] leading-[0.95]">
              {club.nombre.toUpperCase()}
            </h1>
            <p className="mt-3 flex items-start gap-2 text-gray text-[15px]">
              <MapPin size={16} className="text-orange shrink-0 mt-0.5" />
              {club.direccion}
              {club.barrio ? `, ${club.barrio.nombre}` : ""}, {club.ciudad.nombre}
            </p>
          </div>

          {/* Action card sticky on desktop */}
          <aside className="lg:sticky lg:top-20">
            <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-3">
              <CtaButton
                className="w-full"
                onClick={onContactClick}
                disabled={!contactHref}
              >
                {contactHref ? "Contactar" : "Sin contacto disponible"}
              </CtaButton>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-dark hover:text-orange transition"
              >
                <Navigation size={15} /> Cómo llegar
              </a>
              <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-dark hover:text-orange transition">
                <Share2 size={15} /> Compartir
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* Info 3-cols */}
      <section className={`${SECTION_PAD} mt-12 lg:mt-16`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {/* Canchas */}
          <div>
            <SectionLabel>Canchas</SectionLabel>
            {club.clubes_deportes.length > 0 ? (
              <ul className="space-y-4 text-[14px] text-dark">
                {club.clubes_deportes.map((cd, i) => {
                  const detailParts: string[] = [];
                  if (cd.superficie) detailParts.push(SURFACE_LABELS[cd.superficie]);
                  if (cd.indoor) detailParts.push("Indoor");
                  if (cd.iluminacion) detailParts.push("Con iluminación");
                  return (
                    <li key={`${cd.deporte.slug}-${i}`}>
                      <div className="font-semibold">
                        {cd.cantidad_canchas ?? "—"} canchas de {cd.deporte.nombre}
                      </div>
                      {detailParts.length > 0 && (
                        <p className="text-gray text-[13px] mt-1">
                          {detailParts.join(" · ")}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray text-[14px]">Sin información de canchas</p>
            )}
          </div>

          {/* Servicios */}
          <div>
            <SectionLabel>Servicios</SectionLabel>
            {activeServices.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {activeServices.map((s) => (
                  <span
                    key={s.key as string}
                    className="inline-flex items-center gap-1.5 bg-light border border-border rounded text-[12px] font-medium text-dark px-2.5 py-1.5"
                  >
                    <Check size={12} className="text-orange" strokeWidth={3} />
                    {s.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray text-[14px]">Sin información de servicios</p>
            )}
          </div>

          {/* Horarios — TODO: wire to club.horario_apertura/cierre/texto when DB has data */}
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
              {MOCK_SCHEDULE.map((s) => (
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
      <section className={`${SECTION_PAD} mt-12 lg:mt-16`}>
        <SectionLabel>Ubicación</SectionLabel>
        <div className="relative rounded-xl overflow-hidden border border-border">
          <ClubLocationMap lat={lat} lng={lng} name={club.nombre} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
          <p className="text-[14px] text-dark">{club.direccion}</p>
          <div className="flex gap-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-gray hover:text-orange transition"
            >
              Ver en Google Maps <ExternalLink size={12} />
            </a>
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-gray hover:text-orange transition"
            >
              Ver en Waze <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact — hidden if no contact channels */}
      {contacts.length > 0 && (
        <section className={`${SECTION_PAD} mt-12 lg:mt-16`}>
          <SectionLabel>Contacto</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 bg-white border border-border rounded-md px-3 py-2 text-[13px] font-medium text-dark hover:border-orange hover:text-orange transition"
              >
                <c.icon size={14} className="text-orange" />
                {c.label}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Slot 6 — club-sidebar (300x600). Lives in document flow, not sticky.
          Hidden on tablet/mobile (<lg) per density rules. */}
      <aside className={`hidden lg:block ${SECTION_PAD} mt-12`}>
        <div className="ml-auto">
          <AdSlot slot="club-sidebar" format="sidebar" />
        </div>
      </aside>

      {/* Slot 7 — club-before-similar (leaderboard separator) */}
      <div className={`${SECTION_PAD} mt-12`}>
        <AdSlot slot="club-before-similar" format="leaderboard" />
      </div>

      {/* Nearby */}
      {nearby.length > 0 && (
        <section className={`${SECTION_PAD} mt-16`}>
          <h2 className="font-display text-dark text-[28px] md:text-[32px] leading-none mb-6">
            {nearbyTitle}
          </h2>
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0 snap-x">
            {nearby.map((c) => {
              const cSports: Sport[] = (c.clubes_deportes ?? [])
                .map((cd) => cd.deporte.slug)
                .filter((s): s is Sport => KNOWN_SPORTS.includes(s as Sport));
              const image = assetUrl(c.foto_portada!.id, {
                width: 400,
                height: 250,
                fit: "cover",
                quality: 80,
              });
              return (
                <Link
                  key={c.id}
                  to={buildClubHref(c)}
                  className="min-w-[280px] md:min-w-0 snap-start"
                >
                  <CourtCard
                    name={c.nombre}
                    neighborhood={c.barrio?.nombre ?? c.ciudad.nombre}
                    city={c.ciudad.nombre}
                    image={image}
                    sports={cSports}
                    premium={c.es_premium}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* SEO breadcrumb chips — counts deferred (TODO: real counts) */}
      <section className="bg-light mt-16">
        <div className={`${SECTION_PAD} py-10`}>
          <p className="label-meta uppercase text-gray mb-3">Más canchas en</p>
          <div className="flex flex-wrap gap-2">
            {bottomChips.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="inline-flex items-center gap-2 bg-white border border-border rounded-md px-4 py-2 text-[13px] text-dark hover:border-orange hover:text-orange transition"
              >
                <span className="font-semibold">{l.label}</span>
                <span className="text-gray">(... canchas)</span>
                <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Floating sticky sidebar (desktop) — name, sport badges, CONTACTAR */}
      {scrolled && (
        <aside className="hidden lg:block fixed top-24 right-6 w-[300px] z-40 animate-in fade-in slide-in-from-right-4">
          <div className="bg-white rounded-xl border border-border shadow-card-hover p-4 space-y-3">
            <div className="font-semibold text-[14px] text-dark">{club.nombre}</div>
            {sportSlugs.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {sportSlugs.map((s) => (
                  <SportBadge key={s} sport={s} />
                ))}
              </div>
            )}
            <CtaButton
              className="w-full !py-2.5 !text-[12px]"
              onClick={onContactClick}
              disabled={!contactHref}
            >
              {contactHref ? "Contactar" : "Sin contacto"}
            </CtaButton>
          </div>
        </aside>
      )}

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-3 flex gap-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 h-12 border-2 border-orange text-orange font-semibold text-[13px] uppercase tracking-wider rounded-md"
        >
          <Navigation size={15} /> Cómo llegar
        </a>
        <button
          onClick={onContactClick}
          disabled={!contactHref}
          className="flex-[1.2] inline-flex items-center justify-center gap-2 h-12 bg-orange text-white font-semibold text-[13px] uppercase tracking-wider rounded-md disabled:opacity-50 disabled:pointer-events-none"
        >
          <Phone size={15} /> {contactHref ? "Contactar" : "Sin contacto"}
        </button>
      </div>
      {/* Spacer so footer not hidden behind sticky bar on mobile */}
      <div className="lg:hidden h-16" aria-hidden />
    </PageShell>
  );
};

export default ClubDetailPage;
