'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/components/ui/clases';
import { NOTAS_CLIENTES, PROFESIONALES_DEMO } from '@/content/demos/turnos/datos';
import {
  CARTELES,
  COBRO,
  DIAS_CORTO,
  DIAS_LARGO,
  ESTADOS_SENA,
  ESTADOS_TURNO,
  FECHAS,
  HOJA_TURNO,
  MESES,
  PANEL_TURNOS,
  pesos,
} from '@/content/demos/turnos/ui';
import { huecosLibres } from '@/domain/reservas/disponibilidad';
import { etiquetaDia, fechaLarga } from './AppReserva';
import {
  aHhmm,
  aResolver,
  cancelar,
  completar,
  devolverSena,
  faltasPrevias,
  fechaDe,
  franjasDe,
  getProfesional,
  marcarAusente,
  marcarVisto,
  reponer,
  restaurar,
  saldoDe,
  vistaTurno,
  type EstadoDemo,
  type Medio,
  type StoreDemo,
  type Turno,
} from './store';

interface Props {
  e: EstadoDemo;
  ahora: number;
  ahoraReal: number;
  set: StoreDemo['set'];
  onAtendio: () => void;
  /** Adelanta el reloj de la demo (para ver vencer un apartado o cerrarse un turno). */
  onAdelantar: () => void;
  visible?: boolean;
}

interface Cartel {
  id: number;
  titulo?: string;
  texto: string;
  previo?: Turno;
}

type Vista = Turno & { cierreAuto?: boolean };

/** "mar 17/11": cómo nombra el panel un día en los avisos. */
const diaCorto = (dia: number) => {
  const f = fechaDe(dia);
  return `${DIAS_CORTO[f.getDay()]!.toLowerCase()} ${String(f.getDate()).padStart(2, '0')}/${String(f.getMonth() + 1).padStart(2, '0')}`;
};

