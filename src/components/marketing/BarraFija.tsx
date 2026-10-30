'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface BarraFijaProps {
  /** Nombre accesible de la región. */
  etiqueta: string;
  /** Selectores de las zonas donde la barra se esconde (ya hay un CTA a la vista). */
  zonas: readonly string[];
  /** El contenido viene del servidor: acá no se importa ningún componente (JS inicial mínimo). */
  children: ReactNode;
}

function hayZonaALaVista(zonas: readonly string[]): boolean {
  const alto = window.innerHeight;
  return zonas.some((sel) => {
    const r = document.querySelector(sel)?.getBoundingClientRect();
    return r !== undefined && r.bottom > 0 && r.top < alto;
  });
}

/**
 * Barra fija abajo (solo debajo de lg) que aparece cuando ninguna de las `zonas` está a la vista.
 * Las zonas se buscan por selector en cada scroll (el wizard se reemplaza al descargarse). Solo
 * transform/opacity; con reduced-motion aparece sin moverse. Fuera de pantalla es `inert`.
 */
export function BarraFija({ etiqueta, zonas, children }: BarraFijaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cuadro = 0;
    const revisar = () => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => setVisible(!hayZonaALaVista(zonas)));
    };
    revisar();
    window.addEventListener('scroll', revisar, { passive: true });
    window.addEventListener('resize', revisar);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener('scroll', revisar);
      window.removeEventListener('resize', revisar);
    };
  }, [zonas]);

  return (
    <div
      role="region"
      aria-label={etiqueta}
      inert={!visible}
      data-visible={visible}
      className="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-line bg-bg/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] opacity-0 backdrop-blur transition-[transform,opacity] duration-(--duration-base) ease-(--ease-out) data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 motion-reduce:transition-none lg:hidden"
    >
      {children}
    </div>
  );
}
