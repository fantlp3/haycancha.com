import { useEffect, useState } from "react";

/**
 * Thin horizontal bar pinned to the top of the viewport that fills as the
 * user scrolls through the document. Renders nothing until there's a real
 * scrollable area (avoids a flicker bar on short articles).
 */
export const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compute = () => {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const pct = Math.min(100, Math.max(0, (h.scrollTop / scrollable) * 100));
      setProgress(pct);
    };
    compute();
    // Passive listener for smoothness on mobile.
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] z-[1001] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-orange transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
