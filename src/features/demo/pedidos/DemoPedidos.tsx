'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { BarraDemo } from '@/components/marketing/editorial/BarraDemo';
import { EnUso } from '@/components/marketing/editorial/EnUso';
import { Tilde } from '@/components/marketing/editorial/Iconos';
import { Telefono } from '@/components/marketing/editorial/Pantallas';
import { cn } from '@/components/ui/clases';
import { getDemo } from '@/content/demos/hub';
import { BARRA_DEMO, GUIA, LADOS, VISTAS } from '@/content/demos/pedidos/ui';
import { track } from '@/lib/analytics';
import { AppCliente } from './AppCliente';
import { Escalado } from './Escalado';
import { Panel } from './Panel';
import { ahoraDemo, crearEstado, crearStore, type Pedido } from './store';

const DEMO = 'pedidos';
/** El CTA lleva al configurador de la página de pizzerías, con "pedidos" ya elegido. */
const CTA_HREF = '/pizzerias#armar';

/**
 * Demo del sistema de pedidos. En escritorio, el celular del cliente y el panel del dueño
 * lado a lado, del mismo alto y siempre dentro de la pantalla. En celular, la app a pantalla completa y
 * un selector "Cliente / Dueño" abajo. Todo en memoria: nada se envía.
 */
