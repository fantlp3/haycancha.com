// Per-sport configuration that drives the SportLandingPage.
// Adding a new sport = adding a key here.

import type { LucideIcon } from "lucide-react";
import { Layers, ShieldCheck, PhoneCall, Snowflake, Users, TrendingUp, Sparkles, BookOpen, MapPinned } from "lucide-react";

export type SportKey = "tenis" | "padel" | "pickleball";

export interface SportFeature {
  icon: LucideIcon;
  title: string;
  body: string;
}
export interface SportStat {
  value: string;
  label: string;
}
export interface EditorialBlock {
  heading: string;
  paragraphs: string[];
}

export interface SportConfig {
  key: SportKey;
  /** Display name in UI (uppercase H1). */
  name: string;
  /** Genitive form for "canchas de X". */
  ofName: string;
  emoji: string;
  /** Tailwind color name from theme (orange|yellow|celeste|lime). */
  color: "yellow" | "celeste" | "lime";
  /** Hex equivalent — used for inline tinted backgrounds (rgba over light). */
  hex: string;
  taglineWord: string;
  subtitle: string;
  /** Eyebrow over hero. */
  eyebrow: string;
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };
  features: [SportFeature, SportFeature, SportFeature];
  stats: SportStat[];
  editorial: EditorialBlock[];
}

