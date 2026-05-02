// Configuration data for the "Agregá tu cancha" submission form.

export const COUNTRIES_FORM = [
  { name: "Argentina", code: "+54" },
  { name: "Bolivia", code: "+591" },
  { name: "Chile", code: "+56" },
  { name: "Colombia", code: "+57" },
  { name: "Costa Rica", code: "+506" },
  { name: "Cuba", code: "+53" },
  { name: "Ecuador", code: "+593" },
  { name: "El Salvador", code: "+503" },
  { name: "Guatemala", code: "+502" },
  { name: "Honduras", code: "+504" },
  { name: "México", code: "+52" },
  { name: "Nicaragua", code: "+505" },
  { name: "Panamá", code: "+507" },
  { name: "Paraguay", code: "+595" },
  { name: "Perú", code: "+51" },
  { name: "Puerto Rico", code: "+1" },
  { name: "República Dominicana", code: "+1" },
  { name: "Uruguay", code: "+598" },
  { name: "Venezuela", code: "+58" },
] as const;

export const provinceLabel = (country: string): string => {
  if (
    [
      "Argentina",
      "Cuba",
      "Ecuador",
      "Panamá",
      "República Dominicana",
      "El Salvador",
      "Costa Rica",
      "Guatemala",
      "Honduras",
      "Nicaragua",
    ].includes(country)
  )
    return "Provincia";
  if (["México", "Venezuela"].includes(country)) return "Estado";
  if (["Colombia", "Bolivia", "Paraguay", "Uruguay", "Perú"].includes(country)) return "Departamento";
  if (country === "Chile") return "Región";
  if (country === "Puerto Rico") return "Municipio principal";
  return "Provincia / Estado";
};

// Mock suggestions store: in production these come from Directus.
export const PROVINCE_SUGGESTIONS: Record<string, string[]> = {
  Argentina: ["Buenos Aires", "CABA", "Córdoba", "Santa Fe", "Mendoza", "Tucumán"],
  México: ["Ciudad de México", "Jalisco", "Nuevo León", "Estado de México"],
  Colombia: ["Cundinamarca", "Antioquia", "Valle del Cauca"],
  Chile: ["Región Metropolitana", "Valparaíso", "Biobío"],
  Perú: ["Lima", "Arequipa", "Cusco"],
};

export const CITY_SUGGESTIONS: Record<string, string[]> = {
  "Buenos Aires": ["La Plata", "Mar del Plata", "Vicente López", "San Isidro"],
  CABA: ["Buenos Aires"],
  "Ciudad de México": ["Ciudad de México"],
  Jalisco: ["Guadalajara", "Zapopan"],
  Cundinamarca: ["Bogotá", "Chía"],
  "Región Metropolitana": ["Santiago", "Providencia", "Las Condes"],
  Lima: ["Lima", "Miraflores", "San Isidro"],
};

export const NEIGHBORHOOD_SUGGESTIONS: Record<string, string[]> = {
  "Buenos Aires": ["Palermo", "Belgrano", "Recoleta", "Caballito", "Núñez"],
  Bogotá: ["Chapinero", "Usaquén", "Chicó"],
  Santiago: ["Providencia", "Las Condes", "Ñuñoa"],
  Guadalajara: ["Providencia", "Chapalita"],
  Lima: ["Miraflores", "Barranco", "San Isidro"],
};

export const TIPOS_COMPLEJO = [
  "Club",
  "Complejo deportivo",
  "Cancha pública",
  "Hotel con canchas",
  "Otro",
] as const;

export const SUPERFICIES = [
  "Polvo de ladrillo",
  "Cemento",
  "Césped sintético",
  "Multipiso",
  "Cristal (pádel)",
  "Indoor cubierto",
] as const;

export const SERVICIOS = [
  { key: "vestuarios", label: "Vestuarios" },
  { key: "estacionamiento", label: "Estacionamiento" },
  { key: "bar", label: "Bar / Restaurante" },
  { key: "clases", label: "Clases (grupales o individuales)" },
  { key: "alquiler", label: "Alquiler de paletas / raquetas" },
  { key: "reserva_online", label: "Reserva online disponible" },
  { key: "tienda", label: "Tienda / Pro shop" },
  { key: "wifi", label: "Wi-Fi para clientes" },
] as const;

export const DIAS = [
  { key: "lunes", label: "Lun" },
  { key: "martes", label: "Mar" },
  { key: "miercoles", label: "Mié" },
  { key: "jueves", label: "Jue" },
  { key: "viernes", label: "Vie" },
  { key: "sabado", label: "Sáb" },
  { key: "domingo", label: "Dom" },
] as const;

export type DiaKey = (typeof DIAS)[number]["key"];

export const SECTIONS = [
  { id: "info", label: "Información" },
  { id: "deportes", label: "Deportes y canchas" },
  { id: "servicios", label: "Servicios" },
  { id: "ubicacion", label: "Ubicación" },
  { id: "contacto", label: "Contacto" },
  { id: "horarios", label: "Horarios" },
  { id: "fotos", label: "Fotos" },
  { id: "confirmacion", label: "Confirmación" },
] as const;
