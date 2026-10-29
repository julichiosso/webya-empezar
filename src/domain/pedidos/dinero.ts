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

/** Pesos enteros → centavos (para escribir precios de ejemplo legibles en la config). */
export function pesos(montoEnPesos: number): Centavos {
  const c = Math.round(montoEnPesos * 100);
  if (!esCentavos(c)) throw new Error(`Monto inválido: ${montoEnPesos}`);
  return c;
}

/** `2390000` → `$ 23.900`; `2390050` → `$ 23.900,50`. Sin decimales cuando son pesos redondos. */
export function formatearPesos(centavos: Centavos): string {
  if (!esCentavos(centavos)) throw new Error(`No son centavos enteros: ${centavos}`);
  const formato = centavos % 100 === 0 ? ENTERO : CON_CENTAVOS;
  return formato.format(centavos / 100);
}
