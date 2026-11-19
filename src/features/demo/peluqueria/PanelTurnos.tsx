'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/components/ui/clases';
import {
  CLIENTES_DEMO,
  HISTORIAL_DEMO,
  HORARIO_DEMO,
  HOY_DEMO,
  NOMBRE_SERVICIO,
  SEMANAS_HISTORIAL,
  SERVICIOS_DEMO,
} from '@/content/demos/peluqueria/datos';
import { DIA_CORTO, DIA_LARGO, FRANJA_NOMBRE, PANEL_PELU } from '@/content/demos/peluqueria/ui';
import {
  DIAS_SEMANA,
  formatearHora,
  FRANJAS,
  horariosLibres,
  type DiaSemana,
  type Turno,
} from '@/domain/turnos/agenda';
import {
  clientesPorVolver,
  franjaMasFloja,
  ingresosDeLaSemana,
  ocupacionDeLaSemana,
  ocupacionPorFranja,
  previsionPorDia,
  tasaDeAusencias,
} from '@/domain/turnos/estadisticas';

const P = PANEL_PELU;

type Pestana = 'agenda' | 'estadisticas';

interface PanelTurnosProps {
  turnos: readonly Turno[];
  /** El día del último turno que tomó el bot: la agenda lo muestra solo. */
  ultimoTurno: Turno | null;
}

/** El panel del dueño: la agenda de la semana y las estadísticas, calculadas sobre los datos. */
export function PanelTurnos({ turnos, ultimoTurno }: PanelTurnosProps) {
  const [pestana, setPestana] = useState<Pestana>('agenda');
  return (
    <section aria-label={P.aria} className="rounded-panel border border-line bg-surface p-4 lg:p-8">
      <div role="group" aria-label={P.aria} className="mb-6 flex gap-2">
        {(['agenda', 'estadisticas'] as const).map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={pestana === p}
            onClick={() => setPestana(p)}
            className="min-h-tap rounded-full px-4 text-small font-semibold text-muted aria-pressed:bg-fg aria-pressed:text-bg"
          >
            {P.pestanas[p]}
          </button>
        ))}
      </div>
      {pestana === 'agenda' ? (
        <Agenda turnos={turnos} ultimoTurno={ultimoTurno} />
      ) : (
        <Estadisticas turnos={turnos} />
      )}
    </section>
  );
}

