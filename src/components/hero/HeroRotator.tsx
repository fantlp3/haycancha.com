import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  fetchHeroImages,
  heroImageUrl,
  type HeroImage,
  type HeroSport,
} from "@/lib/hero-images";

interface Props {
  deporte?: HeroSport;
  overlayGradient?: "left" | "right" | "bottom" | "none";
  className?: string;
  children: ReactNode;
}

const FALLBACK_BG: Record<HeroSport | "mix", string> = {
  tenis: "bg-[#FEFCE8]",
  padel: "bg-[#ECFEFF]",
  pickleball: "bg-[#ECFCCB]",
  mix: "bg-neutral-900",
};

const GRADIENT_CLASS: Record<"left" | "right" | "bottom", string> = {
  left: "bg-gradient-to-r from-black/70 via-black/40 to-transparent",
  right: "bg-gradient-to-l from-black/70 via-black/40 to-transparent",
  bottom: "bg-gradient-to-t from-black/70 to-transparent",
};

const ROTATE_MS = 6000;
const FADE_MS = 800;

export const HeroRotator = ({
  deporte,
  overlayGradient = "left",
  className,
  children,
}: Props) => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    fetchHeroImages(deporte).then((imgs) => {
      if (!cancelled) setImages(imgs);
    });
    return () => {
      cancelled = true;
    };
  }, [deporte]);

  // Rotation: interval + visibility pause + reduced-motion bypass
  useEffect(() => {
    if (images.length < 2) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
    if (reducedMotionRef.current) return;

    const start = () => {
      stop();
      intervalRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, ROTATE_MS);
    };
    const stop = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else start();
    };
    const onMotion = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) stop();
      else if (document.visibilityState !== "hidden") start();
    };

    if (document.visibilityState !== "hidden") start();
    document.addEventListener("visibilitychange", onVisibility);
    mql.addEventListener("change", onMotion);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      mql.removeEventListener("change", onMotion);
    };
  }, [images.length]);

  const fallbackKey: HeroSport | "mix" = deporte ?? "mix";
  const current = images[index];

  return (
    <section className={cn("relative overflow-hidden", FALLBACK_BG[fallbackKey], className)}>
      {/* Background layer */}
      <div aria-hidden className="absolute inset-0 z-0">
        {images.map((img, i) => (
          <img
            key={img.id}
            src={heroImageUrl(img.imagen)}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out",
              i === index ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          />
        ))}
        {overlayGradient !== "none" && images.length > 0 && (
          <div className={cn("absolute inset-0", GRADIENT_CLASS[overlayGradient])} />
        )}
      </div>

      {/* Content layer */}
      <div className="relative z-10">{children}</div>

      {/* Unsplash attribution */}
      {current && (
        <div
          className="absolute bottom-2 right-2 z-20 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-white/80 text-xs transition-opacity ease-in-out"
          style={{ transitionDuration: `${FADE_MS}ms` }}
        >
          Foto de{" "}
          <a
            href={current.unsplash_author_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            {current.unsplash_author}
          </a>{" "}
          en{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Unsplash
          </a>
        </div>
      )}
    </section>
  );
};
