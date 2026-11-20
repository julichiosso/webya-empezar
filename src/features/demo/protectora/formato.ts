const PESOS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

/** "$ 5.000": montos de ejemplo de la demo. */
export const pesos = (n: number) => PESOS.format(n);

const DIA = new Intl.DateTimeFormat('es-AR', {
  weekday: 'short',
  day: 'numeric',
  month: 'numeric',
});

/** "sáb 23/11 · 10:00": la fecha de una actividad, contada desde hoy. */
export function fechaActividad(dias: number, hora: number, hoy = new Date()): string {
  const f = new Date(hoy);
  f.setDate(f.getDate() + dias);
  return `${DIA.format(f).replace(',', '')} · ${String(hora).padStart(2, '0')}:00`;
}
