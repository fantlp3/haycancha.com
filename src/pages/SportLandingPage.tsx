import { useParams } from "react-router-dom";
import { Navbar } from "@/components/brand/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SportHero } from "@/components/sport/SportHero";
import { SportFeatures } from "@/components/sport/SportFeatures";
import { SportStats } from "@/components/sport/SportStats";
import { SportFeatured } from "@/components/sport/SportFeatured";
import { SportZones } from "@/components/sport/SportZones";
import { SportEditorial } from "@/components/sport/SportEditorial";
import { SportCtaFooter } from "@/components/sport/SportCtaFooter";
import { SeoMeta } from "@/components/SeoMeta";
import { PromoSlot } from "@/components/promo/PromoSlot";
import { SPORTS, type SportKey } from "@/lib/sports";
import NotFound from "./NotFound";

interface Props {
  sportKey?: SportKey;
}

const VALID_SPORTS: SportKey[] = ["tenis", "padel", "pickleball"];

const SportLandingPage = ({ sportKey }: Props) => {
  const params = useParams();
  const key = (sportKey ?? (params.sport as SportKey)) as SportKey;

  if (!VALID_SPORTS.includes(key)) return <NotFound />;
  const sport = SPORTS[key];
  if (!sport) return <NotFound />;

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <SeoMeta
        title={sport.meta.title}
        description={sport.meta.description}
        canonicalPath={`/${sport.key}`}
        ogImage={sport.meta.ogImage}
      />
      <Navbar />
      <main>
        <SportHero sport={sport} />
        <SportFeatures sport={sport} />
        <SportStats sport={sport} />
        <div className="max-w-container mx-auto px-6 lg:px-10 mt-12">
          <PromoSlot variant="leaderboard" exclude={[sport.key]} />
        </div>
        <SportFeatured sport={sport} />
        <SportZones sport={sport} />
        <SportEditorial sport={sport} />
        <SportCtaFooter sport={sport} />
      </main>
      <Footer />
    </div>
  );
};

export default SportLandingPage;
