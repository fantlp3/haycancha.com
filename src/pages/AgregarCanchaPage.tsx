import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Copy,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/brand/Navbar";
import { Footer } from "@/components/sections/Footer";
import { cn } from "@/lib/utils";
import { LocationPicker } from "@/components/agregar/LocationPicker";
import { PhotoUploader, type UploadedPhoto } from "@/components/agregar/PhotoUploader";
import { Combobox } from "@/components/agregar/Combobox";
import { SportIcon } from "@/components/ui/SportIcon";
import {
  COUNTRIES_FORM,
  provinceLabel,
  PROVINCE_SUGGESTIONS,
  CITY_SUGGESTIONS,
  NEIGHBORHOOD_SUGGESTIONS,
  TIPOS_COMPLEJO,
  SUPERFICIES_POR_DEPORTE,
  SERVICIOS,
  DIAS,
  SECTIONS,
  type DiaKey,
} from "@/lib/agregar-cancha-config";
import { useSubmitClub } from "@/hooks/useSubmitClub";
import { toSubmission } from "@/lib/agregar-cancha-mapper";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

// ----- Schema -----
const horarioSchema = z.object({
  abierto: z.boolean(),
  desde: z.string(),
  hasta: z.string(),
});

const sportDetailSchema = z.object({
  cantidad: z.number().int().min(1, "Mínimo 1").max(50, "Máximo 50"),
  superficies: z
    .array(z.string())
    .min(1, "Seleccioná al menos una superficie"),
});

const formSchema = z.object({
  submitter_role: z.enum(["owner", "player"]),
  nombre: z.string().trim().min(2, "Ingresá el nombre del complejo").max(200),
  tipo: z.string().min(1, "Seleccioná el tipo de complejo"),
  descripcion: z.string().max(800).optional(),
  deportes: z
    .object({
      tenis: sportDetailSchema.optional(),
      padel: sportDetailSchema.optional(),
      pickleball: sportDetailSchema.optional(),
    })
    .refine(
      (d) => !!d.tenis || !!d.padel || !!d.pickleball,
      "Seleccioná al menos un deporte"
    ),
  iluminacion: z.boolean(),
  tipo_instalacion: z.enum(["outdoor", "indoor", "mixto"]).nullable(),
  servicios: z.record(z.string(), z.boolean()),
  url_reserva: z.string().url("URL inválida").optional().or(z.literal("")),
  ubicacion: z.object({
    pais: z.string().min(1, "Seleccioná un país"),
    provincia: z.string().min(1, "Campo obligatorio"),
    ciudad: z.string().min(1, "Campo obligatorio"),
    barrio: z.string().optional(),
    direccion: z.string().min(3, "Ingresá la dirección").max(300),
    entre_calle_1: z.string().optional(),
    entre_calle_2: z.string().optional(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
  }),
  contacto: z.object({
    nombre_apellido: z.string().trim().min(2, "Campo obligatorio").max(150),
    email: z.string().trim().email("Email inválido"),
    telefono: z.string().min(8, "Mínimo 8 dígitos"),
    whatsapp: z.string().optional(),
    website: z.string().url("URL inválida").optional().or(z.literal("")),
    instagram: z.string().optional(),
  }),
  horarios: z.object({
    lunes: horarioSchema,
    martes: horarioSchema,
    miercoles: horarioSchema,
    jueves: horarioSchema,
    viernes: horarioSchema,
    sabado: horarioSchema,
    domingo: horarioSchema,
    notas: z.string().max(200).optional(),
  }),
  consentimiento: z.object({ autorizacion: z.literal(true), terminos: z.literal(true) }),
});

type FormData = z.infer<typeof formSchema>;

const initial: FormData = {
  submitter_role: "owner",
  nombre: "",
  tipo: "",
  descripcion: "",
  deportes: {},
  iluminacion: false,
  tipo_instalacion: null,
  servicios: Object.fromEntries(SERVICIOS.map((s) => [s.key, false])),
  url_reserva: "",
  ubicacion: {
    pais: "",
    provincia: "",
    ciudad: "",
    barrio: "",
    direccion: "",
    entre_calle_1: "",
    entre_calle_2: "",
    lat: null,
    lng: null,
  },
  contacto: {
    nombre_apellido: "",
    email: "",
    telefono: "",
    whatsapp: "",
    website: "",
    instagram: "",
  },
  horarios: {
    lunes: { abierto: true, desde: "08:00", hasta: "22:00" },
    martes: { abierto: true, desde: "08:00", hasta: "22:00" },
    miercoles: { abierto: true, desde: "08:00", hasta: "22:00" },
    jueves: { abierto: true, desde: "08:00", hasta: "22:00" },
    viernes: { abierto: true, desde: "08:00", hasta: "22:00" },
    sabado: { abierto: true, desde: "08:00", hasta: "20:00" },
    domingo: { abierto: false, desde: "09:00", hasta: "18:00" },
    notas: "",
  },
  // Consent fields are not pre-true to satisfy z.literal(true) only after click.
  consentimiento: { autorizacion: false as unknown as true, terminos: false as unknown as true },
};

// ----- Reusable bits -----
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-semibold text-[11px] uppercase tracking-[3px] text-orange mb-4">{children}</p>
);

