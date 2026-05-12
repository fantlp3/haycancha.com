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
  { id: "acerca", label: "Acerca de los datos de mapas" },
  { id: "licencia", label: "Licencia" },
  { id: "atribucion-requerida", label: "Atribución requerida" },
  { id: "mas-info", label: "Más información sobre OSM" },
  { id: "contribuir", label: "Contribuir al mapa" },
  { id: "info-clubes", label: "Información sobre clubes" },
];

const AtribucionOsmPage = () => {
  useEffect(() => {
    document.title = "Atribución OpenStreetMap — HayCancha";
    const desc =
      "Atribución de los datos cartográficos de OpenStreetMap utilizados en HayCancha.com bajo licencia Open Database License (ODbL) 1.0.";
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
      title="ATRIBUCIÓN OPENSTREETMAP"
      breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Atribución OpenStreetMap" }]}
      lastUpdated="12 de mayo de 2026"
      toc={TOC}
    >
      <LegalP>
        Esta página reconoce públicamente la fuente de los datos cartográficos utilizados en
        HayCancha.com, conforme a los términos de la licencia aplicable.
      </LegalP>

      <LegalH2 id="acerca">Acerca de los datos de mapas que utilizamos</LegalH2>
      <LegalP>
        Los mapas y datos geográficos visibles en HayCancha.com son provistos por{" "}
        <LegalStrong>OpenStreetMap</LegalStrong>, un proyecto colaborativo y de código abierto que
        construye un mapa mundial libre y editable.
      </LegalP>
      <LegalP>
        Los datos son aportados por miles de personas voluntarias alrededor del mundo y se
        mantienen actualizados por su comunidad global.
      </LegalP>

      <LegalH2 id="licencia">Licencia</LegalH2>
      <LegalP>
        Los datos de OpenStreetMap utilizados en este sitio están licenciados bajo la{" "}
        <LegalStrong>Open Database License (ODbL) 1.0</LegalStrong>, otorgada por la{" "}
        <LegalStrong>OpenStreetMap Foundation (OSMF)</LegalStrong>.
      </LegalP>
      <LegalP>
        La licencia completa puede consultarse en:{" "}
        <LegalA href="https://opendatacommons.org/licenses/odbl/1-0/">
          opendatacommons.org/licenses/odbl/1-0/
        </LegalA>
      </LegalP>
      <LegalP>
        La cartografía base se distribuye bajo la{" "}
        <LegalStrong>Creative Commons Attribution-ShareAlike 2.0 license (CC BY-SA 2.0)</LegalStrong>:{" "}
        <LegalA href="https://creativecommons.org/licenses/by-sa/2.0/">
          creativecommons.org/licenses/by-sa/2.0/
        </LegalA>
      </LegalP>

      <LegalH2 id="atribucion-requerida">Atribución requerida</LegalH2>
      <LegalP>
        Conforme a los términos de la licencia ODbL, atribuimos los datos cartográficos como:
      </LegalP>
      <blockquote className="border-l-4 border-orange bg-light px-4 py-3 my-4 text-[16px] text-dark italic">
        <LegalStrong>© colaboradores de OpenStreetMap</LegalStrong>
      </blockquote>
      <LegalP>Esta atribución se muestra de forma permanente en cada vista de mapa del sitio.</LegalP>

      <LegalH2 id="mas-info">Más información sobre OpenStreetMap</LegalH2>
      <LegalUl>
        <li>
          <LegalStrong>Sitio oficial:</LegalStrong>{" "}
          <LegalA href="https://www.openstreetmap.org">www.openstreetmap.org</LegalA>
        </li>
        <li>
          <LegalStrong>Sobre la Fundación:</LegalStrong>{" "}
          <LegalA href="https://osmfoundation.org">osmfoundation.org</LegalA>
        </li>
        <li>
          <LegalStrong>Cómo contribuir:</LegalStrong>{" "}
          <LegalA href="https://www.openstreetmap.org/welcome">
            www.openstreetmap.org/welcome
          </LegalA>
        </li>
        <li>
          <LegalStrong>Política de uso de tiles:</LegalStrong>{" "}
          <LegalA href="https://operations.osmfoundation.org/policies/tiles/">
            operations.osmfoundation.org/policies/tiles/
          </LegalA>
        </li>
      </LegalUl>

      <LegalH2 id="contribuir">Contribuir al mapa</LegalH2>
      <LegalP>
        Si encontrás errores en el mapa, ubicaciones incorrectas o querés mejorar la información
        cartográfica de tu zona, podés <LegalStrong>editar OpenStreetMap directamente</LegalStrong>.
        Es gratis y la edición es revisada por la comunidad antes de quedar publicada.
      </LegalP>
      <LegalP>
        Para empezar, visitá:{" "}
        <LegalA href="https://www.openstreetmap.org/edit">www.openstreetmap.org/edit</LegalA>
      </LegalP>

      <LegalH2 id="info-clubes">Información sobre clubes</LegalH2>
      <LegalP>
        Es importante aclarar que <LegalStrong>la información sobre los clubes</LegalStrong>{" "}
        publicada en HayCancha.com (nombres, direcciones, teléfonos, deportes, fotos, etc.){" "}
        <LegalStrong>no proviene de OpenStreetMap</LegalStrong>. Esa información se obtiene de
        fuentes propias y públicas, y se rige por nuestros{" "}
        <LegalA href="/terminos">Términos y Condiciones</LegalA> y nuestra{" "}
        <LegalA href="/privacidad">Política de Privacidad</LegalA>.
      </LegalP>
      <LegalP>
        OpenStreetMap solo nos provee la cartografía base sobre la cual visualizamos las
        ubicaciones de los clubes.
      </LegalP>
    </LegalPageLayout>
  );
};

export default AtribucionOsmPage;
