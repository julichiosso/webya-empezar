'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Dónde arranca cada video, en segundos y en el orden del hero, para que no vayan a la par. El del frente
 * empieza desde el principio. Arrancan al cargar, con los iPhones todavía ocultos: el primer cuadro de un
 * video que ya se ve cuenta como contenido nuevo y empeora el LCP.
 */
const INICIO_S = [2, 0, 1, 3];

const media = (q: string) =>
  typeof window.matchMedia === 'function' && window.matchMedia(q).matches;

/**
 * La parte con JS del hero, sin dibujar nada propio: inclina la escena siguiendo al mouse (solo con
 * mouse y sin reduced-motion) y reproduce los videos de los iPhones una vez cargada la página. Los
 * pausa con el hero fuera de pantalla o la pestaña oculta. Con reduced-motion, sin JS o con ahorro de
 * datos queda el póster: todo sigue viéndose.
 */
export function ControlHero({ className, children }: { className?: string; children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;

    const quieto = media('(prefers-reduced-motion: reduce)');
    const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const videos = quieto || conexion?.saveData ? [] : [...el.querySelectorAll('video')];
    let arrancaron = false;

    let visible = true;
    const actualizar = () => {
      if (!arrancaron) return;
      for (const v of videos) {
        // Sin permiso para reproducir solo (modo de bajo consumo en iOS) queda el póster.
        if (visible && !document.hidden) v.play().catch(() => {});
        else v.pause();
      }
    };
    const arrancar = () => {
      videos.forEach((v, i) => {
        v.currentTime = INICIO_S[i] ?? 0;
      });
      arrancaron = true;
      actualizar();
    };
    if (document.readyState === 'complete') arrancar();
    else window.addEventListener('load', arrancar, { once: true });

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
    const conMouse = media('(hover: hover) and (pointer: fine)') && !quieto;
    if (conMouse) window.addEventListener('pointermove', mover, { passive: true });

    return () => {
      window.removeEventListener('load', arrancar);
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