const FieldLabel = ({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-dark mb-1.5">
    {children}
    {required && <span className="text-orange ml-0.5">*</span>}
  </label>
);

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p role="alert" aria-live="polite" className="mt-1.5 text-[12px] text-destructive flex items-center gap-1">
      <AlertCircle size={12} /> {msg}
    </p>
  ) : null;

const inputClass = (invalid?: boolean) =>
  cn(
    "w-full h-11 px-3 border rounded-md text-[14px] bg-white text-dark placeholder:text-gray/70 outline-none focus:border-orange focus:shadow-focus-orange transition disabled:opacity-50",
    invalid ? "border-destructive" : "border-border"
  );

// Section completion logic
const sectionStatus = (data: FormData): Record<string, boolean> => ({
  info: !!data.nombre && !!data.tipo,
  deportes: !!data.deportes.tenis || !!data.deportes.padel || !!data.deportes.pickleball,
  servicios: true,
  ubicacion:
    !!data.ubicacion.pais &&
    !!data.ubicacion.provincia &&
    !!data.ubicacion.ciudad &&
    !!data.ubicacion.direccion &&
    data.ubicacion.lat != null &&
    data.ubicacion.lng != null,
  contacto: !!data.contacto.nombre_apellido && !!data.contacto.email && data.contacto.telefono.length >= 8,
  horarios: true,
  fotos: false, // overridden in component (depends on photos state)
  confirmacion: !!data.consentimiento.autorizacion && !!data.consentimiento.terminos,
});

