import { useEffect } from "react";
import {
  LegalPageLayout,
  LegalH2,
  LegalP,
  LegalUl,
  LegalA,
  LegalStrong,
} from "@/components/legal/LegalPageLayout";

const TOC = [
  { id: "que-es", label: "1. Qué es HayCancha" },
  { id: "uso", label: "2. Uso del sitio" },
  { id: "info-clubes", label: "3. Información de los clubes" },
  { id: "ugc", label: "4. Contenido enviado por usuarios" },
  { id: "ip", label: "5. Propiedad intelectual" },
  { id: "publicidad", label: "6. Publicidad" },
  { id: "disponibilidad", label: "7. Disponibilidad del servicio" },
  { id: "modificaciones", label: "8. Modificaciones a estos términos" },
  { id: "limitacion", label: "9. Limitación de responsabilidad" },
  { id: "ley", label: "10. Ley aplicable y jurisdicción" },
  { id: "contacto", label: "11. Contacto" },
];

const TerminosPage = () => {
  useEffect(() => {
    document.title = "Términos y Condiciones — HayCancha";
    const meta = document.querySelector('meta[name="description"]');
    const desc =
      "Términos y condiciones de uso del directorio HayCancha.com. Reglas de uso, contenido de usuarios, propiedad intelectual y limitación de responsabilidad.";
    if (meta) meta.setAttribute("content", desc);
  }, []);

  return (
    <LegalPageLayout
      title="TÉRMINOS Y CONDICIONES"
      breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Términos y Condiciones" }]}
      lastUpdated="[FECHA_A_COMPLETAR]"
      toc={TOC}
    >
      <LegalP>
        Bienvenido/a a HayCancha.com. Al usar este sitio aceptás los siguientes términos. Si no
        estás de acuerdo con alguno de ellos, te pedimos que no uses el sitio.
      </LegalP>

      <LegalH2 id="que-es">1. Qué es HayCancha</LegalH2>
      <LegalP>
        HayCancha.com es un directorio digital de canchas y clubes de tenis, pádel y pickleball
        ubicados en países hispanohablantes de Latinoamérica. Su único objetivo es facilitarles a
        los jugadores encontrar lugares para jugar.
      </LegalP>
      <LegalP>
        <LegalStrong>HayCancha NO es:</LegalStrong>
      </LegalP>
      <LegalUl>
        <li>Una plataforma de reservas: no procesamos pagos ni administramos turnos.</li>
        <li>
          Un intermediario comercial: no cobramos comisiones por las contrataciones que hagas con
          un club.
        </li>
        <li>
          El operador de los clubes listados: no somos responsables de la atención, los precios ni
          la calidad del servicio prestado por cada complejo.
        </li>
      </LegalUl>

      <LegalH2 id="uso">2. Uso del sitio</LegalH2>
      <LegalP>Podés usar HayCancha para:</LegalP>
      <LegalUl>
        <li>Buscar canchas y clubes.</li>
        <li>Ver información de contacto y características.</li>
        <li>Sugerir nuevos complejos a través del formulario "Agregá tu cancha".</li>
        <li>Reportar información incorrecta sobre un club.</li>
      </LegalUl>
      <LegalP>NO está permitido:</LegalP>
      <LegalUl>
        <li>
          Hacer scraping masivo automatizado del sitio (esto puede ser bloqueado a nivel técnico y
          consultado con autoridades cuando aplique).
        </li>
        <li>
          Usar los datos de los clubes para crear directorios competidores o para envío masivo de
          mensajes no solicitados.
        </li>
        <li>Cargar información falsa, engañosa o injuriosa al formulario de alta.</li>
        <li>
          Hacerse pasar por el dueño/encargado de un complejo del que no se tiene autorización.
        </li>
      </LegalUl>

      <LegalH2 id="info-clubes">3. Información de los clubes — Exención de responsabilidad</LegalH2>
      <LegalP>La información publicada sobre cada club proviene de tres fuentes:</LegalP>
      <LegalUl>
        <li>Datos públicos (sitios web del club, redes sociales, federaciones).</li>
        <li>APIs de terceros (Google Places, OpenStreetMap).</li>
        <li>El formulario "Agregá tu cancha" completado por dueños o jugadores.</li>
      </LegalUl>
      <LegalP>
        Hacemos un esfuerzo razonable para que la información sea precisa y esté actualizada, pero
        NO podemos garantizarlo. Antes de visitar un club te recomendamos confirmar telefónicamente:
      </LegalP>
      <LegalUl>
        <li>Horarios de atención</li>
        <li>Disponibilidad de canchas</li>
        <li>Precios actuales</li>
        <li>Servicios incluidos</li>
      </LegalUl>
      <LegalP>
        HayCancha NO se hace responsable por información desactualizada o incorrecta. Si encontrás
        un dato erróneo, escribinos a{" "}
        <LegalA href="mailto:contacto@haycancha.com">contacto@haycancha.com</LegalA> y lo
        corregimos.
      </LegalP>

      <LegalH2 id="ugc">4. Contenido enviado por usuarios</LegalH2>
      <LegalP>Cuando enviás información a través del formulario "Agregá tu cancha":</LegalP>
      <LegalUl>
        <li>
          Confirmás que tenés autorización para publicarla (si sos dueño/encargado) o que es
          información pública del lugar (si sos jugador).
        </li>
        <li>
          Nos otorgás una licencia no exclusiva, mundial, gratuita y revocable para mostrar esa
          información en el sitio.
        </li>
        <li>
          Aceptás que nuestro equipo la revise antes de publicar y eventualmente la edite para
          ajustarla al formato del directorio.
        </li>
        <li>
          Reconocés que NO toda solicitud es publicada: rechazamos las que tienen información
          insuficiente, falsa o cuando no podemos verificar la existencia del lugar.
        </li>
      </LegalUl>
      <LegalP>Nos reservamos el derecho de eliminar cualquier ficha si:</LegalP>
      <LegalUl>
        <li>El club nos solicita ser dado de baja.</li>
        <li>Detectamos información falsa o que viole derechos de terceros.</li>
        <li>El lugar deja de operar.</li>
      </LegalUl>

      <LegalH2 id="ip">5. Propiedad intelectual</LegalH2>
      <LegalUl>
        <li>
          El logo de HayCancha, el nombre, el design system y el contenido editorial original
          (artículos, descripciones generales, copy del sitio) son propiedad de HayCancha.com.
        </li>
        <li>
          Las fotos de los clubes pertenecen a sus respectivos titulares (clubes, fotógrafos,
          fuentes públicas como Google Places). Cuando es exigido por la fuente, mostramos la
          atribución correspondiente.
        </li>
        <li>
          Los datos de mapas y geocoding son de OpenStreetMap (licencia ODbL — ver{" "}
          <LegalA href="/atribucion-osm">/atribucion-osm</LegalA>).
        </li>
        <li>
          No está permitido copiar, redistribuir ni reutilizar el contenido del sitio con fines
          comerciales sin autorización escrita.
        </li>
      </LegalUl>

      <LegalH2 id="publicidad">6. Publicidad</LegalH2>
      <LegalP>
        HayCancha.com muestra publicidad de terceros (Google AdSense) y eventualmente listados
        premium pagos por clubes. Toda publicidad está claramente identificada con la palabra
        "PUBLICIDAD" arriba del bloque.
      </LegalP>
      <LegalP>Los listados premium de clubes:</LegalP>
      <LegalUl>
        <li>Aparecen destacados en los resultados de búsqueda.</li>
        <li>No alteran la información objetiva del club ni su ubicación en el mapa.</li>
        <li>Están identificados con un ícono de estrella y un borde diferenciado.</li>
      </LegalUl>

      <LegalH2 id="disponibilidad">7. Disponibilidad del servicio</LegalH2>
      <LegalP>
        Nos esforzamos por mantener el sitio disponible las 24 horas, pero no podemos garantizar
        disponibilidad ininterrumpida. Pueden ocurrir interrupciones por mantenimiento programado,
        fallas técnicas o causas de fuerza mayor.
      </LegalP>
      <LegalP>
        NO somos responsables por daños o perjuicios derivados de la imposibilidad de acceder al
        sitio.
      </LegalP>

      <LegalH2 id="modificaciones">8. Modificaciones a estos términos</LegalH2>
      <LegalP>
        Podemos actualizar estos Términos en cualquier momento. Si los cambios son significativos,
        te avisaremos con un aviso en la home del sitio durante al menos 14 días antes de que
        entren en vigencia.
      </LegalP>
      <LegalP>
        El uso continuado del sitio después de la fecha de entrada en vigencia implica la
        aceptación de los nuevos términos.
      </LegalP>

      <LegalH2 id="limitacion">9. Limitación de responsabilidad</LegalH2>
      <LegalP>
        En la máxima medida permitida por la ley aplicable, HayCancha.com (incluyendo sus
        operadores y empleados) NO será responsable por:
      </LegalP>
      <LegalUl>
        <li>Daños directos, indirectos, incidentales o consecuentes derivados del uso del sitio.</li>
        <li>Lesiones, accidentes o problemas que sufras al asistir a un club listado.</li>
        <li>Disputas comerciales con un club que hayas contactado a través del directorio.</li>
        <li>Pérdida de datos, ingresos o oportunidades derivada de información publicada.</li>
      </LegalUl>

      <LegalH2 id="ley">10. Ley aplicable y jurisdicción</LegalH2>
      <LegalP>
        Estos Términos se rigen por las leyes de [PAÍS_JURISDICCION]. Cualquier disputa relacionada
        con el sitio será sometida a los tribunales competentes de [CIUDAD_JURISDICCION],
        renunciando expresamente a cualquier otro fuero.
      </LegalP>

      <LegalH2 id="contacto">11. Contacto</LegalH2>
      <LegalP>
        Para consultas sobre estos términos:
        <br />
        Email: <LegalA href="mailto:contacto@haycancha.com">contacto@haycancha.com</LegalA>
      </LegalP>
    </LegalPageLayout>
  );
};

export default TerminosPage;
