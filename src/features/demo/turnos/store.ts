import {
  AGENDA_DEMO,
  BLOQUEOS_DEMO,
  NEGOCIO_DEMO,
  PROFESIONALES_DEMO,
  SERVICIOS_DEMO,
  type ProfesionalDemo,
  type ServicioDemo,
} from '@/content/demos/turnos/datos';
import {
  calcularSaldo,
  calcularSena,
  calcularSlots,
  sePisan,
  type Rango,
} from '@/domain/reservas/disponibilidad';

/**
 * Estado de la demo de turnos (DEMO_SPEC_TURNOS §3 y §4): lo comparten el turnero del cliente y el panel del dueño. En memoria.
 * Las reglas son las del sistema real (seña, apartado de 10 minutos, cierre automático, sin pisarse);
 * los profesionales son una extensión de la demo: cada uno tiene su agenda.
 */

export type EstadoTurno =
  | 'pendiente_pago'
  | 'confirmado'
  | 'completado'
  | 'ausente'
  | 'cancelado'
  | 'expirado'
  | 'conflicto_pago';
export type EstadoSena = 'pendiente' | 'pagada' | 'devuelta' | 'no_aplica';
export type Medio = 'efectivo' | 'transferencia' | 'tarjeta' | 'otro';

export interface Turno {
  id: number;
  /** Días desde hoy. */
  dia: number;
  inicio: number;
  fin: number;
  servicioId: string;
  servicioNombre: string;
  precio: number;
  sena: number;
  profesionalId: string;
  cliente: string;
  estado: EstadoTurno;
  senaEstado: EstadoSena;
  /** Lo hizo quien prueba la demo. */
  propio: boolean;
  origen: 'web' | 'panel' | 'bot';
  /** Nota del cliente para esta reserva. */
  nota?: string;
  /** Date.now() hasta el que el horario queda apartado (pendiente de pago). */
  holdHasta?: number;
  cobrado?: number;
  medio?: Medio;
  /** Reserva nueva que el dueño todavía no vio. */
  nueva: boolean;
}

export interface Bloqueo {
  dia: number;
  /** null = el día entero. */
  inicio: number | null;
  fin: number | null;
  /** null = todo el local. */
  profesionalId: string | null;
  motivo: string;
}

export interface Recordado {
  nombre: string;
  telefono: string;
  correo: string;
  servicioId: string;
}

export interface EstadoDemo {
  turnos: readonly Turno[];
  bloqueos: readonly Bloqueo[];
  inicioReal: number;
  ultimoPropio: number | null;
  /** Lo que "recuerda el dispositivo" después de reservar. */
  recordado?: Recordado;
}

export const hhmm = (s: string) => {
  const [h, m] = s.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};
export const aHhmm = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Fecha real de un día de la demo (0 = hoy, miércoles 18 de noviembre de 2026). */
export const fechaDe = (dia: number) =>
  new Date(NEGOCIO_DEMO.hoy.anio, NEGOCIO_DEMO.hoy.mes, NEGOCIO_DEMO.hoy.dia + dia);
export const diaSemana = (dia: number) => fechaDe(dia).getDay();

export const getServicio = (id: string): ServicioDemo | undefined =>
  SERVICIOS_DEMO.find((s) => s.id === id);
export const getProfesional = (id: string): ProfesionalDemo | undefined =>
  PROFESIONALES_DEMO.find((p) => p.id === id);
export const senaDe = (s: ServicioDemo) => calcularSena(s.precio, NEGOCIO_DEMO.senaPorcentaje);

export const saldoDe = (t: Turno) => calcularSaldo(t.precio, t.sena, t.senaEstado === 'pagada');

/* ---------------- Semilla ---------------- */

const PRIMER_ID = 1;

export function crearEstado(ahoraReal: number): EstadoDemo {
  const turnos: Turno[] = AGENDA_DEMO.map((a, i) => {
    const s = getServicio(a.servicioId)!;
    const inicio = hhmm(a.hora);
    return {
      id: PRIMER_ID + i,
      dia: a.dia,
      inicio,
      fin: inicio + s.duracionMin,
      servicioId: s.id,
      servicioNombre: s.nombre,
      precio: s.precio,
      sena: a.sena === 'no_aplica' ? 0 : senaDe(s),
      profesionalId: a.profesionalId,
      cliente: a.cliente,
      estado: a.estado,
      senaEstado: a.sena,
      propio: false,
      origen: a.origen,
      nota: a.nota,
      cobrado: a.cobrado,
      medio: a.medio,
      holdHasta:
        a.holdMinutosRestantes != null ? ahoraReal + a.holdMinutosRestantes * 60_000 : undefined,
      nueva: false,
    };
  });
  return {
    turnos,
    bloqueos: BLOQUEOS_DEMO.map((b) => ({
      dia: b.dia,
      inicio: b.desde ? hhmm(b.desde) : null,
      fin: b.hasta ? hhmm(b.hasta) : null,
      profesionalId: b.profesionalId,
      motivo: b.motivo,
    })),
    inicioReal: ahoraReal,
    ultimoPropio: null,
  };
}

