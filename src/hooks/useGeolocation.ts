import { useEffect, useState } from "react";

type GeoState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "granted"; coords: { lat: number; lng: number } }
  | { status: "denied" };

// Module-level cache: shared across mounts so navigating between detail
// pages doesn't re-prompt for permission within the same session.
let cachedCoords: { lat: number; lng: number } | null = null;
let cachedDenied = false;

export function useGeolocation(enabled: boolean = true) {
  const [state, setState] = useState<GeoState>(() => {
    if (cachedCoords) return { status: "granted", coords: cachedCoords };
    if (cachedDenied) return { status: "denied" };
    return { status: "idle" };
  });

  useEffect(() => {
    if (!enabled || state.status !== "idle") return;
    if (!navigator.geolocation) {
      cachedDenied = true;
      setState({ status: "denied" });
      return;
    }
    setState({ status: "pending" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        cachedCoords = coords;
        setState({ status: "granted", coords });
      },
      () => {
        cachedDenied = true;
        setState({ status: "denied" });
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [state.status, enabled]);

  return state;
}
