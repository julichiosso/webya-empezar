/**
 * Reglas del sistema de turnos con seña (DEMO_SPEC_TURNOS §4), puras: horarios libres según la
 * duración, solapes, seña y saldo, y cómo se agrupa el día. Horas en minutos desde las 00:00; montos en
 * pesos enteros. Intervalos semiabiertos [inicio, fin): 16:00–16:30 y 16:30–17:00 no se pisan.
 */

export interface Rango {
  inicioMin: number;
  finMin: number;
}

/** Bloqueo: sin horas (null) = el día entero. */
export interface BloqueoRango {
  inicioMin: number | null;
  finMin: number | null;
}

export const sePisan = (a: Rango, b: Rango) => a.inicioMin < b.finMin && a.finMin > b.inicioMin;

/**
 * Horarios libres de un día (mismo algoritmo que el sistema real): arrancan al inicio de cada franja y
 * avanzan de a `intervaloMin`; el turno tiene que entrar entero en la franja y no pisar turnos activos ni
 * bloqueos. `minimoMin` corta los de hoy que no llegan a la anticipación.
 */
export function calcularSlots({
  franjas,
  duracionMin,
  intervaloMin,
  ocupados,
  bloqueos,
  minimoMin,
}: {
  franjas: readonly Rango[];
  duracionMin: number;
  intervaloMin: number;
  ocupados: readonly Rango[];
  bloqueos: readonly BloqueoRango[];
  minimoMin?: number | null;
}): number[] {
  if (bloqueos.some((b) => b.inicioMin === null)) return [];
  const slots: number[] = [];
  for (const f of [...franjas].sort((a, b) => a.inicioMin - b.inicioMin)) {
    for (let inicio = f.inicioMin; inicio + duracionMin <= f.finMin; inicio += intervaloMin) {
      const turno = { inicioMin: inicio, finMin: inicio + duracionMin };
      if (minimoMin != null && inicio < minimoMin) continue;
      if (ocupados.some((o) => sePisan(turno, o))) continue;
      if (bloqueos.some((b) => b.finMin != null && sePisan(turno, b as Rango))) continue;
      slots.push(inicio);
    }
  }
  return slots;
}

/** Seña redondeada al peso: el mismo porcentaje para todos los servicios. */
export const calcularSena = (precio: number, porcentaje: number) =>
  Math.round((precio * porcentaje) / 100);

/** Lo que falta cobrar en el local. */
export const calcularSaldo = (precio: number, sena: number, senaPagada: boolean) =>
  Math.max(0, precio - (senaPagada ? sena : 0));

export type Momento = 'manana' | 'tarde' | 'noche';

/** Mañana antes de las 12, tarde de 12 a 19, noche desde las 19. */
export const momentoDe = (min: number): Momento =>
  min < 12 * 60 ? 'manana' : min < 19 * 60 ? 'tarde' : 'noche';

export function agruparPorMomento(slots: readonly number[]) {
  const grupos: Record<Momento, number[]> = { manana: [], tarde: [], noche: [] };
  for (const s of slots) grupos[momentoDe(s)].push(s);
  return grupos;
}

/** "Quedan 3": desde cuántos horarios libres se avisa que quedan pocos. */
export const POCOS_HORARIOS = 3;

/**
 * Huecos libres de la agenda del dueño: los tramos de cada franja que no tienen turnos ni bloqueos, de
 * al menos `minimoMin` minutos (para crear un turno tocándolos).
 */
export function huecosLibres(
  franjas: readonly Rango[],
  ocupados: readonly Rango[],
  minimoMin = 30,
): Rango[] {
  const huecos: Rango[] = [];
  const tomados = [...ocupados].sort((a, b) => a.inicioMin - b.inicioMin);
  for (const f of [...franjas].sort((a, b) => a.inicioMin - b.inicioMin)) {
    let desde = f.inicioMin;
    for (const o of tomados) {
      if (o.finMin <= desde || o.inicioMin >= f.finMin) continue;
      if (o.inicioMin - desde >= minimoMin) huecos.push({ inicioMin: desde, finMin: o.inicioMin });
      desde = Math.max(desde, o.finMin);
    }
    if (f.finMin - desde >= minimoMin) huecos.push({ inicioMin: desde, finMin: f.finMin });
  }
  return huecos;
}
