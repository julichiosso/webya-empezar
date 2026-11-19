'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/components/ui/clases';
import { HORARIO_NEGOCIO, NEGOCIO_DEMO, SERVICIOS_DEMO } from '@/content/demos/turnos/datos';
import {
  CHECKOUT,
  DATOS,
  DIAS_CORTO,
  DIAS_LARGO,
  ELEGIR_HORARIO,
  ELEGIR_PROFESIONAL,
  ELEGIR_SERVICIO,
  ESPERA,
  FECHAS,
  MESES,
  MI_RESERVA,
  PASOS,
  PORTADA,
  pesos,
} from '@/content/demos/turnos/ui';
import { crearIcs, descargarIcs } from '@/lib/ics';
import { agruparPorMomento, POCOS_HORARIOS, type Momento } from '@/domain/reservas/disponibilidad';
import {
  aHhmm,
  diaSemana,
  hhmm,
  diasConLugar,
  fechaDe,
  getServicio,
  pagar,
  primerLibre,
  profesionalesDe,
  reservar,
  saldoDe,
  senaDe,
  soltar,
  vistaTurno,
  type EstadoDemo,
  type StoreDemo,
  type Turno,
} from './store';

type Pantalla =
  | 'inicio'
  | 'profesional'
  | 'horario'
  | 'datos'
  | 'reservando'
  | 'checkout'
  | 'confirmando'
  | 'reserva';

interface Props {
  e: EstadoDemo;
  ahora: number;
  ahoraReal: number;
  /** Lo que se adelantó el reloj de la demo (ms): la hora "real" de la demo es Date.now() + desfase. */
  desfase: number;
  set: StoreDemo['set'];
  onConfirmado: (t: Turno) => void;
  onVerPanel: () => void;
}

export const etiquetaDia = (dia: number) =>
  dia === 0
    ? FECHAS.hoy
    : dia === 1
      ? FECHAS.manana
      : `${DIAS_CORTO[diaSemana(dia)]} ${fechaDe(dia).getDate()}`;

export const fechaLarga = (dia: number, inicio: number) => {
  const f = fechaDe(dia);
  return FECHAS.largo(DIAS_LARGO[f.getDay()]!, f.getDate(), MESES[f.getMonth()]!, aHhmm(inicio));
};

