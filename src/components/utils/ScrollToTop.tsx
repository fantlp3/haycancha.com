import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * react-router-dom doesn't reset scroll position when the path changes; the
 * browser keeps wherever the previous route left it. Mount this once inside
 * <BrowserRouter> (and outside <Routes>) so every SPA navigation scrolls
 * back to the top, matching standard MPA behavior.
 *
 * Renders nothing.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
