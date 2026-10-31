/**
 * Experimentos del flujo de /empezar. Sin proveedor de A/B todavía: el orden se elige acá (por
 * defecto) y se puede forzar con `?orden=b` para probarlo.
 *
 * - `a`: rubro → formulario (nombre, WhatsApp, ciudad: guarda el lead) → vista previa.
 * - `b`: rubro → solo el nombre → vista previa → el WhatsApp se pide al tocar el CTA.
 */
export const ORDENES = ['a', 'b'] as const;
export type Orden = (typeof ORDENES)[number];

export const ORDEN_POR_DEFECTO: Orden = 'a';

const esOrden = (v: unknown): v is Orden => (ORDENES as readonly unknown[]).includes(v);

/** El orden de esta visita: el de la URL si es válido, si no el de por defecto. */
export function ordenDeUrl(search: string): Orden {
  const pedido = new URLSearchParams(search).get('orden');
  return esOrden(pedido) ? pedido : ORDEN_POR_DEFECTO;
}
