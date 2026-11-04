/**
 * Precios de WebYa. PENDIENTE DEL DUEÑO: cargar los valores. Mientras `monto` sea null la UI muestra
 * `PRECIO_SIN_DEFINIR` y no inventa ningún número.
 */
export interface Precio {
  tipo: 'mensual' | 'unico';
  /** Monto en pesos argentinos, sin centavos. null = todavía no definido. */
  monto: number | null;
}

export const PRECIO: Precio = { tipo: 'mensual', monto: null };

export const PRECIO_SIN_DEFINIR = 'Te pasamos un presupuesto por WhatsApp, sin compromiso.';

export function textoPrecio(p: Precio = PRECIO): string {
  if (p.monto === null) return PRECIO_SIN_DEFINIR;
  const monto = `$${p.monto.toLocaleString('es-AR')}`;
  return p.tipo === 'mensual' ? `Desde ${monto} por mes.` : `Pago único desde ${monto}.`;
}
