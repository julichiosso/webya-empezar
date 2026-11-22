/**
 * Progreso de los tres estados del hero (0 Creá → 0,5 Digitalizá → 1 Crecé), compartido entre el scroll
 * (que lo escribe) y la escena 3D (que lo lee en cada cuadro). El CSS lo recibe como `--p` en el hero.
 */
export const progresoHero = { valor: 0 };

/** Cuánto del recorrido fijo del hero se scrolleó: 0 arriba, 1 cuando el escenario está por soltarse. */
export function calcularProgreso(top: number, altoSeccion: number, altoVentana: number): number {
  const recorrido = altoSeccion - altoVentana;
  if (recorrido <= 0) return top < 0 ? Math.min(1, -top / (altoVentana * 0.6)) : 0;
  return Math.min(1, Math.max(0, -top / recorrido));
}

/** Proporción del canvas y de los posters del símbolo (ancho / alto). */
export const ASPECTO = 1.6;
