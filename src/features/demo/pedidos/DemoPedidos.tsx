'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { LogoCorchetes } from '@/brand/logo/LogoCorchetes';
import { Tilde } from '@/components/marketing/editorial/Iconos';
import { Telefono } from '@/components/marketing/editorial/Pantallas';
import { cn } from '@/components/ui/clases';
import { BARRA_DEMO, GUIA, VISTAS } from '@/content/demos/pedidos/ui';
import { track } from '@/lib/analytics';
import { AppCliente } from './AppCliente';
import { Panel } from './Panel';
import { ahoraDemo, crearEstado, crearStore, type Pedido } from './store';

const DEMO = 'pedidos';
/** El CTA lleva al configurador de la página de pizzerías, con "pedidos" ya elegido. */
const CTA_HREF = '/pizzerias#armar';

/**
 * Demo del sistema de pedidos de Micio's. En escritorio, el celular del cliente y el panel del dueño
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
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-ed-line bg-ed-bg px-4 md:px-6">
        <Link href="/" aria-label={BARRA_DEMO.volver} className="flex min-h-11 items-center">
          <LogoCorchetes decorativo className="h-5 w-auto" />
        </Link>
        <div className="invisible min-w-0 flex-1 sm:visible">
          <p className="truncate text-[0.875rem] font-semibold">
            <span className="md:hidden">{BARRA_DEMO.tituloCorto}</span>
            <span className="hidden md:inline">{BARRA_DEMO.titulo}</span>
          </p>
          <p className="hidden truncate text-[0.75rem] text-ed-muted md:block">
            {BARRA_DEMO.bajada}
          </p>
        </div>
        <button
          type="button"
          onClick={reiniciar}
          aria-label={BARRA_DEMO.reiniciarAria}
          className="flex min-h-11 items-center gap-2 rounded-full px-3 text-[0.8125rem] font-medium text-ed-muted hover:text-ed-fg"
        >
          <Reinicio />
          <span className="hidden sm:inline">{BARRA_DEMO.reiniciar}</span>
        </button>
        <a href={CTA_HREF} onClick={cta('barra')} className="e-btn e-btn-primario e-btn-chico">
          <span className="hidden md:inline">{BARRA_DEMO.cta}</span>
          <span className="md:hidden">{BARRA_DEMO.ctaCorto}</span>
        </a>
      </header>

      <main>
        <h1 className="sr-only">{BARRA_DEMO.titulo}</h1>
        {/* Escritorio: guía arriba, celular y panel lado a lado. */}
        <div className="m-escenario hidden px-6 pt-5 pb-8 lg:block">
          <ol aria-label={GUIA.aria} className="mx-auto grid max-w-[60rem] grid-cols-3 gap-3">
            {GUIA.pasos.map((p, i) => {
              const actual = hechos.findIndex((h) => !h) === i;
              return (
                <li
                  key={p.titulo}
                  aria-current={actual ? 'step' : undefined}
                  className={cn(
                    'flex gap-3 rounded-2xl border p-3 transition-colors',
                    actual ? 'border-ed-fg' : 'border-ed-line',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-7 shrink-0 place-items-center rounded-full text-[0.75rem] font-bold tabular-nums',
                      hechos[i] ? 'bg-lima text-tinta' : 'border border-ed-line-strong',
                    )}
                  >
                    {hechos[i] ? <Tilde className="size-3.5" /> : i + 1}
                    {hechos[i] ? <span className="sr-only">{GUIA.hecho}</span> : null}
                  </span>
                  <span>
                    <span className="block text-[0.875rem] font-semibold">{p.titulo}</span>
                    <span className="block text-[0.75rem] text-ed-muted">{p.texto}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 flex items-start justify-center gap-10">
            <Telefono
              className="m-tel shrink-0"
              decorativo={false}
              colorBarra={{ fondo: 'var(--m-oscuro)', claro: true }}
            >
              <AppCliente key={`c${ronda}`} {...comunes} />
            </Telefono>
            <div
              ref={panel}
              tabIndex={-1}
              className="m-ventana w-full max-w-[32rem] overflow-hidden rounded-[1.5rem] border border-ed-line outline-none focus-visible:ring-2 focus-visible:ring-lima"
            >
              <Panel key={`p${ronda}`} {...panelProps} />
            </div>
          </div>
        </div>

        {/* Celular y tablet: una cara a la vez, a pantalla completa, y abajo el selector con su propio lugar. */}
        <div className="flex h-[calc(100svh-3.5rem)] flex-col lg:hidden">
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

function Reinicio() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
