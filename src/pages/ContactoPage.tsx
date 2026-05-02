import { useEffect } from "react";
import { MessageCircle, Plus, Megaphone, Shield, type LucideIcon } from "lucide-react";
import { LegalPageLayout, LegalP, LegalStrong } from "@/components/legal/LegalPageLayout";

interface ContactCard {
  icon: LucideIcon;
  heading: string;
  body: string;
  cta: { label: string; href: string; variant: "link" | "button" };
}

const CARDS: ContactCard[] = [
  {
    icon: MessageCircle,
    heading: "Consultas generales",
    body: "Sugerencias, reportes de errores, preguntas sobre el sitio.",
    cta: { label: "contacto@haycancha.com", href: "mailto:contacto@haycancha.com", variant: "link" },
  },
  {
    icon: Plus,
    heading: "¿Tu club no aparece?",
    body: "Sumalo gratis al directorio en menos de 5 minutos.",
    cta: { label: "Agregá tu cancha →", href: "/agregar-cancha", variant: "button" },
  },
  {
    icon: Megaphone,
    heading: "Publicidad y partners",
    body: "Anunciantes, marcas deportivas, academias, alianzas comerciales.",
    cta: { label: "publicidad@haycancha.com", href: "mailto:publicidad@haycancha.com", variant: "link" },
  },
  {
    icon: Shield,
    heading: "Privacidad y datos",
    body: "Solicitudes sobre tus datos personales, ejercicio de derechos.",
    cta: { label: "privacidad@haycancha.com", href: "mailto:privacidad@haycancha.com", variant: "link" },
  },
];

const ContactoPage = () => {
  useEffect(() => {
    document.title = "Contacto — HayCancha";
  }, []);

  return (
    <LegalPageLayout
      title="CONTACTO"
      breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]}
    >
      <LegalP>
        ¿Tenés algo para decirnos? Estamos para escucharte. Elegí el canal según el motivo:
      </LegalP>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.heading}
              className="bg-light border border-border rounded-lg p-6 flex flex-col"
            >
              <Icon className="h-7 w-7 text-orange mb-4" strokeWidth={2} />
              <h3 className="text-[18px] font-bold text-dark mb-2">{card.heading}</h3>
              <p className="text-[14px] text-gray leading-relaxed mb-5 flex-1">{card.body}</p>
              {card.cta.variant === "button" ? (
                <a
                  href={card.cta.href}
                  className="inline-flex justify-center items-center text-[13px] font-semibold uppercase tracking-wider text-white bg-orange rounded-md px-4 py-2.5 hover:bg-orange/90 transition-colors w-full md:w-auto md:self-start"
                >
                  {card.cta.label}
                </a>
              ) : (
                <a
                  href={card.cta.href}
                  className="text-[14px] font-semibold text-orange hover:underline break-all"
                >
                  {card.cta.label}
                </a>
              )}
            </div>
          );
        })}
      </div>

      <LegalP>
        <LegalStrong>Tiempo de respuesta</LegalStrong>
        <br />
        Respondemos dentro de las 48 horas hábiles. Para temas de privacidad, dentro de los 10 días
        hábiles según corresponda por ley.
      </LegalP>
      <LegalP>
        <LegalStrong>Redes sociales</LegalStrong>
        <br />
        Pronto vas a poder seguirnos en Instagram (@haycancha) y otras redes. Mientras tanto, el
        email es la forma más confiable de contactarnos.
      </LegalP>
    </LegalPageLayout>
  );
};

export default ContactoPage;
