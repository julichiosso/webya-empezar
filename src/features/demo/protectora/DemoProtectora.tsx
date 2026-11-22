'use client';

import { useCallback, useEffect, useReducer, useState } from 'react';
import { BarraDemo } from '@/components/marketing/editorial/BarraDemo';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { TecladoAbierto } from '@/components/marketing/editorial/TecladoAbierto';
import { cn } from '@/components/ui/clases';
import { ORG, UI_PROTECTORA as U, type Animal } from '@/content/demos/protectora';
import { PROTECTORAS } from '@/content/protectoras';
import { track } from '@/lib/analytics';
import { Admin } from './Admin';
import { Compartir } from './Compartir';
import { estadoInicial, reducir } from './estado';
import { Publica } from './Publica';

const DEMO = 'protectora';
type Vista = 'publica' | 'admin';

/**
 * Demo para protectoras: la organización ficticia "Refugio Ventarrón" con su identidad propia (dentro del
 * marco). El interruptor muestra los dos lados: lo que hace el público (adoptar, asociarse, donar,
 * anotarse) y cómo lo gestiona el equipo. Todo en memoria; nada se envía.
 */
export function DemoProtectora() {
  const [e, d] = useReducer(reducir, undefined, estadoInicial);
  const [vista, setVista] = useState<Vista>('publica');
  const [compartir, setCompartir] = useState<Animal | null>(null);
  const [ronda, setRonda] = useState(0);
  const cerrar = useCallback(() => setCompartir(null), []);

  useEffect(() => {
    track('demo_view', { demo: DEMO, cocina: 'protectora' });
  }, []);

  const reiniciar = () => {
    d({ tipo: 'reiniciar' });
    setVista('publica');
    setRonda((r) => r + 1);
  };

  return (
    <div className="pr-paleta min-h-dvh pb-(--d-cta)">
      <TecladoAbierto />
      <BarraDemo demo={DEMO} onReiniciar={reiniciar} />
      <div className="mx-auto max-w-md px-4 pt-5 pb-10 md:my-8 md:rounded-[2rem] md:border md:border-(--pr-linea) md:px-6 md:pb-8">
        <header>
          <p className="text-[0.75rem] font-semibold tracking-[0.12em] text-(--pr-tinta-2) uppercase">
            {ORG.ficticia}
          </p>
          <h1 className="pr-titulo mt-1 text-[2rem] leading-tight font-semibold">{ORG.nombre}</h1>
          <p className="text-(--pr-tinta-2)">{ORG.lema}</p>
        </header>

        <div
          role="group"
          aria-label={U.vistas.etiqueta}
          className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-(--pr-papel) p-1"
        >
          {(['publica', 'admin'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={vista === v}
              onClick={() => {
                setVista(v);
                track('demo_estado_avanzado', { demo: DEMO, estado: v });
              }}
              className={cn(
                'relative min-h-11 rounded-full text-[0.9375rem] font-semibold',
                vista === v ? 'bg-(--pr-tinta) text-(--pr-fondo)' : 'text-(--pr-tinta-2)',
              )}
            >
              {U.vistas[v]}
              {v === 'admin' && e.aviso && vista !== 'admin' ? (
                <span
                  aria-hidden="true"
                  className="absolute top-2 right-4 size-2 rounded-full bg-(--pr-acento)"
                />
              ) : null}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-[0.75rem] text-(--pr-tinta-2)">{U.aviso}</p>

        <div key={ronda} className="mt-5">
          {vista === 'publica' ? (
            <Publica e={e} d={d} onCompartir={setCompartir} />
          ) : (
            <Admin e={e} d={d} />
          )}
        </div>
      </div>

      <section aria-labelledby="demo-final" className="mx-auto max-w-md px-4 pb-16 text-center">
        <h2 id="demo-final" className="pr-titulo text-[1.5rem] font-semibold">
          {U.final.titulo}
        </h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <a
            href={PROTECTORAS.armar}
            onClick={() => track('demo_cta_click', { demo: DEMO, origen: 'final' })}
            className="pr-boton"
          >
            {U.final.quiero}
          </a>
          <a
            href={enlaceContacto(U.final.mensaje).href}
            target="_blank"
            rel="noopener"
            className="pr-boton-2"
          >
            {U.final.escribinos}
          </a>
        </div>
      </section>

      {compartir ? <Compartir animal={compartir} onCerrar={cerrar} /> : null}
    </div>
  );
}
