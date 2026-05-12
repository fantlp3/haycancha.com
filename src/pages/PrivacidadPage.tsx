import { useEffect } from "react";
import {
  LegalPageLayout,
  LegalH2,
  LegalH3,
  LegalP,
  LegalUl,
  LegalA,
  LegalStrong,
} from "@/components/legal/LegalPageLayout";

const TOC = [
  { id: "responsable", label: "1. Responsable del tratamiento" },
  { id: "marco-legal", label: "2. Marco legal aplicable" },
  { id: "datos-recolectamos", label: "3. Datos que recopilamos" },
  { id: "finalidad", label: "4. Finalidad del tratamiento" },
  { id: "base-legal", label: "5. Base legal del tratamiento" },
  { id: "cookies", label: "6. Cookies y tecnologías similares" },
  { id: "terceros", label: "7. Terceros con quienes compartimos" },
  { id: "derechos", label: "8. Derechos del titular" },
  { id: "conservacion", label: "9. Plazo de conservación" },
  { id: "seguridad", label: "10. Seguridad de los datos" },
  { id: "modificaciones", label: "11. Modificaciones a esta política" },
  { id: "contacto", label: "12. Contacto" },
];

const PrivacidadPage = () => {
  useEffect(() => {
    document.title = "Política de Privacidad — HayCancha";
    const desc =
      "Cómo HayCancha.com recolecta, usa y protege tus datos personales. Política de privacidad de P3GROUP S.A. conforme a la Ley 25.326 de Argentina.";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  return (
    <LegalPageLayout
      title="POLÍTICA DE PRIVACIDAD"
      breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Política de Privacidad" }]}
      lastUpdated="12 de mayo de 2026"
      toc={TOC}
    >
      <LegalP>
        Esta Política de Privacidad explica cómo HayCancha.com recolecta, usa, comparte y protege
        los datos personales de quienes visitan o interactúan con el Sitio.
      </LegalP>

      <LegalH2 id="responsable">1. Responsable del tratamiento de datos</LegalH2>
      <LegalP>
        El responsable del tratamiento de los datos personales recolectados a través de{" "}
        <LegalStrong>HayCancha.com</LegalStrong> (en adelante, "el Sitio") es:
      </LegalP>
      <LegalUl>
        <li>
          <LegalStrong>Razón social:</LegalStrong> P3GROUP S.A.
        </li>
        <li>
          <LegalStrong>CUIT:</LegalStrong> 30-70972578-1
        </li>
        <li>
          <LegalStrong>Domicilio legal:</LegalStrong> Basavilbaso 1350, Ciudad Autónoma de Buenos
          Aires, Argentina
        </li>
        <li>
          <LegalStrong>Email de contacto:</LegalStrong>{" "}
          <LegalA href="mailto:legales@p3design.com">legales@p3design.com</LegalA>
        </li>
      </LegalUl>

      <LegalH2 id="marco-legal">2. Marco legal aplicable</LegalH2>
      <LegalP>Esta política se rige por:</LegalP>
      <LegalUl>
        <li>
          <LegalStrong>Ley N° 25.326</LegalStrong> de Protección de los Datos Personales de la
          República Argentina
        </li>
        <li>
          <LegalStrong>Decreto 1558/2001</LegalStrong>, reglamentario de la Ley 25.326
        </li>
        <li>
          Disposiciones de la <LegalStrong>Agencia de Acceso a la Información Pública (AAIP)</LegalStrong>,
          autoridad de aplicación
        </li>
      </LegalUl>
      <LegalP>
        Para usuarios residentes en otros países de Latinoamérica, esta política respeta los
        principios comunes de protección de datos: licitud, finalidad, proporcionalidad, calidad y
        seguridad de los datos tratados.
      </LegalP>

      <LegalH2 id="datos-recolectamos">3. Datos que recopilamos</LegalH2>
      <LegalH3>3.1. Datos que el usuario nos proporciona voluntariamente</LegalH3>
      <LegalP>
        Cuando el usuario interactúa con el Sitio (por ejemplo, al enviar un formulario para sugerir
        un nuevo club, contactarnos o suscribirse a actualizaciones), recolectamos:
      </LegalP>
      <LegalUl>
        <li>Nombre completo</li>
        <li>Dirección de correo electrónico</li>
        <li>Datos del club que desea sumar al directorio (nombre, dirección, teléfono, deportes, etc.)</li>
        <li>Mensajes o comentarios enviados a través de formularios de contacto</li>
      </LegalUl>
      <LegalH3>3.2. Datos recolectados automáticamente</LegalH3>
      <LegalP>Al navegar por el Sitio, recolectamos automáticamente:</LegalP>
      <LegalUl>
        <li>Dirección IP</li>
        <li>Tipo y versión del navegador</li>
        <li>Sistema operativo</li>
        <li>Páginas visitadas dentro del Sitio</li>
        <li>Tiempo de permanencia en cada página</li>
        <li>Fuente de referencia (sitio desde el cual el usuario llegó al nuestro)</li>
        <li>Datos de geolocalización aproximada (a nivel ciudad, derivada de la IP)</li>
      </LegalUl>
      <LegalP>
        Estos datos se obtienen mediante cookies y tecnologías similares (ver sección 6).
      </LegalP>
      <LegalH3>3.3. Datos de menores de edad</LegalH3>
      <LegalP>
        El Sitio está destinado a personas mayores de <LegalStrong>13 años</LegalStrong>. No
        recolectamos conscientemente datos personales de menores de 13 años. Si tomamos conocimiento
        de que hemos recibido datos de un menor de 13 años sin consentimiento parental verificable,
        procederemos a eliminarlos.
      </LegalP>
      <LegalP>
        Si sos padre, madre o tutor legal y creés que un menor a tu cargo nos ha proporcionado
        datos, escribinos a{" "}
        <LegalA href="mailto:legales@p3design.com">legales@p3design.com</LegalA>.
      </LegalP>

      <LegalH2 id="finalidad">4. Finalidad del tratamiento</LegalH2>
      <LegalP>Utilizamos los datos personales recolectados para:</LegalP>
      <LegalUl>
        <li>Operar y mantener el Sitio</li>
        <li>Procesar las sugerencias de nuevos clubes enviadas por los usuarios</li>
        <li>Responder consultas y comunicaciones</li>
        <li>Mejorar la experiencia de usuario y el contenido del Sitio</li>
        <li>Analizar el uso del Sitio mediante herramientas estadísticas</li>
        <li>Mostrar publicidad relevante a través de Google AdSense</li>
        <li>Cumplir con obligaciones legales</li>
      </LegalUl>

      <LegalH2 id="base-legal">5. Base legal del tratamiento</LegalH2>
      <LegalP>El tratamiento de los datos se basa en:</LegalP>
      <LegalUl>
        <li>
          <LegalStrong>Consentimiento del usuario</LegalStrong>, prestado al enviar formularios o
          aceptar el uso de cookies
        </li>
        <li>
          <LegalStrong>Interés legítimo</LegalStrong> del responsable en mantener un directorio de
          canchas funcional, seguro y útil
        </li>
        <li>
          <LegalStrong>Cumplimiento de obligaciones legales</LegalStrong> aplicables
        </li>
      </LegalUl>

      <LegalH2 id="cookies">6. Cookies y tecnologías similares</LegalH2>
      <LegalP>
        El Sitio utiliza cookies propias y de terceros. Las cookies son pequeños archivos de texto
        que se almacenan en el dispositivo del usuario para diversos fines.
      </LegalP>
      <LegalH3>6.1. Tipos de cookies utilizadas</LegalH3>
      <LegalP>
        <LegalStrong>Cookies técnicas (necesarias):</LegalStrong> indispensables para el
        funcionamiento del Sitio. No requieren consentimiento del usuario.
      </LegalP>
      <LegalP>
        <LegalStrong>Cookies de análisis (Google Analytics 4):</LegalStrong> nos permiten analizar
        el comportamiento de los visitantes de manera agregada y anónima. Los datos se procesan en
        servidores de Google LLC (Estados Unidos).
      </LegalP>
      <LegalP>
        <LegalStrong>Cookies publicitarias (Google AdSense):</LegalStrong> permiten a Google y a
        sus socios mostrar publicidad personalizada al usuario, tanto dentro como fuera del Sitio,
        basada en sus visitas previas. Esto incluye el uso de identificadores publicitarios y datos
        de navegación.
      </LegalP>
      <LegalH3>6.2. Gestión de cookies</LegalH3>
      <LegalP>
        Al ingresar al Sitio por primera vez, se le presenta al usuario un banner de cookies donde
        puede aceptar o rechazar el uso de cookies no necesarias. El usuario puede modificar sus
        preferencias en cualquier momento.
      </LegalP>
      <LegalP>
        Adicionalmente, el usuario puede gestionar y eliminar cookies directamente desde la
        configuración de su navegador. Para más información:
      </LegalP>
      <LegalUl>
        <li>
          <LegalStrong>Google Chrome:</LegalStrong>{" "}
          <LegalA href="https://support.google.com/chrome/answer/95647">
            support.google.com/chrome/answer/95647
          </LegalA>
        </li>
        <li>
          <LegalStrong>Mozilla Firefox:</LegalStrong>{" "}
          <LegalA href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan">
            support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan
          </LegalA>
        </li>
        <li>
          <LegalStrong>Safari:</LegalStrong>{" "}
          <LegalA href="https://support.apple.com/es-es/HT201265">
            support.apple.com/es-es/HT201265
          </LegalA>
        </li>
        <li>
          <LegalStrong>Microsoft Edge:</LegalStrong>{" "}
          <LegalA href="https://support.microsoft.com/es-es/microsoft-edge">
            support.microsoft.com/es-es/microsoft-edge
          </LegalA>
        </li>
      </LegalUl>
      <LegalP>
        Para optar por no recibir publicidad personalizada de Google, el usuario puede visitar:{" "}
        <LegalA href="https://adssettings.google.com">adssettings.google.com</LegalA>.
      </LegalP>

      <LegalH2 id="terceros">7. Terceros con quienes compartimos datos</LegalH2>
      <LegalP>
        Para operar el Sitio, compartimos datos con los siguientes proveedores:
      </LegalP>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-[14px] border-collapse">
          <thead>
            <tr className="bg-light">
              <th className="text-left font-bold text-dark border border-border px-3 py-2">
                Proveedor
              </th>
              <th className="text-left font-bold text-dark border border-border px-3 py-2">
                Finalidad
              </th>
              <th className="text-left font-bold text-dark border border-border px-3 py-2">
                Ubicación de servidores
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border px-3 py-2 font-semibold text-dark">
                Contabo GmbH
              </td>
              <td className="border border-border px-3 py-2 text-dark">
                Hosting del Sitio (servidor principal)
              </td>
              <td className="border border-border px-3 py-2 text-dark">
                Alemania (Unión Europea)
              </td>
            </tr>
            <tr>
              <td className="border border-border px-3 py-2 font-semibold text-dark">
                Cloudflare, Inc.
              </td>
              <td className="border border-border px-3 py-2 text-dark">
                CDN, seguridad y protección DDoS
              </td>
              <td className="border border-border px-3 py-2 text-dark">
                Datacenters globales
              </td>
            </tr>
            <tr>
              <td className="border border-border px-3 py-2 font-semibold text-dark">
                Google LLC
              </td>
              <td className="border border-border px-3 py-2 text-dark">
                Analytics (GA4) y publicidad (AdSense)
              </td>
              <td className="border border-border px-3 py-2 text-dark">Estados Unidos</td>
            </tr>
            <tr>
              <td className="border border-border px-3 py-2 font-semibold text-dark">
                OpenStreetMap Foundation
              </td>
              <td className="border border-border px-3 py-2 text-dark">Datos de mapas</td>
              <td className="border border-border px-3 py-2 text-dark">Reino Unido</td>
            </tr>
          </tbody>
        </table>
      </div>
      <LegalP>
        Cada uno de estos proveedores cuenta con sus propias políticas de privacidad. No
        transferimos datos personales a terceros con fines comerciales fuera de los listados
        anteriormente.
      </LegalP>
      <LegalH3>7.1. Transferencias internacionales de datos</LegalH3>
      <LegalP>
        Algunos de los proveedores mencionados procesan datos fuera de Argentina. P3GROUP S.A.
        utiliza únicamente proveedores que ofrecen un nivel adecuado de protección de datos,
        conforme a los estándares internacionales y a la normativa argentina aplicable.
      </LegalP>

      <LegalH2 id="derechos">8. Derechos del titular de los datos</LegalH2>
      <LegalP>
        Como titular de los datos personales, el usuario tiene derecho a:
      </LegalP>
      <LegalUl>
        <li>
          <LegalStrong>Acceso:</LegalStrong> conocer qué datos personales suyos tratamos
        </li>
        <li>
          <LegalStrong>Rectificación:</LegalStrong> solicitar la corrección de datos inexactos o
          incompletos
        </li>
        <li>
          <LegalStrong>Supresión:</LegalStrong> solicitar la eliminación de sus datos cuando ya no
          sean necesarios
        </li>
        <li>
          <LegalStrong>Oposición:</LegalStrong> oponerse al tratamiento de sus datos por motivos
          legítimos
        </li>
        <li>
          <LegalStrong>Portabilidad:</LegalStrong> recibir sus datos en un formato estructurado y
          reutilizable
        </li>
        <li>
          <LegalStrong>Retiro del consentimiento:</LegalStrong> revocar el consentimiento prestado
          en cualquier momento, sin efecto retroactivo
        </li>
      </LegalUl>
      <LegalP>
        Para ejercer cualquiera de estos derechos, el usuario puede contactarnos a{" "}
        <LegalA href="mailto:legales@p3design.com">legales@p3design.com</LegalA>. Responderemos en
        un plazo máximo de <LegalStrong>10 días hábiles</LegalStrong> desde la recepción de la
        solicitud.
      </LegalP>
      <LegalP>
        Asimismo, el usuario tiene derecho a presentar denuncias ante la{" "}
        <LegalStrong>Agencia de Acceso a la Información Pública (AAIP)</LegalStrong>, autoridad de
        control en materia de protección de datos personales en Argentina. Más información:{" "}
        <LegalA href="https://www.argentina.gob.ar/aaip">www.argentina.gob.ar/aaip</LegalA>.
      </LegalP>

      <LegalH2 id="conservacion">9. Plazo de conservación</LegalH2>
      <LegalP>
        Conservamos los datos personales durante el tiempo necesario para cumplir con las
        finalidades para las que fueron recolectados, y por los plazos legales aplicables.
      </LegalP>
      <LegalUl>
        <li>
          <LegalStrong>Datos de formularios de contacto:</LegalStrong> hasta 24 meses desde el
          último contacto
        </li>
        <li>
          <LegalStrong>Datos de sugerencias de clubes:</LegalStrong> mientras el club permanezca en
          el directorio
        </li>
        <li>
          <LegalStrong>Datos de análisis (GA4):</LegalStrong> conforme a la configuración por
          defecto de Google Analytics 4 (hasta 14 meses)
        </li>
        <li>
          <LegalStrong>Logs del servidor:</LegalStrong> hasta 30 días
        </li>
      </LegalUl>

      <LegalH2 id="seguridad">10. Seguridad de los datos</LegalH2>
      <LegalP>
        Implementamos medidas técnicas y organizativas razonables para proteger los datos personales
        contra accesos no autorizados, pérdida, alteración o divulgación. Estas medidas incluyen:
      </LegalP>
      <LegalUl>
        <li>Conexiones cifradas (HTTPS/TLS)</li>
        <li>Tokens de autenticación para acceso administrativo</li>
        <li>Backups periódicos</li>
        <li>Acceso restringido al panel de administración por roles</li>
        <li>Monitoreo de actividad sospechosa a través de Cloudflare</li>
      </LegalUl>
      <LegalP>
        Sin embargo, ningún sistema informático es 100% seguro. En caso de incidente de seguridad
        que afecte los datos personales del usuario, notificaremos al usuario y a la AAIP conforme
        a la normativa aplicable.
      </LegalP>

      <LegalH2 id="modificaciones">11. Modificaciones a esta política</LegalH2>
      <LegalP>
        Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento.
        Cuando hagamos cambios significativos, lo notificaremos mediante un aviso en el Sitio o por
        email a los usuarios registrados.
      </LegalP>
      <LegalP>
        La fecha de "Última actualización" al inicio del documento refleja la versión vigente.
      </LegalP>

      <LegalH2 id="contacto">12. Contacto</LegalH2>
      <LegalP>
        Para consultas, solicitudes o reclamos relacionados con esta Política de Privacidad o con
        el tratamiento de tus datos personales, contactanos a:
      </LegalP>
      <LegalP>
        <LegalStrong>Email:</LegalStrong>{" "}
        <LegalA href="mailto:legales@p3design.com">legales@p3design.com</LegalA>
        <br />
        <LegalStrong>Domicilio postal:</LegalStrong> P3GROUP S.A., Basavilbaso 1350, CABA, Argentina
      </LegalP>
    </LegalPageLayout>
  );
};

export default PrivacidadPage;
