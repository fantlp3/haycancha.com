import { Check } from "lucide-react";
import { CtaButton } from "@/components/brand/CtaButton";
import mapPreview from "@/assets/map-preview.jpg";

const features = [
  "Búsqueda en tiempo real",
  "Filtros avanzados",
  "Ver en lista o mapa",
  "Datos de contacto",
];

export const MapSection = () => (
  <section className="bg-dark py-16 md:py-20">
    <div className="max-w-container mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <p className="label-meta uppercase text-orange tracking-[3px]">Mapa interactivo</p>
        <h2 className="font-display text-white text-[36px] md:text-[48px] leading-[0.95]">
          BUSCÁ POR<br />UBICACIÓN<span className="text-orange">.</span>
        </h2>
        <p className="text-white/70 text-[16px] max-w-md leading-relaxed">
          Encontrá canchas cerca tuyo en el mapa. Filtrá por deporte, superficie, iluminación y más.
        </p>
        <ul className="space-y-2.5 pt-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-white/80 text-[15px]">
              <span className="w-5 h-5 rounded-full bg-orange/15 text-orange flex items-center justify-center shrink-0">
                <Check size={12} strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <div className="pt-2">
          <CtaButton>Abrir mapa completo</CtaButton>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-card-hover">
        <img
          src={mapPreview}
          alt="Vista previa del mapa interactivo de canchas"
          width={1280}
          height={800}
          loading="lazy"
          className="w-full h-auto object-cover aspect-[16/10]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-md bg-dark/80 backdrop-blur border border-white/10 text-white/80 label-meta uppercase">
          Mapa disponible en la app
        </div>
      </div>
    </div>
  </section>
);
