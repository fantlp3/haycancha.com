/**
 * Guards the route table used by functions/_middleware.ts to decide whether a
 * URL gets 200 or 404. The middleware itself runs on Cloudflare Pages, so the
 * matcher is duplicated here as the contract: if a route is added to
 * src/App.tsx it must be added to STATIC_ROUTES too, or the page will start
 * answering 404 to crawlers while still rendering fine in the browser.
 */
import { describe, expect, it } from "vitest";
import { isKnownRoute } from "../../functions/_middleware";

describe("isKnownRoute — served by the router (200)", () => {
  const ok = [
    "/",
    "/tenis",
    "/padel",
    "/pickleball",
    "/canchas",
    "/blog",
    "/sobre",
    "/sobre-haycancha",
    "/contacto",
    "/privacidad",
    "/terminos",
    "/atribucion-osm",
    "/agregar-cancha",
    "/blog/medidas-de-canchas-tenis-padel-pickleball",
    "/canchas/argentina",
    "/canchas/argentina/buenos-aires",
    "/canchas/argentina/cordoba/orbit-club-tenis-padel-cordoba",
    "/canchas/argentina/buenos-aires/palermo/sportium-alcorta-palermo",
    "/canchas/argentina/",            // trailing slash
    "/blog/",                          // trailing slash on the listing
  ];
  it.each(ok)("%s", (path) => expect(isKnownRoute(path)).toBe(true));
});

describe("isKnownRoute — nonexistent (404)", () => {
  const notFound = [
    "/pagina-que-no-existe-12345",
    "/cancha.php",
    "/busqueda.php",
    "/galeria.php",
    "/cancha_comentarios.php",
    "/wp-admin",
    "/wp-login.php",
    "/admin",
    "/blog/Not_A_Slug",                // uppercase + underscore
    "/blog/foo/bar",                   // too deep
    "/canchas/argentina/buenos-aires/palermo/club/extra",  // 5 segments deep
    "/canchas/Argentina",              // uppercase
    "/tenis/extra",
    "/sobre/nosotros",
  ];
  it.each(notFound)("%s", (path) => expect(isKnownRoute(path)).toBe(false));
});
