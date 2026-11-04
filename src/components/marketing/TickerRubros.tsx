'use client';

import { useEffect, useRef } from 'react';
import { RUBROS_FLOTANTES } from '@/content/rubros-flotantes';
import estilos from './TickerRubros.module.css';

/**
 * Ticker único de rubros: una línea de nombres que corre despacio (solo transform). Decorativo
 * (aria-hidden). Se pausa fuera de pantalla, con la pestaña oculta, al pasar el mouse o tocarlo, y
 * queda quieto con reduced-motion. Los nombres salen de content/rubros-flotantes.
 */
export function TickerRubros() {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let visible = false;
    const aplicar = () => el.toggleAttribute('data-corre', visible && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      aplicar();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', aplicar);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', aplicar);
    };
  }, []);

  const nombres = RUBROS_FLOTANTES.slice(0, 36).map((r) => r.nombre);
  return (
    <div ref={raiz} aria-hidden="true" className={estilos.ticker}>
      <div className={estilos.pista}>
        {[0, 1].map((copia) => (
          <ul key={copia} className={estilos.lista}>
            {nombres.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
