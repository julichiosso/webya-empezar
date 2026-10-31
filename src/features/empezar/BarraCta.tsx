'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { FLUJO } from '@/content/empezar/wizard-flujo';

/**
 * Barra fija abajo (solo debajo de lg) con el CTA de la pantalla 3, al alcance del pulgar. Se ve
 * solo mientras el flujo está en pantalla: más abajo ya aparece la barra general de la página
 * (StickyCta), así nunca hay dos. Solo transform/opacity; con reduced-motion aparece sin moverse.
 * Fuera de pantalla es `inert`. Se monta fuera del paso animado (un ancestro con transform
 * rompería el `position: fixed`).
 */
export function BarraCta({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const flujo = document.getElementById('wizard');
    if (!flujo || typeof IntersectionObserver === 'undefined') {
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)));
    io.observe(flujo);
    return () => io.disconnect();
  }, []);

  return (
    <div
      role="region"
      aria-label={FLUJO.resultado.barra}
      inert={!visible}
      data-visible={visible}
      data-testid="barra-cta"
      className="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-line bg-bg px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] opacity-0 transition-[transform,opacity] duration-(--duration-base) ease-(--ease-out) data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 motion-reduce:transition-none lg:hidden"
    >
      {children}
    </div>
  );
}
