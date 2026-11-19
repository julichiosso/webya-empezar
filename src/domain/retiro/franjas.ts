/**
 * Franjas de retiro del sistema de pedidos (el de Micio's): franjas de 15 minutos con tope de pedidos,
 * salto de las llenas y cálculo de la hora de retiro. Funciones puras, en minutos desde las 00:00 del día
 * de la jornada (una jornada que cruza la medianoche sigue sumando: 01:00 = 1500).
 */

export const PASO_FRANJA_MIN = 15;
/** Tiempo mínimo de cocina. */
export const TIEMPO_PREPARACION_MIN = 20;
/** Lo que suma cada pedido que ya está en la cola de la franja elegida. */
export const MINUTOS_EXTRA_POR_PEDIDO = 4;
/** Desde este porcentaje de ocupación, la franja está "casi llena". */
export const UMBRAL_CASI_LLENO = 0.8;

export interface Franja {
  inicio: number;
  fin: number;
  capacidad: number;
  bloqueado: boolean;
  /** Pedidos que ocupan cupo (confirmados y pendientes vigentes). */
  pedidos: number;
}

export type EstadoFranja = 'pasado' | 'pausado' | 'lleno' | 'casi' | 'libre';

/** "20:45" → 1245. */
export function hhmmAMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** 1245 → "20:45" (y 1500 → "01:00"). */
export function minAHhmm(min: number): string {
  const enDia = ((Math.round(min) % 1440) + 1440) % 1440;
  const h = Math.floor(enDia / 60);
  const m = enDia % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Rangos de 15 minutos entre la apertura y el cierre. Si el cierre es antes, cruza la medianoche. */
export function generarRangos(
  apertura: string,
  cierre: string,
  paso = PASO_FRANJA_MIN,
): { inicio: number; fin: number }[] {
  const desde = hhmmAMin(apertura);
  let hasta = hhmmAMin(cierre);
  if (hasta <= desde) hasta += 1440;
  const rangos: { inicio: number; fin: number }[] = [];
  for (let t = desde; t + paso <= hasta; t += paso) rangos.push({ inicio: t, fin: t + paso });
  return rangos;
}

export const estaLlena = (f: Franja) => f.pedidos >= f.capacidad;

export function estadoFranja(f: Franja, ahora: number): EstadoFranja {
  if (f.fin <= ahora) return 'pasado';
  if (f.bloqueado) return 'pausado';
  if (estaLlena(f)) return 'lleno';
  if (f.capacidad > 0 && f.pedidos / f.capacidad >= UMBRAL_CASI_LLENO) return 'casi';
  return 'libre';
}

/** Lo antes que puede salir un pedido hecho ahora. */
export const minimoRetiro = (ahora: number) => ahora + TIEMPO_PREPARACION_MIN;

const conCupo = (f: Franja) => !f.bloqueado && !estaLlena(f);

/**
 * "Lo antes posible": la primera franja que termina después del mínimo, sin pausa y con cupo. Si para
 * llegar a ella se saltó alguna llena, `huboSalto` (el texto de demora lo usa).
 */
export function elegirFranja(
  franjas: readonly Franja[],
  ahora: number,
): { franja: Franja; huboSalto: boolean } | null {
  const minimo = minimoRetiro(ahora);
  let huboSalto = false;
  for (const f of [...franjas].sort((a, b) => a.inicio - b.inicio)) {
    if (f.fin < minimo) continue;
    if (conCupo(f)) return { franja: f, huboSalto };
    if (!f.bloqueado && estaLlena(f)) huboSalto = true;
  }
  return null;
}

/** "Elegir horario": las franjas futuras con cupo. */
export const franjasElegibles = (franjas: readonly Franja[], ahora: number) =>
  franjas.filter((f) => f.fin >= minimoRetiro(ahora) && conCupo(f));

export interface Retiro {
  /** Minuto del día en que se puede pasar a buscar. */
  hora: number;
  minutosEspera: number;
  esInmediato: boolean;
}

/** La hora de retiro dentro de la franja: el mínimo de cocina más la cola, sin pasarse del fin. */
export function calcularRetiro(franja: Franja, ahora: number, huboSalto = false): Retiro {
  const cola = Math.max(0, franja.pedidos) * MINUTOS_EXTRA_POR_PEDIDO;
  const hora = Math.min(Math.max(minimoRetiro(ahora), franja.inicio) + cola, franja.fin);
  const minutosEspera = Math.max(TIEMPO_PREPARACION_MIN, hora - ahora);
  return { hora, minutosEspera, esInmediato: !huboSalto && minutosEspera <= 25 };
}
