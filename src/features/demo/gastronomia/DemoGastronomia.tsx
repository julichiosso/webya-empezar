'use client';

import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { AVISO_DEMO, getPaletaDemo, RUBRO_DEMO } from '@/config/demos/gastronomia';
import { variablesDePaleta } from '@/config/marca/colores';
import { track } from '@/lib/analytics';
import { DemoCliente } from './cliente/DemoCliente';
import { getEstadoDemo, useDemo } from './store';

interface DemoGastronomiaProps {
  /** Encabezado de la página (servidor): logo, título y bajada. */
  encabezado: ReactNode;
}

/**
 * Página de la demo: aplica la paleta elegida a todo el contenedor (variables CSS con scope) y
 * muestra siempre el aviso de que es una demo. En escritorio, la carta va en un celular; el
 * panel del dueño se suma al lado (etapa siguiente).
 */
export function DemoGastronomia({ encabezado }: DemoGastronomiaProps) {
  const { paletaId } = useDemo();

  useEffect(() => {
    track('demo_view', { demo: RUBRO_DEMO, cocina: getEstadoDemo().cocinaId });
  }, []);

  return (
    <div style={variablesDePaleta(getPaletaDemo(paletaId)) as CSSProperties}>
      {/* Cartel permanente: siempre fijo arriba, en celular y en escritorio. */}
      <p
        role="note"
        // Alto fijo para dos renglones en celulares angostos: la barra de categorías se apoya debajo (top-14).
        className="sticky top-0 z-30 flex h-14 items-center justify-center bg-surface-2 px-4 text-center text-small leading-tight font-medium text-fg lg:h-10"
      >
        {AVISO_DEMO}
      </p>
      <div className="mx-auto w-full max-w-page lg:px-8 lg:pb-16">
        <div className="px-4 pt-6 pb-8 lg:px-0 lg:pt-10">{encabezado}</div>
        <div className="lg:mx-auto lg:w-[25rem]">
          <DemoCliente />
        </div>
      </div>
    </div>
  );
}
