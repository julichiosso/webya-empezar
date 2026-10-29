/**
 * Dinero de WebYa: SIEMPRE enteros en centavos (nunca floats). Se formatea recién al mostrar.
 * Reglas completas en .claude/skills/webya-pedidos-module.
 */

/** Monto en centavos de peso. Entero seguro, puede ser 0. */
export type Centavos = number;

const ENTERO = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const CON_CENTAVOS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function esCentavos(valor: unknown): valor is Centavos {
  return typeof valor === 'number' && Number.isSafeInteger(valor);
}

function exigirCentavos(valor: number, contexto: string): Centavos {
  if (!esCentavos(valor)) throw new Error(`${contexto}: no son centavos enteros (${valor})`);
  return valor;
}

/** Pesos → centavos (para escribir precios de ejemplo legibles en la config). */
export function pesos(montoEnPesos: number): Centavos {
  return exigirCentavos(Math.round(montoEnPesos * 100), `pesos(${montoEnPesos})`);
}

/** Suma de montos; falla si alguno no es entero (nunca se cuela un float). */
export function sumar(...montos: Centavos[]): Centavos {
  return montos.reduce<Centavos>(
    (t, m) => exigirCentavos(t + exigirCentavos(m, 'sumar'), 'sumar'),
    0,
  );
}

/** Precio unitario × cantidad (cantidad entera ≥ 0). */
export function multiplicar(monto: Centavos, cantidad: number): Centavos {
  if (!Number.isSafeInteger(cantidad) || cantidad < 0)
    throw new Error(`Cantidad inválida: ${cantidad}`);
  return exigirCentavos(exigirCentavos(monto, 'multiplicar') * cantidad, 'multiplicar');
}

/**
 * Porcentaje de un monto, redondeado al centavo (mitad hacia arriba). Es la ÚNICA regla de
 * redondeo del sistema: propinas y recargos pasan por acá.
 */
export function porcentaje(monto: Centavos, porciento: number): Centavos {
  if (!Number.isSafeInteger(porciento) || porciento < 0 || porciento > 100) {
    throw new Error(`Porcentaje inválido: ${porciento}`);
  }
  // monto × porciento es entero exacto; la única división se redondea una sola vez.
  return Math.round((exigirCentavos(monto, 'porcentaje') * porciento) / 100);
}

/** `2390000` → `$ 23.900`; `2390050` → `$ 23.900,50`. Sin decimales cuando son pesos redondos. */
export function formatearPesos(centavos: Centavos): string {
  exigirCentavos(centavos, 'formatearPesos');
  const formato = centavos % 100 === 0 ? ENTERO : CON_CENTAVOS;
  return formato.format(centavos / 100);
}
