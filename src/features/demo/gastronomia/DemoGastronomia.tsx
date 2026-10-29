'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { AVISO_DEMO, getPaletaDemo, RUBRO_DEMO } from '@/config/demos/gastronomia';
import { variablesDePaleta } from '@/config/marca/colores';
import { track } from '@/lib/analytics';
import { DemoCliente } from './cliente/DemoCliente';
import { iniciarSincronizacion } from './sincronizacion';
import { getEstadoDemo, useDemo } from './store';

const cargarPanel = () => import('./duenio/PanelDuenio').then((m) => m.PanelDuenio);

/** El panel del dueño se descarga aparte: en celular no se paga hasta que hace falta. */
const PanelDuenio = dynamic(cargarPanel, {
  ssr: false,
  loading: () => (
    <div
      aria-busy="true"
      className="min-h-[28rem] rounded-panel border border-line bg-surface-2 p-6 text-small text-muted"
    >
      Cargando el panel…
    </div>
  ),
});

type Vista = 'cliente' | 'duenio';

interface DemoGastronomiaProps {
  /** Encabezado de la página (servidor): logo, título y bajada. */
  encabezado: ReactNode;
}

/**
 * Página de la demo. Escritorio: pantalla dividida, la carta en un celular a la izquierda y el
 * panel del dueño a la derecha. Celular: una vista a la vez con un selector flotante. La paleta
 * elegida se aplica a todo el contenedor (variables CSS con scope) y el aviso de demo está siempre.
 */
export function DemoGastronomia({ encabezado }: DemoGastronomiaProps) {
  const { paletaId, pedidos } = useDemo();
  const [vista, setVista] = useState<Vista>('cliente');
  const [escritorio, setEscritorio] = useState(false);

  useEffect(() => {
    track('demo_view', { demo: RUBRO_DEMO, cocina: getEstadoDemo().cocinaId });
    return iniciarSincronizacion();
  }, []);

  // ¿Se ven las dos caras a la vez? (lg). Decide si el panel se monta de entrada.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64rem)');
    const actualizar = () => setEscritorio(mq.matches);
    mq.addEventListener('change', actualizar);
    // En un timer: no se llama a setState de forma síncrona dentro del efecto.
    const t = setTimeout(actualizar, 0);
    // En celular, el panel se descarga cuando el navegador está libre: el cambio es instantáneo.
    const idle =
      'requestIdleCallback' in window ? window.requestIdleCallback(() => void cargarPanel()) : 0;
    return () => {
      mq.removeEventListener('change', actualizar);
      clearTimeout(t);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  const cambiarVista = (v: Vista) => {
    if (v === vista) return;
    const aplicar = () => {
      flushSync(() => setVista(v));
      window.scrollTo({ top: 0 });
    };
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // View Transitions donde existan (fundido); si no, el cambio es instantáneo.
    if (!reducir && typeof document.startViewTransition === 'function') {
      document.startViewTransition(aplicar);
    } else {
      aplicar();
    }
  };

  const nuevos = pedidos.filter((p) => p.estado === 'recibido').length;
  const mostrarPanel = escritorio || vista === 'duenio';

  return (
    <div
      style={variablesDePaleta(getPaletaDemo(paletaId)) as CSSProperties}
      className="pb-24 lg:pb-0"
    >
      {/* Cartel permanente: siempre fijo arriba, en celular y en escritorio. */}
      <p
        role="note"
        // Alto fijo para dos renglones en celulares angostos: la barra de categorías se apoya debajo (top-14).
        className="sticky top-0 z-30 flex h-14 items-center justify-center bg-surface-2 px-4 text-center text-small leading-tight font-medium text-fg lg:h-10"
      >
        {AVISO_DEMO}
      </p>

      <div className="mx-auto w-full max-w-[90rem] lg:px-8 lg:pb-16">
        <div className="px-4 pt-6 pb-8 lg:px-0 lg:pt-10">{encabezado}</div>
        <div className="lg:grid lg:grid-cols-[25rem_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div id="vista-cliente" className={vista === 'cliente' ? '' : 'max-lg:hidden'}>
            <DemoCliente />
          </div>
          <div id="vista-duenio" className={vista === 'duenio' ? 'px-4 lg:px-0' : 'max-lg:hidden'}>
            {mostrarPanel && <PanelDuenio />}
          </div>
        </div>
      </div>

      {/* Selector flotante (solo celular y tablet): una cara a la vez. */}
      <div
        role="group"
        aria-label="Qué querés ver"
        className="fixed inset-x-0 bottom-4 z-30 mx-auto flex w-fit gap-1 rounded-full border border-line-strong bg-surface-2 p-1 shadow-raised lg:hidden"
      >
        <BotonVista
          activa={vista === 'cliente'}
          onClick={() => cambiarVista('cliente')}
          controla="vista-cliente"
        >
          Ver como cliente
        </BotonVista>
        <BotonVista
          activa={vista === 'duenio'}
          onClick={() => cambiarVista('duenio')}
          controla="vista-duenio"
        >
          Ver como dueño
          {nuevos > 0 && (
            <span className="tabular flex size-6 items-center justify-center rounded-full bg-accent text-small text-accent-fg">
              {nuevos}
              <span className="sr-only"> {nuevos === 1 ? 'pedido nuevo' : 'pedidos nuevos'}</span>
            </span>
          )}
        </BotonVista>
      </div>
    </div>
  );
}

function BotonVista({
  activa,
  onClick,
  controla,
  children,
}: {
  activa: boolean;
  onClick: () => void;
  controla: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      aria-controls={controla}
      onClick={onClick}
      className="flex min-h-tap items-center gap-2 rounded-full px-4 text-small font-semibold text-muted aria-pressed:bg-fg aria-pressed:text-bg"
    >
      {children}
    </button>
  );
}
