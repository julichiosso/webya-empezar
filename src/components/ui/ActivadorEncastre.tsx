'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// Literal (y no MOVIMIENTO_REDUCIDO de brand/motion/presets): importar presets en una isla de
// cliente sumaría los primitivos de tokens al JS de la ruta.
const REDUCIDO = '(prefers-reduced-motion: reduce)';

/** Estado de la entrada "vista" de TituloEncastre (lo lee su CSS por `data-encastre`). */
export type EstadoEncastre = 'espera' | 'activo' | 'quieto';

interface ActivadorEncastreProps {
  className: string;
  children: ReactNode;
}

/**
 * Isla mínima de TituloEncastre con `entrada="vista"`: dispara la entrada UNA vez, al entrar en
 * pantalla, y se desconecta. Sin JS (o antes de hidratar) el titular queda en su estado final,
 * legible. Si al hidratar ya estaba a la vista, queda quieto: nunca se "re-arma" algo que ya se leyó.
 * Con movimiento reducido no hace nada (y el CSS tampoco anima).
 */
export function ActivadorEncastre({ className, children }: ActivadorEncastreProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [estado, setEstado] = useState<EstadoEncastre | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.(REDUCIDO).matches) return;

    let primera = true;
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.some((e) => e.isIntersecting);
        if (primera) {
          primera = false;
          if (visible) {
            setEstado('quieto');
            observador.disconnect();
          } else {
            setEstado('espera');
          }
          return;
        }
        if (visible) {
          setEstado('activo');
          observador.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <span ref={ref} aria-hidden="true" className={className} data-encastre={estado}>
      {children}
    </span>
  );
}
