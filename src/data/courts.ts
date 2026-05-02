import type { Sport } from "@/components/brand/SportBadge";
import court1 from "@/assets/court-1.jpg";
import court2 from "@/assets/court-2.jpg";
import court3 from "@/assets/court-3.jpg";

export interface SearchCourt {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  thumb: string;
  sports: Sport[];
  premium?: boolean;
  distanceKm?: number;
  surface: string;
  // Position on the placeholder map (% of container, 0-100)
  x: number;
  y: number;
}

export const SAMPLE_COURTS: SearchCourt[] = [
  { id: "1", name: "Club Deportivo Palermo", neighborhood: "Palermo", city: "CABA", thumb: court1, sports: ["tenis", "padel"], premium: true, distanceKm: 1.2, surface: "Polvo de ladrillo", x: 38, y: 32 },
  { id: "2", name: "Asociación Tenis Belgrano", neighborhood: "Belgrano", city: "CABA", thumb: court2, sports: ["tenis"], distanceKm: 2.3, surface: "Cemento", x: 56, y: 28 },
  { id: "3", name: "Complejo Tenis Recoleta", neighborhood: "Recoleta", city: "CABA", thumb: court3, sports: ["tenis", "padel"], distanceKm: 3.1, surface: "Multipiso", x: 48, y: 46 },
  { id: "4", name: "Pádel Norte Vicente López", neighborhood: "Vicente López", city: "GBA Norte", thumb: court3, sports: ["padel"], distanceKm: 5.4, surface: "Césped sintético", x: 64, y: 18 },
  { id: "5", name: "Tenis Club Caballito", neighborhood: "Caballito", city: "CABA", thumb: court1, sports: ["tenis"], premium: true, distanceKm: 4.0, surface: "Polvo de ladrillo", x: 30, y: 58 },
  { id: "6", name: "Pickle CABA", neighborhood: "Núñez", city: "CABA", thumb: court2, sports: ["pickleball"], distanceKm: 6.2, surface: "Cemento", x: 70, y: 42 },
  { id: "7", name: "Club Italiano Tenis", neighborhood: "Caballito", city: "CABA", thumb: court1, sports: ["tenis", "padel"], distanceKm: 4.5, surface: "Polvo de ladrillo", x: 22, y: 70 },
  { id: "8", name: "Pádel Sur", neighborhood: "Barracas", city: "CABA", thumb: court3, sports: ["padel"], distanceKm: 7.8, surface: "Césped sintético", x: 50, y: 78 },
];
