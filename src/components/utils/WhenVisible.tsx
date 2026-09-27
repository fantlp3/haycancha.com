import { useEffect, useRef, useState, type ReactNode } from "react";

interface WhenVisibleProps {
  /** Clases del contenedor. Debe reservar el alto final para no generar CLS. */
  className?: string;
  /** Margen de precarga: el contenido arranca antes de entrar al viewport. */
  rootMargin?: string;
  /** Qué mostrar mientras no es visible. */
  placeholder?: ReactNode;
  children: ReactNode;
}

/**
 * Renderiza sus hijos sólo cuando el contenedor se acerca al viewport.
 *
 * Sirve para diferir chunks pesados (leaflet, ~150 KB) y su trabajo de
 * inicialización. Un contenedor con `display:none` nunca interseca, así que un
 * panel oculto por CSS —el mapa del listado en móvil— no baja nada hasta que
 * el usuario lo abre.
 *
 * Importante: los hijos se pasan como elemento ya creado, pero crear un
 * elemento de un componente `lazy()` no dispara el import; eso pasa cuando
 * React lo renderiza, o sea recién cuando `visible` es true.
 */
export function WhenVisible({
  className,
  rootMargin = "200px",
  placeholder = null,
  children,
}: WhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;

    // Sin IntersectionObserver (navegador viejo, jsdom): montar directo.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : placeholder}
    </div>
  );
}
