export interface PromoSlot {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  emoji: string;
}

export const PROMO_SLOTS: PromoSlot[] = [
  {
    id: "agregar",
    title: "¿Tenés un club?",
    subtitle: "Listalo gratis en HayCancha",
    cta: "Sumar mi club",
    href: "/agregar-cancha",
    emoji: "🎾",
  },
  {
    id: "premium",
    title: "Destacá tu cancha",
    subtitle: "Conocé el plan premium",
    cta: "Más info",
    href: "/",
    emoji: "⭐",
  },
  {
    id: "explorar",
    title: "Explorá 2,297 canchas",
    subtitle: "En toda Latinoamérica",
    cta: "Buscar canchas",
    href: "/canchas",
    emoji: "🗺️",
  },
  {
    id: "tenis",
    title: "Tu cancha de tenis perfecta",
    subtitle: "Encontrala en HayCancha",
    cta: "Ver canchas de tenis",
    href: "/tenis",
    emoji: "🎾",
  },
  {
    id: "padel",
    title: "Pádel en tu barrio",
    subtitle: "977 canchas en LATAM",
    cta: "Ver canchas de pádel",
    href: "/padel",
    emoji: "🥎",
  },
  {
    id: "pickleball",
    title: "Pickleball está creciendo",
    subtitle: "385 canchas en LATAM",
    cta: "Ver canchas de pickleball",
    href: "/pickleball",
    emoji: "🏓",
  },
];
