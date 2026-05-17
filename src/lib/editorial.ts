/**
 * Single source of truth for the editorial team identity shown to the
 * public-facing UI. We hide the three fictional Directus authors
 * (Martín Acosta, Lucía Ferrer, Dr. Pablo Ruiz) behind this unified team
 * branding until we have real bylines.
 *
 * The data layer is untouched — `Articulo.autor` still resolves to the
 * fictional author row in Directus. Only the rendering layer (cards,
 * detail meta, author bio block, Schema.org JSON-LD) reads this constant.
 *
 * To revert: import & render the real `articulo.autor` again from the
 * components that currently read EDITORIAL_TEAM.
 */
export const EDITORIAL_TEAM = {
  name: "Equipo Editorial HayCancha.com",
  description:
    "Este artículo fue preparado por el Equipo Editorial de HayCancha.com, que se nutre de profesionales del deporte, kinesiólogos, profesores y jugadores experimentados.",
  avatar_initials: "HC",
  avatar_color_bg: "#E8632A",
  avatar_color_text: "#FFFFFF",
} as const;
