import { useEffect } from "react";
import {
  LegalPageLayout,
  LegalH2,
  LegalP,
  LegalUl,
  LegalA,
  LegalStrong,
} from "@/components/legal/LegalPageLayout";

const AtribucionOsmPage = () => {
  useEffect(() => {
    document.title = "Atribución de Datos — HayCancha";
  }, []);

  return (
    <LegalPageLayout
      title="ATRIBUCIÓN DE DATOS"
      breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Atribución de Datos" }]}
    >
      <LegalP>
        HayCancha.com utiliza datos abiertos y servicios de terceros para construir su directorio.
        Esta página reconoce públicamente esas fuentes según las licencias correspondientes.
      </LegalP>

      <LegalH2 id="osm">OpenStreetMap</LegalH2>
      <LegalP>
        Los mapas interactivos del sitio, las coordenadas geográficas de muchos clubes y parte de
        la información de ubicación provienen del proyecto OpenStreetMap.
      </LegalP>
      <LegalP>
        Atribución requerida por licencia ODbL:
        <br />
        <LegalStrong>© OpenStreetMap contributors</LegalStrong> — los datos están disponibles bajo
        la Open Database License (ODbL).
      </LegalP>
      <LegalP>
        Más información:{" "}
        <LegalA href="https://www.openstreetmap.org/copyright">
          https://www.openstreetmap.org/copyright
        </LegalA>
        <br />
        Licencia ODbL completa:{" "}
        <LegalA href="https://opendatacommons.org/licenses/odbl/">
          https://opendatacommons.org/licenses/odbl/
        </LegalA>
      </LegalP>

      <LegalH2 id="google-places">Google Places</LegalH2>
      <LegalP>
        Información complementaria de algunos clubes (fotos, horarios, descripciones públicas) se
        obtiene a través de la API oficial de Google Places. Estos datos se muestran de acuerdo
        con los términos de servicio de Google.
      </LegalP>
      <LegalP>
        Política de Google:{" "}
        <LegalA href="https://policies.google.com/privacy">
          https://policies.google.com/privacy
        </LegalA>
      </LegalP>

      <LegalH2 id="federaciones">Federaciones y asociaciones</LegalH2>
      <LegalP>Datos de clubes oficialmente afiliados provienen de los sitios públicos de:</LegalP>
      <LegalUl>
        <li>
          Asociación Argentina de Tenis (AAT) —{" "}
          <LegalA href="https://www.aat.com.ar">www.aat.com.ar</LegalA>
        </li>
        <li>Federaciones provinciales y otras asociaciones nacionales en Latinoamérica</li>
      </LegalUl>

      <LegalH2 id="legacy">Sitio actual de HayCancha (legacy)</LegalH2>
      <LegalP>
        El directorio incluye datos curados durante los más de 20 años de existencia del sitio
        HayCancha.com en sus versiones anteriores.
      </LegalP>

      <LegalH2 id="comunidad">Aportes de la comunidad</LegalH2>
      <LegalP>
        Una parte creciente de la base de datos proviene de aportes de jugadores y dueños de
        clubes a través del formulario "Agregá tu cancha". Cada aporte es revisado antes de ser
        publicado.
      </LegalP>

      <LegalH2 id="reportar">Reportar un dato incorrecto</LegalH2>
      <LegalP>
        Si encontrás información que necesita ser corregida o un dato que pertenece a una fuente
        que requiere atribución no listada arriba, escribinos a{" "}
        <LegalA href="mailto:contacto@haycancha.com">contacto@haycancha.com</LegalA>.
      </LegalP>
    </LegalPageLayout>
  );
};

export default AtribucionOsmPage;
