import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { ConsentBridge } from "@/lib/cookies/consent-bridge";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { AdsenseScript } from "@/components/blog/AdsenseScript";
import Index from "./pages/Index.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import ClubDetailPage from "./pages/ClubDetailPage.tsx";
import GeoRouterPage from "./pages/GeoRouterPage.tsx";
import AgregarCanchaPage from "./pages/AgregarCanchaPage.tsx";
import SportLandingPage from "./pages/SportLandingPage.tsx";
import PrivacidadPage from "./pages/PrivacidadPage.tsx";
import TerminosPage from "./pages/TerminosPage.tsx";
import AtribucionOsmPage from "./pages/AtribucionOsmPage.tsx";
import SobrePage from "./pages/SobrePage.tsx";
import ContactoPage from "./pages/ContactoPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import ArticuloDetailPage from "./pages/ArticuloDetailPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const App = () => (
  <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