export const SPORTS: Record<SportKey, SportConfig> = {
  tenis: {
    key: "tenis",
    name: "TENIS",
    ofName: "tenis",
    emoji: "🎾",
    color: "yellow",
    hex: "#E7E242",
    taglineWord: "perfecta",
    subtitle: "1.480 canchas y clubes de tenis en 19 países de Latinoamérica",
    eyebrow: "🎾 EL DIRECTORIO DE TENIS DE LATINOAMÉRICA",
    meta: {
      title: "Canchas de tenis en Latinoamérica · HayCancha",
      description:
        "1.480 canchas y clubes de tenis en 19 países. Polvo de ladrillo, cemento, sintético, indoor y outdoor. Datos curados, sin intermediarios.",
      ogImage: "/og-tenis.jpg",
    },
    features: [
      {
        icon: Layers,
        title: "Toda la grilla",
        body: "Polvo de ladrillo, cemento, sintético, cubierto, exterior. Pública o privada. Todas las superficies del tenis amateur en un mismo lugar.",
      },
      {
        icon: ShieldCheck,
        title: "Datos curados",
        body: "Fotos reales, contacto verificado, info de superficie e iluminación. Sin sorpresas al llegar al club.",
      },
      {
        icon: PhoneCall,
        title: "Sin intermediarios",
        body: "Link directo al teléfono o WhatsApp del club. Sin comisiones, sin cuentas, sin pasos extra.",
      },
    ],
    stats: [
      { value: "1.480", label: "Canchas" },
      { value: "19", label: "Países" },
      { value: "320", label: "Clubes premium" },
      { value: "5.000+", label: "Búsquedas/mes" },
    ],
    editorial: [
      {
        heading: "El tenis en Latinoamérica",
        paragraphs: [
          "Latinoamérica es una potencia histórica del tenis mundial. Desde Guillermo Vilas y Gabriela Sabatini hasta Juan Martín del Potro, Diego Schwartzman, Guillermo Coria, Nicolás Massú o la dupla colombiana Cabal-Farah, la región exporta talento desde hace décadas.",
          "Argentina, México, Chile y Colombia concentran la mayor densidad de clubes y academias. En cada uno hay una cultura de tenis amateur fuertísima, con torneos zonales, ligas interclubes y miles de canchas abiertas al público todos los días.",
        ],
      },
      {
        heading: "Elegí la superficie que querés jugar",
        paragraphs: [
          "El polvo de ladrillo es la superficie más popular en Sudamérica: es lenta, exige más resistencia y cuida las articulaciones. El cemento (hard court) es rápida y predecible — ideal para principiantes y jugadores agresivos. La sintética imita al polvo pero es de bajo mantenimiento, perfecta para clubes medianos.",
          "Las canchas indoor permiten jugar todo el año sin depender del clima, pero suelen costar más por hora. En HayCancha podés filtrar por superficie y por iluminación nocturna para encontrar exactamente lo que buscás.",
        ],
      },
      {
        heading: "Qué mirar antes de reservar",
        paragraphs: [
          "Antes de ir a una cancha nueva, conviene chequear: iluminación nocturna, vestuarios y duchas, estacionamiento, disponibilidad de clases, alquiler de paletas y pelotas, y si tienen sistema de reserva online o hay que llamar.",
          "Cada ficha de HayCancha incluye estos datos verificados. Si encontrás algo desactualizado, podés reportarlo desde la misma ficha en un clic.",
        ],
      },
    ],
  },

  padel: {
    key: "padel",
    name: "PÁDEL",
    ofName: "pádel",
    emoji: "🏓",
    color: "celeste",
    hex: "#5DB8D4",
    taglineWord: "indoor",
    subtitle: "280 canchas de pádel en 19 países de Latinoamérica",
    eyebrow: "🏓 EL DIRECTORIO DE PÁDEL DE LATINOAMÉRICA",
    meta: {
      title: "Canchas de pádel en Latinoamérica · HayCancha",
      description:
        "280 canchas de pádel en 19 países. Indoor y outdoor, cristal panorámico, redes reglamentarias. Encontrá tu cancha, tu compañero y tu cuarteto.",
      ogImage: "/og-padel.jpg",
    },
    features: [
      {
        icon: Snowflake,
        title: "Indoor y outdoor",
        body: "Canchas con cristal panorámico, redes reglamentarias, indoor con clima controlado. Lo encontrás todo.",
      },
      {
        icon: Users,
        title: "Cultura dobles",
        body: "El pádel se juega en parejas. Encontrá compañero, armá tu cuarteto, descubrí ligas locales y torneos amateurs.",
      },
      {
        icon: TrendingUp,
        title: "Crecimiento imparable",
        body: "El deporte que más crece en LATAM. Nuevas canchas cada mes en CDMX, Bogotá, Buenos Aires y Lima.",
      },
    ],
    stats: [
      { value: "280", label: "Canchas" },
      { value: "19", label: "Países" },
      { value: "95", label: "Clubes" },
      { value: "+35%", label: "Crecimiento anual" },
    ],
    editorial: [
      {
        heading: "El boom del pádel en LATAM",
        paragraphs: [
          "Desde 2020 el pádel explotó en Latinoamérica. La influencia española y argentina —los dos países más fuertes del mundo en este deporte— se hizo sentir en México, Colombia, Chile y Perú, donde se inauguran nuevos complejos cada mes.",
          "El circuito profesional (World Padel Tour, Premier Padel) llevó la disciplina a primera plana, y la accesibilidad frente al tenis —es más fácil de aprender, requiere menos cancha y se juega en pareja— hizo el resto.",
        ],
      },
      {
        heading: "Indoor vs outdoor",
        paragraphs: [
          "Las canchas outdoor son más económicas pero dependen del clima. Las indoor permiten jugar todo el año, con iluminación constante y sin viento — un factor clave en un deporte de pared y cristal.",
          "Los cristales panorámicos templados son obligatorios en canchas reglamentarias y permiten que el público vea el partido desde cualquier ángulo. Los clubes premium suelen sumar climatización y pisos de césped sintético de última generación.",
        ],
      },
      {
        heading: "Primer partido de pádel — qué saber",
        paragraphs: [
          "Si nunca jugaste, no necesitás equipo propio: la mayoría de los clubes alquila paletas y vende pelotas. Buscá un club con clases para principiantes o sesiones grupales — son la forma más rápida de aprender la dinámica de la pared.",
          "Las reglas básicas son parecidas al tenis pero el saque es por debajo y las paredes están en juego. En unos pocos partidos vas a estar listo para sumarte a un cuarteto fijo.",
        ],
      },
    ],
  },

  pickleball: {
    key: "pickleball",
    name: "PICKLEBALL",
    ofName: "pickleball",
    emoji: "🏸",
    color: "lime",
    hex: "#84CC16",
    taglineWord: "amateur",
    subtitle: "45 canchas de pickleball en 19 países — el deporte que más crece",
    eyebrow: "🏸 EL DIRECTORIO DE PICKLEBALL DE LATINOAMÉRICA",
    meta: {
      title: "Canchas de pickleball en Latinoamérica · HayCancha",
      description:
        "45 canchas de pickleball en 19 países. El deporte que más crece en LATAM. Canchas dedicadas y mixtas sobre tenis. Encontrá dónde jugar.",
      ogImage: "/og-pickleball.jpg",
    },
    features: [
      {
        icon: TrendingUp,
        title: "El deporte que más crece",
        body: "Nº1 en USA, llegando fuerte a LATAM. Argentina, México y Colombia liderando la apertura de nuevas canchas.",
      },
      {
        icon: Sparkles,
        title: "Fácil de empezar",
        body: "Reglas simples, raqueta liviana, cancha chica. Familias, todas las edades, todos los niveles.",
      },
      {
        icon: MapPinned,
        title: "Canchas dedicadas y mixtas",
        body: "Canchas pickleball-only o adaptadas sobre tenis. Cada ficha del directorio indica claramente cuál es cuál.",
      },
    ],
    stats: [
      { value: "45", label: "Canchas" },
      { value: "12", label: "Países" },
      { value: "+120%", label: "Crecimiento anual" },
      { value: "25-65", label: "Edad promedio jugadores" },
    ],
    editorial: [
      {
        heading: "Qué es el pickleball",
        paragraphs: [
          "El pickleball nació en Estados Unidos en 1965 como un juego de jardín que mezcla tenis, bádminton y ping-pong. Se juega con una raqueta sólida (paddle), una pelota perforada de plástico y una red baja, en una cancha más chica que la de tenis.",
          "Su explosión llegó en la década de 2020: en Estados Unidos pasó a ser el deporte de mayor crecimiento del país. Su accesibilidad —reglas simples, equipo barato, físico no exigente— lo hace ideal para todas las edades.",
        ],
      },
      {
        heading: "Cómo llegó a Latinoamérica",
        paragraphs: [
          "Argentina, México y Colombia fueron los primeros en sumarse. Las comunidades de expatriados estadounidenses jugaron un rol clave llevando la cultura del deporte a clubes ya existentes.",
          "Hoy hay torneos zonales en Buenos Aires, CDMX, Medellín y Santiago, y cada vez más clubes están abriendo canchas dedicadas en lugar de adaptar canchas de tenis.",
        ],
      },
      {
        heading: "Encontrá dónde jugar",
        paragraphs: [
          "En HayCancha distinguimos los clubes pickleball-only de los clubes de tenis con canchas adaptadas (líneas pintadas sobre la cancha de tenis y red más baja). Ambas opciones son válidas para empezar.",
          "Muchos clubes alquilan paddles y pelotas, y ofrecen clases grupales para principiantes. Filtrá por 'Pickleball' y por 'Clases disponibles' para encontrar el club ideal cerca tuyo.",
        ],
      },
    ],
  },
};

/** Map color name → utility class fragments (text/border/bg/hex). */
export const colorClasses = (color: SportConfig["color"]) => ({
  text: `text-${color}`,
  bg: `bg-${color}`,
  borderLeft: `border-l-${color}`,
  border: `border-${color}`,
});
