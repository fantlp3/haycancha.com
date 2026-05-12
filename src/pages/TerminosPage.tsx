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
  { id: "aceptacion", label: "1. Aceptación de los términos" },
  { id: "prestador", label: "2. Identificación del prestador" },
  { id: "objeto", label: "3. Objeto del Sitio" },
  { id: "naturaleza", label: "4. Naturaleza informativa" },
  { id: "edad", label: "5. Edad mínima" },
  { id: "obligaciones", label: "6. Obligaciones del usuario" },
  { id: "sugerencias", label: "7. Sugerencias de clubes" },
  { id: "propiedad-intelectual", label: "8. Propiedad intelectual" },
  { id: "publicidad", label: "9. Publicidad" },
  { id: "premium", label: "10. Servicios premium (futuro)" },
  { id: "enlaces", label: "11. Enlaces a sitios externos" },
  { id: "responsabilidad", label: "12. Limitación de responsabilidad" },
  { id: "modificaciones-servicio", label: "13. Modificaciones del servicio" },
  { id: "modificaciones-terminos", label: "14. Modificaciones de los Términos" },
  { id: "privacidad", label: "15. Privacidad y protección de datos" },
  { id: "jurisdiccion", label: "16. Ley aplicable y jurisdicción" },
  { id: "nulidad", label: "17. Nulidad parcial" },
  { id: "contacto", label: "18. Contacto" },
];