const AgregarCanchaPage = () => {
  const [data, setData] = useState<FormData>(initial);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ nombre: string; email: string } | null>(null);
  const [phoneIsWhatsapp, setPhoneIsWhatsapp] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const { mutateAsync } = useSubmitClub();

  const country = data.ubicacion.pais;
  const countryMeta = COUNTRIES_FORM.find((c) => c.name === country);
  const phonePrefix = countryMeta?.code ?? "";

  // Auto-prefill phone prefix when country changes
  useEffect(() => {
    if (!phonePrefix) return;
    setData((d) => {
      const tel = d.contacto.telefono;
      const wa = d.contacto.whatsapp ?? "";
      const next = { ...d };
      if (!tel || /^\+\d+\s?$/.test(tel.trim())) {
        next.contacto = { ...next.contacto, telefono: `${phonePrefix} ` };
      }
      if (!wa || /^\+\d+\s?$/.test(wa.trim())) {
        next.contacto = { ...next.contacto, whatsapp: phoneIsWhatsapp ? next.contacto.telefono : `${phonePrefix} ` };
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phonePrefix]);

  // Mirror phone → whatsapp when toggle is on
  useEffect(() => {
    if (phoneIsWhatsapp) {
      setData((d) => ({
        ...d,
        contacto: { ...d.contacto, whatsapp: d.contacto.telefono },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneIsWhatsapp, data.contacto.telefono]);

  const status = useMemo(() => {
    const s = sectionStatus(data);
    s.fotos = true;
    return s;
  }, [data]);

  const completedCount = Object.values(status).filter(Boolean).length;
  const progressPct = Math.round((completedCount / SECTIONS.length) * 100);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const updateUbicacion = <K extends keyof FormData["ubicacion"]>(
    key: K,
    value: FormData["ubicacion"][K]
  ) => setData((d) => ({ ...d, ubicacion: { ...d.ubicacion, [key]: value } }));

  const updateContacto = <K extends keyof FormData["contacto"]>(
    key: K,
    value: FormData["contacto"][K]
  ) => setData((d) => ({ ...d, contacto: { ...d.contacto, [key]: value } }));

  const updateHorario = (day: DiaKey, patch: Partial<FormData["horarios"]["lunes"]>) =>
    setData((d) => ({
      ...d,
      horarios: { ...d.horarios, [day]: { ...d.horarios[day], ...patch } },
    }));

  type SportKey = "tenis" | "padel" | "pickleball";
  const toggleSport = (sport: SportKey, on: boolean) =>
    setData((d) => {
      const next = { ...d, deportes: { ...d.deportes } };
      if (on) {
        next.deportes[sport] = next.deportes[sport] ?? { cantidad: 1, superficies: [] };
      } else {
        delete next.deportes[sport];
      }
      return next;
    });

  const updateSport = (sport: SportKey, patch: Partial<{ cantidad: number; superficies: string[] }>) =>
    setData((d) => {
      const current = d.deportes[sport];
      if (!current) return d;
      return {
        ...d,
        deportes: { ...d.deportes, [sport]: { ...current, ...patch } },
      };
    });

  const copyMondayToAll = () => {
    const src = data.horarios.lunes;
    setData((d) => ({
      ...d,
      horarios: {
        ...d.horarios,
        martes: { ...src },
        miercoles: { ...src },
        jueves: { ...src },
        viernes: { ...src },
        sabado: { ...src },
        domingo: { ...src },
      },
    }));
  };

  const validate = (): { ok: boolean; firstErrorKey?: string } => {
    const r = formSchema.safeParse(data);
    const newErr: Record<string, string> = {};
    if (!r.success) {
      for (const issue of r.error.issues) {
        newErr[issue.path.join(".")] = issue.message;
      }
    }
    if (data.ubicacion.lat == null || data.ubicacion.lng == null) {
      newErr["ubicacion.lat"] = "Confirmá la ubicación en el mapa";
    }
    setErrors(newErr);
    const firstErrorKey = Object.keys(newErr)[0];
    return { ok: Object.keys(newErr).length === 0, firstErrorKey };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const { ok, firstErrorKey } = validate();
    const sectionMap: Record<string, string> = {
      nombre: "info",
      tipo: "info",
      deportes: "deportes",
      ubicacion: "ubicacion",
      "ubicacion.lat": "ubicacion",
      contacto: "contacto",
      consentimiento: "confirmacion",
    };
    if (!ok) {
      const sec = sectionMap[firstErrorKey?.split(".")[0] ?? ""] ?? "info";
      sectionRefs.current[sec]?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!turnstileToken) {
      setServerError(
        TURNSTILE_SITE_KEY
          ? "Esperá a que termine la verificación anti-spam y volvé a enviar."
          : "Verificación anti-spam no configurada en este entorno. No se puede enviar."
      );
      sectionRefs.current.confirmacion?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setSubmitting(true);
    const result = await mutateAsync({ data: toSubmission(data), turnstileToken });
    setSubmitting(false);
    if (result.success) {
      setSuccess({ nombre: data.nombre, email: data.contacto.email });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Token is single-use — reset the widget so the user can submit again.
    setTurnstileToken(null);
    turnstileRef.current?.reset();
    if (result.details) {
      // Map Directus collection field names back to the form's nested error keys
      // so per-field <ErrorMsg> components and the scroll-to-section logic work.
      const fieldMap: Record<string, string> = {
        nombre: "nombre",
        tipo: "tipo",
        direccion: "ubicacion.direccion",
        pais_texto: "ubicacion.pais",
        ciudad_texto: "ubicacion.ciudad",
        barrio_texto: "ubicacion.barrio",
        latitud: "ubicacion.lat",
        longitud: "ubicacion.lng",
        telefono: "contacto.telefono",
        website: "contacto.website",
        nombre_remitente: "contacto.nombre_apellido",
        email_remitente: "contacto.email",
        relacion_con_club: "submitter_role",
        deportes_indicados: "deportes",
        cantidad_canchas: "deportes",
      };
      const newErr: Record<string, string> = {};
      for (const [field, message] of Object.entries(result.details)) {
        newErr[fieldMap[field] ?? field] = message;
      }
      setErrors((prev) => ({ ...prev, ...newErr }));
      const firstKey = Object.keys(newErr)[0];
      const sec = sectionMap[firstKey?.split(".")[0] ?? ""] ?? "info";
      sectionRefs.current[sec]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setServerError(result.error);
  };

  const resetForm = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setData(initial);
    setSuccess(null);
    setErrors({});
    setPhoneIsWhatsapp(false);
    window.scrollTo({ top: 0 });
  };

  // ---- Success view ----
  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-light">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="bg-white rounded-xl border border-border shadow-card p-12 max-w-[600px] w-full text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange text-white flex items-center justify-center mb-6">
              <Check size={32} strokeWidth={3} />
            </div>
            <h2 className="font-display text-dark text-[36px] leading-none">¡SOLICITUD ENVIADA!</h2>
            <p className="mt-4 text-[16px] text-dark leading-relaxed">
              Recibimos los datos de <strong>{success.nombre}</strong>. Nuestro equipo los revisará en las
              próximas 48 horas hábiles. Te avisaremos por email a{" "}
              <strong className="text-orange">{success.email}</strong> cuando tu complejo esté publicado.
            </p>
            <div className="mt-8 space-y-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center w-full sm:w-[320px] mx-auto h-12 bg-orange text-white font-bold uppercase tracking-[1px] rounded-md hover:brightness-90 transition"
              >
                Volver al inicio
              </Link>
              <button
                onClick={resetForm}
                className="block mx-auto text-orange text-[14px] font-semibold hover:underline"
              >
                Agregar otro complejo
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const provinceLbl = country ? provinceLabel(country) : "Provincia / Estado";
  const provinceSugg = country ? PROVINCE_SUGGESTIONS[country] ?? [] : [];
  const citySugg = data.ubicacion.provincia ? CITY_SUGGESTIONS[data.ubicacion.provincia] ?? [] : [];
  const barrioSugg = data.ubicacion.ciudad ? NEIGHBORHOOD_SUGGESTIONS[data.ubicacion.ciudad] ?? [] : [];
  const geocodeQuery =
    country && data.ubicacion.ciudad && data.ubicacion.direccion
      ? `${data.ubicacion.direccion}, ${data.ubicacion.ciudad}, ${country}`
      : "";

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />

      {/* Mobile progress bar */}
      <div className="lg:hidden sticky top-[60px] z-40 bg-white border-b border-border">
        <div className="h-1 bg-light">
          <div
            className="h-full bg-orange transition-all"
            style={{ width: `${progressPct}%` }}
            aria-hidden
          />
        </div>
        <div className="px-4 py-2 text-[11px] uppercase tracking-wider text-gray font-semibold">
          {completedCount}/{SECTIONS.length} secciones completas
        </div>
      </div>

      {/* Header */}
      <header className="bg-dark relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)",
          }}
        />
        <div className="relative max-w-container mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <p className="font-semibold text-[11px] uppercase tracking-[3px] text-orange mb-4 inline-flex items-center gap-2">
            <SportIcon sport="tenis" size={26} />
            Sumá tu complejo al directorio
          </p>
          <h1 className="font-display text-white text-[44px] md:text-[64px] leading-[0.95]">
            AGREGÁ TU CANCHA
          </h1>
          <p className="mt-5 text-white/75 text-[17px] leading-relaxed max-w-[640px]">
            En HayCancha te damos la posibilidad de llegar a todos los jugadores de tenis, pádel y
            pickleball amateur de Latinoamérica. Completá los datos de tu complejo y, tras una breve
            revisión, lo publicamos.
          </p>
        </div>
      </header>

      {/* Free / premium callout */}
      <div className="max-w-container mx-auto px-6 lg:px-10 mt-10">
        <div
          className="max-w-[720px] mx-auto rounded-md p-5 flex gap-3 items-start"
          style={{ background: "rgba(232,99,42,0.08)", borderLeft: "3px solid #E8632A" }}
        >
          <Check className="text-orange shrink-0 mt-0.5" size={18} strokeWidth={3} />
          <p className="text-[15px] text-dark">
            El alta es totalmente gratuita. Si querés mayor visibilidad o posicionamiento destacado,
            escribinos a{" "}
            <a href="mailto:haycancha.online@gmail.com" className="text-orange font-semibold hover:underline">
              haycancha.online@gmail.com
            </a>
          </p>
        </div>
      </div>

      <main className="max-w-container mx-auto px-6 lg:px-10 mt-10 mb-16 w-full">
        <div className="grid lg:grid-cols-[minmax(0,720px)_240px] gap-10 items-start">
          {/* Form */}
          <form onSubmit={onSubmit} noValidate className="space-y-12 min-w-0 relative">
            <p className="text-[13px] text-gray">
              Los campos marcados con <span className="text-orange font-semibold">*</span> son
              obligatorios. Toda solicitud es revisada por nuestro equipo antes de publicarse —
              recibirás un email cuando tu complejo esté online.
            </p>

            {/* SECTION 1 — INFO */}
            <section
              ref={(el) => { sectionRefs.current.info = el; }}
              className="bg-white border border-border rounded-xl p-6 md:p-8"
            >
              <SectionLabel>Información del complejo</SectionLabel>

              <div className="space-y-5">
                <fieldset>
                  <legend className="block text-[13px] font-semibold text-dark mb-2">
                    Te identificás como <span className="text-orange">*</span>
                  </legend>
                  <div className="space-y-2">
                    {[
                      { v: "owner", l: "Soy dueño/encargado del complejo" },
                      { v: "player", l: "Soy jugador y quiero sugerir este complejo" },
                    ].map((opt) => (
                      <label key={opt.v} className="flex items-center gap-2 text-[14px] cursor-pointer">
                        <input
                          type="radio"
                          name="submitter_role"
                          value={opt.v}
                          checked={data.submitter_role === opt.v}
                          onChange={() => update("submitter_role", opt.v as "owner" | "player")}
                          className="accent-orange w-4 h-4"
                        />
                        {opt.l}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <FieldLabel htmlFor="nombre" required>Nombre del complejo</FieldLabel>
                  <input
                    id="nombre"
                    type="text"
                    maxLength={200}
                    value={data.nombre}
                    onChange={(e) => update("nombre", e.target.value)}
                    placeholder="Ej: Club Atlético Palermo"
                    aria-required
                    aria-invalid={!!errors.nombre}
                    className={inputClass(!!errors.nombre)}
                  />
                  <ErrorMsg msg={errors.nombre} />
                </div>

                <div>
                  <FieldLabel htmlFor="tipo" required>Tipo de complejo</FieldLabel>
                  <select
                    id="tipo"
                    value={data.tipo}
                    onChange={(e) => update("tipo", e.target.value)}
                    aria-required
                    aria-invalid={!!errors.tipo}
                    className={inputClass(!!errors.tipo)}
                  >
                    <option value="">Seleccioná una opción</option>
                    {TIPOS_COMPLEJO.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ErrorMsg msg={errors.tipo} />
                </div>

                <div>
                  <FieldLabel htmlFor="descripcion">Descripción</FieldLabel>
                  <textarea
                    id="descripcion"
                    rows={4}
                    maxLength={800}
                    value={data.descripcion ?? ""}
                    onChange={(e) => update("descripcion", e.target.value)}
                    placeholder="Contanos brevemente sobre el complejo: historia, ambiente, qué lo hace especial..."
                    className="w-full p-3 border border-border rounded-md text-[14px] outline-none focus:border-orange focus:shadow-focus-orange transition resize-y"
                  />
                  <p className="text-[11px] text-gray text-right mt-1">
                    {(data.descripcion ?? "").length}/800
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2 — DEPORTES */}
            <section
              ref={(el) => { sectionRefs.current.deportes = el; }}
              className="bg-white border border-border rounded-xl p-6 md:p-8"
            >
              <SectionLabel>Deportes y canchas</SectionLabel>
              <div className="space-y-5">
                <fieldset>
                  <legend className="block text-[13px] font-semibold text-dark mb-2">
                    Deportes ofrecidos <span className="text-orange">*</span>
                  </legend>
                  <p className="text-[12px] text-gray mb-3">
                    Marcá los deportes que ofrece tu complejo. Por cada uno indicá la cantidad
                    de canchas y la(s) superficie(s).
                  </p>
                  <div className="space-y-3">
                    {([
                      { k: "tenis", l: "Tenis" },
                      { k: "padel", l: "Pádel" },
                      { k: "pickleball", l: "Pickleball" },
                    ] as const).map((s) => {
                      const detail = data.deportes[s.k];
                      const active = !!detail;
                      const cantidadErr = errors[`deportes.${s.k}.cantidad`];
                      const superficiesErr = errors[`deportes.${s.k}.superficies`];
                      return (
                        <div
                          key={s.k}
                          className={cn(
                            "border rounded-md transition",
                            active ? "border-orange bg-orange/5" : "border-border bg-light"
                          )}
                        >
                          <label className="flex items-center gap-2 p-3 cursor-pointer text-[14px] font-semibold text-dark">
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={(e) => toggleSport(s.k, e.target.checked)}
                              className="accent-orange w-4 h-4"
                            />
                            <SportIcon sport={s.k} size={16} />
                            {s.l}
                          </label>
                          {active && detail && (
                            <div className="px-4 pb-4 space-y-4">
                              <div>
                                <FieldLabel htmlFor={`cantidad-${s.k}`} required>
                                  ¿Cuántas canchas de {s.l.toLowerCase()}?
                                </FieldLabel>
                                <input
                                  id={`cantidad-${s.k}`}
                                  type="number"
                                  min={1}
                                  max={50}
                                  value={detail.cantidad || ""}
                                  onChange={(e) =>
                                    updateSport(s.k, {
                                      cantidad: e.target.value ? parseInt(e.target.value) : 0,
                                    })
                                  }
                                  placeholder="Ej: 4"
                                  aria-required
                                  aria-invalid={!!cantidadErr}
                                  className={cn(inputClass(!!cantidadErr), "max-w-[160px]")}
                                />
                                <ErrorMsg msg={cantidadErr} />
                              </div>
                              <div>
                                <p className="block text-[13px] font-semibold text-dark mb-1.5">
                                  Superficie(s) <span className="text-orange">*</span>
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {SUPERFICIES_POR_DEPORTE[s.k].map((surf) => {
                                    const checked = detail.superficies.includes(surf);
                                    return (
                                      <label
                                        key={surf}
                                        className="flex items-center gap-2 text-[14px] cursor-pointer"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() =>
                                            updateSport(s.k, {
                                              superficies: checked
                                                ? detail.superficies.filter((x) => x !== surf)
                                                : [...detail.superficies, surf],
                                            })
                                          }
                                          className="accent-orange w-4 h-4"
                                        />
                                        {surf}
                                      </label>
                                    );
                                  })}
                                </div>
                                <ErrorMsg msg={superficiesErr} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <ErrorMsg msg={errors.deportes} />
                </fieldset>

                <label className="flex items-center justify-between gap-3 p-3 border border-border rounded-md">
                  <span className="text-[14px] text-dark">El complejo cuenta con iluminación nocturna</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={data.iluminacion}
                    onClick={() => update("iluminacion", !data.iluminacion)}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors",
                      data.iluminacion ? "bg-orange" : "bg-border"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                        data.iluminacion && "translate-x-5"
                      )}
                    />
                  </button>
                </label>

                <fieldset>
                  <legend className="block text-[13px] font-semibold text-dark mb-2">
                    Tipo de instalación
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { v: "outdoor", l: "Outdoor (al aire libre)" },
                      { v: "indoor", l: "Indoor (cubierto)" },
                      { v: "mixto", l: "Mixto" },
                    ].map((opt) => (
                      <label key={opt.v} className="inline-flex items-center gap-2 text-[14px] cursor-pointer">
                        <input
                          type="radio"
                          name="tipo_instalacion"
                          value={opt.v}
                          checked={data.tipo_instalacion === opt.v}
                          onChange={() =>
                            update("tipo_instalacion", opt.v as "outdoor" | "indoor" | "mixto")
                          }
                          className="accent-orange w-4 h-4"
                        />
                        {opt.l}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </section>

            {/* SECTION 3 — SERVICIOS */}
            <section
              ref={(el) => { sectionRefs.current.servicios = el; }}
              className="bg-white border border-border rounded-xl p-6 md:p-8"
            >
              <SectionLabel>Servicios</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICIOS.map((s) => {
                  const checked = !!data.servicios[s.key];
                  return (
                    <label key={s.key} className="flex items-center gap-2 text-[14px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          update("servicios", { ...data.servicios, [s.key]: e.target.checked })
                        }
                        className="accent-orange w-4 h-4"
                      />
                      {s.label}
                    </label>
                  );
                })}
              </div>
              {data.servicios["reserva_online"] && (
                <div className="mt-5">
                  <FieldLabel htmlFor="url_reserva">URL de reserva</FieldLabel>
                  <input
                    id="url_reserva"
                    type="url"
                    value={data.url_reserva ?? ""}
                    onChange={(e) => update("url_reserva", e.target.value)}
                    placeholder="https://..."
                    className={inputClass(!!errors.url_reserva)}
                  />
                  <ErrorMsg msg={errors.url_reserva} />
                </div>
              )}
            </section>

            {/* SECTION 4 — UBICACIÓN */}
            <section
              ref={(el) => { sectionRefs.current.ubicacion = el; }}
              className="bg-white border border-border rounded-xl p-6 md:p-8"
            >
              <SectionLabel>Ubicación</SectionLabel>
              <div className="space-y-5">
                <div>
                  <FieldLabel htmlFor="pais" required>País</FieldLabel>
                  <select
                    id="pais"
                    value={country}
                    onChange={(e) => {
                      updateUbicacion("pais", e.target.value);
                      updateUbicacion("provincia", "");
                      updateUbicacion("ciudad", "");
                      updateUbicacion("barrio", "");
                    }}
                    aria-required
                    aria-invalid={!!errors["ubicacion.pais"]}
                    className={inputClass(!!errors["ubicacion.pais"])}
                  >
                    <option value="">Seleccioná un país</option>
                    {COUNTRIES_FORM.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <ErrorMsg msg={errors["ubicacion.pais"]} />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel htmlFor="provincia" required>{provinceLbl}</FieldLabel>
                    <Combobox
                      id="provincia"
                      value={data.ubicacion.provincia}
                      onChange={(v) => {
                        updateUbicacion("provincia", v);
                        updateUbicacion("ciudad", "");
                        updateUbicacion("barrio", "");
                      }}
                      suggestions={provinceSugg}
                      placeholder={country ? `Ej: ${provinceSugg[0] ?? "Buenos Aires"}` : "Seleccioná un país primero"}
                      disabled={!country}
                      invalid={!!errors["ubicacion.provincia"]}
                      ariaRequired
                    />
                    <ErrorMsg msg={errors["ubicacion.provincia"]} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="ciudad" required>Ciudad / Localidad</FieldLabel>
                    <Combobox
                      id="ciudad"
                      value={data.ubicacion.ciudad}
                      onChange={(v) => {
                        updateUbicacion("ciudad", v);
                        updateUbicacion("barrio", "");
                      }}
                      suggestions={citySugg}
                      placeholder="Ej: Buenos Aires"
                      disabled={!data.ubicacion.provincia}
                      invalid={!!errors["ubicacion.ciudad"]}
                      ariaRequired
                    />
                    <ErrorMsg msg={errors["ubicacion.ciudad"]} />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="barrio">Barrio</FieldLabel>
                  <Combobox
                    id="barrio"
                    value={data.ubicacion.barrio ?? ""}
                    onChange={(v) => updateUbicacion("barrio", v)}
                    suggestions={barrioSugg}
                    placeholder="Ej: Palermo"
                    disabled={!data.ubicacion.ciudad}
                  />
                  <p className="text-[12px] text-gray mt-1.5">
                    Importante para que aparezcas en búsquedas locales.
                  </p>
                </div>

                <div>
                  <FieldLabel htmlFor="direccion" required>Dirección</FieldLabel>
                  <input
                    id="direccion"
                    type="text"
                    maxLength={300}
                    value={data.ubicacion.direccion}
                    onChange={(e) => updateUbicacion("direccion", e.target.value)}
                    placeholder="Ej: Av. Santa Fe 3456"
                    aria-required
                    aria-invalid={!!errors["ubicacion.direccion"]}
                    className={inputClass(!!errors["ubicacion.direccion"])}
                  />
                  <ErrorMsg msg={errors["ubicacion.direccion"]} />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel htmlFor="entre1">Entre calle</FieldLabel>
                    <input
                      id="entre1"
                      type="text"
                      value={data.ubicacion.entre_calle_1 ?? ""}
                      onChange={(e) => updateUbicacion("entre_calle_1", e.target.value)}
                      className={inputClass()}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="entre2">y calle</FieldLabel>
                    <input
                      id="entre2"
                      type="text"
                      value={data.ubicacion.entre_calle_2 ?? ""}
                      onChange={(e) => updateUbicacion("entre_calle_2", e.target.value)}
                      className={inputClass()}
                    />
                  </div>
                </div>

                <div>
                  <p className="block text-[13px] font-semibold text-dark mb-1.5">
                    Confirmá tu ubicación en el mapa <span className="text-orange">*</span>
                  </p>
                  <LocationPicker
                    lat={data.ubicacion.lat}
                    lng={data.ubicacion.lng}
                    onChange={(lat, lng) => {
                      updateUbicacion("lat", lat);
                      updateUbicacion("lng", lng);
                    }}
                    geocodeQuery={geocodeQuery}
                    height={typeof window !== "undefined" && window.innerWidth < 768 ? 240 : 300}
                  />
                  <ErrorMsg msg={errors["ubicacion.lat"]} />
                </div>
              </div>
            </section>

            {/* SECTION 5 — CONTACTO */}
            <section
              ref={(el) => { sectionRefs.current.contacto = el; }}
              className="bg-white border border-border rounded-xl p-6 md:p-8"
            >
              <SectionLabel>Datos de contacto</SectionLabel>
              <div className="space-y-5">
                <div>
                  <FieldLabel htmlFor="nombre_apellido" required>Nombre y apellido del contacto</FieldLabel>
                  <input
                    id="nombre_apellido"
                    type="text"
                    maxLength={150}
                    value={data.contacto.nombre_apellido}
                    onChange={(e) => updateContacto("nombre_apellido", e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    aria-required
                    aria-invalid={!!errors["contacto.nombre_apellido"]}
                    className={inputClass(!!errors["contacto.nombre_apellido"])}
                  />
                  <ErrorMsg msg={errors["contacto.nombre_apellido"]} />
                </div>
                <div>
                  <FieldLabel htmlFor="email" required>Email de contacto</FieldLabel>
                  <input
                    id="email"
                    type="email"
                    value={data.contacto.email}
                    onChange={(e) => updateContacto("email", e.target.value)}
                    aria-required
                    aria-invalid={!!errors["contacto.email"]}
                    className={inputClass(!!errors["contacto.email"])}
                  />
                  <p className="text-[12px] text-gray mt-1.5">
                    Te avisaremos por este email cuando tu complejo esté publicado.
                  </p>
                  <ErrorMsg msg={errors["contacto.email"]} />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel htmlFor="telefono" required>Teléfono del complejo</FieldLabel>
                    <input
                      id="telefono"
                      type="tel"
                      value={data.contacto.telefono}
                      onChange={(e) => updateContacto("telefono", e.target.value)}
                      placeholder={`${phonePrefix || "+54"} 11 1234 5678`}
                      aria-required
                      aria-invalid={!!errors["contacto.telefono"]}
                      className={inputClass(!!errors["contacto.telefono"])}
                    />
                    <ErrorMsg msg={errors["contacto.telefono"]} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
                    <input
                      id="whatsapp"
                      type="tel"
                      value={data.contacto.whatsapp ?? ""}
                      onChange={(e) => updateContacto("whatsapp", e.target.value)}
                      disabled={phoneIsWhatsapp}
                      className={inputClass()}
                    />
                    <label className="mt-1.5 inline-flex items-center gap-2 text-[12px] text-gray cursor-pointer">
                      <input
                        type="checkbox"
                        checked={phoneIsWhatsapp}
                        onChange={(e) => setPhoneIsWhatsapp(e.target.checked)}
                        className="accent-orange"
                      />
                      El teléfono también es WhatsApp
                    </label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <FieldLabel htmlFor="website">Sitio web</FieldLabel>
                    <input
                      id="website"
                      type="url"
                      value={data.contacto.website ?? ""}
                      onChange={(e) => updateContacto("website", e.target.value)}
                      placeholder="https://..."
                      aria-invalid={!!errors["contacto.website"]}
                      className={inputClass(!!errors["contacto.website"])}
                    />
                    <ErrorMsg msg={errors["contacto.website"]} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
                    <input
                      id="instagram"
                      type="text"
                      value={data.contacto.instagram ?? ""}
                      onChange={(e) =>
                        updateContacto("instagram", e.target.value.replace(/^@+/, ""))
                      }
                      placeholder="tuclub (sin el @)"
                      className={inputClass()}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6 — HORARIOS */}
            <section
              ref={(el) => { sectionRefs.current.horarios = el; }}
              className="bg-white border border-border rounded-xl p-6 md:p-8"
            >
              <SectionLabel>Horarios</SectionLabel>
              <div className="flex justify-end mb-3">
                <button
                  type="button"
                  onClick={copyMondayToAll}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-orange hover:underline"
                >
                  <Copy size={12} /> Copiar lunes a todos los días
                </button>
              </div>
              <div className="space-y-2">
                {DIAS.map((d) => {
                  const h = data.horarios[d.key];
                  return (
                    <div
                      key={d.key}
                      className={cn(
                        "grid grid-cols-[60px_110px_1fr_1fr] gap-3 items-center p-2.5 rounded-md border",
                        h.abierto ? "border-border bg-white" : "border-border bg-light/60 opacity-60"
                      )}
                    >
                      <div className="font-semibold text-[13px] text-dark">{d.label}</div>
                      <button
                        type="button"
                        onClick={() => updateHorario(d.key, { abierto: !h.abierto })}
                        className={cn(
                          "h-8 px-3 rounded text-[11px] font-bold uppercase tracking-wider transition",
                          h.abierto ? "bg-orange text-white" : "bg-border text-dark"
                        )}
                      >
                        {h.abierto ? "Abierto" : "Cerrado"}
                      </button>
                      <input
                        type="time"
                        value={h.desde}
                        onChange={(e) => updateHorario(d.key, { desde: e.target.value })}
                        disabled={!h.abierto}
                        aria-label={`Hora de apertura ${d.label}`}
                        className="h-9 px-2 border border-border rounded-md text-[13px] outline-none focus:border-orange disabled:opacity-50"
                      />
                      <input
                        type="time"
                        value={h.hasta}
                        onChange={(e) => updateHorario(d.key, { hasta: e.target.value })}
                        disabled={!h.abierto}
                        aria-label={`Hora de cierre ${d.label}`}
                        className="h-9 px-2 border border-border rounded-md text-[13px] outline-none focus:border-orange disabled:opacity-50"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-5">
                <FieldLabel htmlFor="notas_horarios">Notas sobre horarios</FieldLabel>
                <textarea
                  id="notas_horarios"
                  rows={2}
                  maxLength={200}
                  value={data.horarios.notas ?? ""}
                  onChange={(e) =>
                    setData((d) => ({ ...d, horarios: { ...d.horarios, notas: e.target.value } }))
                  }
                  placeholder="Ej: Cerrado feriados nacionales. Verano: extendido hasta 23:00."
                  className="w-full p-3 border border-border rounded-md text-[14px] outline-none focus:border-orange focus:shadow-focus-orange resize-y"
                />
              </div>
            </section>

            {/* SECTION 7 — FOTOS */}
            <section
              ref={(el) => { sectionRefs.current.fotos = el; }}
              className="bg-white border border-border rounded-xl p-6 md:p-8"
            >
              <SectionLabel>Fotos (próximamente)</SectionLabel>
              <p className="text-[13px] font-semibold text-dark mb-1.5">
                Subí fotos del complejo
              </p>
              <p className="text-[12px] text-gray mb-4">
                Por ahora esta sección es opcional: las fotos todavía no se envían con la solicitud.
                Cuando aprobemos tu complejo te pediremos las imágenes por email. Podés ir cargándolas
                acá para previsualizar el resultado.
              </p>
              <PhotoUploader photos={photos} onChange={setPhotos} />
            </section>

            {/* SECTION 8 — CONFIRMACIÓN */}
            <section
              ref={(el) => { sectionRefs.current.confirmacion = el; }}
              className="bg-white border border-border rounded-xl p-6 md:p-8"
            >
              <SectionLabel>Confirmación</SectionLabel>
              <div className="space-y-3">
                <label className="flex items-start gap-2 text-[14px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!data.consentimiento.autorizacion}
                    onChange={(e) =>
                      update("consentimiento", {
                        ...data.consentimiento,
                        autorizacion: e.target.checked as unknown as true,
                      })
                    }
                    aria-required
                    className="accent-orange w-4 h-4 mt-1"
                  />
                  <span>
                    Confirmo que tengo autorización para publicar la información de este complejo en
                    HayCancha.com. <span className="text-orange">*</span>
                  </span>
                </label>
                <label className="flex items-start gap-2 text-[14px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!data.consentimiento.terminos}
                    onChange={(e) =>
                      update("consentimiento", {
                        ...data.consentimiento,
                        terminos: e.target.checked as unknown as true,
                      })
                    }
                    aria-required
                    className="accent-orange w-4 h-4 mt-1"
                  />
                  <span>
                    Acepto los{" "}
                    <a href="/terminos" target="_blank" rel="noreferrer" className="text-orange hover:underline">
                      Términos y Condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="/privacidad" target="_blank" rel="noreferrer" className="text-orange hover:underline">
                      Política de Privacidad
                    </a>{" "}
                    de HayCancha.com. <span className="text-orange">*</span>
                  </span>
                </label>
                <ErrorMsg msg={errors["consentimiento.autorizacion"] || errors["consentimiento.terminos"]} />
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="mt-6 p-4 rounded-md flex gap-3 items-start"
                  style={{ background: "rgba(220,38,38,0.08)", borderLeft: "3px solid #DC2626" }}
                >
                  <AlertCircle className="text-destructive shrink-0 mt-0.5" size={18} />
                  <p className="text-[14px] text-dark">{serverError}</p>
                </div>
              )}

              {TURNSTILE_SITE_KEY ? (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    options={{ theme: "auto" }}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => setTurnstileToken(null)}
                  />
                  <p className="text-[11px] text-gray text-center">
                    Protegido contra spam con verificación de Cloudflare.
                  </p>
                </div>
              ) : (
                <p className="mt-6 text-[12px] text-destructive text-center">
                  Dev: VITE_TURNSTILE_SITE_KEY no está configurada — el envío está deshabilitado.
                </p>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={submitting || !turnstileToken}
                  aria-busy={submitting}
                  className={cn(
                    "h-14 w-full sm:w-[320px] inline-flex items-center justify-center gap-2 bg-orange text-white font-bold uppercase tracking-[1px] rounded-md hover:brightness-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Enviando...
                    </>
                  ) : (
                    "Enviar solicitud"
                  )}
                </button>
              </div>
              <p className="text-[11px] text-gray text-center mt-3">
                Las solicitudes son revisadas manualmente antes de publicarse.
              </p>
            </section>

            {/* Submitting overlay */}
            {submitting && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-50">
                <Loader2 className="text-orange animate-spin" size={36} />
                <p className="mt-3 text-[14px] font-semibold text-dark">Enviando tu solicitud...</p>
              </div>
            )}
          </form>

          {/* Sticky progress sidebar (desktop) */}
          <aside className="hidden lg:block sticky top-24 self-start">
            <div className="bg-white border border-border rounded-xl p-5 shadow-card">
              <p className="font-semibold text-[11px] uppercase tracking-[3px] text-orange mb-4">
                Progreso
              </p>
              <div className="h-1.5 bg-light rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-orange transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[12px] text-gray mb-4">
                {completedCount}/{SECTIONS.length} secciones completas
              </p>
              <ul className="space-y-2">
                {SECTIONS.map((s) => {
                  const done = status[s.id];
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => sectionRefs.current[s.id]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                        className="w-full flex items-center gap-2 text-left text-[13px] text-dark hover:text-orange transition"
                      >
                        <span
                          className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition",
                            done ? "bg-orange border-orange text-white" : "border-border text-gray"
                          )}
                        >
                          {done ? <Check size={12} strokeWidth={3} /> : <ChevronRight size={11} />}
                        </span>
                        <span className={cn(done && "text-gray line-through opacity-70")}>{s.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Link
                to="/"
                className="mt-5 inline-flex items-center gap-1.5 text-[12px] text-gray hover:text-orange transition"
              >
                <ArrowLeft size={12} /> Volver al inicio
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgregarCanchaPage;
