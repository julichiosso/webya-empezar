'use client';

import { ESTUDIO } from '@/content/demos/studio';
import type { useSimulador } from './useSimulador';

type Sim = ReturnType<typeof useSimulador<unknown>>;

/** Botonera del simulador: arrancar, pausar/seguir, terminar, velocidad y cuánto falta. */
export function ControlSimulador({ sim, className }: { sim: Sim; className?: string }) {
  const S = ESTUDIO.simulador;
  const activo = sim.estado === 'corriendo' || sim.estado === 'pausa';
  return (
    <div role="group" aria-label={S.aria} className={className}>
      {activo ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={sim.estado === 'corriendo' ? sim.pausar : sim.seguir}
            className="min-h-14 flex-1 rounded-full bg-ed-fg px-5 text-[1.0625rem] font-semibold text-ed-bg"
          >
            {sim.estado === 'corriendo' ? S.pausar : S.seguir}
          </button>
          <button
            type="button"
            aria-pressed={sim.rapido}
            onClick={() => sim.setRapido(!sim.rapido)}
            className="min-h-14 rounded-full border border-ed-line-strong px-5 text-[1.0625rem] aria-pressed:border-ed-fg aria-pressed:bg-ed-fg aria-pressed:text-ed-bg"
          >
            {S.rapido}
          </button>
          <button
            type="button"
            onClick={sim.detener}
            className="min-h-14 rounded-full px-4 text-[1.0625rem] underline underline-offset-4"
          >
            {S.detener}
          </button>
          <div
            aria-hidden="true"
            className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ed-surface"
          >
            <div
              className="h-full rounded-full bg-ed-fg transition-[width] duration-300"
              style={{ width: `${sim.total ? (sim.hechos / sim.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={sim.iniciar}
          className="min-h-14 w-full rounded-full bg-ed-fg px-5 text-[1.0625rem] font-semibold text-ed-bg"
        >
          {S.iniciar}
        </button>
      )}
      {sim.estado === 'fin' ? (
        <p role="status" className="mt-2 text-center text-[1rem] text-ed-muted">
          {S.terminado}
        </p>
      ) : null}
    </div>
  );
}
