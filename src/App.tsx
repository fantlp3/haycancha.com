import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { ConsentBridge } from "@/lib/cookies/consent-bridge";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { AdsenseScript } from "@/components/blog/AdsenseScript";
/**
 * Rutas del embudo: estáticas a propósito.
 *
 * Son las que reciben el tráfico orgánico (home, landings de deporte,
 * listados y las 2.297 fichas de club) y las que llevan el SEO de la página.
 * Dejarlas en el bundle de entrada evita un round-trip extra antes de que
 * SeoMeta escriba el head.
 */
import Index from "./pages/Index.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import ClubDetailPage from "./pages/ClubDetailPage.tsx";
import GeoRouterPage from "./pages/GeoRouterPage.tsx";
import SportLandingPage from "./pages/SportLandingPage.tsx";

/**
 * Todo lo demás, en chunks aparte.
 *
 * El build era UN solo chunk de 913 KB para las 14 rutas, con 437 KiB de JS
 * sin usar en el home: 2,9 s de bootup y 7,3 s de trabajo en el main thread.
 * AgregarCanchaPage se lleva zod + react-hook-form + turnstile + leaflet, que
 * antes pagaba cualquier visitante que entrara a una ficha.
 */
const AgregarCanchaPage = lazy(() => import("./pages/AgregarCanchaPage.tsx"));
const PrivacidadPage = lazy(() => import("./pages/PrivacidadPage.tsx"));
const TerminosPage = lazy(() => import("./pages/TerminosPage.tsx"));
const AtribucionOsmPage = lazy(() => import("./pages/AtribucionOsmPage.tsx"));
const SobrePage = lazy(() => import("./pages/SobrePage.tsx"));
const ContactoPage = lazy(() => import("./pages/ContactoPage.tsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.tsx"));
const ArticuloDetailPage = lazy(() => import("./pages/ArticuloDetailPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

/**
 * Fallback de altura de viewport: ocupa el lugar del layout que viene, así el
 * chunk que llega no empuja nada y no suma CLS.
 */
const RouteFallback = () => <div className="min-h-screen bg-light" aria-busy="true" />;

const App = () => (
  <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agregar-cancha" element={<AgregarCanchaPage />} />
          <Route path="/tenis" element={<SportLandingPage sportKey="tenis" />} />
          <Route path="/padel" element={<SportLandingPage sportKey="padel" />} />
          <Route path="/pickleball" element={<SportLandingPage sportKey="pickleball" />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
          <Route path="/terminos" element={<TerminosPage />} />
          <Route path="/atribucion-osm" element={<AtribucionOsmPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/sobre-haycancha" element={<SobrePage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<ArticuloDetailPage />} />
          <Route path="/canchas" element={<SearchPage />} />
          <Route path="/canchas/:pais" element={<SearchPage />} />
          <Route path="/canchas/:pais/:ciudad" element={<SearchPage />} />
          {/* 3-seg slug is ambiguous (could be a barrio or a club). GeoRouterPage
              disambiguates with parallel club + barrio lookups. */}
          <Route path="/canchas/:pais/:ciudad/:slug" element={<GeoRouterPage />} />
          <Route path="/canchas/:pais/:ciudad/:barrio/:slug" element={<ClubDetailPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        {/*
          Sitewide cookie consent banner + preferences modal.
          ConsentBridge translates `cookieConsentChange` into Google Consent
          Mode v2 `gtag('consent','update', …)` calls so GTM-loaded GA4 and
          AdSense activate only when the matching category is granted.
        */}
        <CookieConsent />
        <ConsentBridge />
        <AdsenseScript />
      </BrowserRouter>
    </TooltipProvider>
);

export default App;
