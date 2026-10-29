import { z } from 'zod';
import { sumar, type Centavos } from './dinero';
import { calcularTotales, PROPINAS } from './totales';
import { MEDIOS_PAGO, MODALIDADES, type BorradorPedido, type ItemPedido, type Menu } from './types';

/** Límites de lo que puede mandar un cliente. Iguales en la demo y en el servidor. */
export const LIMITES_PEDIDO = {
  lineas: 30,
  cantidad: 20,
  nota: 140,
  nombre: 60,
  mesa: 10,
  direccion: 160,
} as const;

/**
 * Lo que manda el cliente al confirmar. NO trae precios ni nombres: el servidor los resuelve
 * contra la carta (`armarPedido`). Nunca se confía en un monto que venga del navegador.
 */
export const entradaPedidoSchema = z
  .object({
    modalidad: z.enum(MODALIDADES),
    cliente: z.object({
      nombre: z
        .string()
        .trim()
        .min(2, 'Decinos tu nombre para llamarte cuando esté listo.')
        .max(LIMITES_PEDIDO.nombre, `Usá hasta ${LIMITES_PEDIDO.nombre} caracteres.`),
    }),
    mesa: z.string().trim().max(LIMITES_PEDIDO.mesa).optional(),
    direccion: z.string().trim().max(LIMITES_PEDIDO.direccion).optional(),
    medioPago: z.enum(MEDIOS_PAGO),
    propinaPorcentaje: z
      .number()
      .int()
      .refine(
        (p) => (PROPINAS as readonly number[]).includes(p),
        'Esa propina no está disponible.',
      ),
    items: z
      .array(
        z.object({
          productoId: z.string().min(1).max(60),
          cantidad: z.number().int().min(1).max(LIMITES_PEDIDO.cantidad),
          modificadores: z
            .array(
              z.object({ grupoId: z.string().min(1).max(60), opcionId: z.string().min(1).max(60) }),
            )
            .max(20),
          nota: z.string().trim().max(LIMITES_PEDIDO.nota).optional(),
        }),
      )
      .min(1, 'Sumá al menos un plato.')
      .max(LIMITES_PEDIDO.lineas),
  })
  .superRefine((p, ctx) => {
    if (p.modalidad === 'mesa' && !p.mesa) {
      ctx.addIssue({ code: 'custom', path: ['mesa'], message: 'Decinos en qué mesa estás.' });
    }
    if (p.modalidad === 'delivery' && (p.direccion ?? '').length < 5) {
      ctx.addIssue({
        code: 'custom',
        path: ['direccion'],
        message: 'Decinos a dónde te lo llevamos.',
      });
    }
  });

export type EntradaPedido = z.infer<typeof entradaPedidoSchema>;

export type ResultadoArmado =
  { ok: true; borrador: BorradorPedido } | { ok: false; errores: string[] };

export interface ContextoLocal {
  tenantId: string;
  localId: string;
  costoEnvio: Centavos;
}

export type LineaEntrada = EntradaPedido['items'][number];

/**
 * Resuelve UNA línea contra la carta: el plato y cada modificador tienen que existir y pertenecer
 * a ese plato; los grupos `unico` admiten una sola opción y los obligatorios exigen una. Precio y
 * nombres salen de la carta. Lo usan el carrito de la demo y `armarPedido` (mismo cálculo).
 */
export function resolverLinea(
  menu: Menu,
  linea: LineaEntrada,
): { ok: true; item: ItemPedido } | { ok: false; errores: string[] } {
  const producto = menu.productos.find((p) => p.id === linea.productoId);
  if (!producto)
    return { ok: false, errores: [`El plato ${linea.productoId} no está en la carta.`] };

  const errores: string[] = [];
  const elegidos: ItemPedido['modificadores'] = [];
  for (const m of linea.modificadores) {
    const grupo = producto.modificadores.find((g) => g.id === m.grupoId);
    const opcion = grupo?.opciones.find((o) => o.id === m.opcionId);
    if (!grupo || !opcion) {
      errores.push(`${producto.nombre}: esa opción no existe.`);
      continue;
    }
    if (elegidos.some((x) => x.grupoId === grupo.id && x.opcionId === opcion.id)) {
      errores.push(`${producto.nombre}: hay opciones repetidas.`);
      continue;
    }
    elegidos.push({
      grupoId: grupo.id,
      opcionId: opcion.id,
      nombre: opcion.nombre,
      precio: opcion.precio,
    });
  }
  for (const grupo of producto.modificadores) {
    const cuantos = elegidos.filter((x) => x.grupoId === grupo.id).length;
    if (grupo.tipo === 'unico' && cuantos > 1) {
      errores.push(`${producto.nombre}: elegí una sola opción de ${grupo.nombre.toLowerCase()}.`);
    }
    if (grupo.obligatorio && cuantos === 0) {
      errores.push(`${producto.nombre}: elegí ${grupo.nombre.toLowerCase()}.`);
    }
  }
  if (errores.length > 0) return { ok: false, errores };
  return {
    ok: true,
    item: {
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad: linea.cantidad,
      precioUnitario: sumar(producto.precio, ...elegidos.map((x) => x.precio)),
      modificadores: elegidos,
      nota: linea.nota || null,
    },
  };
}

/**
 * Valida la entrada completa y la resuelve contra la carta línea por línea (`resolverLinea`).
 * Precios y nombres salen de la carta y quedan congelados en el pedido; los totales los calcula
 * `calcularTotales`. Es lo que va a llamar el servidor antes de guardar.
 */
export function armarPedido(menu: Menu, entrada: unknown, ctx: ContextoLocal): ResultadoArmado {
  const parsed = entradaPedidoSchema.safeParse(entrada);
  if (!parsed.success) return { ok: false, errores: parsed.error.issues.map((i) => i.message) };
  const e = parsed.data;

  const errores: string[] = [];
  const items: ItemPedido[] = [];
  for (const linea of e.items) {
    const r = resolverLinea(menu, linea);
    if (r.ok) items.push(r.item);
    else errores.push(...r.errores);
  }
  if (errores.length > 0) return { ok: false, errores };

  return {
    ok: true,
    borrador: {
      tenantId: ctx.tenantId,
      localId: ctx.localId,
      modalidad: e.modalidad,
      cliente: { nombre: e.cliente.nombre },
      mesa: e.modalidad === 'mesa' ? (e.mesa ?? null) : null,
      direccion: e.modalidad === 'delivery' ? (e.direccion ?? null) : null,
      medioPago: e.medioPago,
      propinaPorcentaje: e.propinaPorcentaje,
      items,
      totales: calcularTotales(items, {
        propinaPorcentaje: e.propinaPorcentaje,
        modalidad: e.modalidad,
        costoEnvio: ctx.costoEnvio,
      }),
    },
  };
}
