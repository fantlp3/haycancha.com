import { Suspense, lazy } from "react";
import { WhenVisible } from "@/components/utils/WhenVisible";
import { MAP_BOX_CLASS, type ClubLocationMapProps } from "./ClubLocationMap";

const ClubLocationMap = lazy(() => import("./ClubLocationMap"));

/**
 * Mapa de la ficha de club, diferido hasta que la sección de ubicación se
 * acerca al viewport. Está bien abajo del fold, así que la mayoría de las
 * visitas nunca piden leaflet ni los tiles de OSM.
 *
 * El placeholder usa el mismo alto que el mapa (MAP_BOX_CLASS), así que
 * cargarlo no mueve el layout.
 */
export function LazyClubLocationMap(props: ClubLocationMapProps) {
  const placeholder = <div className={`${MAP_BOX_CLASS} bg-neutral-100`} aria-hidden />;
  return (
    <WhenVisible placeholder={placeholder}>
      <Suspense fallback={placeholder}>
        <ClubLocationMap {...props} />
      </Suspense>
    </WhenVisible>
  );
}