/** El turnero que ve el cliente, como el del sistema real, con el pago de la seña simulado. */
export function AppReserva({ e, ahora, ahoraReal, desfase, set, onConfirmado, onVerPanel }: Props) {
  const [pantalla, setPantalla] = useState<Pantalla>('inicio');
  const [servicioId, setServicioId] = useState<string>();
  const [profesionalId, setProfesionalId] = useState<string | null>(null);
  const [eleccion, setEleccion] = useState<{ dia: number; inicio: number }>();
  const [aviso, setAviso] = useState<string>();
  const [turnoId, setTurnoId] = useState<number>();
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [pantalla]);

  const servicio = servicioId ? getServicio(servicioId) : undefined;
  const turno = turnoId != null ? e.turnos.find((t) => t.id === turnoId) : undefined;

  const elegirServicio = (id: string) => {
    setServicioId(id);
    setProfesionalId(null);
    setEleccion(undefined);
    setAviso(undefined);
    setPantalla(profesionalesDe(id).length > 1 ? 'profesional' : 'horario');
  };
  const irADatos = (dia: number, inicio: number) => {
    setEleccion({ dia, inicio });
    setPantalla('datos');
  };
  const reiniciarFlujo = () => {
    setTurnoId(undefined);
    setEleccion(undefined);
    setServicioId(undefined);
    setPantalla('inicio');
  };
  const volver = () =>
    setPantalla((p) =>
      p === 'datos'
        ? 'horario'
        : p === 'horario'
          ? servicioId && profesionalesDe(servicioId).length > 1
            ? 'profesional'
            : 'inicio'
          : 'inicio',
    );

  const paso = { inicio: 0, profesional: 1, horario: 1, datos: 2 }[pantalla as 'inicio'];

  return (
    <div className="t-app relative h-full overflow-hidden">
      <div
        ref={scroller}
        className="d-sin-barra absolute inset-0 overflow-y-auto overscroll-contain"
      >
        {pantalla === 'reservando' || pantalla === 'confirmando' ? (
          <Espera
            titulo={pantalla === 'reservando' ? ESPERA.reservando : ESPERA.confirmando}
            texto={pantalla === 'reservando' ? ESPERA.reservandoTexto : ESPERA.confirmandoTexto}
          />
        ) : pantalla === 'checkout' && turno ? (
          <Checkout
            turno={turno}
            onAprobado={() => {
              setPantalla('confirmando');
              setTimeout(() => {
                set((x) => pagar(x, turno.id, Date.now() + desfase));
                setPantalla('reserva');
                onConfirmado(turno);
              }, 1800);
            }}
            onRechazado={() => setPantalla('reserva')}
          />
        ) : pantalla === 'reserva' && turno ? (
          <MiReserva
            turno={vistaTurno(turno, ahora, ahoraReal)}
            ahora={ahora}
            ahoraReal={ahoraReal}
            desfase={desfase}
            onPagar={() => setPantalla('checkout')}
            onSoltar={() => set((x) => soltar(x, turno.id))}
            onOtro={reiniciarFlujo}
            onVerPanel={onVerPanel}
          />
        ) : (
          <>
            {pantalla === 'inicio' ? <Portada ahora={ahora} /> : <BarraNegocio onVolver={volver} />}
            <Progreso paso={paso ?? 0} onIr={(i) => i === 0 && setPantalla('inicio')} />
            <div className="px-5 pt-5 pb-10">
              {pantalla === 'inicio' && (
                <Servicios
                  e={e}
                  ahora={ahora}
                  ahoraReal={ahoraReal}
                  onElegir={elegirServicio}
                  onDeSiempre={(id, d) => {
                    setServicioId(id);
                    setProfesionalId(null);
                    irADatos(d.dia, d.inicio);
                  }}
                />
              )}
              {pantalla === 'profesional' && servicio && (
                <Profesionales
                  e={e}
                  servicioId={servicio.id}
                  ahora={ahora}
                  ahoraReal={ahoraReal}
                  elegido={profesionalId}
                  onElegir={(id) => {
                    setProfesionalId(id);
                    setPantalla('horario');
                  }}
                />
              )}
              {pantalla === 'horario' && servicio && (
                <Horarios
                  e={e}
                  servicioId={servicio.id}
                  profesionalId={profesionalId}
                  ahora={ahora}
                  ahoraReal={ahoraReal}
                  aviso={aviso}
                  onElegir={irADatos}
                />
              )}
              {pantalla === 'datos' && servicio && eleccion && (
                <Datos
                  e={e}
                  servicioId={servicio.id}
                  eleccion={eleccion}
                  onPagar={(datos) => {
                    const r = reservar(
                      e,
                      { servicioId: servicio.id, profesionalId, ...eleccion, ...datos },
                      ahora,
                      ahoraReal,
                    );
                    if (r === 'ocupado') {
                      setAviso(ELEGIR_HORARIO.ocupado);
                      setPantalla('horario');
                      return;
                    }
                    set(() => r.estado);
                    setTurnoId(r.turno.id);
                    setPantalla('reservando');
                    setTimeout(() => setPantalla('checkout'), 900);
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Partes ---------------- */

function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center rounded-lg bg-[var(--t-tinta)] font-semibold text-[var(--t-fondo)]',
        className,
      )}
    >
      {NEGOCIO_DEMO.inicial}
    </span>
  );
}

/** "Abierto · hasta las 20:00" o cuándo abre, mirando solo el horario semanal (como el real). */
function estadoApertura(ahora: number) {
  const franjas = (dia: number) =>
    HORARIO_NEGOCIO.filter((f) => f.dia === diaSemana(dia)).map((f) => ({
      inicio: hhmm(f.inicio),
      fin: hhmm(f.fin),
    }));
  const hoy = franjas(0);
  const abierta = hoy.find((f) => f.inicio <= ahora && ahora < f.fin);
  if (abierta) return { abierto: true, texto: PORTADA.abierto(aHhmm(abierta.fin)) };
  const luego = hoy.find((f) => f.inicio > ahora);
  if (luego) return { abierto: false, texto: PORTADA.cerradoHoy(aHhmm(luego.inicio)) };
  for (let d = 1; d <= 7; d++) {
    const f = franjas(d)[0];
    if (!f) continue;
    return {
      abierto: false,
      texto:
        d === 1
          ? PORTADA.cerradoManana(aHhmm(f.inicio))
          : PORTADA.cerradoDia(DIAS_LARGO[diaSemana(d)]!, aHhmm(f.inicio)),
    };
  }
  return { abierto: false, texto: '' };
}

function Portada({ ahora }: { ahora: number }) {
  const estado = estadoApertura(ahora);
  return (
    <header className="border-b border-[var(--t-linea)] px-5 pt-5 pb-5">
      <div className="flex items-center gap-3.5">
        <Logo className="size-16 rounded-2xl text-[1.5rem]" />
        <div className="min-w-0">
          <p className="truncate text-[1.375rem] leading-tight font-semibold tracking-tight">
            {NEGOCIO_DEMO.nombre}
          </p>
          <p className="mt-0.5 text-[0.8125rem] text-[var(--t-gris)]">{NEGOCIO_DEMO.direccion}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[0.8125rem] font-medium">
            <span
              className={cn(
                'size-1.5 rounded-full',
                estado.abierto ? 't-late bg-[var(--t-verde-punto)]' : 'bg-[var(--t-gris)]',
              )}
            />
            {estado.texto}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[0.8125rem] text-[var(--t-tinta-2)]">{NEGOCIO_DEMO.descripcion}</p>
      <ul className="mt-4 grid grid-cols-4 divide-x divide-[var(--t-linea)] rounded-2xl border border-[var(--t-linea)]">
        {PORTADA.acciones.map((a, i) => (
          <li
            key={a}
            className="flex h-14 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium"
          >
            <span className={i === 0 ? 'text-[var(--t-whatsapp)]' : undefined}>
              <IconoAccion i={i} />
            </span>
            {a}
          </li>
        ))}
      </ul>
    </header>
  );
}

function IconoAccion({ i }: { i: number }) {
  const d = [
    'M4 20l1.3-3.9A8 8 0 1 1 8 19.3z',
    'M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10zm0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    'M12 3v12M7 8l5-5 5 5M5 13v6h14v-6',
  ][i];
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[1.125rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function BarraNegocio({ onVolver }: { onVolver: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--t-linea)] bg-[var(--t-fondo)] px-3 py-2.5">
      <button
        type="button"
        onClick={onVolver}
        aria-label={PASOS.volver}
        className="grid size-10 place-items-center rounded-full hover:bg-[var(--t-suave)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <Logo className="size-8 rounded-lg text-[0.6875rem]" />
      <p className="text-[0.9375rem] font-semibold">{NEGOCIO_DEMO.nombre}</p>
    </div>
  );
}

function Progreso({ paso, onIr }: { paso: number; onIr: (i: number) => void }) {
  return (
    <ol aria-label={PASOS.aria} className="grid grid-cols-3 gap-2 px-5 pt-4">
      {PASOS.nombres.map((n, i) => (
        <li key={n}>
          <button
            type="button"
            disabled={i >= paso}
            onClick={() => onIr(i)}
            aria-current={i === paso ? 'step' : undefined}
            className="w-full text-left disabled:cursor-default"
          >
            <span
              className={cn(
                'block h-1 rounded-full',
                i <= paso ? 'bg-[var(--t-tinta)]' : 'bg-[var(--t-linea)]',
              )}
            />
            <span
              className={cn(
                'mt-1.5 block text-[0.6875rem] font-medium',
                i <= paso ? 'text-[var(--t-tinta)]' : 'text-[var(--t-gris)]',
              )}
            >
              {i + 1}. {n}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function Titulo({ children, bajada }: { children: ReactNode; bajada?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-[1.375rem] leading-tight font-bold tracking-tight">{children}</h2>
      {bajada ? <p className="mt-1 text-[0.8125rem] text-[var(--t-gris)]">{bajada}</p> : null}
    </div>
  );
}

function Pastilla({ children, tono = 'verde' }: { children: ReactNode; tono?: 'verde' | 'gris' }) {
  return (
    <span
      className={cn(
        't-entra inline-block rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold',
        tono === 'verde'
          ? 'bg-[var(--t-verde-suave)] text-[var(--t-verde)]'
          : 'bg-[var(--t-suave)] text-[var(--t-gris)]',
      )}
    >
      {children}
    </span>
  );
}

function Servicios({
  e,
  ahora,
  ahoraReal,
  onElegir,
  onDeSiempre,
}: {
  e: EstadoDemo;
  ahora: number;
  ahoraReal: number;
  onElegir: (id: string) => void;
  onDeSiempre: (id: string, d: { dia: number; inicio: number }) => void;
}) {
  const r = e.recordado;
  const deSiempre = r ? primerLibre(e, r.servicioId, null, ahora, ahoraReal) : null;
  return (
    <>
      <Titulo bajada={ELEGIR_SERVICIO.bajada}>{ELEGIR_SERVICIO.titulo}</Titulo>
      {r && deSiempre ? (
        <div className="t-entra mb-4 rounded-2xl bg-[var(--t-tinta)] p-4 text-[var(--t-fondo)]">
          <p className="text-[0.9375rem] font-semibold">
            {ELEGIR_SERVICIO.deSiempre(r.nombre.split(' ')[0]!)}
          </p>
          <p className="mt-0.5 text-[0.8125rem] opacity-75">
            {getServicio(r.servicioId)?.nombre} ·{' '}
            {FECHAS.momento(etiquetaDia(deSiempre.dia), aHhmm(deSiempre.inicio))}
          </p>
          <button
            type="button"
            onClick={() => onDeSiempre(r.servicioId, deSiempre)}
            className="mt-3 rounded-full bg-[var(--t-fondo)] px-4 py-2 text-[0.8125rem] font-semibold text-[var(--t-tinta)]"
          >
            {ELEGIR_SERVICIO.reservar}
          </button>
        </div>
      ) : null}
      <ul className="divide-y divide-[var(--t-linea)] overflow-hidden rounded-2xl border border-[var(--t-linea)]">
        {SERVICIOS_DEMO.map((s, i) => {
          const libre = primerLibre(e, s.id, null, ahora, ahoraReal);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onElegir(s.id)}
                className="group relative flex min-h-[4.5rem] w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--t-suave)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-3 left-0 w-[3px] origin-center scale-y-0 rounded-r bg-[var(--t-tinta)] transition-transform group-hover:scale-y-100"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-semibold">{s.nombre}</span>
                  <span className="block text-[0.75rem] text-[var(--t-gris)]">
                    {s.descripcion} · {ELEGIR_SERVICIO.minutos(s.duracionMin)}
                  </span>
                  <span className="mt-1.5 block" style={{ animationDelay: `${i * 70}ms` }}>
                    {libre ? (
                      <Pastilla>
                        {FECHAS.momento(etiquetaDia(libre.dia), aHhmm(libre.inicio))}
                      </Pastilla>
                    ) : (
                      <Pastilla tono="gris">{ELEGIR_SERVICIO.sinLugar}</Pastilla>
                    )}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[0.9375rem] font-semibold tabular-nums">
                    {pesos(s.precio)}
                  </span>
                  <span className="block text-[0.6875rem] text-[var(--t-gris)]">
                    {ELEGIR_SERVICIO.sena(pesos(senaDe(s)))}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-center text-[0.625rem] tracking-[0.2em] text-[var(--t-gris)] uppercase">
        {PORTADA.firma}
      </p>
    </>
  );
}

function Profesionales({
  e,
  servicioId,
  ahora,
  ahoraReal,
  elegido,
  onElegir,
}: {
  e: EstadoDemo;
  servicioId: string;
  ahora: number;
  ahoraReal: number;
  elegido: string | null;
  onElegir: (id: string | null) => void;
}) {
  const opciones: { id: string | null; nombre: string; inicial: string; color?: string }[] = [
    { id: null, nombre: ELEGIR_PROFESIONAL.cualquiera, inicial: '' },
    ...profesionalesDe(servicioId).map((p) => ({
      id: p.id,
      nombre: p.nombre,
      inicial: p.iniciales,
      color: p.color,
    })),
  ];
  return (
    <>
      <Titulo>{ELEGIR_PROFESIONAL.titulo}</Titulo>
      <ul className="grid grid-cols-2 gap-2.5">
        {opciones.map((o) => {
          const libre = primerLibre(e, servicioId, o.id, ahora, ahoraReal);
          return (
            <li key={o.id ?? 'cualquiera'}>
              <button
                type="button"
                aria-pressed={elegido === o.id}
                onClick={() => onElegir(o.id)}
                className="flex h-full w-full flex-col items-start gap-2 rounded-2xl border border-[var(--t-linea)] p-3.5 text-left hover:border-[var(--t-tinta)] aria-pressed:border-[var(--t-tinta)]"
              >
                <span
                  style={o.color ? { background: o.color, color: 'var(--t-fondo)' } : undefined}
                  className="grid size-10 place-items-center rounded-full bg-[var(--t-suave)] text-[0.875rem] font-semibold"
                >
                  {o.inicial || <Estrellita />}
                </span>
                <span className="text-[0.9375rem] font-semibold">{o.nombre}</span>
                {o.id === null ? (
                  <span className="text-[0.75rem] text-[var(--t-gris)]">
                    {ELEGIR_PROFESIONAL.cualquieraTexto}
                  </span>
                ) : null}
                {libre ? (
                  <Pastilla>{FECHAS.momento(etiquetaDia(libre.dia), aHhmm(libre.inicio))}</Pastilla>
                ) : (
                  <Pastilla tono="gris">{ELEGIR_SERVICIO.sinLugar}</Pastilla>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Estrellita() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="3.5" />
      <circle cx="16" cy="11" r="2.8" />
      <path
        d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M14 15.2c2.6-.4 5 .9 5.8 3.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Horarios({
  e,
  servicioId,
  profesionalId,
  ahora,
  ahoraReal,
  aviso,
  onElegir,
}: {
  e: EstadoDemo;
  servicioId: string;
  profesionalId: string | null;
  ahora: number;
  ahoraReal: number;
  aviso?: string;
  onElegir: (dia: number, inicio: number) => void;
}) {
  const dias = diasConLugar(e, servicioId, profesionalId, ahora, ahoraReal);
  const [dia, setDia] = useState<number>();
  const [marcado, setMarcado] = useState<number>();
  const elegido = dias.find((d) => d.dia === dia) ?? dias[0];
  const cercano = dias[0] ? { dia: dias[0].dia, inicio: dias[0].slots[0]! } : null;

  if (!cercano || !elegido)
    return (
      <>
        <Titulo>{ELEGIR_HORARIO.titulo}</Titulo>
        <p className="text-[0.875rem] text-[var(--t-gris)]">{ELEGIR_HORARIO.sinHorarios}</p>
      </>
    );

  const grupos = agruparPorMomento(elegido.slots);
  const pocos = elegido.slots.length <= POCOS_HORARIOS;
  return (
    <>
      <Titulo>{ELEGIR_HORARIO.titulo}</Titulo>
      {aviso ? (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-[var(--t-rojo-suave)] px-3.5 py-2.5 text-[0.8125rem] font-medium text-[var(--t-rojo)]"
        >
          {aviso}
        </p>
      ) : null}
      <div className="rounded-2xl bg-[var(--t-tinta)] p-4 text-[var(--t-fondo)]">
        <p className="flex items-center gap-2 text-[0.75rem] font-medium opacity-80">
          <span className="t-late size-1.5 rounded-full bg-[var(--t-verde-punto)]" />
          {ELEGIR_HORARIO.masCercano}
        </p>
        <p className="mt-1.5 text-[1.5rem] leading-tight font-bold tabular-nums">
          {etiquetaDia(cercano.dia)} · {aHhmm(cercano.inicio)}
        </p>
        <button
          type="button"
          onClick={() => onElegir(cercano.dia, cercano.inicio)}
          className="mt-3 rounded-full bg-[var(--t-fondo)] px-4 py-2 text-[0.8125rem] font-semibold text-[var(--t-tinta)]"
        >
          {ELEGIR_HORARIO.reservar}
        </button>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <p className="text-[0.9375rem] font-semibold">{ELEGIR_HORARIO.elegi}</p>
        <p className="text-[0.75rem] text-[var(--t-gris)]">
          {ELEGIR_HORARIO.diasConLugar(dias.length)}
        </p>
      </div>
      <div className="d-sin-barra -mx-5 mt-3 flex gap-2 overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_1.25rem,#000_calc(100%-1.25rem),transparent)] px-5">
        {dias.map((d) => {
          const f = fechaDe(d.dia);
          return (
            <button
              key={d.dia}
              type="button"
              aria-pressed={d.dia === elegido.dia}
              onClick={() => setDia(d.dia)}
              className="t-elegible relative flex h-[4.25rem] w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[var(--t-linea)] aria-pressed:border-[var(--t-tinta)] aria-pressed:bg-[var(--t-tinta)] aria-pressed:text-[var(--t-fondo)]"
            >
              <span className="text-[0.6875rem] font-medium">
                {d.dia === 0
                  ? FECHAS.hoy
                  : d.dia === 1
                    ? FECHAS.mananaCorto
                    : DIAS_CORTO[f.getDay()]}
              </span>
              <span className="text-[1.125rem] leading-tight font-bold tabular-nums">
                {f.getDate()}
              </span>
              {d.slots.length <= POCOS_HORARIOS ? (
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[var(--t-ambar-punto)]" />
              ) : null}
            </button>
          );
        })}
      </div>
      {pocos ? (
        <p className="mt-3 text-[0.75rem] font-semibold text-[var(--t-ambar)]">
          {ELEGIR_HORARIO.quedan(elegido.slots.length)}
        </p>
      ) : null}
      {(Object.keys(grupos) as Momento[])
        .filter((m) => grupos[m].length > 0)
        .map((m) => (
          <div key={m} className="mt-4">
            <p className="text-[0.75rem] font-semibold text-[var(--t-gris)]">
              {ELEGIR_HORARIO.momentos[m]}
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {grupos[m].map((s, i) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={marcado === s}
                  onClick={() => {
                    setMarcado(s);
                    setTimeout(() => onElegir(elegido.dia, s), 160);
                  }}
                  style={{ animationDelay: `${i * 16}ms` }}
                  className="t-entra t-elegible h-11 rounded-xl border border-[var(--t-linea)] text-[0.875rem] font-semibold tabular-nums hover:border-[var(--t-tinta)] aria-pressed:bg-[var(--t-tinta)] aria-pressed:text-[var(--t-fondo)]"
                >
                  {aHhmm(s)}
                </button>
              ))}
            </div>
          </div>
        ))}
    </>
  );
}

function Datos({
  e,
  servicioId,
  eleccion,
  onPagar,
}: {
  e: EstadoDemo;
  servicioId: string;
  eleccion: { dia: number; inicio: number };
  onPagar: (d: { nombre: string; telefono: string; correo: string; nota: string }) => void;
}) {
  const s = getServicio(servicioId)!;
  const r = e.recordado;
  const id = useId();
  const [nombre, setNombre] = useState(r?.nombre ?? '');
  const [telefono, setTelefono] = useState(r?.telefono ?? '');
  const [correo, setCorreo] = useState(r?.correo ?? '');
  const [nota, setNota] = useState('');
  const [errores, setErrores] = useState<Partial<Record<'nombre' | 'telefono' | 'correo', string>>>(
    {},
  );
  const f = fechaDe(eleccion.dia);
  const sena = senaDe(s);

  const enviar = () => {
    const err: typeof errores = {};
    if (!nombre.trim()) err.nombre = DATOS.errores.nombre;
    if (telefono.replace(/\D/g, '').length < 8) err.telefono = DATOS.errores.telefono;
    if (!correo.trim()) err.correo = DATOS.errores.correo;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()))
      err.correo = DATOS.errores.correoMal;
    setErrores(err);
    if (Object.keys(err).length === 0)
      onPagar({ nombre, telefono, correo: correo.trim(), nota: nota.trim() });
  };

  const campo = (
    clave: 'nombre' | 'telefono' | 'correo',
    etiqueta: string,
    valor: string,
    cambiar: (v: string) => void,
    extra: { ayuda?: string; ejemplo?: string; tipo?: string; ac: string },
  ) => (
    <label htmlFor={`${id}-${clave}`} className="block">
      <span className="text-[0.8125rem] font-semibold">{etiqueta}</span>
      <input
        id={`${id}-${clave}`}
        value={valor}
        type={extra.tipo ?? 'text'}
        inputMode={clave === 'telefono' ? 'tel' : undefined}
        autoComplete={extra.ac}
        placeholder={extra.ejemplo}
        aria-invalid={Boolean(errores[clave])}
        onChange={(ev) => cambiar(ev.target.value)}
        className="mt-1 h-11 w-full rounded-lg border border-[var(--t-linea-2)] bg-[var(--t-fondo)] px-3 text-[1rem] outline-none focus:border-[var(--t-tinta)] aria-invalid:border-[var(--t-rojo)]"
      />
      {errores[clave] ? (
        <span className="mt-1 block text-[0.75rem] font-medium text-[var(--t-rojo)]">
          {errores[clave]}
        </span>
      ) : extra.ayuda ? (
        <span className="mt-1 block text-[0.75rem] text-[var(--t-gris)]">{extra.ayuda}</span>
      ) : null}
    </label>
  );

  return (
    <>
      <Titulo bajada={r ? DATOS.hola(r.nombre.split(' ')[0]!) : undefined}>{DATOS.titulo}</Titulo>
      <div className="rounded-2xl border border-[var(--t-linea)] p-3.5">
        <div className="flex items-center gap-3">
          <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[var(--t-tinta)] leading-none text-[var(--t-fondo)]">
            <span className="text-center">
              <span className="block text-[0.6875rem] font-medium opacity-75">
                {MESES[f.getMonth()]!.slice(0, 3)}
              </span>
              <span className="block text-[1.25rem] font-bold">{f.getDate()}</span>
            </span>
          </span>
          <span className="min-w-0">
            <span className="block text-[0.875rem] font-semibold">
              {fechaLarga(eleccion.dia, eleccion.inicio)}
            </span>
            <span className="block text-[0.75rem] text-[var(--t-gris)]">
              {s.nombre} · {ELEGIR_SERVICIO.minutos(s.duracionMin)}
            </span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 divide-x divide-[var(--t-linea)] border-t border-[var(--t-linea)] pt-3 text-center">
          <span>
            <span className="block text-[0.6875rem] text-[var(--t-gris)]">{DATOS.senaAhora}</span>
            <span className="block text-[0.9375rem] font-bold tabular-nums">{pesos(sena)}</span>
          </span>
          <span>
            <span className="block text-[0.6875rem] text-[var(--t-gris)]">{DATOS.enLocal}</span>
            <span className="block text-[0.9375rem] font-bold tabular-nums">
              {pesos(s.precio - sena)}
            </span>
          </span>
        </div>
      </div>
      <div className="mt-5 space-y-3.5">
        {campo('nombre', DATOS.nombre, nombre, setNombre, { ac: 'name' })}
        {campo('telefono', DATOS.whatsapp, telefono, setTelefono, {
          ayuda: DATOS.whatsappAyuda,
          ejemplo: DATOS.whatsappEjemplo,
          tipo: 'tel',
          ac: 'tel',
        })}
        {campo('correo', DATOS.correo, correo, setCorreo, {
          ayuda: DATOS.correoAyuda,
          ejemplo: DATOS.correoEjemplo,
          tipo: 'email',
          ac: 'email',
        })}
        <label htmlFor={`${id}-nota`} className="block">
          <span className="text-[0.8125rem] font-semibold">
            {DATOS.nota}{' '}
            <span className="font-normal text-[var(--t-gris)]">· {DATOS.opcional}</span>
          </span>
          <textarea
            id={`${id}-nota`}
            value={nota}
            maxLength={300}
            rows={2}
            placeholder={DATOS.notaEjemplo}
            onChange={(ev) => setNota(ev.target.value)}
            className="mt-1 w-full resize-none rounded-lg border border-[var(--t-linea-2)] bg-[var(--t-fondo)] px-3 py-2 text-[1rem] outline-none focus:border-[var(--t-tinta)]"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={enviar}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--t-mp)] text-[1rem] font-semibold text-white hover:bg-[var(--t-mp-hover)]"
      >
        {DATOS.pagar(pesos(sena))}
        <span aria-hidden="true">→</span>
      </button>
      <p className="mt-4 text-[0.75rem] font-semibold">{DATOS.protegido}</p>
      <ul className="mt-2 space-y-1.5">
        {DATOS.garantias.map((g) => (
          <li key={g} className="flex gap-2 text-[0.75rem] text-[var(--t-gris)]">
            <Tilde />
            {g}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.75rem] text-[var(--t-gris)]">{NEGOCIO_DEMO.politica}</p>
    </>
  );
}

function Tilde({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('mt-0.5 size-3.5 shrink-0 text-[var(--t-verde)]', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Espera({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div
      role="status"
      className="flex h-full flex-col items-center justify-center px-8 text-center"
    >
      <span className="relative grid size-[4.5rem] place-items-center">
        <span className="t-anillo absolute inset-0 rounded-full border-2 border-[var(--t-linea)] border-t-[var(--t-tinta)]" />
        <span className="t-respira">
          <Logo className="size-8 rounded-lg text-[0.6875rem]" />
        </span>
      </span>
      <p className="mt-5 text-[1.0625rem] font-semibold">{titulo}</p>
      <p className="mt-1 text-[0.8125rem] text-[var(--t-gris)]">{texto}</p>
    </div>
  );
}

function Checkout({
  turno,
  onAprobado,
  onRechazado,
}: {
  turno: Turno;
  onAprobado: () => void;
  onRechazado: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--t-suave)] px-5 pt-8 pb-6">
      <p className="text-[1.125rem] font-bold text-[var(--t-mp-texto)]">{CHECKOUT.marca}</p>
      <p className="mt-4 rounded-xl bg-[var(--t-ambar-suave)] px-3.5 py-2.5 text-[0.75rem] font-medium text-[var(--t-ambar)]">
        {CHECKOUT.aviso}
      </p>
      <div className="mt-4 rounded-2xl bg-[var(--t-fondo)] p-4">
        <p className="text-[0.8125rem] text-[var(--t-gris)]">
          {CHECKOUT.concepto(turno.servicioNombre)}
        </p>
        <p className="mt-0.5 text-[1.5rem] font-bold tabular-nums">{pesos(turno.sena)}</p>
      </div>
      <p className="mt-6 text-[0.9375rem] font-semibold">{CHECKOUT.pregunta}</p>
      <button
        type="button"
        onClick={onAprobado}
        className="mt-3 h-12 rounded-xl bg-[var(--t-mp)] text-[0.9375rem] font-semibold text-white hover:bg-[var(--t-mp-hover)]"
      >
        {CHECKOUT.aprobado}
      </button>
      <button
        type="button"
        onClick={onRechazado}
        className="mt-2 h-12 rounded-xl border border-[var(--t-linea)] bg-[var(--t-fondo)] text-[0.9375rem] font-semibold"
      >
        {CHECKOUT.rechazado}
      </button>
      <button
        type="button"
        onClick={onRechazado}
        className="mt-3 text-[0.8125rem] font-medium text-[var(--t-gris)] underline underline-offset-4"
      >
        {CHECKOUT.volver}
      </button>
      <p className="mt-auto pt-8 text-center text-[0.6875rem] text-[var(--t-gris)]">
        {CHECKOUT.pie}
      </p>
    </div>
  );
}

/** El turno como evento de calendario, con la alarma 30 minutos antes (funciona en la demo). */
function agendar(t: Turno) {
  const f = fechaDe(t.dia);
  const en = (min: number) => new Date(f.getFullYear(), f.getMonth(), f.getDate(), 0, min);
  descargarIcs(
    crearIcs({
      uid: `demo-${t.id}@webya.dev`,
      inicio: en(t.inicio),
      fin: en(t.fin),
      titulo: MI_RESERVA.eventoCalendario(t.servicioNombre, NEGOCIO_DEMO.nombre),
      lugar: NEGOCIO_DEMO.direccion,
    }),
  );
}

function MiReserva({
  turno,
  ahora,
  ahoraReal,
  desfase,
  onPagar,
  onSoltar,
  onOtro,
  onVerPanel,
}: {
  turno: Turno;
  ahora: number;
  ahoraReal: number;
  desfase: number;
  onPagar: () => void;
  onSoltar: () => void;
  onOtro: () => void;
  onVerPanel: () => void;
}) {
  const [avisado, setAvisado] = useState(false);
  const [preguntar, setPreguntar] = useState(false);
  const [reloj, setReloj] = useState(ahoraReal);
  const pendiente = turno.estado === 'pendiente_pago';
  useEffect(() => {
    if (!pendiente) return;
    const t = setInterval(() => setReloj(Date.now() + desfase), 1000);
    return () => clearInterval(t);
  }, [pendiente, desfase]);

  const nombre = turno.cliente.split(' ')[0]!;
  const restante = Math.max(0, (turno.holdHasta ?? 0) - reloj);
  const mmss = `${String(Math.floor(restante / 60000)).padStart(2, '0')}:${String(Math.floor((restante % 60000) / 1000)).padStart(2, '0')}`;
  const horasFaltan = (turno.dia * 1440 + turno.inicio - ahora) / 60;

  const encabezado: Record<
    string,
    { titulo: string; texto?: string; tono: 'verde' | 'ambar' | 'gris' }
  > = {
    confirmado: { titulo: MI_RESERVA.confirmado(nombre), tono: 'verde' },
    pendiente_pago: {
      titulo: MI_RESERVA.pendiente,
      texto: MI_RESERVA.pendienteTexto,
      tono: 'ambar',
    },
    expirado: { titulo: MI_RESERVA.expirado, texto: MI_RESERVA.expiradoTexto, tono: 'gris' },
    cancelado: { titulo: MI_RESERVA.cancelado, tono: 'gris' },
  };
  const enc = encabezado[turno.estado] ?? encabezado.cancelado!;

  const boton =
    'flex h-11 w-full items-center justify-center rounded-xl border border-[var(--t-linea)] text-[0.875rem] font-semibold hover:border-[var(--t-tinta)]';

  return (
    <div className="t-entra px-5 pt-8 pb-8">
      <Logo className="size-8 rounded-lg text-[0.6875rem]" />
      <div className="mt-5 flex items-start gap-2.5">
        <span
          className={cn(
            'mt-1 grid size-6 shrink-0 place-items-center rounded-full',
            enc.tono === 'verde' && 'bg-[var(--t-verde-suave)] text-[var(--t-verde)]',
            enc.tono === 'ambar' && 'bg-[var(--t-ambar-suave)] text-[var(--t-ambar)]',
            enc.tono === 'gris' && 'bg-[var(--t-suave)] text-[var(--t-gris)]',
          )}
        >
          {enc.tono === 'verde' ? (
            <Tilde className="mt-0 text-current" />
          ) : (
            <span className="size-1.5 rounded-full bg-current" />
          )}
        </span>
        <div>
          <h2 className="text-[1.25rem] leading-tight font-bold">{enc.titulo}</h2>
          {enc.texto ? (
            <p className="mt-1 text-[0.8125rem] text-[var(--t-gris)]">{enc.texto}</p>
          ) : null}
        </div>
      </div>

      {pendiente ? (
        <p className="mt-4 rounded-xl bg-[var(--t-ambar-suave)] px-3.5 py-2.5 text-[0.8125rem] font-semibold text-[var(--t-ambar)] tabular-nums">
          {MI_RESERVA.guardado(mmss)}
        </p>
      ) : null}

      <dl className="mt-5 divide-y divide-[var(--t-linea)] border-y border-[var(--t-linea)] text-[0.875rem]">
        {[
          [MI_RESERVA.servicio, turno.servicioNombre],
          [MI_RESERVA.cuando, fechaLarga(turno.dia, turno.inicio)],
          [
            MI_RESERVA.sena,
            turno.senaEstado === 'pagada'
              ? MI_RESERVA.pagada(pesos(turno.sena))
              : pesos(turno.sena),
          ],
          [MI_RESERVA.enLocal, pesos(saldoDe(turno))],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5">
            <dt className="text-[var(--t-gris)]">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 space-y-2">
        {turno.estado === 'confirmado' ? (
          <>
            <button
              type="button"
              onClick={onVerPanel}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--t-tinta)] text-[0.875rem] font-semibold text-[var(--t-fondo)]"
            >
              {MI_RESERVA.verPanel}
            </button>
            <button
              type="button"
              aria-pressed={avisado}
              onClick={() => setAvisado(true)}
              className={boton}
            >
              {avisado ? MI_RESERVA.avisado : MI_RESERVA.avisar}
            </button>
            <button type="button" onClick={() => agendar(turno)} className={boton}>
              {MI_RESERVA.calendario}
            </button>
            <button type="button" onClick={onOtro} className={boton}>
              {MI_RESERVA.otro}
            </button>
            <div className="border-t border-[var(--t-linea)] pt-3">
              {horasFaltan > NEGOCIO_DEMO.cancelacionHoras ? (
                preguntar ? (
                  <div className="rounded-xl bg-[var(--t-suave)] p-3.5">
                    <p className="text-[0.875rem] font-semibold">{MI_RESERVA.cancelarPregunta}</p>
                    <p className="mt-1 text-[0.75rem] text-[var(--t-gris)]">
                      {NEGOCIO_DEMO.politica}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={onSoltar}
                        className="rounded-full bg-[var(--t-tinta)] px-4 py-2 text-[0.8125rem] font-semibold text-[var(--t-fondo)]"
                      >
                        {MI_RESERVA.si}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreguntar(false)}
                        className="rounded-full px-4 py-2 text-[0.8125rem] font-semibold"
                      >
                        {MI_RESERVA.no}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPreguntar(true)}
                    className="text-[0.8125rem] font-medium text-[var(--t-rojo)]"
                  >
                    {MI_RESERVA.cancelar}
                  </button>
                )
              ) : (
                <p className="text-[0.75rem] text-[var(--t-gris)]">{MI_RESERVA.cancelarTarde}</p>
              )}
            </div>
          </>
        ) : pendiente ? (
          <>
            <button
              type="button"
              onClick={onPagar}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--t-mp)] text-[0.9375rem] font-semibold text-white hover:bg-[var(--t-mp-hover)]"
            >
              {MI_RESERVA.pagarMp(pesos(turno.sena))}
            </button>
            <div className="border-t border-[var(--t-linea)] pt-3">
              <button
                type="button"
                onClick={onSoltar}
                className="text-[0.8125rem] font-medium text-[var(--t-gris)] underline underline-offset-4"
              >
                {MI_RESERVA.soltar}
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={onOtro}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--t-tinta)] text-[0.875rem] font-semibold text-[var(--t-fondo)]"
          >
            {MI_RESERVA.otro}
          </button>
        )}
      </div>
    </div>
  );
}
