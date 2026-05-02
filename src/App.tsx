import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import ClubDetailPage from "./pages/ClubDetailPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/canchas" element={<SearchPage />} />
          <Route path="/canchas/:pais" element={<SearchPage />} />
          <Route path="/canchas/:pais/:ciudad" element={<SearchPage />} />
          <Route path="/canchas/:pais/:ciudad/:barrio" element={<SearchPage />} />
          <Route path="/canchas/:pais/:ciudad/:barrio/:slug" element={<ClubDetailPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