/** Minuto del día en la demo: arranca a las 16:40 y avanza con el reloj (que se puede adelantar). */
export const ahoraDemo = (e: EstadoDemo, ahoraReal: number) =>
  hhmm(NEGOCIO_DEMO.hoy.hora) + Math.max(0, Math.floor((ahoraReal - e.inicioReal) / 60000));

/**
 * Cómo se ve un turno ahora: un pendiente vencido pasa a "expirado" y un confirmado de hoy cuyo horario
 * terminó se cierra solo como atendido, cobrado en efectivo (cierre automático del sistema real).
 */
export function vistaTurno(
  t: Turno,
  ahora: number,
  ahoraReal: number,
): Turno & { cierreAuto?: boolean } {
  if (t.estado === 'pendiente_pago' && (t.holdHasta ?? 0) <= ahoraReal)
    return { ...t, estado: 'expirado' };
  // El cierre automático solo mira los últimos dos días; más viejos quedan para el dueño.
  if (t.estado === 'confirmado' && t.dia <= 0 && t.dia >= -2 && (t.dia < 0 || t.fin <= ahora))
    return { ...t, estado: 'completado', cobrado: saldoDe(t), medio: 'efectivo', cierreAuto: true };
  return t;
}

const ocupa = (t: Turno, ahoraReal: number) =>
  t.estado === 'confirmado' || (t.estado === 'pendiente_pago' && (t.holdHasta ?? 0) > ahoraReal);

/** Las veces que el cliente no vino antes de este turno (la hoja del dueño lo avisa). */
export const faltasPrevias = (e: EstadoDemo, t: Turno) =>
  e.turnos
    .filter(
      (o) =>
        o.cliente === t.cliente &&
        o.estado === 'ausente' &&
        (o.dia < t.dia || (o.dia === t.dia && o.inicio < t.inicio)),
    )
    .sort((a, b) => b.dia - a.dia);

/** Pendientes de resolver: pagó sin horario, o canceló con la seña pagada sin devolver. */
export const aResolver = (t: Turno) =>
  t.estado === 'conflicto_pago' || (t.estado === 'cancelado' && t.senaEstado === 'pagada');

/* ---------------- Disponibilidad ---------------- */

export const franjasDe = (p: ProfesionalDemo, dia: number): Rango[] =>
  p.franjas
    .filter((f) => f.dia === diaSemana(dia))
    .map((f) => ({ inicioMin: hhmm(f.inicio), finMin: hhmm(f.fin) }));

export const profesionalesDe = (servicioId: string) =>
  PROFESIONALES_DEMO.filter((p) => p.servicioIds.includes(servicioId));

/** Horarios libres de un profesional para un servicio en un día. */
export function slotsDe(
  e: EstadoDemo,
  p: ProfesionalDemo,
  s: ServicioDemo,
  dia: number,
  ahora: number,
  ahoraReal: number,
): number[] {
  return calcularSlots({
    franjas: franjasDe(p, dia),
    duracionMin: s.duracionMin,
    intervaloMin: NEGOCIO_DEMO.intervaloMinutos,
    ocupados: e.turnos
      .filter((t) => t.dia === dia && t.profesionalId === p.id && ocupa(t, ahoraReal))
      .map((t) => ({ inicioMin: t.inicio, finMin: t.fin })),
    bloqueos: e.bloqueos
      .filter((b) => b.dia === dia && (!b.profesionalId || b.profesionalId === p.id))
      .map((b) => ({ inicioMin: b.inicio, finMin: b.fin })),
    minimoMin: dia === 0 ? ahora + NEGOCIO_DEMO.anticipacionMinutos : null,
  });
}

