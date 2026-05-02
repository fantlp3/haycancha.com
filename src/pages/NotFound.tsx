import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/brand/Navbar";
import { Footer } from "@/components/sections/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "Página no encontrada — HayCancha";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-[600px] w-full mx-auto text-center relative">
          {/* Decorative tennis-ball SVG */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="absolute left-1/2 -translate-x-1/2 top-32 md:top-40 w-40 h-40 md:w-56 md:h-56 text-gray opacity-40 -z-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="100" cy="100" r="80" />
            <path d="M28 70 Q100 110 172 70" />
            <path d="M28 130 Q100 90 172 130" />
          </svg>

          <div
            className="font-display italic text-orange leading-none"
            style={{ fontSize: "clamp(120px, 22vw, 180px)" }}
          >
            404
          </div>
          <h1 className="font-display italic text-dark text-[28px] md:text-[32px] mt-2 mb-4">
            ESTA CANCHA NO EXISTE
          </h1>
          <p className="text-[16px] text-gray leading-relaxed mb-8 max-w-md mx-auto">
            La página que buscás no está acá. Puede que haya sido movida o que el link sea
            incorrecto.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a
              href="/"
              className="inline-flex justify-center items-center text-[13px] font-semibold uppercase tracking-wider text-white bg-orange rounded-md px-6 py-3 hover:bg-orange/90 transition-colors"
            >
              Volver al inicio
            </a>
            <a
              href="/canchas"
              className="inline-flex justify-center items-center text-[13px] font-semibold uppercase tracking-wider text-dark border-2 border-dark rounded-md px-6 py-3 hover:bg-dark hover:text-white transition-colors"
            >
              Buscar canchas
            </a>
          </div>
          <p className="text-[13px] text-gray">
            ¿Encontraste un link roto? Avisanos a{" "}
            <a href="mailto:contacto@haycancha.com" className="text-orange hover:underline">
              contacto@haycancha.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