export function DemoPedidos() {
  const [store] = useState(() => crearStore(Date.now()));
  const e = useSyncExternalStore(store.subscribe, store.get, store.get);
  const [ahoraReal, setAhoraReal] = useState(e.inicioReal);
  const [vista, setVista] = useState<'cliente' | 'duenio'>('cliente');
  const [llego, setLlego] = useState(false);
  const [novedad, setNovedad] = useState(false);
  const [ronda, setRonda] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const ahora = ahoraDemo(e, ahoraReal);

  useEffect(() => {
    track('demo_view', { demo: DEMO, cocina: 'pizzeria' });
    const t = setInterval(() => setAhoraReal(Date.now()), 15_000);
    return () => clearInterval(t);
  }, []);

  const verPanel = () => {
    setLlego(true);
    setNovedad(false);
    if (window.matchMedia('(min-width: 64rem)').matches) panel.current?.focus();
    else setVista('duenio');
  };
  const cambiarVista = (v: 'cliente' | 'duenio') => {
    setVista(v);
    if (v === 'duenio') {
      setNovedad(false);
      if (e.ultimoPropio != null) setLlego(true);
    }
  };
  const reiniciar = () => {
    const ya = Date.now();
    store.set(() => crearEstado(ya));
    setAhoraReal(ya);
    setVista('cliente');
    setLlego(false);
    setNovedad(false);
    setRonda((r) => r + 1);
  };
  const cta = (origen: string) => () => track('demo_cta_click', { demo: DEMO, origen });

  const comunes = {
    e,
    ahora,
    set: store.set,
    ctaHref: CTA_HREF,
    onCta: cta('confirmacion'),
    onVerPanel: verPanel,
    onPedido: (p: Pedido) => {
      setNovedad(true);
      track('demo_pedido_creado', {
        demo: DEMO,
        modalidad: 'retiro',
        items: p.lineas.length,
        medioPago: 'whatsapp',
      });
    },
    onEnviado: () => track('demo_estado_avanzado', { demo: DEMO, estado: 'enviado' }),
  };
  const panelProps = {
    e,
    ahora,
    set: store.set,
    onComanda: () => track('demo_estado_avanzado', { demo: DEMO, estado: 'comanda' }),
    onConfirmar: () => track('demo_estado_avanzado', { demo: DEMO, estado: 'confirmado' }),
  };
  const hechos = [e.ultimoPropio != null, e.ultimoPropio != null && llego, e.comandaVista];

  return (
    <div className="m-paleta tono-oscuro min-h-svh bg-ed-bg text-ed-fg">
      <BarraDemo demo="pedidos" onReiniciar={reiniciar} />

      <main>
        <h1 className="sr-only">{BARRA_DEMO.titulo}</h1>
        {/* Escritorio: guía arriba, celular y panel lado a lado. */}
        <div className="m-escenario hidden justify-center gap-8 px-6 py-6 lg:flex xl:gap-12">
          <div className="w-[13rem] shrink-0 pt-2">
            <ol aria-label={GUIA.aria} className="space-y-2">
              {GUIA.pasos.map((p, i) => {
                const actual = hechos.findIndex((h) => !h) === i;
                return (
                  <li
                    key={p.titulo}
                    aria-current={actual ? 'step' : undefined}
                    className={cn(
                      'flex gap-3 rounded-xl border p-3 transition-colors',
                      actual ? 'border-ed-fg' : 'border-transparent',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-6 shrink-0 place-items-center rounded-full text-[0.6875rem] font-bold tabular-nums',
                        hechos[i] ? 'bg-lima text-tinta' : 'border border-ed-line-strong',
                      )}
                    >
                      {hechos[i] ? <Tilde className="size-3" /> : i + 1}
                      {hechos[i] ? <span className="sr-only">{GUIA.hecho}</span> : null}
                    </span>
                    <span>
                      <span className="block text-[0.8125rem] font-semibold">{p.titulo}</span>
                      <span className="mt-0.5 block text-[0.75rem] leading-snug text-ed-muted">
                        {p.texto}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <EnUso proyecto={getDemo('pedidos').enUso!} className="mt-6" />
          </div>
          <div className="shrink-0">
            <p className="mb-2 text-center text-[0.75rem] text-ed-muted">{LADOS.cliente}</p>
            <Telefono
              className="m-tel shrink-0"
              decorativo={false}
              colorBarra={{ fondo: 'var(--m-oscuro)', claro: true }}
            >
              <Escalado>
                <AppCliente key={`c${ronda}`} {...comunes} />
              </Escalado>
            </Telefono>
          </div>
          <div className="w-full max-w-[30rem] min-w-0">
            <p className="mb-2 text-center text-[0.75rem] text-ed-muted">{LADOS.panel}</p>
            <div
              ref={panel}
              tabIndex={-1}
              className="m-ventana w-full overflow-hidden rounded-[1.5rem] border border-ed-line outline-none focus-visible:ring-2 focus-visible:ring-lima"
            >
              <Panel key={`p${ronda}`} {...panelProps} />
            </div>
          </div>
        </div>

        {/* Celular y tablet: una cara a la vez, a pantalla completa, y abajo el selector con su propio lugar. */}
        <div className="flex h-[calc(100svh-2.75rem)] flex-col lg:hidden">
          <div className="relative min-h-0 flex-1">
            <div className={vista === 'cliente' ? 'h-full' : 'hidden'}>
              <AppCliente key={`mc${ronda}`} {...comunes} />
            </div>
            <div className={vista === 'duenio' ? 'h-full' : 'hidden'}>
              <Panel key={`mp${ronda}`} {...panelProps} visible={vista === 'duenio'} />
            </div>
          </div>
          <nav
            aria-label={VISTAS.aria}
            className="flex shrink-0 justify-center border-t border-ed-line bg-ed-bg px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex gap-1 rounded-full border border-ed-line-strong p-1">
              <BotonVista activa={vista === 'cliente'} onClick={() => cambiarVista('cliente')}>
                {VISTAS.cliente}
              </BotonVista>
              <BotonVista activa={vista === 'duenio'} onClick={() => cambiarVista('duenio')}>
                {VISTAS.duenio}
                {novedad && vista === 'cliente' ? (
                  <span className="size-2 rounded-full bg-lima">
                    <span className="sr-only">{VISTAS.novedad}</span>
                  </span>
                ) : null}
              </BotonVista>
            </div>
          </nav>
        </div>
      </main>
    </div>
  );
}

function BotonVista({
  activa,
  onClick,
  children,
}: {
  activa: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className="flex min-h-11 items-center gap-2 rounded-full px-5 text-[0.875rem] font-semibold text-ed-muted aria-pressed:bg-ed-fg aria-pressed:text-ed-bg"
    >
      {children}
    </button>
  );
}
