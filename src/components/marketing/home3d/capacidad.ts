/**
 * ¿Este dispositivo puede con el símbolo en WebGL sin perjudicar la página? Si no, queda el poster
 * (que ya es el LCP). Se decide en el navegador, después de que la página es interactiva.
 */
export interface Capacidad {
  webgl2: boolean;
  nucleos: number;
  memoria: number | null;
  ahorroDatos: boolean;
  movimientoReducido: boolean;
}

export function medirCapacidad(): Capacidad {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  let webgl2 = false;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    webgl2 = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webgl2 = false;
  }
  return {
    webgl2,
    nucleos: nav.hardwareConcurrency ?? 2,
    memoria: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
    ahorroDatos: !!nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType ?? ''),
    movimientoReducido: matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

/** La regla, separada para probarla. */
export function alcanza(c: Capacidad): boolean {
  if (!c.webgl2 || c.ahorroDatos || c.movimientoReducido) return false;
  if (c.nucleos < 4) return false;
  if (c.memoria !== null && c.memoria < 4) return false;
  return true;
}