const TerminosPage = () => {
  useEffect(() => {
    document.title = "Términos y Condiciones — HayCancha";
    const desc =
      "Términos y Condiciones de uso del directorio HayCancha.com, operado por P3GROUP S.A. Reglas de uso, contenido de usuarios, propiedad intelectual y jurisdicción.";
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
      title="TÉRMINOS Y CONDICIONES"
      breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Términos y Condiciones" }]}
      lastUpdated="12 de mayo de 2026"
      toc={TOC}
    >
      <LegalP>
        Estos Términos y Condiciones regulan el acceso y uso de HayCancha.com. Al utilizar el Sitio,
        aceptás de forma plena y sin reservas las disposiciones que se detallan a continuación.
      </LegalP>

      <LegalH2 id="aceptacion">1. Aceptación de los términos</LegalH2>
      <LegalP>
        El acceso y uso del sitio web <LegalStrong>HayCancha.com</LegalStrong> (en adelante, "el
        Sitio") implica la aceptación plena y sin reservas de los presentes Términos y Condiciones
        (en adelante, "los Términos"). Si no estás de acuerdo con alguna de las disposiciones, te
        pedimos que no utilices el Sitio.
      </LegalP>

      <LegalH2 id="prestador">2. Identificación del prestador</LegalH2>
      <LegalP>El Sitio es operado por:</LegalP>
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

      <LegalH2 id="objeto">3. Objeto del Sitio</LegalH2>
      <LegalP>
        HayCancha.com es un <LegalStrong>directorio informativo</LegalStrong> de clubes y canchas de
        tenis, pádel y pickleball en países hispanohablantes de Latinoamérica. El Sitio:
      </LegalP>
      <LegalUl>
        <li>Permite a los usuarios buscar clubes por ubicación, deporte y otras características</li>
        <li>Muestra información de contacto e instalaciones de cada club</li>
        <li>
          Permite que los administradores de clubes sugieran agregar o modificar su listado
        </li>
      </LegalUl>
      <LegalP>
        <LegalStrong>
          El Sitio NO realiza reservas de canchas, ni procesa pagos, ni interviene en la relación
          entre el usuario y el club.
        </LegalStrong>
      </LegalP>

      <LegalH2 id="naturaleza">4. Naturaleza informativa de los contenidos</LegalH2>
      <LegalP>
        La información publicada en el Sitio (direcciones, horarios, teléfonos, dimensiones,
        superficies, etc.) proviene de:
      </LegalP>
      <LegalUl>
        <li>Datos públicos disponibles en internet</li>
        <li>Información provista por los propios clubes</li>
        <li>Sugerencias enviadas por usuarios</li>
      </LegalUl>
      <LegalP>
        P3GROUP S.A. realiza esfuerzos razonables para verificar y mantener actualizada esta
        información, <LegalStrong>pero no garantiza su exactitud, completitud ni vigencia en todo
        momento</LegalStrong>. Recomendamos al usuario contactar directamente al club antes de
        visitarlo para confirmar disponibilidad, precios, horarios y servicios.
      </LegalP>

      <LegalH2 id="edad">5. Edad mínima</LegalH2>
      <LegalP>
        El Sitio está destinado a personas mayores de <LegalStrong>13 años</LegalStrong>. Al
        utilizar el Sitio, el usuario declara tener al menos esa edad. Los menores entre 13 y 18
        años deben contar con autorización de sus padres o tutores legales para utilizar el Sitio.
      </LegalP>

      <LegalH2 id="obligaciones">6. Obligaciones del usuario</LegalH2>
      <LegalP>El usuario se compromete a:</LegalP>
      <LegalUl>
        <li>
          Utilizar el Sitio conforme a la ley, la moral, las buenas costumbres y el orden público
        </li>
        <li>No realizar actividades que puedan dañar el funcionamiento normal del Sitio</li>
        <li>No intentar acceder sin autorización a áreas restringidas del Sitio</li>
        <li>
          No utilizar herramientas automatizadas (scrapers, bots) para extraer información del
          Sitio en forma masiva sin autorización previa por escrito
        </li>
        <li>No utilizar la información del Sitio para fines comerciales sin autorización</li>
        <li>Proporcionar información veraz al enviar formularios o sugerir clubes</li>
        <li>No suplantar la identidad de terceros</li>
      </LegalUl>

      <LegalH2 id="sugerencias">7. Sugerencias de clubes y contenido enviado por usuarios</LegalH2>
      <LegalP>
        Al enviar información sobre un club (sea como administrador del club o como usuario
        sugiriendo un agregado), el usuario:
      </LegalP>
      <LegalUl>
        <li>
          <LegalStrong>Declara y garantiza</LegalStrong> que tiene derecho a compartir dicha
          información
        </li>
        <li>
          <LegalStrong>Otorga a P3GROUP S.A.</LegalStrong> una licencia no exclusiva, mundial,
          gratuita e indefinida para publicar, reproducir, modificar y distribuir esa información
          en el Sitio y en materiales promocionales del Sitio
        </li>
        <li>
          <LegalStrong>Acepta</LegalStrong> que P3GROUP S.A. puede modificar, depurar o no publicar
          la información enviada, a su exclusivo criterio editorial
        </li>
        <li>
          <LegalStrong>Acepta</LegalStrong> que la información puede ser revisada antes de ser
          publicada
        </li>
      </LegalUl>
      <LegalP>
        P3GROUP S.A. <LegalStrong>no se hace responsable</LegalStrong> por la veracidad de la
        información provista por los usuarios. Si detectás información incorrecta sobre un club,
        podés reportarla a través de los canales de contacto del Sitio.
      </LegalP>

      <LegalH2 id="propiedad-intelectual">8. Propiedad intelectual</LegalH2>
      <LegalH3>8.1. Contenido del Sitio</LegalH3>
      <LegalP>
        El diseño, código fuente, logotipos, marcas, textos editoriales, ilustraciones y cualquier
        otro contenido original del Sitio son propiedad exclusiva de P3GROUP S.A. o se utilizan
        bajo licencia de sus respectivos titulares. Quedan reservados todos los derechos.
      </LegalP>
      <LegalP>
        Queda <LegalStrong>expresamente prohibida</LegalStrong> la reproducción, distribución,
        comunicación pública, transformación o cualquier otro uso de los contenidos del Sitio sin
        la autorización previa y por escrito de P3GROUP S.A., salvo los usos permitidos por la ley
        de propiedad intelectual aplicable.
      </LegalP>
      <LegalH3>8.2. Datos de mapas</LegalH3>
      <LegalP>
        El Sitio utiliza datos cartográficos de <LegalStrong>OpenStreetMap</LegalStrong>, bajo la
        licencia <LegalStrong>Open Database License (ODbL) 1.0</LegalStrong>. La atribución
        correspondiente está disponible en{" "}
        <LegalA href="/atribucion-osm">/atribucion-osm</LegalA>.
      </LegalP>
      <LegalH3>8.3. Marcas de terceros</LegalH3>
      <LegalP>
        Los nombres de los clubes, marcas, logotipos y cualquier otro signo distintivo perteneciente
        a terceros son propiedad de sus respectivos titulares. Su mención en el Sitio se realiza
        con fines exclusivamente informativos y descriptivos, y no implica ninguna relación,
        patrocinio o aval con dichos titulares.
      </LegalP>

      <LegalH2 id="publicidad">9. Publicidad</LegalH2>
      <LegalP>
        El Sitio muestra publicidad de terceros a través de{" "}
        <LegalStrong>Google AdSense</LegalStrong> y, eventualmente, otros sistemas publicitarios.
        P3GROUP S.A.:
      </LegalP>
      <LegalUl>
        <li>
          <LegalStrong>No respalda</LegalStrong> los productos o servicios anunciados
        </li>
        <li>
          <LegalStrong>No es responsable</LegalStrong> por el contenido, veracidad o calidad de los
          anuncios
        </li>
        <li>
          <LegalStrong>No participa</LegalStrong> de las transacciones que el usuario pueda realizar
          con los anunciantes
        </li>
      </LegalUl>
      <LegalP>
        Para más información sobre cookies publicitarias y opciones de personalización, ver la{" "}
        <LegalA href="/privacidad">Política de Privacidad</LegalA>.
      </LegalP>

      <LegalH2 id="premium">10. Servicios premium para clubes (futuro)</LegalH2>
      <LegalP>
        P3GROUP S.A. podrá, en el futuro, ofrecer servicios pagos para clubes, tales como listados
        destacados, eliminación de publicidad en la página del club, u otros. Las condiciones
        específicas de estos servicios se publicarán al momento de su lanzamiento y formarán parte
        integrante de los presentes Términos.
      </LegalP>

      <LegalH2 id="enlaces">11. Enlaces a sitios externos</LegalH2>
      <LegalP>
        El Sitio puede contener enlaces a sitios web de terceros (clubes, redes sociales, sistemas
        de reserva externos, etc.). P3GROUP S.A. <LegalStrong>no es responsable</LegalStrong> del
        contenido, políticas de privacidad ni prácticas de dichos sitios externos. La inclusión de
        un enlace no implica recomendación o aval.
      </LegalP>

      <LegalH2 id="responsabilidad">12. Limitación de responsabilidad</LegalH2>
      <LegalP>
        En la máxima medida permitida por la ley aplicable, P3GROUP S.A.{" "}
        <LegalStrong>no será responsable</LegalStrong> por:
      </LegalP>
      <LegalUl>
        <li>Daños directos o indirectos derivados del uso o la imposibilidad de uso del Sitio</li>
        <li>Errores u omisiones en la información publicada</li>
        <li>Interrupciones del servicio, fallas técnicas o pérdida de datos</li>
        <li>Acciones u omisiones de los clubes listados en el directorio</li>
        <li>Acciones u omisiones de terceros anunciantes</li>
        <li>Disputas entre usuarios y clubes</li>
      </LegalUl>
      <LegalP>
        El Sitio se proporciona <LegalStrong>"tal cual"</LegalStrong> y{" "}
        <LegalStrong>"según disponibilidad"</LegalStrong>, sin garantías de ningún tipo.
      </LegalP>

      <LegalH2 id="modificaciones-servicio">13. Modificaciones del servicio</LegalH2>
      <LegalP>
        P3GROUP S.A. se reserva el derecho de modificar, suspender o discontinuar el Sitio (total o
        parcialmente) en cualquier momento, sin necesidad de aviso previo, sin que esto genere
        derecho a indemnización alguna a favor de los usuarios.
      </LegalP>

      <LegalH2 id="modificaciones-terminos">14. Modificaciones de los Términos</LegalH2>
      <LegalP>
        Estos Términos pueden ser actualizados en cualquier momento. Cuando realicemos cambios
        significativos, lo notificaremos mediante un aviso visible en el Sitio. El uso continuado
        del Sitio después de las modificaciones implica la aceptación de los nuevos Términos.
      </LegalP>
      <LegalP>
        La fecha de "Última actualización" al inicio del documento refleja la versión vigente.
      </LegalP>

      <LegalH2 id="privacidad">15. Privacidad y protección de datos</LegalH2>
      <LegalP>
        El tratamiento de los datos personales de los usuarios se rige por la{" "}
        <LegalA href="/privacidad">Política de Privacidad</LegalA>, que forma parte integrante de
        los presentes Términos.
      </LegalP>

      <LegalH2 id="jurisdiccion">16. Ley aplicable y jurisdicción</LegalH2>
      <LegalP>
        Los presentes Términos se rigen e interpretan conforme a las leyes de la{" "}
        <LegalStrong>República Argentina</LegalStrong>, con expresa exclusión de cualquier otra
        normativa de derecho internacional privado que pudiera resultar aplicable.
      </LegalP>
      <LegalP>
        Para cualquier controversia derivada de la interpretación o ejecución de los presentes
        Términos, las partes se someten a la jurisdicción exclusiva de los{" "}
        <LegalStrong>
          Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires
        </LegalStrong>
        , con renuncia expresa a cualquier otro fuero o jurisdicción que pudiera corresponder.
      </LegalP>

      <LegalH2 id="nulidad">17. Nulidad parcial</LegalH2>
      <LegalP>
        Si alguna disposición de los presentes Términos fuera declarada nula, ilegal o inejecutable
        por una autoridad competente, dicha disposición se considerará removida, sin afectar la
        validez y eficacia de las restantes disposiciones, que continuarán en plena vigencia.
      </LegalP>

      <LegalH2 id="contacto">18. Contacto</LegalH2>
      <LegalP>
        Para cualquier consulta relacionada con estos Términos y Condiciones, contactanos a:
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

export default TerminosPage;
