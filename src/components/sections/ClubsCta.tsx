import { CtaButton } from "@/components/brand/CtaButton";

const benefits = ["Sin comisiones", "Datos actualizados", "Panel de administración"];

export const ClubsCta = () => (
  <section
    className="py-20 md:py-24"
    style={{
      background: "linear-gradient(135deg, hsl(var(--dark)) 0%, hsl(var(--dark-2)) 100%)",
    }}
  >
    <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center space-y-6">
      <p className="label-meta uppercase text-orange tracking-[3px]">¿Tenés un club?</p>
      <h2 className="font-display text-white text-[40px] md:text-[56px] leading-[0.95]">
        LLEGÁ A MÁS<br />JUGADORES<span className="text-orange">.</span>
      </h2>
      <p className="text-white/70 text-[16px] md:text-[18px] max-w-xl mx-auto">
        Publicación básica gratuita. Tus clientes te buscan aquí.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <CtaButton>Publicar mi cancha gratis</CtaButton>
        <CtaButton variant="secondary">Ver planes premium</CtaButton>
      </div>
      <div className="flex flex-wrap gap-2 justify-center pt-4">
        {benefits.map((b) => (
          <span
            key={b}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[12px] font-medium"
          >
            <span className="text-orange">✓</span> {b}
          </span>
        ))}
      </div>
    </div>
  </section>
);
