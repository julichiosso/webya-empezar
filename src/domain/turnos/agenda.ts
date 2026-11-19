/**
 * Reglas de la agenda de turnos: qué horarios están libres y cuándo se puede reservar. Sin React ni
 * copy: los días y servicios vienen de afuera y los horarios son minutos desde la medianoche.
 */
export const DIAS_SEMANA = ['mar', 'mie', 'jue', 'vie', 'sab'] as const;
export type DiaSemana = (typeof DIAS_SEMANA)[number];

export type Franja = 'manana' | 'tarde';
export const FRANJAS: readonly Franja[] = ['manana', 'tarde'];

export interface Servicio {
  id: string;
  minutos: number;
  precioCentavos: number;
}

export interface Turno {
  id: string;
  dia: DiaSemana;
  /** Minutos desde la medianoche. */
  inicio: number;
  minutos: number;
  servicioId: string;
  cliente: string;
  /** Lo tomó el bot en esta visita (no es de los datos de ejemplo). */
  delBot?: boolean;
}

export interface HorarioLocal {
  manana: { desde: number; hasta: number };
  tarde: { desde: number; hasta: number };
  /** Cada cuánto arranca un turno. */
  paso: number;
}

export const franjaDe = (inicio: number, h: HorarioLocal): Franja =>
  inicio < h.manana.hasta ? 'manana' : 'tarde';

/** Los dos tramos de atención: un turno tiene que entrar entero en uno de ellos. */
const tramos = (h: HorarioLocal) => [h.manana, h.tarde];

export function dentroDeHorario(inicio: number, minutos: number, h: HorarioLocal): boolean {
  return (
    (inicio - h.manana.desde) % h.paso === 0 &&
    tramos(h).some((t) => inicio >= t.desde && inicio + minutos <= t.hasta)
  );
}

const seSuperponen = (a: { inicio: number; minutos: number }, inicio: number, minutos: number) =>
  a.inicio < inicio + minutos && inicio < a.inicio + a.minutos;

/** Inicios libres de ese día para un turno de esa duración, en orden. */
export function horariosLibres(
  turnos: readonly Turno[],
  dia: DiaSemana,
  minutos: number,
  h: HorarioLocal,
  franja?: Franja,
): number[] {
  const delDia = turnos.filter((t) => t.dia === dia);
  const libres: number[] = [];
  for (const t of tramos(h)) {
    for (let inicio = t.desde; inicio + minutos <= t.hasta; inicio += h.paso) {
      if (!dentroDeHorario(inicio, minutos, h)) continue;
      if (franja && franjaDe(inicio, h) !== franja) continue;
      if (!delDia.some((x) => seSuperponen(x, inicio, minutos))) libres.push(inicio);
    }
  }
  return libres;
}

export type ResultadoReserva =
  { ok: true; turnos: Turno[] } | { ok: false; motivo: 'ocupado' | 'fuera_de_horario' };

/** Reserva si entra. Es la única puerta para sumar un turno: nunca quedan dos en el mismo horario. */
export function reservar(
  turnos: readonly Turno[],
  nuevo: Turno,
  h: HorarioLocal,
): ResultadoReserva {
  if (!dentroDeHorario(nuevo.inicio, nuevo.minutos, h)) {
    return { ok: false, motivo: 'fuera_de_horario' };
  }
  const choca = turnos.some(
    (t) => t.dia === nuevo.dia && seSuperponen(t, nuevo.inicio, nuevo.minutos),
  );
  if (choca) return { ok: false, motivo: 'ocupado' };
  return {
    ok: true,
    turnos: [...turnos, nuevo].sort((a, b) =>
      a.dia === b.dia
        ? a.inicio - b.inicio
        : DIAS_SEMANA.indexOf(a.dia) - DIAS_SEMANA.indexOf(b.dia),
    ),
  };
}

/** 570 → "9:30". */
export function formatearHora(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

/** Cuántos turnos de un paso entran en una franja: la capacidad para medir la ocupación. */
export function capacidadDeFranja(franja: Franja, h: HorarioLocal): number {
  const t = h[franja];
  return Math.floor((t.hasta - t.desde) / h.paso);
}
