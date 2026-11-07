import {
  capacidadDeFranja,
  DIAS_SEMANA,
  franjaDe,
  FRANJAS,
  type DiaSemana,
  type Franja,
  type HorarioLocal,
  type Servicio,
  type Turno,
} from './agenda';

/** Un turno pasado. `dia` cuenta días corridos desde el inicio del historial. */
export interface Visita {
  dia: number;
  semana: number;
  diaSemana: DiaSemana;
  inicio: number;
  /** Cuántos pasos de agenda ocupó (para medir ocupación). */
  pasos: number;
  servicioId: string;
  clienteId: string;
  vino: boolean;
}

export interface CeldaOcupacion {
  dia: DiaSemana;
  franja: Franja;
  /** De 0 a 1. */
  ocupacion: number;
}

/** Ocupación de cada día y franja, promedio del historial o de una semana de turnos. */
export function ocupacionPorFranja(
  visitas: readonly Visita[],
  h: HorarioLocal,
  semanas: number,
): CeldaOcupacion[] {
  return DIAS_SEMANA.flatMap((dia) =>
    FRANJAS.map((franja) => {
      const usados = visitas
        .filter((v) => v.diaSemana === dia && franjaDe(v.inicio, h) === franja)
        .reduce((s, v) => s + v.pasos, 0);
      const capacidad = capacidadDeFranja(franja, h) * semanas;
      return { dia, franja, ocupacion: capacidad === 0 ? 0 : Math.min(1, usados / capacidad) };
    }),
  );
}

/** La franja con más lugar: donde una promo o un mensaje rinde más. */
export function franjaMasFloja(celdas: readonly CeldaOcupacion[]): CeldaOcupacion | null {
  return celdas.reduce<CeldaOcupacion | null>(
    (min, c) => (min === null || c.ocupacion < min.ocupacion ? c : min),
    null,
  );
}

export interface Prevision {
  dia: DiaSemana;
  turnos: number;
  /** Respecto del promedio simple del historial: positivo, viene subiendo. */
  tendencia: number;
}

/**
 * Cuántos turnos esperar por día la semana que viene: promedio de las últimas semanas pesando más las
 * recientes (promedio móvil ponderado). Con más datos reales se puede cambiar el modelo sin tocar
 * quien lo usa.
 */
export function previsionPorDia(visitas: readonly Visita[], ultimaSemana: number): Prevision[] {
  const PESOS = [1, 2, 3, 4];
  return DIAS_SEMANA.map((dia) => {
    const porSemana = PESOS.map(
      (_, i) =>
        visitas.filter(
          (v) => v.diaSemana === dia && v.semana === ultimaSemana - (PESOS.length - 1 - i),
        ).length,
    );
    const suma = PESOS.reduce((s, p) => s + p, 0);
    const ponderado = porSemana.reduce((s, n, i) => s + n * PESOS[i]!, 0) / suma;
    const simple = porSemana.reduce((s, n) => s + n, 0) / porSemana.length;
    return { dia, turnos: Math.round(ponderado), tendencia: ponderado - simple };
  });
}

export interface ClientePorVolver {
  clienteId: string;
  /** Cada cuántos días viene normalmente. */
  ritmoDias: number;
  /** Hace cuántos días que no viene. */
  sinVenirDias: number;
}

function mediana(numeros: readonly number[]): number {
  const orden = [...numeros].sort((a, b) => a - b);
  const medio = Math.floor(orden.length / 2);
  return orden.length % 2 === 1 ? orden[medio]! : (orden[medio - 1]! + orden[medio]!) / 2;
}

/**
 * Clientes que se pasaron de su ritmo: venían cada X días y ya llevan bastante más. Hacen falta al
 * menos tres visitas para saber su ritmo. Ordenados por los que más se pasaron.
 */
export function clientesPorVolver(
  visitas: readonly Visita[],
  hoy: number,
  margen = 1.4,
): ClientePorVolver[] {
  const porCliente = new Map<string, number[]>();
  for (const v of visitas) {
    if (!v.vino) continue;
    porCliente.set(v.clienteId, [...(porCliente.get(v.clienteId) ?? []), v.dia]);
  }
  const lista: ClientePorVolver[] = [];
  for (const [clienteId, dias] of porCliente) {
    if (dias.length < 3) continue;
    const orden = [...dias].sort((a, b) => a - b);
    const ritmoDias = mediana(orden.slice(1).map((d, i) => d - orden[i]!));
    const sinVenirDias = hoy - orden[orden.length - 1]!;
    if (ritmoDias > 0 && sinVenirDias > ritmoDias * margen) {
      lista.push({ clienteId, ritmoDias, sinVenirDias });
    }
  }
  return lista.sort((a, b) => b.sinVenirDias / b.ritmoDias - a.sinVenirDias / a.ritmoDias);
}

/** Parte de los turnos a los que no vinieron, de 0 a 1. */
export function tasaDeAusencias(visitas: readonly Visita[]): number {
  if (visitas.length === 0) return 0;
  return visitas.filter((v) => !v.vino).length / visitas.length;
}

/** Ocupación de una semana de turnos, de 0 a 1. */
export function ocupacionDeLaSemana(turnos: readonly Turno[], h: HorarioLocal): number {
  const usados = turnos.reduce((s, t) => s + Math.ceil(t.minutos / h.paso), 0);
  const capacidad = FRANJAS.reduce((s, f) => s + capacidadDeFranja(f, h), 0) * DIAS_SEMANA.length;
  return capacidad === 0 ? 0 : Math.min(1, usados / capacidad);
}

/** Lo que suman los turnos de la semana, en centavos. */
export function ingresosDeLaSemana(
  turnos: readonly Turno[],
  servicios: readonly Servicio[],
): number {
  return turnos.reduce(
    (s, t) => s + (servicios.find((x) => x.id === t.servicioId)?.precioCentavos ?? 0),
    0,
  );
}
