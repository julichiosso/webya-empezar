'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const media = (q: string) =>
  typeof window.matchMedia === 'function' && window.matchMedia(q).matches;

/**
 * La parte con JS del hero, sin dibujar nada propio: inclina la escena siguiendo al mouse (solo con
 * mouse y sin reduced-motion) y pausa los sitios que se recorren cuando el hero no está en pantalla o
 * la pestaña está oculta. Sin JS todo sigue viéndose.
 */
export function ControlHero({ className, children }: { className?: string; children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;

    let visible = true;
    const actualizar = () => el.toggleAttribute('data-pausa', !visible || document.hidden);
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([e]) => {
            visible = !!e?.isIntersecting;
            actualizar();
          });
    io?.observe(el);
    document.addEventListener('visibilitychange', actualizar);

    let raf = 0;
    let px = 0;
    let py = 0;
    const mover = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      if (raf || !visible) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty('--px', px.toFixed(3));
        el.style.setProperty('--py', py.toFixed(3));
      });
    };
    const conMouse =
      media('(hover: hover) and (pointer: fine)') && !media('(prefers-reduced-motion: reduce)');
    if (conMouse) window.addEventListener('pointermove', mover, { passive: true });

    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', actualizar);
      window.removeEventListener('pointermove', mover);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={raiz} className={className}>
      {children}
    </div>
  );
}
