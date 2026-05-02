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
  { id: "quienes-somos", label: "1. Quiénes somos" },
  { id: "que-recolectamos", label: "2. Qué información recolectamos" },
  { id: "para-que-usamos", label: "3. Para qué usamos tu información" },
  { id: "con-quien-compartimos", label: "4. Con quién compartimos" },
  { id: "cookies", label: "5. Cookies y tecnologías similares" },
  { id: "tus-derechos", label: "6. Tus derechos" },
  { id: "retencion", label: "7. Retención de datos" },
  { id: "menores", label: "8. Menores de edad" },
  { id: "transferencia", label: "9. Transferencia internacional" },
  { id: "cambios", label: "10. Cambios a esta política" },
  { id: "contacto", label: "11. Contacto" },
];

const PrivacidadPage = () => {
  useEffect(() => {
    document.title = "Política de Privacidad — HayCancha";
    const meta = document.querySelector('meta[name="description"]');
    const desc =
      "Cómo HayCancha.com recolecta, usa y protege tus datos personales. Cookies, analítica, publicidad y derechos del usuario.";
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
      lastUpdated="[FECHA_A_COMPLETAR]"
      toc={TOC}
    >
      <LegalP>
        En HayCancha.com nos tomamos en serio la privacidad de las personas que visitan nuestro
        sitio. Esta Política explica qué información recolectamos, cómo la usamos, con quién la
        compartimos y qué derechos tenés sobre tus datos.
      </LegalP>

      <LegalH2 id="quienes-somos">1. Quiénes somos</LegalH2>
      <LegalP>
        HayCancha.com (en adelante, "HayCancha", "el sitio" o "nosotros") es un directorio digital
        de canchas de tenis, pádel y pickleball en Latinoamérica.
      </LegalP>
      <LegalP>
        Responsable del tratamiento de datos: [NOMBRE_LEGAL_O_RAZON_SOCIAL]
        <br />
        Domicilio: [DOMICILIO_LEGAL]
        <br />
        Email de contacto para temas de privacidad:{" "}
        <LegalA href="mailto:privacidad@haycancha.com">privacidad@haycancha.com</LegalA>
      </LegalP>

      <LegalH2 id="que-recolectamos">2. Qué información recolectamos</LegalH2>
      <LegalH3>Información que nos proporcionás directamente:</LegalH3>
      <LegalUl>
        <li>
          Cuando completás el formulario "Agregá tu cancha": nombre del complejo, dirección, datos
          de contacto (teléfono, email, WhatsApp, sitio web, redes sociales), fotos del complejo,
          nombre y apellido de la persona de contacto.
        </li>
        <li>
          Cuando nos escribís a cualquier email del sitio: el contenido del mensaje y los datos que
          nos compartas en él.
        </li>
      </LegalUl>
      <LegalH3>Información que se recolecta automáticamente:</LegalH3>
      <LegalUl>
        <li>
          Datos técnicos: dirección IP, tipo de dispositivo, navegador, sistema operativo, idioma,
          país aproximado (a nivel ciudad).
        </li>
        <li>
          Datos de navegación: páginas visitadas, tiempo en cada página, origen del tráfico
          (buscador, link directo, redes), búsquedas realizadas dentro del sitio.
        </li>
        <li>Cookies: ver sección 5.</li>
      </LegalUl>
      <LegalH3>Información que NO recolectamos:</LegalH3>
      <LegalUl>
        <li>
          No solicitamos ni almacenamos contraseñas de jugadores (el sitio no requiere registro).
        </li>
        <li>
          No solicitamos datos de tarjetas de crédito ni información financiera (no procesamos
          pagos).
        </li>
        <li>
          No recolectamos datos sensibles como salud, religión, orientación sexual, ideología
          política o afiliación sindical.
        </li>
      </LegalUl>

      <LegalH2 id="para-que-usamos">3. Para qué usamos tu información</LegalH2>
      <LegalUl>
        <li>
          <LegalStrong>Operar el directorio:</LegalStrong> publicar y mantener actualizadas las
          fichas de los clubes y complejos.
        </li>
        <li>
          <LegalStrong>Mejorar el sitio:</LegalStrong> entender qué buscan los usuarios y qué
          contenido es más útil, en forma agregada y anónima.
        </li>
        <li>
          <LegalStrong>Comunicarnos con vos:</LegalStrong> responder consultas, notificar sobre el
          estado de una solicitud que enviaste.
        </li>
        <li>
          <LegalStrong>Mostrar publicidad relevante:</LegalStrong> a través de Google AdSense, solo
          si nos diste consentimiento explícito.
        </li>
        <li>
          <LegalStrong>Cumplir obligaciones legales:</LegalStrong> responder a requerimientos de
          autoridades cuando corresponda por ley.
        </li>
      </LegalUl>

      <LegalH2 id="con-quien-compartimos">4. Con quién compartimos tu información</LegalH2>
      <LegalP>
        HayCancha trabaja con proveedores de servicios externos que pueden acceder a parte de tus
        datos para realizar funciones específicas en nuestro nombre:
      </LegalP>
      <LegalUl>
        <li>
          <LegalStrong>Google LLC (Estados Unidos):</LegalStrong> Google Analytics 4 para análisis
          de tráfico (datos anonimizados), Google AdSense para publicidad. Política:{" "}
          <LegalA href="https://policies.google.com/privacy">https://policies.google.com/privacy</LegalA>
        </li>
        <li>
          <LegalStrong>Cloudflare Inc. (Estados Unidos):</LegalStrong> CDN y protección contra
          ataques. Política:{" "}
          <LegalA href="https://www.cloudflare.com/privacypolicy/">
            https://www.cloudflare.com/privacypolicy/
          </LegalA>
        </li>
        <li>
          <LegalStrong>OpenStreetMap Foundation (Reino Unido):</LegalStrong> datos de mapas y
          geocoding. Política:{" "}
          <LegalA href="https://wiki.osmfoundation.org/wiki/Privacy_Policy">
            https://wiki.osmfoundation.org/wiki/Privacy_Policy
          </LegalA>
        </li>
        <li>
          <LegalStrong>Resend (Estados Unidos):</LegalStrong> envío de emails transaccionales
          (notificaciones a clubes que enviaron una solicitud). Política:{" "}
          <LegalA href="https://resend.com/legal/privacy-policy">
            https://resend.com/legal/privacy-policy
          </LegalA>
        </li>
        <li>
          <LegalStrong>Servidor propio:</LegalStrong> la información de las fichas de clubes se
          almacena en nuestra base de datos PostgreSQL alojada en infraestructura propia ubicada en
          [PAÍS_DEL_VPS].
        </li>
      </LegalUl>
      <LegalP>
        NO vendemos, alquilamos ni cedemos tus datos personales a terceros con fines comerciales.
        NO compartimos información con redes sociales más allá de los botones de "compartir" que
        actuás voluntariamente.
      </LegalP>

      <LegalH2 id="cookies">5. Cookies y tecnologías similares</LegalH2>
      <LegalP>Usamos cookies y almacenamiento local del navegador para:</LegalP>
      <LegalH3>Cookies esenciales (no se pueden desactivar):</LegalH3>
      <LegalUl>
        <li>Recordar tus preferencias de visualización (vista mapa, grilla o lista).</li>
        <li>Recordar tu decisión sobre el banner de cookies.</li>
        <li>Mantener el funcionamiento del formulario "Agregá tu cancha".</li>
      </LegalUl>
      <LegalH3>Cookies de analítica (opcionales, requieren tu consentimiento):</LegalH3>
      <LegalUl>
        <li>Google Analytics 4: medir uso del sitio en forma anónima y agregada.</li>
      </LegalUl>
      <LegalH3>Cookies de publicidad (opcionales, requieren tu consentimiento):</LegalH3>
      <LegalUl>
        <li>
          Google AdSense: mostrar anuncios y medir su efectividad. Si no consentís, igual podés ver
          el sitio completo — solo no verás publicidad personalizada.
        </li>
      </LegalUl>
      <LegalP>
        Podés cambiar tus preferencias de cookies en cualquier momento desde el link "Configurar
        cookies" en el footer.
      </LegalP>

      <LegalH2 id="tus-derechos">6. Tus derechos</LegalH2>
      <LegalP>
        Independientemente del país donde residas, tenés los siguientes derechos sobre tus datos
        personales:
      </LegalP>
      <LegalUl>
        <li>
          <LegalStrong>Acceso:</LegalStrong> saber qué información tenemos sobre vos.
        </li>
        <li>
          <LegalStrong>Rectificación:</LegalStrong> corregir información inexacta o incompleta.
        </li>
        <li>
          <LegalStrong>Eliminación:</LegalStrong> pedir que eliminemos tus datos (sujeto a
          obligaciones legales de retención).
        </li>
        <li>
          <LegalStrong>Oposición:</LegalStrong> oponerte al tratamiento de tus datos para fines
          específicos.
        </li>
        <li>
          <LegalStrong>Portabilidad:</LegalStrong> recibir una copia de tus datos en formato
          estructurado.
        </li>
        <li>
          <LegalStrong>Revocar consentimiento:</LegalStrong> retirar el consentimiento que hayas
          dado, en cualquier momento.
        </li>
      </LegalUl>
      <LegalP>
        Para ejercer cualquiera de estos derechos, escribinos a{" "}
        <LegalA href="mailto:privacidad@haycancha.com">privacidad@haycancha.com</LegalA> con tu
        solicitud. Respondemos dentro de los 10 días hábiles.
      </LegalP>

      <LegalH2 id="retencion">7. Retención de datos</LegalH2>
      <LegalUl>
        <li>
          <LegalStrong>Información del formulario "Agregá tu cancha"</LegalStrong> (datos del
          club): se mantiene mientras el club esté publicado en el directorio. Si el club nos
          solicita ser dado de baja, eliminamos la ficha en un plazo de 30 días hábiles.
        </li>
        <li>
          <LegalStrong>Datos de contacto del solicitante</LegalStrong> (nombre, email del
          responsable que cargó el club): se mantienen por 24 meses desde el último contacto, a
          fines de soporte.
        </li>
        <li>
          <LegalStrong>Datos de analítica anónimos:</LegalStrong> retenidos por 14 meses (estándar
          de Google Analytics).
        </li>
        <li>
          <LegalStrong>Logs técnicos del servidor:</LegalStrong> rotados cada 90 días.
        </li>
      </LegalUl>

      <LegalH2 id="menores">8. Menores de edad</LegalH2>
      <LegalP>
        HayCancha no está dirigido a menores de 16 años. No recolectamos a sabiendas datos
        personales de menores. Si sos padre/madre/tutor y creés que tu hijo/a nos proporcionó
        información, escribinos y la eliminaremos.
      </LegalP>

      <LegalH2 id="transferencia">9. Transferencia internacional de datos</LegalH2>
      <LegalP>
        Algunos de nuestros proveedores (Google, Cloudflare, Resend) están ubicados fuera de
        Latinoamérica, principalmente en Estados Unidos. Estas empresas se adhieren a marcos de
        transferencia internacional de datos reconocidos (Cláusulas Contractuales Estándar,
        certificación Data Privacy Framework de la UE, etc.).
      </LegalP>

      <LegalH2 id="cambios">10. Cambios a esta política</LegalH2>
      <LegalP>
        Podemos actualizar esta política periódicamente. Cuando hagamos cambios significativos, te
        avisaremos:
      </LegalP>
      <LegalUl>
        <li>Publicando un aviso en la home del sitio durante al menos 14 días.</li>
        <li>Actualizando la fecha de "Última actualización" arriba.</li>
      </LegalUl>

      <LegalH2 id="contacto">11. Contacto</LegalH2>
      <LegalP>
        Si tenés preguntas sobre esta política o sobre cómo manejamos tus datos:
      </LegalP>
      <LegalP>
        Email: <LegalA href="mailto:privacidad@haycancha.com">privacidad@haycancha.com</LegalA>
        <br />
        Domicilio: [DOMICILIO_LEGAL]
      </LegalP>
      <LegalP>
        Si estás en Argentina, tenés derecho a presentar reclamos ante la Agencia de Acceso a la
        Información Pública (AAIP) —{" "}
        <LegalA href="https://www.argentina.gob.ar/aaip">www.argentina.gob.ar/aaip</LegalA>
        <br />
        Si estás en otros países LATAM, podés acudir a la autoridad de protección de datos
        correspondiente de tu jurisdicción.
      </LegalP>
    </LegalPageLayout>
  );
};

export default PrivacidadPage;
