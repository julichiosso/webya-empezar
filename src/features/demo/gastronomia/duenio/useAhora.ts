'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Reloj compartido para los contadores del panel. Avanza una vez por segundo y SE PAUSA con la
 * pestaña oculta o con el panel fuera de pantalla (presupuesto de animación: nada corre de más).
 * Solo cambia texto: no anima nada.
 */
export function useAhora(ref: RefObject<HTMLElement | null>, intervaloMs = 1000): number {
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    let visible = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    const actualizar = () => {
      const corre = visible && document.visibilityState === 'visible';
      if (corre && !timer) {
        setAhora(Date.now());
        timer = setInterval(() => setAhora(Date.now()), intervaloMs);
      } else if (!corre && timer) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const io =
      typeof IntersectionObserver === 'undefined' || !ref.current
        ? null
        : new IntersectionObserver(([e]) => {
            visible = !!e?.isIntersecting;
            actualizar();
          });
    if (io && ref.current) io.observe(ref.current);
    document.addEventListener('visibilitychange', actualizar);
    actualizar();

    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', actualizar);
      clearInterval(timer);
    };
  }, [ref, intervaloMs]);

  return ahora;
}
