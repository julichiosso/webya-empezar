'use client';

import { useState } from 'react';
import { BarraDemo } from '@/components/marketing/editorial/BarraDemo';
import { EnUso } from '@/components/marketing/editorial/EnUso';
import { Tilde } from '@/components/marketing/editorial/Iconos';
import {
  MarcoVista,
  SelectorVista,
  type VistaDispositivo,
} from '@/components/marketing/editorial/MarcoVista';
import { cn } from '@/components/ui/clases';
import { DEMO_WEB_UI as UI, RUBROS_WEB, type RubroWebId } from '@/content/demos/web/datos';
import { track } from '@/lib/analytics';
import { SitioPlantilla } from './SitioPlantilla';

/**
 * Demo de página web: la misma plantilla para cada rubro, en el celular o en la computadora. A la
 * izquierda (escritorio) qué probar, el rubro, la vista y el ejemplo real; en el celular, el rubro
 * arriba y la página a pantalla completa.
 */
export function DemoWeb() {
  const [rubroId, setRubroId] = useState<RubroWebId>('salud');
  const [vista, setVista] = useState<VistaDispositivo>('movil');
  const [aviso, setAviso] = useState(false);
  const [hechos, setHechos] = useState([false, false, false]);
  const rubro = RUBROS_WEB.find((r) => r.id === rubroId) ?? RUBROS_WEB[0]!;

  const marcar = (i: number) => setHechos((h) => h.map((x, j) => x || j === i));
  const elegirRubro = (id: RubroWebId) => {
    setRubroId(id);
    marcar(0);
    track('demo_personalizada', { demo: 'web', campo: 'rubro', valor: id });
  };
  const elegirVista = (v: VistaDispositivo) => {
    setVista(v);
    if (v === 'escritorio') marcar(1);
  };
  const whatsapp = () => {
    setAviso(true);
    marcar(2);
    track('demo_whatsapp_click', { demo: 'web' });
  };
  const reiniciar = () => {
    setRubroId('salud');
    setVista('movil');
    setAviso(false);
    setHechos([false, false, false]);
  };

  const sitio = <SitioPlantilla rubro={rubro} onWhatsApp={whatsapp} />;
  const avisoUI = aviso ? (
    <div
      role="status"
      className="absolute inset-x-3 bottom-3 z-20 flex items-start gap-3 rounded-2xl bg-neutral-900 p-4 text-[0.875rem] text-white"
    >
      <p className="flex-1">{UI.aviso(rubro.mensaje)}</p>
      <button
        type="button"
        onClick={() => setAviso(false)}
        className="shrink-0 rounded-full border border-white/30 px-3 py-1 font-semibold"
      >
        {UI.cerrarAviso}
      </button>
    </div>
  ) : null;
  const actual = hechos.findIndex((h) => !h);

  const chips = (
    <div role="radiogroup" aria-label={UI.rubro} className="flex gap-2">
      {RUBROS_WEB.map((r) => (
        <button
          key={r.id}
          type="button"
          role="radio"
          aria-checked={r.id === rubroId}
          onClick={() => elegirRubro(r.id)}
          className="min-h-10 shrink-0 rounded-full border border-ed-line-strong px-4 text-[0.8125rem] font-medium aria-checked:border-ed-fg aria-checked:bg-ed-fg aria-checked:text-ed-bg"
        >
          {r.etiqueta}
        </button>
      ))}
    </div>
  );

  return (
    <div className="tono-oscuro min-h-svh bg-ed-bg text-ed-fg">
      <BarraDemo demo="web" onReiniciar={reiniciar} />
      <main>
        <h1 className="sr-only">{UI.titulo}</h1>
        <div className="d-escenario hidden justify-center gap-8 px-6 py-6 lg:flex xl:gap-12">
          <div className="w-[15rem] shrink-0 space-y-6 pt-2">
            <ol aria-label={UI.guia.aria} className="space-y-2">
              {UI.guia.pasos.map((p, i) => (
                <li
                  key={p.titulo}
                  aria-current={actual === i ? 'step' : undefined}
                  className={cn(
                    'flex gap-3 rounded-xl border p-3 transition-colors',
                    actual === i ? 'border-ed-fg' : 'border-transparent',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full text-[0.6875rem] font-bold tabular-nums',
                      hechos[i] ? 'bg-ed-fg text-ed-bg' : 'border border-ed-line-strong',
                    )}
                  >
                    {hechos[i] ? <Tilde className="size-3" /> : i + 1}
                  </span>
                  <span>
                    <span className="block text-[0.8125rem] font-semibold">{p.titulo}</span>
                    <span className="mt-0.5 block text-[0.75rem] leading-snug text-ed-muted">
                      {p.texto}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <div>
              <p className="e-rotulo mb-2 text-ed-muted">{UI.rubro}</p>
              <div className="[&>div]:flex-wrap">{chips}</div>
            </div>
            <SelectorVista
              vista={vista}
              onVista={elegirVista}
              etiqueta={UI.vista}
              celular={UI.celular}
              computadora={UI.computadora}
            />
            <EnUso proyecto="lorena" />
          </div>
          <div
            className={cn('min-w-0', vista === 'escritorio' ? 'w-full max-w-[62rem]' : 'shrink-0')}
          >
            <p className="mb-2 text-center text-[0.75rem] text-ed-muted">{UI.ladoSitio}</p>
            <div className="relative">
              <MarcoVista vista={vista} dominio={UI.dominio}>
                <div className="relative h-full">
                  {sitio}
                  {avisoUI}
                </div>
              </MarcoVista>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100svh-2.75rem)] flex-col lg:hidden">
          <div className="d-sin-barra shrink-0 overflow-x-auto border-b border-ed-line px-3 py-2">
            {chips}
          </div>
          <div className="relative min-h-0 flex-1">
            {sitio}
            {avisoUI}
          </div>
        </div>
      </main>
    </div>
  );
}
