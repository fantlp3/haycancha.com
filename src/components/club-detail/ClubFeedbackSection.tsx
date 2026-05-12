import { useState } from "react";
import { toast } from "sonner";
import { X, AlertCircle, User } from "lucide-react";
import { CtaButton } from "@/components/brand/CtaButton";
import { submitFeedback, type FeedbackTipo } from "@/lib/feedback";

interface ClubFeedbackSectionProps {
  clubId: string;
  clubName: string;
}

export function ClubFeedbackSection({ clubId, clubName }: ClubFeedbackSectionProps) {
  const [openTipo, setOpenTipo] = useState<FeedbackTipo | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => {
    if (submitting) return;
    setOpenTipo(null);
    setNombre("");
    setEmail("");
    setMensaje("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openTipo) return;
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      toast.error("Completá todos los campos");
      return;
    }
    setSubmitting(true);
    try {
      await submitFeedback({
        tipo: openTipo,
        club: clubId,
        nombre: nombre.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
      });
      toast.success("Gracias, lo revisamos pronto");
      closeModal();
    } catch (err) {
      console.error("Feedback submit failed:", err);
      toast.error("No pudimos enviar tu mensaje. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle =
    openTipo === "owner"
      ? `Soy el dueño de ${clubName}`
      : `Conozco ${clubName}`;

  return (
    <>
      <section className="bg-white border-y border-border mt-16">
        <div className="max-w-container mx-auto px-6 lg:px-10 py-10">
          <p className="label-meta uppercase text-orange tracking-[3px] mb-3">
            Ayudanos a mejorar este listado
          </p>
          <h2 className="font-display text-dark text-[24px] md:text-[28px] leading-tight mb-2">
            ¿Algo está mal o falta data?
          </h2>
          <p className="text-gray text-[14px] mb-5 max-w-xl">
            Si sos el dueño o conocés este complejo, escribinos. Revisamos cada mensaje a mano.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setOpenTipo("owner")}
              className="inline-flex items-center justify-center gap-2 bg-orange text-white font-semibold text-[14px] uppercase tracking-[1px] rounded-md px-5 py-3 hover:brightness-90 transition"
            >
              <User size={16} />
              Soy el dueño
            </button>
            <button
              type="button"
              onClick={() => setOpenTipo("visitor")}
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-orange text-orange font-semibold text-[14px] uppercase tracking-[1px] rounded-md px-5 py-3 hover:bg-orange/5 transition"
            >
              <AlertCircle size={16} />
              Tengo info para sumar
            </button>
          </div>
        </div>
      </section>

      {openTipo && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
        >
          <div
            className="bg-white rounded-xl shadow-card-hover max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 border-b border-border">
              <h3
                id="feedback-modal-title"
                className="font-display text-dark text-[20px] leading-tight pr-4"
              >
                {modalTitle.toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                aria-label="Cerrar"
                className="text-gray hover:text-dark transition shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label htmlFor="fb-nombre" className="block text-[13px] font-semibold text-dark mb-1">
                  Tu nombre
                </label>
                <input
                  id="fb-nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={submitting}
                  maxLength={100}
                  required
                  className="w-full border border-border rounded-md px-3 py-2 text-[14px] text-dark focus:outline-none focus:border-orange transition"
                />
              </div>
              <div>
                <label htmlFor="fb-email" className="block text-[13px] font-semibold text-dark mb-1">
                  Tu email
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  required
                  className="w-full border border-border rounded-md px-3 py-2 text-[14px] text-dark focus:outline-none focus:border-orange transition"
                />
              </div>
              <div>
                <label htmlFor="fb-mensaje" className="block text-[13px] font-semibold text-dark mb-1">
                  ¿Qué hay que corregir o sumar?
                </label>
                <textarea
                  id="fb-mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  disabled={submitting}
                  required
                  rows={5}
                  placeholder="Contanos qué dato está mal o falta. Ejemplo: el teléfono cambió, hay 2 canchas más, los horarios son otros…"
                  className="w-full border border-border rounded-md px-3 py-2 text-[14px] text-dark focus:outline-none focus:border-orange transition resize-y"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center py-2.5 text-[13px] font-semibold uppercase tracking-wider text-dark border-2 border-border rounded-md hover:border-gray transition disabled:opacity-50"
                >
                  Cancelar
                </button>
                <CtaButton type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Enviando..." : "Enviar"}
                </CtaButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
