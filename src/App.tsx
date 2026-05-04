import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsent } from "@/components/legal/CookieConsent";
import Index from "./pages/Index.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import ClubDetailPage from "./pages/ClubDetailPage.tsx";
import AgregarCanchaPage from "./pages/AgregarCanchaPage.tsx";
import SportLandingPage from "./pages/SportLandingPage.tsx";
import PrivacidadPage from "./pages/PrivacidadPage.tsx";
import TerminosPage from "./pages/TerminosPage.tsx";
import AtribucionOsmPage from "./pages/AtribucionOsmPage.tsx";
import SobrePage from "./pages/SobrePage.tsx";
import ContactoPage from "./pages/ContactoPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const App = () => (
  <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/canchas" element={<SearchPage />} />
          <Route path="/canchas/:pais" element={<SearchPage />} />
          <Route path="/canchas/:pais/:ciudad" element={<SearchPage />} />
          <Route path="/canchas/:pais/:ciudad/:barrio" element={<SearchPage />} />
          <Route path="/canchas/:pais/:ciudad/:barrio/:slug" element={<ClubDetailPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/*
          Sitewide cookie consent banner + preferences modal.
          Listens to `cookieConsentChange` so GA4 / AdSense can load conditionally.

          // TODO: mount Google Analytics 4 here, LOAD ONLY IF cookieConsent.analytics === true
          // TODO: mount Google AdSense script here, LOAD ONLY IF cookieConsent.advertising === true
        */}
        <CookieConsent />
    </TooltipProvider>
);

export default App;
