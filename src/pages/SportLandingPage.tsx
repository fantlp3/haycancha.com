import { useEffect } from "react";
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
import { SPORTS, type SportKey } from "@/lib/sports";
import NotFound from "./NotFound";

interface Props {
  sportKey?: SportKey;
}

const SportLandingPage = ({ sportKey }: Props) => {
  // Allow either prop-driven (preferred for static routes) or param-driven.
  const params = useParams();
  const key = (sportKey ?? (params.sport as SportKey)) as SportKey;
  const sport = SPORTS[key];

  // Per-sport meta tags (title + description). For real SSG these would be
  // rendered server-side; this updates them on the client for now.
  useEffect(() => {
    if (!sport) return;
    document.title = sport.meta.title;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", sport.meta.description);

    // JSON-LD CollectionPage schema
    const scriptId = "sport-jsonld";
    document.getElementById(scriptId)?.remove();
    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: sport.meta.title,
      description: sport.meta.description,
      about: {
        "@type": "Sport",
        name: sport.name,
      },
      url: typeof window !== "undefined" ? window.location.href : undefined,
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [sport]);

  if (!sport) return <NotFound />;

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      <main>
        <SportHero sport={sport} />
        <SportFeatures sport={sport} />
        <SportStats sport={sport} />
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
