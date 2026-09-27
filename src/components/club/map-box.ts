/**
 * Constantes compartidas del mapa de la ficha, SIN importar leaflet.
 *
 * Existe para que LazyClubLocationMap pueda usar el alto del placeholder sin
 * tocar ClubLocationMap.tsx: ese modulo importa leaflet a nivel de modulo, asi
 * que cualquier import estatico suyo mete leaflet en el grafo estatico del
 * entry — y Vite entonces le pone un <link rel="modulepreload"> en el HTML,
 * con lo cual los 150 KB se bajan en toda pagina y el code splitting no sirve
 * para nada. Pasó exactamente eso; se detectó mirando el HTML de producción.
 */

/** Alto fijo del mapa, compartido con el placeholder para no generar CLS. */
export const MAP_BOX_CLASS = "w-full h-[280px] z-0";

export interface ClubLocationMapProps {
  lat: number;
  lng: number;
  name: string;
}
