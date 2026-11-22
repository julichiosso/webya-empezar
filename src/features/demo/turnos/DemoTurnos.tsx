'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { EscenarioDemo, type Vista } from '@/components/marketing/editorial/EscenarioDemo';
import { GUIA_TURNOS, LADOS_TURNOS, PAGINA_TURNOS, VISTAS_TURNOS } from '@/content/demos/turnos/ui';
import { track } from '@/lib/analytics';
import { AppReserva } from './AppReserva';
import { avisarNuevaReserva } from './aviso';
import { PanelDueno } from './PanelDueno';
import { ESTUDIO } from '@/content/demos/studio';
import { NEGOCIO_DEMO } from '@/content/demos/turnos/datos';
import { generador, persona } from '@/domain/studio/semilla';
import { Asistente } from '../studio/Asistente';
import { BotonPersonalizar } from '../studio/BotonPersonalizar';
import { ControlSimulador } from '../studio/ControlSimulador';
import { ProveedorMarca } from '../studio/MarcaContexto';
import { estiloMarca } from '../studio/marca';
import { useMarcaEstudio } from '../studio/useMarcaEstudio';
import { useSimulador } from '../studio/useSimulador';
import { VistaMarca } from '../studio/VistaMarca';
import { ahoraDemo, crearEstado, crearStore, simularReserva } from './store';

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
  const studio = useMarcaEstudio({
    demo: DEMO,
    inicial: { nombre: NEGOCIO_DEMO.nombre, colorId: 'negro', fuenteId: 'moderna' },
  });
  const sim = useSimulador<number>({
    demo: DEMO,
    eventos: () => {
      const azar = generador(Date.now());
      return Array.from({ length: 6 }, (_, i) => ({
        espera: 2400 + Math.floor(azar() * 2400),
        dato: i,
      }));
    },
    onEvento: (i) => {
      const azar = generador(e.inicioReal + i * 104_729);
      const r = Date.now() + desfase;
      store.set((x) => simularReserva(x, ahoraDemo(x, r), r, azar, persona(azar)));
      setNovedad(true);
    },
  });

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
    sim.detener();
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
    <ProveedorMarca marca={studio.marca}>
      <EscenarioDemo
        demo="turnos"
        titulo={PAGINA_TURNOS.titulo}
        claseRaiz="t-paleta"
        estilo={estiloMarca(studio.marca)}
        estudio={{
          ...studio.controles,
          reiniciar: () => {
            studio.controles.reiniciar();
            reiniciar();
          },
        }}
        extra={<BotonPersonalizar onClick={studio.abrirGuia} />}
        herramientas={<ControlSimulador sim={sim} />}
        arriba={
          studio.guia ? (
            <Asistente
              demo={DEMO}
              pasos={studio.pasos}
              onTerminar={studio.cerrarGuia}
              vista={
                <VistaMarca
                  marca={studio.marca}
                  linea={ESTUDIO.asistente.vistaLinea}
                  boton={NEGOCIO_DEMO.reservar}
                />
              }
            />
          ) : undefined
        }
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
    </ProveedorMarca>
  );
}