/** "Cualquiera" = la unión de los horarios de quienes hacen el servicio. */
export function slots(
  e: EstadoDemo,
  servicioId: string,
  profesionalId: string | null,
  dia: number,
  ahora: number,
  ahoraReal: number,
): number[] {
  const s = getServicio(servicioId);
  if (!s) return [];
  const profs = profesionalId ? [getProfesional(profesionalId)!] : profesionalesDe(servicioId);
  return [...new Set(profs.flatMap((p) => slotsDe(e, p, s, dia, ahora, ahoraReal)))].sort(
    (a, b) => a - b,
  );
}

export function diasConLugar(
  e: EstadoDemo,
  servicioId: string,
  profesionalId: string | null,
  ahora: number,
  ahoraReal: number,
) {
  return Array.from({ length: NEGOCIO_DEMO.horizonteDias }, (_, dia) => ({
    dia,
    slots: slots(e, servicioId, profesionalId, dia, ahora, ahoraReal),
  })).filter((d) => d.slots.length > 0);
}

export function primerLibre(
  e: EstadoDemo,
  servicioId: string,
  profesionalId: string | null,
  ahora: number,
  ahoraReal: number,
) {
  const d = diasConLugar(e, servicioId, profesionalId, ahora, ahoraReal)[0];
  return d ? { dia: d.dia, inicio: d.slots[0]! } : null;
}

/* ---------------- Acciones del cliente ---------------- */

export interface DatosReserva {
  servicioId: string;
  profesionalId: string | null;
  dia: number;
  inicio: number;
  nombre: string;
  telefono: string;
  correo: string;
  nota?: string;
}

/**
 * Aparta el horario 10 minutos (pendiente de pago). Con "Cualquiera" se asigna el primero libre a esa
 * hora. Si el horario ya no está: 'ocupado' (el turnero vuelve a los horarios con el aviso).
 */
export function reservar(
  e: EstadoDemo,
  d: DatosReserva,
  ahora: number,
  ahoraReal: number,
): { estado: EstadoDemo; turno: Turno } | 'ocupado' {
  const s = getServicio(d.servicioId)!;
  const candidatos = d.profesionalId ? [getProfesional(d.profesionalId)!] : profesionalesDe(s.id);
  const p = candidatos.find((x) => slotsDe(e, x, s, d.dia, ahora, ahoraReal).includes(d.inicio));
  if (!p) return 'ocupado';
  const turno: Turno = {
    id: Math.max(0, ...e.turnos.map((t) => t.id)) + 1,
    dia: d.dia,
    inicio: d.inicio,
    fin: d.inicio + s.duracionMin,
    servicioId: s.id,
    servicioNombre: s.nombre,
    precio: s.precio,
    sena: senaDe(s),
    profesionalId: p.id,
    cliente: d.nombre.trim(),
    estado: 'pendiente_pago',
    senaEstado: 'pendiente',
    propio: true,
    holdHasta: ahoraReal + NEGOCIO_DEMO.holdMinutos * 60_000,
    origen: 'web',
    nota: d.nota || undefined,
    nueva: false,
  };
  return {
    estado: {
      ...e,
      turnos: [...e.turnos, turno],
      recordado: {
        nombre: d.nombre.trim(),
        telefono: d.telefono,
        correo: d.correo,
        servicioId: s.id,
      },
    },
    turno,
  };
}

const cambiar = (e: EstadoDemo, id: number, f: (t: Turno) => Turno): EstadoDemo => ({
  ...e,
  turnos: e.turnos.map((t) => (t.id === id ? f(t) : t)),
});

/**
 * Pago aprobado: confirma y avisa al dueño. Si llegó tarde, se confirma igual si el horario sigue libre;
 * si no, queda "pagó sin horario" para que lo resuelva el dueño.
 */
export function pagar(e: EstadoDemo, id: number, ahoraReal: number): EstadoDemo {
  const t = e.turnos.find((x) => x.id === id);
  if (!t || (t.estado !== 'pendiente_pago' && t.estado !== 'expirado')) return e;
  const vigente = (t.holdHasta ?? 0) > ahoraReal;
  const libre =
    vigente ||
    !e.turnos.some(
      (o) =>
        o.id !== t.id &&
        o.dia === t.dia &&
        o.profesionalId === t.profesionalId &&
        ocupa(o, ahoraReal) &&
        sePisan({ inicioMin: o.inicio, finMin: o.fin }, { inicioMin: t.inicio, finMin: t.fin }),
    );
  const confirmado = cambiar(e, id, (x) => ({
    ...x,
    estado: libre ? 'confirmado' : 'conflicto_pago',
    senaEstado: 'pagada',
    holdHasta: undefined,
    nueva: libre,
  }));
  return { ...confirmado, ultimoPropio: id };
}

