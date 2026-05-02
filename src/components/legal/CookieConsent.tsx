import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CONSENT_EVENT,
  OPEN_PREFERENCES_EVENT,
  readConsent,
  writeConsent,
  type CookieConsentState,
} from "@/lib/cookie-consent";

/**
 * Sitewide cookie consent banner + preferences modal.
 *
 * Mounts at the app root. Behaviour:
 *  - First visit (no/expired/mismatched consent) → banner slides up.
 *  - "Personalizar" opens a modal with 3 categories (essential always on).
 *  - Footer link "Configurar cookies" dispatches `cookieConsentOpenPreferences`
 *    to re-open the modal at any time.
 *  - Saving dispatches `cookieConsentChange`. GA4 / AdSense scripts must
 *    subscribe to that event and load conditionally.
 */
export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Decide on mount whether to show the banner.
  useEffect(() => {
    const stored = readConsent();
    if (!stored) {
      setShowBanner(true);
    } else {
      setAnalytics(stored.analytics);
      setAdvertising(stored.advertising);
      // Re-emit so listeners mounted after this can react.
      window.dispatchEvent(new CustomEvent<CookieConsentState>(CONSENT_EVENT, { detail: stored }));
    }
  }, []);

  // Allow any component (e.g. footer "Configurar cookies") to open the modal.
  useEffect(() => {
    const onOpen = () => {
      const stored = readConsent();
      if (stored) {
        setAnalytics(stored.analytics);
        setAdvertising(stored.advertising);
      }
      setShowModal(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
  }, []);

  // ESC closes the modal back to the banner (does NOT auto-consent).
  useEffect(() => {
    if (!showModal) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
      if (e.key === "Tab" && modalRef.current) {
        // Simple focus trap.
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // Focus first interactive element of the modal.
    setTimeout(() => {
      modalRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    }, 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      previousFocusRef.current?.focus?.();
    };
  }, [showModal]);

  const persist = (a: boolean, ad: boolean) => {
    writeConsent({ analytics: a, advertising: ad });
    setAnalytics(a);
    setAdvertising(ad);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => persist(true, true);
  const handleEssentialOnly = () => persist(false, false);
  const handleSavePreferences = () => persist(analytics, advertising);
  const handleOpenCustomize = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* BANNER */}
      {showBanner && !showModal && (
        <div
          role="dialog"
          aria-labelledby="cookie-banner-eyebrow"
          className={cn(
            "fixed left-3 right-3 bottom-3 md:left-auto md:right-6 md:bottom-6",
            "z-[9999] w-auto md:max-w-[720px] md:w-[calc(100vw-3rem)]",
            "bg-dark text-white p-6 rounded-lg md:rounded-xl",
            "shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
            "animate-in slide-in-from-bottom-4 fade-in duration-200 ease-out"
          )}
        >
          <div
            id="cookie-banner-eyebrow"
            className="text-orange font-semibold text-[11px] tracking-[3px] mb-2 select-none"
          >
            🍪 COOKIES Y PRIVACIDAD
          </div>
          <p className="text-[14px] leading-relaxed text-white/85 mb-5">
            Usamos cookies para que el sitio funcione, medir el tráfico de forma anónima y mostrar
            publicidad relevante. Podés aceptar todas, solo las esenciales, o personalizar tus
            preferencias. Más info en nuestra{" "}
            <a href="/privacidad" className="text-orange font-medium hover:underline">
              Política de Privacidad
            </a>
            .
          </p>
          <div className="flex flex-col md:flex-row md:justify-end gap-2 md:gap-3">
            <button
              type="button"
              onClick={handleOpenCustomize}
              className="text-[13px] font-semibold uppercase tracking-wider text-white border-2 border-white rounded-md px-4 py-2 hover:border-orange hover:text-orange transition-colors"
            >
              Personalizar
            </button>
            <button
              type="button"
              onClick={handleEssentialOnly}
              className="text-[13px] font-semibold uppercase tracking-wider text-white border-2 border-white rounded-md px-4 py-2 hover:border-orange hover:text-orange transition-colors"
            >
              Solo esenciales
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="text-[13px] font-semibold uppercase tracking-wider text-white bg-orange rounded-md px-4 py-2 hover:bg-orange/90 transition-colors"
            >
              Aceptar todas
            </button>
          </div>
        </div>
      )}

      {/* PREFERENCES MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
            className="bg-white text-dark rounded-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 md:p-8">
              <div className="text-orange font-semibold text-[11px] tracking-[3px] mb-2 select-none">
                🍪 PREFERENCIAS DE COOKIES
              </div>
              <h2
                id="cookie-modal-title"
                className="font-display italic text-[28px] text-dark leading-tight mb-2"
              >
                Personalizá tu experiencia
              </h2>
              <p className="text-[14px] text-gray leading-relaxed mb-6">
                Elegí qué tipos de cookies querés permitir. Podés cambiar esta decisión en cualquier
                momento desde el footer del sitio.
              </p>

              <ConsentRow
                id="essential"
                title="Esenciales"
                description="Necesarias para el funcionamiento del sitio (sesión, preferencias de vista, idioma). No se pueden desactivar."
                checked
                disabled
                onChange={() => undefined}
              />
              <ConsentRow
                id="analytics"
                title="Analítica"
                description="Nos ayudan a entender cómo se usa el sitio (páginas más visitadas, dispositivos, regiones) de forma anónima. Usamos Google Analytics 4."
                checked={analytics}
                onChange={setAnalytics}
              />
              <ConsentRow
                id="advertising"
                title="Publicidad"
                description="Permiten mostrar publicidad personalizada y medir su efectividad. Usamos Google AdSense."
                checked={advertising}
                onChange={setAdvertising}
              />
            </div>

            <div className="border-t border-border p-4 md:p-5 flex justify-end gap-2 bg-light rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[13px] font-semibold uppercase tracking-wider text-dark border-2 border-border rounded-md px-4 py-2 hover:border-dark transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="text-[13px] font-semibold uppercase tracking-wider text-white bg-orange rounded-md px-4 py-2 hover:bg-orange/90 transition-colors"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface ConsentRowProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}

const ConsentRow = ({ id, title, description, checked, disabled, onChange }: ConsentRowProps) => (
  <div className="flex items-start justify-between gap-4 py-4 border-t border-border first:border-t-0">
    <div className="flex-1 min-w-0">
      <label htmlFor={`consent-${id}`} className="block font-semibold text-[15px] text-dark mb-1">
        {title}
        {disabled && (
          <span className="ml-2 text-[10px] tracking-[2px] uppercase text-gray font-medium">
            Siempre activas
          </span>
        )}
      </label>
      <p className="text-[13px] text-gray leading-relaxed">{description}</p>
    </div>
    <label
      className={cn(
        "relative inline-flex shrink-0 mt-1 cursor-pointer",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <input
        id={`consent-${id}`}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        aria-label={`Activar cookies de ${title}`}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={cn(
          "w-11 h-6 rounded-full bg-border transition-colors",
          "peer-checked:bg-orange",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-orange/40 peer-focus-visible:ring-offset-2"
        )}
      />
      <span
        className={cn(
          "absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
          checked && "translate-x-5"
        )}
      />
    </label>
  </div>
);

export default CookieConsent;