/** El panel del dueño: el día en la peluquería, la agenda, cada turno y el cobro al terminar. */
export function PanelDueno({
  e,
  ahora,
  ahoraReal,
  set,
  onAtendio,
  onAdelantar,
  visible = true,
}: Props) {
  const [pestana, setPestana] = useState<'inicio' | 'agenda'>('inicio');
  const [abierto, setAbierto] = useState<number>();
  const [cobro, setCobro] = useState<number>();
  const [carteles, setCarteles] = useState<Cartel[]>([]);
  const scroller = useRef<HTMLDivElement>(null);

  const turnos: Vista[] = e.turnos.map((t) => vistaTurno(t, ahora, ahoraReal));
  const turno = abierto != null ? turnos.find((t) => t.id === abierto) : undefined;
  const aCobrar = cobro != null ? turnos.find((t) => t.id === cobro) : undefined;

  const cartel = (c: Omit<Cartel, 'id'>) =>
    setCarteles((cs) => [...cs.slice(-2), { ...c, id: Date.now() + Math.random() }]);

  // Entra una reserva nueva del que prueba la demo: cartel de 9 s (estado derivado, en el render).
  const nuevo = e.ultimoPropio != null ? turnos.find((t) => t.id === e.ultimoPropio) : undefined;
  const [anunciado, setAnunciado] = useState<number>();
  if (nuevo && nuevo.estado === 'confirmado' && nuevo.id !== anunciado) {
    setAnunciado(nuevo.id);
    setPestana('inicio');
    cartel({
      titulo: PANEL_TURNOS.avisoNueva.titulo,
      texto: PANEL_TURNOS.avisoNueva.texto(
        nuevo.cliente,
        nuevo.servicioNombre,
        FECHAS.aLas(etiquetaDia(nuevo.dia).toLowerCase(), aHhmm(nuevo.inicio)),
      ),
    });
  }

  useEffect(() => {
    if (carteles.length === 0) return;
    const ultimo = carteles.at(-1)!;
    const t = setTimeout(
      () => setCarteles((cs) => cs.filter((c) => c.id !== ultimo.id)),
      ultimo.titulo ? 9000 : 7000,
    );
    return () => clearTimeout(t);
  }, [carteles]);

  useEffect(() => {
    if (visible) scroller.current?.scrollTo({ top: 0 });
  }, [visible, pestana]);

  const abrir = (t: Turno) => {
    setAbierto(t.id);
    set((x) => marcarVisto(x, t.id));
  };
  const accion = (t: Turno, f: (x: EstadoDemo) => EstadoDemo, texto: string) => {
    const previo = e.turnos.find((x) => x.id === t.id)!;
    set(f);
    cartel({ texto, previo });
  };

  return (
    <div className="t-paleta t-panel relative h-full overflow-hidden bg-[var(--t-panel)] text-[var(--t-tinta)]">
      <div ref={scroller} className="d-barra-fina h-full overflow-y-auto overscroll-contain">
        <header className="sticky top-0 z-10 border-b border-[var(--t-linea)] bg-[var(--t-panel)]/95 px-4 pt-4 pb-3 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-[1.0625rem] font-bold">{PANEL_TURNOS.marca}</p>
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1.5 text-[0.75rem] font-medium text-[var(--t-gris)]">
                <span className="t-late size-1.5 rounded-full bg-[var(--t-verde-punto)]" />
                {PANEL_TURNOS.enVivo} · {aHhmm(ahora)}
              </p>
              <button
                type="button"
                onClick={onAdelantar}
                aria-label={PANEL_TURNOS.adelantarAria}
                className="rounded-full border border-[var(--t-linea-2)] bg-[var(--t-fondo)] px-2.5 py-1 text-[0.6875rem] font-semibold"
              >
                {PANEL_TURNOS.adelantar}
              </button>
            </div>
          </div>
          <div
            role="tablist"
            aria-label={PANEL_TURNOS.pestanasAria}
            className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-[var(--t-linea)] p-1"
          >
            {(['inicio', 'agenda'] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={pestana === p}
                onClick={() => setPestana(p)}
                className="rounded-lg py-1.5 text-[0.8125rem] font-semibold text-[var(--t-tinta-2)] aria-selected:bg-[var(--t-fondo)] aria-selected:text-[var(--t-tinta)]"
              >
                {PANEL_TURNOS.pestanas[p]}
              </button>
            ))}
          </div>
        </header>
        <div className="px-4 pt-4 pb-24">
          {pestana === 'inicio' ? (
            <Inicio
              turnos={turnos}
              ahora={ahora}
              onAbrir={abrir}
              onTermine={(t) => setCobro(t.id)}
              onNoVino={(t) => {
                accion(t, (x) => marcarAusente(x, t.id), CARTELES.noVino(t.cliente));
                onAtendio();
              }}
            />
          ) : (
            <Agenda e={e} turnos={turnos} onAbrir={abrir} />
          )}
        </div>
      </div>

      {turno ? (
        <Hoja titulo={turno.cliente} onCerrar={() => setAbierto(undefined)}>
          <HojaTurno
            t={turno}
            ahora={ahora}
            faltas={faltasPrevias(e, turno)}
            onAtendido={() => {
              setAbierto(undefined);
              setCobro(turno.id);
            }}
            onNoVino={() => {
              accion(turno, (x) => marcarAusente(x, turno.id), CARTELES.noVino(turno.cliente));
              setAbierto(undefined);
              onAtendio();
            }}
            onCancelar={() => {
              accion(turno, (x) => cancelar(x, turno.id), CARTELES.cancelado(turno.cliente));
              setAbierto(undefined);
            }}
            onRestaurar={() => {
              accion(turno, (x) => restaurar(x, turno.id), CARTELES.restaurado(turno.cliente));
              setAbierto(undefined);
            }}
            onDevolver={() => {
              set((x) => devolverSena(x, turno.id));
              cartel({ texto: CARTELES.devuelta(turno.cliente) });
              setAbierto(undefined);
            }}
          />
        </Hoja>
      ) : null}

      {aCobrar ? (
        <Hoja
          titulo={COBRO.titulo(aCobrar.cliente.split(' ')[0]!)}
          onCerrar={() => setCobro(undefined)}
        >
          <Cobro
            t={aCobrar}
            onListo={(c) => {
              accion(
                aCobrar,
                (x) => completar(x, aCobrar.id, c),
                CARTELES.atendido(aCobrar.cliente),
              );
              setCobro(undefined);
              onAtendio();
            }}
          />
        </Hoja>
      ) : null}

      <div
        aria-live="polite"
        className="pointer-events-none absolute inset-x-3 bottom-3 z-30 space-y-2"
      >
        {carteles.map((c) => (
          <div
            key={c.id}
            className="t-entra pointer-events-auto flex items-start gap-3 rounded-xl bg-[var(--t-tinta)] px-3.5 py-3 text-[0.8125rem] text-[var(--t-fondo)]"
          >
            <p className="min-w-0 flex-1">
              {c.titulo ? <span className="block font-semibold">{c.titulo}</span> : null}
              <span className={c.titulo ? 'opacity-80' : ''}>{c.texto}</span>
            </p>
            {c.previo ? (
              <button
                type="button"
                onClick={() => {
                  set((x) => reponer(x, c.previo!));
                  setCarteles((cs) => cs.filter((x) => x.id !== c.id));
                }}
                className="shrink-0 font-semibold underline underline-offset-4"
              >
                {CARTELES.deshacer}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Inicio ---------------- */

function Inicio({
  turnos,
  ahora,
  onAbrir,
  onTermine,
  onNoVino,
}: {
  turnos: Vista[];
  ahora: number;
  onAbrir: (t: Turno) => void;
  onTermine: (t: Turno) => void;
  onNoVino: (t: Turno) => void;
}) {
  const [verAtendidos, setVerAtendidos] = useState(false);
  const hoy = turnos.filter((t) => t.dia === 0);
  const confirmados = hoy
    .filter((t) => t.estado === 'confirmado')
    .sort((a, b) => a.inicio - b.inicio);
  const enSilla = confirmados.filter((t) => t.inicio <= ahora && ahora < t.fin);
  const fila = confirmados.filter((t) => t.inicio > ahora);
  const atendidos = hoy.filter((t) => t.estado === 'completado');
  const entro = atendidos.reduce(
    (s, t) => s + (t.senaEstado === 'pagada' ? t.sena : 0) + (t.cobrado ?? 0),
    0,
  );
  const resolver = turnos.filter(aResolver);
  const manana = turnos.filter((t) => t.dia === 1 && t.estado === 'confirmado');
  const f = fechaDe(0);

  return (
    <>
      <p className="text-[0.75rem] font-medium text-[var(--t-gris)] first-letter:uppercase">
        {FECHAS.dia(DIAS_LARGO[f.getDay()]!, f.getDate(), MESES[f.getMonth()]!)}
      </p>
      <h2 className="mt-0.5 text-[1.375rem] font-bold tracking-tight">
        {PANEL_TURNOS.titulo(enSilla.length + fila.length)}
      </h2>

      {resolver.length > 0 ? (
        <section className="mt-4 rounded-2xl bg-[var(--t-rojo-suave)] p-3.5">
          <h3 className="text-[0.75rem] font-semibold text-[var(--t-rojo)] uppercase">
            {PANEL_TURNOS.aResolver}
          </h3>
          <ul className="mt-2 space-y-1.5">
            {resolver.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 text-[0.8125rem]">
                <span>
                  {t.estado === 'conflicto_pago'
                    ? PANEL_TURNOS.conflicto(t.cliente.split(' ')[0]!)
                    : PANEL_TURNOS.senaCancelado(t.cliente.split(' ')[0]!)}
                </span>
                <button
                  type="button"
                  onClick={() => onAbrir(t)}
                  className="shrink-0 font-semibold text-[var(--t-rojo)] underline underline-offset-4"
                >
                  {PANEL_TURNOS.resolver}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {enSilla.map((t) => {
        const avance = Math.min(1, (ahora - t.inicio) / (t.fin - t.inicio));
        const saldo = saldoDe(t);
        return (
          <section
            key={t.id}
            className="t-entra mt-4 overflow-hidden rounded-2xl bg-[var(--t-tinta)] text-[var(--t-fondo)]"
          >
            <div className="h-1 bg-white/15">
              <div
                className="h-full bg-[var(--t-verde-punto)]"
                style={{ width: `${avance * 100}%` }}
              />
            </div>
            <div className="p-4">
              <p className="text-[0.75rem] font-medium opacity-70">
                {PANEL_TURNOS.enLaSilla} · {aHhmm(t.inicio)} – {aHhmm(t.fin)} ·{' '}
                {PANEL_TURNOS.con(getProfesional(t.profesionalId)?.nombre ?? '')}
              </p>
              <p className="mt-1 text-[1.375rem] leading-tight font-bold">{t.cliente}</p>
              <p className="text-[0.8125rem] opacity-80">
                {t.servicioNombre} ·{' '}
                {saldo > 0 ? PANEL_TURNOS.cobrar(pesos(saldo)) : PANEL_TURNOS.pagoTodo}
              </p>
              {t.nota ? (
                <p className="mt-2 rounded-lg bg-white/10 px-2.5 py-1.5 text-[0.75rem]">{t.nota}</p>
              ) : null}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onTermine(t)}
                  className="h-10 rounded-xl bg-[var(--t-fondo)] text-[0.8125rem] font-semibold text-[var(--t-tinta)]"
                >
                  {PANEL_TURNOS.termine}
                </button>
                <button
                  type="button"
                  onClick={() => onNoVino(t)}
                  className="h-10 rounded-xl border border-white/25 text-[0.8125rem] font-semibold"
                >
                  {PANEL_TURNOS.noVino}
                </button>
              </div>
            </div>
          </section>
        );
      })}

      {fila.length > 0 ? (
        <section className="mt-5">
          <h3 className="text-[0.75rem] font-semibold text-[var(--t-gris)] uppercase">
            {PANEL_TURNOS.fila}
          </h3>
          <ul className="mt-2 divide-y divide-[var(--t-linea)] overflow-hidden rounded-2xl border border-[var(--t-linea)] bg-[var(--t-fondo)]">
            {fila.map((t, i) => (
              <li key={t.id}>
                <FilaTurno
                  t={t}
                  onAbrir={onAbrir}
                  extra={i === 0 ? PANEL_TURNOS.enMinutos(t.inicio - ahora) : undefined}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {atendidos.length > 0 ? (
        <section className="mt-5">
          <button
            type="button"
            aria-expanded={verAtendidos}
            onClick={() => setVerAtendidos((v) => !v)}
            className="flex w-full items-center justify-between text-[0.75rem] font-semibold text-[var(--t-gris)] uppercase"
          >
            {PANEL_TURNOS.atendidos(atendidos.length, pesos(entro))}
            <span aria-hidden="true">{verAtendidos ? '−' : '+'}</span>
          </button>
          {verAtendidos ? (
            <ul className="mt-2 divide-y divide-[var(--t-linea)] overflow-hidden rounded-2xl border border-[var(--t-linea)] bg-[var(--t-fondo)]">
              {atendidos.map((t) => (
                <li key={t.id}>
                  <FilaTurno t={t} onAbrir={onAbrir} />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {manana.length > 0 ? (
        <p className="mt-6 text-[0.8125rem] text-[var(--t-gris)]">
          {PANEL_TURNOS.manana(manana.length, aHhmm(Math.min(...manana.map((t) => t.inicio))))}
        </p>
      ) : null}
    </>
  );
}

function Insignia({
  children,
  tono,
}: {
  children: ReactNode;
  tono: 'verde' | 'ambar' | 'rojo' | 'gris';
}) {
  return (
    <span
      className={cn(
        'rounded-md px-1.5 py-0.5 text-[0.6875rem] font-semibold',
        tono === 'verde' && 'bg-[var(--t-verde-suave)] text-[var(--t-verde)]',
        tono === 'ambar' && 'bg-[var(--t-ambar-suave)] text-[var(--t-ambar)]',
        tono === 'rojo' && 'bg-[var(--t-rojo-suave)] text-[var(--t-rojo)]',
        tono === 'gris' && 'bg-[var(--t-suave)] text-[var(--t-gris)]',
      )}
    >
      {children}
    </span>
  );
}

function insignias(t: Vista) {
  const lista: { texto: string; tono: 'verde' | 'ambar' | 'rojo' | 'gris' }[] = [];
  if (t.nueva) lista.push({ texto: PANEL_TURNOS.nueva, tono: 'verde' });
  if (t.estado === 'pendiente_pago')
    lista.push({ texto: ESTADOS_TURNO.pendiente_pago, tono: 'ambar' });
  if (t.estado === 'completado' && t.cobrado != null)
    lista.push({ texto: PANEL_TURNOS.cobrado, tono: 'verde' });
  if (t.estado === 'ausente') lista.push({ texto: ESTADOS_TURNO.ausente, tono: 'rojo' });
  if (t.estado === 'conflicto_pago')
    lista.push({ texto: ESTADOS_TURNO.conflicto_pago, tono: 'rojo' });
  if (t.estado === 'cancelado') lista.push({ texto: ESTADOS_TURNO.cancelado, tono: 'gris' });
  if (t.senaEstado === 'no_aplica' && t.estado === 'confirmado')
    lista.push({ texto: PANEL_TURNOS.sinSena, tono: 'gris' });
  return lista;
}

function FilaTurno({
  t,
  onAbrir,
  extra,
}: {
  t: Vista;
  onAbrir: (t: Turno) => void;
  extra?: string;
}) {
  const p = getProfesional(t.profesionalId);
  return (
    <button
      type="button"
      onClick={() => onAbrir(t)}
      className="flex min-h-16 w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[var(--t-suave)]"
    >
      <span className="w-11 shrink-0 text-[0.875rem] font-semibold tabular-nums">
        {aHhmm(t.inicio)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-[0.875rem] font-semibold">{t.cliente}</span>
          {insignias(t).map((i) => (
            <Insignia key={i.texto} tono={i.tono}>
              {i.texto}
            </Insignia>
          ))}
        </span>
        <span className="block text-[0.75rem] text-[var(--t-gris)]">
          {t.servicioNombre}
          {p ? ` · ${p.nombre}` : ''}
          {extra ? ` · ${extra}` : ''}
        </span>
      </span>
    </button>
  );
}

/* ---------------- Agenda ---------------- */

function Agenda({
  e,
  turnos,
  onAbrir,
}: {
  e: EstadoDemo;
  turnos: Vista[];
  onAbrir: (t: Turno) => void;
}) {
  const [dia, setDia] = useState(0);
  const [prof, setProf] = useState<string | null>(null);
  const visibles = (t: Vista) =>
    t.estado !== 'cancelado' && t.estado !== 'expirado' && t.estado !== 'conflicto_pago';
  const delDia = turnos
    .filter((t) => t.dia === dia && visibles(t) && (!prof || t.profesionalId === prof))
    .sort((a, b) => a.inicio - b.inicio);
  const senas = delDia.filter((t) => t.senaEstado === 'pagada').reduce((s, t) => s + t.sena, 0);
  const p = prof ? getProfesional(prof) : undefined;

  type Item =
    | { tipo: 'turno'; inicio: number; t: Vista }
    | { tipo: 'libre'; inicio: number; fin: number }
    | { tipo: 'bloqueo'; inicio: number; fin: number | null; motivo: string };
  const items: Item[] = delDia.map((t) => ({ tipo: 'turno', inicio: t.inicio, t }));
  const bloqueosDia = e.bloqueos.filter(
    (b) => b.dia === dia && (!p || !b.profesionalId || b.profesionalId === p.id),
  );
  for (const b of bloqueosDia)
    items.push({ tipo: 'bloqueo', inicio: b.inicio ?? 0, fin: b.fin, motivo: b.motivo });
  if (p && !bloqueosDia.some((b) => b.inicio === null)) {
    const ocupados = [
      ...delDia.map((t) => ({ inicioMin: t.inicio, finMin: t.fin })),
      ...bloqueosDia.map((b) => ({ inicioMin: b.inicio!, finMin: b.fin! })),
    ];
    for (const h of huecosLibres(franjasDe(p, dia), ocupados))
      items.push({ tipo: 'libre', inicio: h.inicioMin, fin: h.finMin });
  }
  items.sort((a, b) => a.inicio - b.inicio);
  const cerrado = PROFESIONALES_DEMO.every((x) => franjasDe(x, dia).length === 0);

  return (
    <>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }, (_, d) => {
          const n = turnos.filter((t) => t.dia === d && visibles(t)).length;
          const f = fechaDe(d);
          return (
            <button
              key={d}
              type="button"
              aria-pressed={d === dia}
              onClick={() => setDia(d)}
              className="flex h-16 flex-col items-center justify-center rounded-xl text-[0.6875rem] font-medium aria-pressed:bg-[var(--t-tinta)] aria-pressed:text-[var(--t-fondo)]"
            >
              <span className="opacity-70">
                {d === 0 ? FECHAS.hoy : d === 1 ? FECHAS.mananaCorto : DIAS_CORTO[f.getDay()]}
              </span>
              <span className="text-[1rem] font-bold tabular-nums">{f.getDate()}</span>
              <span className="tabular-nums">{n > 0 ? n : '·'}</span>
            </button>
          );
        })}
      </div>
      <div role="group" aria-label={PANEL_TURNOS.agenda.filtroAria} className="mt-3 flex gap-1.5">
        {[{ id: null, nombre: PANEL_TURNOS.agenda.todos }, ...PROFESIONALES_DEMO].map((x) => (
          <button
            key={x.id ?? 'todos'}
            type="button"
            aria-pressed={prof === x.id}
            onClick={() => setProf(x.id)}
            className="rounded-full border border-[var(--t-linea)] bg-[var(--t-fondo)] px-3 py-1.5 text-[0.75rem] font-semibold aria-pressed:border-[var(--t-tinta)] aria-pressed:bg-[var(--t-tinta)] aria-pressed:text-[var(--t-fondo)]"
          >
            {x.nombre}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[0.9375rem] font-bold first-letter:uppercase">
        {FECHAS.dia(
          DIAS_LARGO[fechaDe(dia).getDay()]!,
          fechaDe(dia).getDate(),
          MESES[fechaDe(dia).getMonth()]!,
        )}
      </p>
      <p className="text-[0.75rem] text-[var(--t-gris)]">
        {cerrado
          ? PANEL_TURNOS.agenda.cerrado
          : PANEL_TURNOS.agenda.resumen(delDia.length, pesos(senas))}
      </p>
      {items.length > 0 ? (
        <ul className="mt-3 divide-y divide-[var(--t-linea)] overflow-hidden rounded-2xl border border-[var(--t-linea)] bg-[var(--t-fondo)]">
          {items.map((it) => (
            <li key={`${it.tipo}${it.inicio}${it.tipo === 'turno' ? it.t.id : ''}`}>
              {it.tipo === 'turno' ? (
                <FilaTurno t={it.t} onAbrir={onAbrir} />
              ) : (
                <div className="flex min-h-12 items-center gap-3 px-3.5 py-2 text-[0.8125rem] text-[var(--t-gris)]">
                  <span className="w-11 shrink-0 tabular-nums">{aHhmm(it.inicio)}</span>
                  {it.tipo === 'libre'
                    ? PANEL_TURNOS.agenda.libre(aHhmm(it.fin))
                    : it.fin == null
                      ? PANEL_TURNOS.agenda.bloqueadoDia(it.motivo)
                      : PANEL_TURNOS.agenda.bloqueado(aHhmm(it.fin), it.motivo)}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

/* ---------------- Hojas ---------------- */

function Hoja({
  titulo,
  onCerrar,
  children,
}: {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const tecla = (ev: KeyboardEvent) => ev.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onCerrar]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      className="absolute inset-0 z-20 flex items-end bg-[var(--t-tinta)]/40"
      onClick={(ev) => ev.target === ev.currentTarget && onCerrar()}
    >
      <div className="t-entra max-h-[92%] w-full overflow-y-auto rounded-t-2xl bg-[var(--t-fondo)] px-4 pt-2 pb-5">
        <span
          aria-hidden="true"
          className="mx-auto block h-1 w-10 rounded-full bg-[var(--t-linea)]"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[1.0625rem] font-bold">{titulo}</p>
          <button
            type="button"
            onClick={onCerrar}
            aria-label={HOJA_TURNO.cerrar}
            className="grid size-11 place-items-center rounded-full hover:bg-[var(--t-suave)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function HojaTurno({
  t,
  ahora,
  faltas,
  onAtendido,
  onNoVino,
  onCancelar,
  onRestaurar,
  onDevolver,
}: {
  t: Vista;
  ahora: number;
  faltas: readonly Turno[];
  onAtendido: () => void;
  onNoVino: () => void;
  onCancelar: () => void;
  onRestaurar: () => void;
  onDevolver: () => void;
}) {
  const [pregunta, setPregunta] = useState<'cancelar' | 'devolver'>();
  const yaEmpezo = t.dia === 0 && t.inicio <= ahora;
  const puedeDevolver =
    t.senaEstado === 'pagada' &&
    (t.estado === 'cancelado' || t.estado === 'conflicto_pago' || t.estado === 'ausente');
  const boton = 'h-11 rounded-xl text-[0.8125rem] font-semibold';
  return (
    <>
      <div className="mt-1 flex flex-wrap gap-1.5">
        <Insignia
          tono={
            t.estado === 'confirmado' || t.estado === 'completado'
              ? 'verde'
              : t.estado === 'pendiente_pago'
                ? 'ambar'
                : 'rojo'
          }
        >
          {ESTADOS_TURNO[t.estado]}
        </Insignia>
        <Insignia tono={t.senaEstado === 'pagada' ? 'verde' : 'gris'}>
          {ESTADOS_SENA[t.senaEstado]}
        </Insignia>
      </div>
      {faltas.length > 0 ? (
        <p className="mt-3 rounded-lg bg-[var(--t-rojo-suave)] px-3 py-2 text-[0.75rem] font-medium text-[var(--t-rojo)]">
          {HOJA_TURNO.faltas(faltas.length, diaCorto(faltas[0]!.dia))}
        </p>
      ) : null}
      <dl className="mt-3 divide-y divide-[var(--t-linea)] border-y border-[var(--t-linea)] text-[0.8125rem]">
        {[
          [HOJA_TURNO.cuando, fechaLarga(t.dia, t.inicio)],
          [HOJA_TURNO.servicio, t.servicioNombre],
          [HOJA_TURNO.profesional, getProfesional(t.profesionalId)?.nombre ?? ''],
          [HOJA_TURNO.precio, pesos(t.precio)],
          [HOJA_TURNO.sena, `${pesos(t.sena)} · ${ESTADOS_SENA[t.senaEstado]}`],
          [HOJA_TURNO.aCobrar, pesos(saldoDe(t))],
          ...(t.nota ? [[HOJA_TURNO.nota, t.nota]] : []),
          ...(NOTAS_CLIENTES[t.cliente]
            ? [[HOJA_TURNO.sobreCliente, NOTAS_CLIENTES[t.cliente]!]]
            : []),
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2">
            <dt className="text-[var(--t-gris)]">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-2 text-[0.75rem] text-[var(--t-gris)]">{HOJA_TURNO.origen[t.origen]}</p>
      {pregunta ? (
        <div className="mt-4 rounded-xl bg-[var(--t-suave)] p-3.5">
          <p className="text-[0.8125rem]">
            {pregunta === 'cancelar'
              ? HOJA_TURNO.cancelarPregunta(t.cliente, pesos(t.sena))
              : HOJA_TURNO.devolverPregunta(t.cliente.split(' ')[0]!, pesos(t.sena))}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={pregunta === 'cancelar' ? onCancelar : onDevolver}
              className={cn(boton, 'bg-[var(--t-rojo)] text-white')}
            >
              {pregunta === 'cancelar' ? HOJA_TURNO.siCancelar : HOJA_TURNO.siDevolver}
            </button>
            <button
              type="button"
              onClick={() => setPregunta(undefined)}
              className={cn(boton, 'border border-[var(--t-linea)]')}
            >
              {HOJA_TURNO.no}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {t.estado === 'confirmado' ? (
            <>
              <button
                type="button"
                onClick={onAtendido}
                className={cn(boton, 'bg-[var(--t-tinta)] text-[var(--t-fondo)]')}
              >
                {HOJA_TURNO.atendido}
              </button>
              {yaEmpezo ? (
                <button
                  type="button"
                  onClick={onNoVino}
                  className={cn(boton, 'border border-[var(--t-linea)]')}
                >
                  {HOJA_TURNO.noVino}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setPregunta('cancelar')}
                className={cn(boton, 'col-span-2 text-[var(--t-rojo)]')}
              >
                {HOJA_TURNO.cancelar}
              </button>
            </>
          ) : null}
          {(t.estado === 'completado' ||
            t.estado === 'ausente' ||
            (t.estado === 'cancelado' && t.senaEstado !== 'devuelta')) &&
          !t.cierreAuto ? (
            <button
              type="button"
              onClick={onRestaurar}
              className={cn(boton, 'col-span-2 border border-[var(--t-linea)]')}
            >
              {HOJA_TURNO.restaurar}
            </button>
          ) : null}
          {puedeDevolver ? (
            <button
              type="button"
              onClick={() => setPregunta('devolver')}
              className={cn(boton, 'col-span-2 border border-[var(--t-linea)]')}
            >
              {HOJA_TURNO.devolver(pesos(t.sena))}
            </button>
          ) : null}
        </div>
      )}
    </>
  );
}

function Cobro({
  t,
  onListo,
}: {
  t: Vista;
  onListo: (c: { monto: number; medio: Medio } | null) => void;
}) {
  const saldo = saldoDe(t);
  const [monto, setMonto] = useState(String(saldo));
  const [medio, setMedio] = useState<Medio>('efectivo');
  const valor = Math.max(0, Number(monto.replace(/\D/g, '')) || 0);
  if (saldo === 0)
    return (
      <>
        <p className="mt-2 text-[0.875rem] text-[var(--t-gris)]">{COBRO.todoPago}</p>
        <button
          type="button"
          onClick={() => onListo(null)}
          className="mt-4 h-11 w-full rounded-xl bg-[var(--t-tinta)] text-[0.875rem] font-semibold text-[var(--t-fondo)]"
        >
          {COBRO.listo(pesos(0))}
        </button>
      </>
    );
  return (
    <>
      <p className="mt-1 text-[0.875rem]">{COBRO.debe(pesos(saldo))}</p>
      <label className="mt-4 block">
        <span className="text-[0.8125rem] font-semibold">{COBRO.cuanto}</span>
        <input
          inputMode="numeric"
          value={monto}
          onChange={(ev) => setMonto(ev.target.value)}
          className="mt-1 h-11 w-full rounded-lg border border-[var(--t-linea)] px-3 text-[1rem] tabular-nums outline-none focus:border-[var(--t-tinta)]"
        />
        <span className="mt-1 block text-[0.75rem] text-[var(--t-gris)]">{COBRO.ayuda}</span>
      </label>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {(Object.keys(COBRO.medios) as Medio[]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={medio === m}
            onClick={() => setMedio(m)}
            className="h-10 rounded-lg border border-[var(--t-linea)] text-[0.75rem] font-semibold aria-pressed:border-[var(--t-tinta)] aria-pressed:bg-[var(--t-tinta)] aria-pressed:text-[var(--t-fondo)]"
          >
            {COBRO.medios[m]}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onListo({ monto: valor, medio })}
        className="mt-4 h-11 w-full rounded-xl bg-[var(--t-tinta)] text-[0.875rem] font-semibold text-[var(--t-fondo)]"
      >
        {COBRO.listo(pesos(valor))}
      </button>
      <button
        type="button"
        onClick={() => onListo(null)}
        className="mt-2 w-full py-2 text-[0.8125rem] font-medium text-[var(--t-gris)] underline underline-offset-4"
      >
        {COBRO.sinAnotar}
      </button>
    </>
  );
}
