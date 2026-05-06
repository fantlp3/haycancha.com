import { useParams } from "react-router-dom";
import { Navbar } from "@/components/brand/Navbar";
import { Footer } from "@/components/sections/Footer";
import { useClubBySlug } from "@/hooks/useClubes";
import { useBarrioBySlug } from "@/hooks/useBarrios";
import ClubDetailPage from "./ClubDetailPage";
import SearchPage from "./SearchPage";
import NotFound from "./NotFound";

const PageSkeleton = () => (
  <div className="min-h-screen bg-light flex flex-col">
    <Navbar />
    <main className="flex-1">
      <div className="max-w-container mx-auto px-6 lg:px-10 py-6 space-y-6 animate-pulse">
        <div className="h-4 w-64 bg-border rounded" />
        <div className="h-[280px] md:h-[400px] w-full bg-border rounded-xl" />
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="space-y-3">
            <div className="h-6 w-32 bg-border rounded" />
            <div className="h-12 w-3/4 bg-border rounded" />
            <div className="h-4 w-1/2 bg-border rounded" />
          </div>
          <div className="h-40 bg-white rounded-xl border border-border" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

/**
 * Disambiguates `/canchas/:pais/:ciudad/:slug` between a club detail page and
 * a barrio-filtered search page. Both lookups fire in parallel; we block on
 * the skeleton until at least one resolves.
 *
 * Tie-breaker: club wins. Clubs are named businesses with higher SEO/UX
 * priority. A barrio slug colliding with a club slug is a data-quality issue
 * to be flagged in admin.
 */
const GeoRouterPage = () => {
  const { ciudad, slug } = useParams();
  const club = useClubBySlug(slug);
  const barrio = useBarrioBySlug(slug, ciudad);

  if (club.isLoading || barrio.isLoading) return <PageSkeleton />;

  if (club.data) return <ClubDetailPage />;
  if (barrio.data) return <SearchPage />;
  return <NotFound />;
};

export default GeoRouterPage;
