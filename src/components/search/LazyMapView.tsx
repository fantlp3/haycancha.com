import { Suspense, lazy } from "react";
import { WhenVisible } from "@/components/utils/WhenVisible";
import type { ClubCard } from "@/lib/directus-types";

const MapView = lazy(() =>
  import("./MapView").then((m) => ({ default: m.MapView }))
);

const FILL = "w-full h-full";

/**
 * Mapa del listado, diferido hasta que el panel se ve.
 *
 * En móvil el panel arranca con `hidden` (la vista por defecto es la lista):
 * un contenedor con display:none no interseca, así que leaflet no se baja
 * hasta que el usuario toca "Ver mapa". En desktop el panel es visible desde
 * el primer render, así que carga enseguida, como antes.
 *
 * Además evita el bug clásico de inicializar leaflet en un contenedor de alto
 * 0: el mapa se crea recién cuando el panel tiene tamaño real.
 */
export function LazyMapView({ clubs }: { clubs: ClubCard[] }) {
  const placeholder = <div className={`${FILL} bg-neutral-100`} aria-hidden />;
  return (
    <WhenVisible className={FILL} placeholder={placeholder}>
      <Suspense fallback={placeholder}>
        <MapView clubs={clubs} />
      </Suspense>
    </WhenVisible>
  );
}
