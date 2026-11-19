'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { EscenarioDemo, type Vista } from '@/components/marketing/editorial/EscenarioDemo';
import { GUIA_TURNOS, LADOS_TURNOS, PAGINA_TURNOS, VISTAS_TURNOS } from '@/content/demos/turnos/ui';
import { track } from '@/lib/analytics';
import { AppReserva } from './AppReserva';
import { avisarNuevaReserva } from './aviso';
import { PanelDueno } from './PanelDueno';
import { ahoraDemo, crearEstado, crearStore } from './store';

const DEMO = 'turnos';

/**
 * Demo del sistema de turnos con seña: el estado y los eventos; el escenario (escritorio y celular) es
 * el común de las demos. Todo en memoria: el pago y los avisos se simulan.
 */
export function DemoTurnos() {
  const [store] = useState(() => crearStore(Date.now()));
  const e = useSyncExternalStore(store.subscribe, store.get, store.get);
  const [ahoraReal, setAhoraReal] = useState(e.inicioReal);
  const [vista, setVista] = useState<Vista>('cliente');
  const [llego, setLlego] = useState(false);
  const [atendio, setAtendio] = useState(false);
  const [novedad, setNovedad] = useState(false);
  const [ronda, setRonda] = useState(0);
  /** El reloj de la demo se puede adelantar: todo lo que mira la hora usa Date.now() + desfase. */
  const [desfase, setDesfase] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const reloj = ahoraReal + desfase;
  const ahora = ahoraDemo(e, reloj);

  useEffect(() => {
    track('demo_view', { demo: DEMO, cocina: 'peluqueria' });
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
    setAtendio(false);
    setNovedad(false);
    setDesfase(0);
    setRonda((r) => r + 1);
  };

  const propio = e.ultimoPropio != null ? e.turnos.find((t) => t.id === e.ultimoPropio) : undefined;
  const pagado = propio?.senaEstado === 'pagada';
  const hechos = [pagado, pagado && llego, atendio];

  return (
    <EscenarioDemo
      demo="turnos"
      titulo={PAGINA_TURNOS.titulo}
      claseRaiz="t-paleta"
      guia={GUIA_TURNOS}
      hechos={hechos}
      lados={LADOS_TURNOS}
      vistas={VISTAS_TURNOS}
      colorBarra={{ fondo: 'var(--t-fondo)', claro: false }}
      vista={vista}
      onVista={cambiarVista}
      novedad={novedad}
      onReiniciar={reiniciar}
      panelRef={panel}
      cliente={(i) => (
        <AppReserva
          key={`${i}${ronda}`}
          e={e}
          ahora={ahora}
          ahoraReal={reloj}
          desfase={desfase}
          set={store.set}
          onVerPanel={verPanel}
          onConfirmado={() => {
            avisarNuevaReserva();
            setNovedad(true);
            track('demo_estado_avanzado', { demo: DEMO, estado: 'sena_pagada' });
          }}
        />
      )}
      panel={(i, visible) => (
        <PanelDueno
          key={`${i}${ronda}`}
          e={e}
          ahora={ahora}
          ahoraReal={reloj}
          set={store.set}
          visible={visible}
          onAdelantar={() => setDesfase((d) => d + 10 * 60_000)}
          onAtendio={() => {
            setAtendio(true);
            track('demo_estado_avanzado', { demo: DEMO, estado: 'atendido' });
          }}
        />
      )}
    />
  );
}
