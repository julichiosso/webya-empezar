'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Dibuja el contenido a un ancho de celular real (375 px) y lo escala para que entre en la pantalla
 * del teléfono de la demo: se ve como un iPhone de verdad, no como una web estirada o apretada.
 * Antes de medir (el primer pintado) ocupa el lugar sin escalar.
 */
export function Escalado({ ancho = 375, children }: { ancho?: number; children: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null);
  const [medida, setMedida] = useState<{ escala: number; alto: number }>();

  useLayoutEffect(() => {
    const el = caja.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      if (!e) return;
      const { width, height } = e.contentRect;
      if (!width) return;
      const escala = width / ancho;
      setMedida({ escala, alto: height / escala });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ancho]);

  return (
    <div ref={caja} className="absolute inset-0 overflow-hidden">
      <div
        className="h-full w-full"
        style={
          medida
            ? {
                width: ancho,
                height: medida.alto,
                transform: `scale(${medida.escala})`,
                transformOrigin: '0 0',
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
