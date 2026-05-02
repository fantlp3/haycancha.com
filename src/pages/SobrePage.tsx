import { useEffect } from "react";
import {
  LegalPageLayout,
  LegalH2,
  LegalP,
  LegalA,
  LegalStrong,
} from "@/components/legal/LegalPageLayout";

const SobrePage = () => {
  useEffect(() => {
    document.title = "Sobre HayCancha — El directorio LATAM de tenis, pádel y pickleball";
    const meta = document.querySelector('meta[name="description"]');
    const desc =
      "HayCancha.com es el directorio de canchas de tenis, pádel y pickleball en Latinoamérica. Especializado, gratis y sin comisiones.";
    if (meta) meta.setAttribute("content", desc);
  }, []);

  return (
    <LegalPageLayout
      title="SOBRE HAYCANCHA"
      breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Sobre HayCancha" }]}
    >
      <LegalH2 id="que-es">El directorio de tenis, pádel y pickleball de Latinoamérica</LegalH2>
      <LegalP>
        HayCancha.com es un directorio digital pensado para que cualquier jugador amateur encuentre
        dónde jugar — rápido, sin trámites, sin intermediarios.
      </LegalP>

      <LegalH2 id="origen">Cómo nació</LegalH2>
      <LegalP>
        HayCancha existe desde hace más de 20 años. Empezó como una guía local de canchas de tenis
        y se mantuvo activa a lo largo del tiempo gracias a una comunidad que entendió el valor de
        tener la información en un solo lugar.
      </LegalP>
      <LegalP>
        En 2026 relanzamos el sitio con una arquitectura completamente nueva: mapa interactivo,
        búsqueda por barrio, fichas detalladas con fotos y datos verificados, y cobertura de los 19
        países hispanohablantes de Latinoamérica.
      </LegalP>

      <LegalH2 id="diferencial">Qué nos diferencia</LegalH2>
      <LegalP>
        <LegalStrong>Especializado.</LegalStrong> Google Maps tiene todo, pero no filtra por
        superficie, iluminación o tipo de cancha. Nosotros sí. Si querés "polvo de ladrillo con
        iluminación nocturna en Palermo", lo encontrás en dos clicks.
      </LegalP>
      <LegalP>
        <LegalStrong>Sin reservas, sin comisiones.</LegalStrong> Te conectamos directamente con el
        club. No cobramos comisiones por turnos ni intermediamos en transacciones. Lo que pagás en
        el club es lo que pagás.
      </LegalP>
      <LegalP>
        <LegalStrong>Datos curados.</LegalStrong> Cada ficha pasa por un proceso de revisión. Las
        fotos son representativas, los teléfonos están verificados, la información de superficie e
        iluminación es real.
      </LegalP>
      <LegalP>
        <LegalStrong>Cobertura LATAM.</LegalStrong> Argentina, México, Colombia, Chile, Perú,
        Uruguay, Venezuela, Ecuador, Paraguay, Bolivia, Costa Rica, Cuba, El Salvador, Guatemala,
        Honduras, Nicaragua, Panamá, Puerto Rico y República Dominicana. Una sola plataforma para
        toda la región hispanohablante.
      </LegalP>

      <LegalH2 id="modelo">Cómo se mantiene el sitio</LegalH2>
      <LegalP>
        HayCancha es gratuito para los jugadores y para los clubes que quieran tener su ficha
        básica publicada. Los costos de operación se cubren con:
      </LegalP>
      <ul className="list-disc pl-6 text-[16px] text-dark leading-[1.7] mb-4 space-y-2">
        <li>Publicidad relevante (Google AdSense), claramente identificada.</li>
        <li>Listados premium opcionales para clubes que quieran mayor visibilidad.</li>
      </ul>
      <LegalP>
        NO cobramos comisiones por reservas, NO vendemos datos de jugadores, NO usamos dark
        patterns. Lo que ves es lo que es.
      </LegalP>

      <LegalH2 id="clubes">Para clubes y dueños de complejos</LegalH2>
      <LegalP>
        Si tenés un club que no aparece, podés agregarlo gratis a través del formulario{" "}
        <LegalA href="/agregar-cancha">Agregá tu cancha</LegalA>. Si tu club ya está y querés
        actualizar la información o destacarlo, escribinos a{" "}
        <LegalA href="mailto:contacto@haycancha.com">contacto@haycancha.com</LegalA>.
      </LegalP>

      <LegalH2 id="anunciantes">Para anunciantes</LegalH2>
      <LegalP>
        Si querés llegar a jugadores activos de tenis, pádel o pickleball en Latinoamérica,
        escribinos a{" "}
        <LegalA href="mailto:publicidad@haycancha.com">publicidad@haycancha.com</LegalA>.
      </LegalP>

      <LegalH2 id="contacto">Contacto</LegalH2>
      <LegalP>
        Email general:{" "}
        <LegalA href="mailto:contacto@haycancha.com">contacto@haycancha.com</LegalA>
      </LegalP>
    </LegalPageLayout>
  );
};

export default SobrePage;
