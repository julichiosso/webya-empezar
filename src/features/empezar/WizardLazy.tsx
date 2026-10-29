'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { WIZARD } from '@/content/empezar/wizard';

/**
 * El wizard arrastra motion + react-hook-form + zod (~70 KB gzip) y está bajo el primer viewport.
 * Se descarga cuando se acerca a la pantalla (o si la URL ya apunta a #wizard), no antes: el
 * hero, que es lo primero que se ve, carga solo lo imprescindible.
 */
const Wizard = dynamic(() => import('./Wizard').then((m) => m.Wizard), {
  ssr: false,
  loading: () => <WizardEsqueleto />,
});

/** Mantiene el id (el CTA del hero baja acá) y reserva espacio para que no haya saltos. */
function WizardEsqueleto() {
  return (
    <section
      id="wizard"
      aria-label={WIZARD.ariaSeccion}
      aria-busy="true"
      className="min-h-[48rem] scroll-mt-4 rounded-panel border border-line bg-surface/70 p-4 shadow-raised sm:p-8 lg:min-h-[44rem]"
    >
      <p className="text-small text-muted">{WIZARD.cargando}</p>
    </section>
  );
}

/** Primer gesto de la persona: ahí se empieza a descargar, mientras baja hacia el wizard. */
const GESTOS = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;

export function WizardLazy() {
  const [cargar, setCargar] = useState(false);
  const centinela = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = centinela.current;
    const abrir = () => setCargar(true);
    // Sin IntersectionObserver, o si la URL ya apunta al wizard, se carga ya (en un timer: no se
    // llama a setState de forma síncrona dentro del efecto).
    if (window.location.hash === '#wizard' || !el || typeof IntersectionObserver === 'undefined') {
      const t = setTimeout(abrir, 0);
      return () => clearTimeout(t);
    }
    // Lighthouse y quien solo mira el hero no pagan el wizard; quien interactúa, lo tiene a tiempo.
    const io = new IntersectionObserver(([entrada]) => entrada?.isIntersecting && abrir());
    io.observe(el);
    for (const g of GESTOS) window.addEventListener(g, abrir, { once: true, passive: true });
    return () => {
      io.disconnect();
      for (const g of GESTOS) window.removeEventListener(g, abrir);
    };
  }, []);

  return cargar ? (
    <Wizard />
  ) : (
    <div ref={centinela}>
      <WizardEsqueleto />
    </div>
  );
}
