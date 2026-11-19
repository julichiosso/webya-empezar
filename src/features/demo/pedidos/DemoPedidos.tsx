'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { EscenarioDemo, type Vista } from '@/components/marketing/editorial/EscenarioDemo';
import { BARRA_DEMO, GUIA, LADOS, VISTAS } from '@/content/demos/pedidos/ui';
import { track } from '@/lib/analytics';
import { AppCliente } from './AppCliente';
import { Panel } from './Panel';
import { ahoraDemo, crearEstado, crearStore, type Pedido } from './store';

const DEMO = 'pedidos';
/** El CTA lleva al configurador de la página de pizzerías, con "pedidos" ya elegido. */
const CTA_HREF = '/pizzerias#armar';

/**
 * Demo del sistema de pedidos: el estado y los eventos; el escenario (escritorio y celular) es el común
 * de las demos. Todo en memoria: nada se envía.
 */
export function DemoPedidos() {
  const [store] = useState(() => crearStore(Date.now()));
  const e = useSyncExternalStore(store.subscribe, store.get, store.get);
  const [ahoraReal, setAhoraReal] = useState(e.inicioReal);
  const [vista, setVista] = useState<Vista>('cliente');
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
  const cambiarVista = (v: Vista) => {
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
    <EscenarioDemo
      demo="pedidos"
      titulo={BARRA_DEMO.titulo}
      claseRaiz="m-paleta"
      guia={GUIA}
      hechos={hechos}
      lados={LADOS}
      vistas={VISTAS}
      colorBarra={{ fondo: 'var(--m-oscuro)', claro: true }}
      vista={vista}
      onVista={cambiarVista}
      novedad={novedad}
      onReiniciar={reiniciar}
      panelRef={panel}
      cliente={(i) => <AppCliente key={`${i}${ronda}`} {...comunes} />}
      panel={(i, visible) => <Panel key={`${i}${ronda}`} {...panelProps} visible={visible} />}
    />
  );
}