/** "Soltar este horario" o cancelar desde la reserva. */
export const soltar = (e: EstadoDemo, id: number): EstadoDemo =>
  cambiar(e, id, (t) => ({ ...t, estado: 'cancelado', holdHasta: undefined }));

/* ---------------- Acciones del dueño ---------------- */

export const completar = (
  e: EstadoDemo,
  id: number,
  cobro: { monto: number; medio: Medio } | null,
): EstadoDemo =>
  cambiar(e, id, (t) => ({
    ...t,
    estado: 'completado',
    cobrado: cobro?.monto,
    medio: cobro?.medio,
    nueva: false,
  }));

export const marcarAusente = (e: EstadoDemo, id: number): EstadoDemo =>
  cambiar(e, id, (t) => ({
    ...t,
    estado: 'ausente',
    cobrado: undefined,
    medio: undefined,
    nueva: false,
  }));

export const cancelar = (e: EstadoDemo, id: number): EstadoDemo =>
  cambiar(e, id, (t) => ({ ...t, estado: 'cancelado', nueva: false }));

export const restaurar = (e: EstadoDemo, id: number): EstadoDemo =>
  cambiar(e, id, (t) => ({ ...t, estado: 'confirmado', cobrado: undefined, medio: undefined }));

/** Devolver la seña: total, no se deshace. Un "pagó sin horario" queda cancelado. */
export const devolverSena = (e: EstadoDemo, id: number): EstadoDemo =>
  cambiar(e, id, (t) => ({
    ...t,
    senaEstado: 'devuelta',
    estado: t.estado === 'conflicto_pago' ? 'cancelado' : t.estado,
  }));

export const marcarVisto = (e: EstadoDemo, id: number): EstadoDemo => {
  const t = e.turnos.find((x) => x.id === id);
  return t?.nueva ? cambiar(e, id, (x) => ({ ...x, nueva: false })) : e;
};

/** Volver un turno a como estaba (el "Deshacer" de los carteles). */
export const reponer = (e: EstadoDemo, previo: Turno): EstadoDemo =>
  cambiar(e, previo.id, () => previo);

/* ---------------- Store ---------------- */

export interface StoreDemo {
  get: () => EstadoDemo;
  set: (f: (e: EstadoDemo) => EstadoDemo) => void;
  subscribe: (escuchar: () => void) => () => void;
}

export function crearStore(ahoraReal: number): StoreDemo {
  let estado = crearEstado(ahoraReal);
  const escuchas = new Set<() => void>();
  return {
    get: () => estado,
    set: (f) => {
      const nuevo = f(estado);
      if (nuevo === estado) return;
      estado = nuevo;
      escuchas.forEach((l) => l());
    },
    subscribe: (l) => {
      escuchas.add(l);
      return () => escuchas.delete(l);
    },
  };
}

/**
 * "Simular un día de trabajo": una reserva de otro cliente que entra sola, ya con la seña pagada y la
 * etiqueta "Nueva" (como en el sistema real: no hay que aprobarla). Servicio y nombre salen de `azar`;
 * va al primer horario libre de cualquier profesional. Si no queda lugar, no entra nada.
 */
export function simularReserva(
  e: EstadoDemo,
  ahora: number,
  ahoraReal: number,
  azar: () => number,
  cliente: string,
): EstadoDemo {
  const s = SERVICIOS_DEMO[Math.floor(azar() * SERVICIOS_DEMO.length)];
  if (!s) return e;
  const libre = primerLibre(e, s.id, null, ahora, ahoraReal);
  if (!libre) return e;
  const p = profesionalesDe(s.id).find((x) =>
    slotsDe(e, x, s, libre.dia, ahora, ahoraReal).includes(libre.inicio),
  );
  if (!p) return e;
  const turno: Turno = {
    id: Math.max(0, ...e.turnos.map((t) => t.id)) + 1,
    dia: libre.dia,
    inicio: libre.inicio,
    fin: libre.inicio + s.duracionMin,
    servicioId: s.id,
    servicioNombre: s.nombre,
    precio: s.precio,
    sena: senaDe(s),
    profesionalId: p.id,
    cliente,
    estado: 'confirmado',
    senaEstado: 'pagada',
    propio: false,
    origen: azar() < 0.3 ? 'bot' : 'web',
    nueva: true,
  };
  return { ...e, turnos: [...e.turnos, turno] };
}