function Agenda({ turnos, ultimoTurno }: PanelTurnosProps) {
  const [elegido, setElegido] = useState<DiaSemana>('mar');
  // Cuando el bot toma un turno, la agenda salta a ese día (ajuste de estado durante el render).
  const [visto, setVisto] = useState<string | null>(null);
  if (ultimoTurno && ultimoTurno.id !== visto) {
    setVisto(ultimoTurno.id);
    setElegido(ultimoTurno.dia);
  }
  const delDia = turnos.filter((t) => t.dia === elegido);
  const libres = horariosLibres(turnos, elegido, HORARIO_DEMO.paso, HORARIO_DEMO).length;

  return (
    <div>
      <h2 className="text-heading font-semibold">{P.agenda.titulo}</h2>
      <div role="group" aria-label={P.agenda.diaAria} className="mt-4 grid grid-cols-5 gap-2">
        {DIAS_SEMANA.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={elegido === d}
            aria-label={DIA_LARGO[d]}
            onClick={() => setElegido(d)}
            className="min-h-tap rounded-control border border-line text-small font-medium hover:border-line-strong aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg"
          >
            {DIA_CORTO[d]}
          </button>
        ))}
      </div>
      <p className="tabular mt-4 text-small text-muted">{P.agenda.libres(libres)}</p>
      {delDia.length === 0 ? (
        <p className="mt-4 rounded-card border border-dashed border-line-strong p-6 text-small text-muted">
          {P.agenda.vacio}
        </p>
      ) : (
        <ol className="mt-2 max-h-[26rem] overflow-y-auto border-t border-line" tabIndex={0}>
          {delDia.map((t) => (
            <li
              key={t.id}
              data-del-bot={t.delBot ? '' : undefined}
              className={cn(
                'grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2 border-b border-line py-2',
                t.delBot && 'snap rounded-control border-accent bg-accent-soft px-2',
              )}
            >
              <span className="tabular text-small font-medium">{formatearHora(t.inicio)}</span>
              <span className="min-w-0">
                <span className="block truncate text-small font-medium">{t.cliente}</span>
                <span className="block text-small text-muted">
                  {NOMBRE_SERVICIO[t.servicioId]}
                  {t.delBot && `. ${P.agenda.delBot}`}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-4 text-small text-muted">{P.agenda.deEjemplo}</p>
    </div>
  );
}

/** Tono de una celda del mapa de calor: un solo color, de claro a fuerte, con el texto que se lee. */
function tonoCelda(ocupacion: number): string {
  if (ocupacion < 0.3) return 'bg-fg/10 text-fg';
  if (ocupacion < 0.5) return 'bg-fg/25 text-fg';
  if (ocupacion < 0.75) return 'bg-fg/70 text-bg';
  return 'bg-fg text-bg';
}

function Estadisticas({ turnos }: { turnos: readonly Turno[] }) {
  const celdas = useMemo(
    () => ocupacionPorFranja(HISTORIAL_DEMO, HORARIO_DEMO, SEMANAS_HISTORIAL),
    [],
  );
  const prevision = useMemo(() => previsionPorDia(HISTORIAL_DEMO, SEMANAS_HISTORIAL - 1), []);
  const porVolver = useMemo(() => clientesPorVolver(HISTORIAL_DEMO, HOY_DEMO), []);
  const ausencias = useMemo(() => tasaDeAusencias(HISTORIAL_DEMO), []);
  const floja = franjaMasFloja(celdas);
  const maxPrevision = Math.max(1, ...prevision.map((p) => p.turnos));

  const numeros = [
    {
      t: P.numeros.ocupacion.titulo,
      v: P.numeros.ocupacion.valor(ocupacionDeLaSemana(turnos, HORARIO_DEMO)),
    },
    {
      t: P.numeros.ingresos.titulo,
      v: P.numeros.ingresos.valor(ingresosDeLaSemana(turnos, SERVICIOS_DEMO)),
    },
    { t: P.numeros.ausencias.titulo, v: P.numeros.ausencias.valor(ausencias) },
    { t: P.numeros.porVolver.titulo, v: P.numeros.porVolver.valor(porVolver.length) },
  ];

  return (
    <div className="flex flex-col gap-10">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 xl:grid-cols-4">
        {numeros.map((n) => (
          <div key={n.t}>
            <dd className="tabular text-title leading-none font-semibold">{n.v}</dd>
            <dt className="mt-2 text-small text-muted">{n.t}</dt>
          </div>
        ))}
      </dl>

      {floja && (
        <div>
          <h2 className="text-heading font-semibold">{P.sugerencia.titulo}</h2>
          <ul className="mt-2 border-t border-line text-small">
            <li className="border-b border-line py-2">
              {P.sugerencia.floja(DIA_LARGO[floja.dia], floja.franja, floja.ocupacion)}
            </li>
            {porVolver.length > 0 && (
              <li className="border-b border-line py-2">
                {P.sugerencia.recuperar(porVolver.length)}
              </li>
            )}
            <li className="border-b border-line py-2">{P.sugerencia.ausencias(ausencias)}</li>
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-heading font-semibold">{P.calor.titulo}</h2>
        <p className="mt-1 text-small text-muted">{P.calor.bajada}</p>
        {/* Una tabla de verdad: el valor está escrito en cada celda, además del tono. */}
        <table className="mt-4 w-full table-fixed border-separate border-spacing-0.5 text-small">
          <thead>
            <tr>
              <th scope="col" className="w-16 text-left font-medium text-muted">
                {P.calor.franja}
              </th>
              {DIAS_SEMANA.map((d) => (
                <th key={d} scope="col" className="pb-1 font-medium text-muted">
                  {DIA_CORTO[d]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FRANJAS.map((f) => (
              <tr key={f}>
                <th scope="row" className="text-left font-medium text-muted">
                  {FRANJA_NOMBRE[f]}
                </th>
                {DIAS_SEMANA.map((d) => {
                  const c = celdas.find((x) => x.dia === d && x.franja === f);
                  const o = c?.ocupacion ?? 0;
                  return (
                    <td
                      key={d}
                      title={P.calor.celda(DIA_LARGO[d], FRANJA_NOMBRE[f], o)}
                      data-floja={floja === c ? '' : undefined}
                      className={cn(
                        'tabular h-12 rounded-control text-center font-medium',
                        tonoCelda(o),
                        floja === c && 'outline-2 -outline-offset-2 outline-accent',
                      )}
                    >
                      {P.calor.valor(o)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-heading font-semibold">{P.prevision.titulo}</h2>
        <p className="mt-1 text-small text-muted">{P.prevision.bajada}</p>
        <ul className="mt-4 grid grid-cols-5 gap-2">
          {prevision.map((p) => (
            <li key={p.dia} title={P.prevision.barra(DIA_LARGO[p.dia], p.turnos)}>
              <div className="flex h-28 flex-col justify-end">
                <span className="tabular block text-center text-small font-semibold">
                  {p.turnos}
                </span>
                <span
                  className="mx-auto mt-1 block w-8 rounded-t-sm bg-fg/70"
                  style={{ height: `${Math.max(4, (p.turnos / maxPrevision) * 80)}px` }}
                />
              </div>
              <span className="mt-1 block border-t border-line pt-1 text-center text-small text-muted">
                <span aria-hidden="true">{DIA_CORTO[p.dia]}</span>
                <span className="sr-only">{P.prevision.barra(DIA_LARGO[p.dia], p.turnos)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-heading font-semibold">{P.volver.titulo}</h2>
        <p className="mt-1 text-small text-muted">{P.volver.bajada}</p>
        {porVolver.length === 0 ? (
          <p className="mt-4 text-small text-muted">{P.volver.vacio}</p>
        ) : (
          <ul className="mt-2 border-t border-line">
            {porVolver.slice(0, 5).map((c) => (
              <li key={c.clienteId} className="border-b border-line py-2 text-small">
                <span className="block font-medium">{CLIENTES_DEMO[c.clienteId]}</span>
                <span className="tabular block text-muted">
                  {P.volver.fila(c.ritmoDias, c.sinVenirDias)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-small text-muted">{P.aclaracion}</p>
    </div>
  );
}
