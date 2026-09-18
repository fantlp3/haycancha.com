import { Helmet } from "react-helmet-async";
import type { ClubFull } from "@/lib/directus-types";
import { assetUrl } from "@/lib/directus";
import { parseHorarioTexto } from "@/lib/opening-hours";

interface SchemaOrgClubProps {
  club: ClubFull;
  url: string;
}

export function SchemaOrgClub({ club, url }: SchemaOrgClubProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: club.nombre,
    address: {
      "@type": "PostalAddress",
      streetAddress: club.direccion,
      addressLocality: club.ciudad.nombre,
      addressRegion: club.ciudad.provincia_estado ?? undefined,
      postalCode: club.codigo_postal ?? undefined,
      addressCountry: club.pais.codigo_iso,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: club.ubicacion.coordinates[1],
      longitude: club.ubicacion.coordinates[0],
    },
    url,
  };

  if (club.telefono) data.telephone = club.telefono;
  if (club.website) data.sameAs = [club.website];
  if (club.descripcion) data.description = club.descripcion.slice(0, 500);
  if (club.foto_portada) {
    data.image = assetUrl(club.foto_portada.id, { width: 1200 });
  }
  // Sports the club actually offers — populated on every club, unlike the
  // amenity booleans (true on under 1 % of the catalogue).
  const sports = [
    ...new Set(club.clubes_deportes.map((cd) => cd.deporte.nombre).filter(Boolean)),
  ];
  if (sports.length > 0) data.sport = sports;

  // Opening hours. The structured columns are filled on 2 of 2.297 clubs, so
  // parse `horario_texto` (filled on 1.447) instead and fall back to them.
  const spec = parseHorarioTexto(club.horario_texto);
  if (spec) {
    data.openingHoursSpecification = spec;
  } else if (club.horario_apertura && club.horario_cierre) {
    data.openingHours = `Mo-Su ${club.horario_apertura.slice(0, 5)}-${club.horario_cierre.slice(0, 5)}`;
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
