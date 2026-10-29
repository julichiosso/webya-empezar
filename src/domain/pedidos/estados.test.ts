import { describe, expect, it } from 'vitest';
import {
  avanzar,
  esFinal,
  ETIQUETA_ESTADO,
  PASOS_SEGUIMIENTO,
  puedeTransicionar,
  siguienteEstado,
  transicionar,
  TRANSICIONES,
  TransicionInvalidaError,
} from './estados';
import { ESTADOS_PEDIDO, type EstadoPedido, type Pedido } from './types';

const AHORA = new Date('2026-10-29T12:00:00.000Z');

function pedido(estado: EstadoPedido): Pedido {
  return {
    id: 'p1',
    tenantId: 't1',
    localId: 'l1',
    numero: 1,
    estado,
    modalidad: 'retiro',
    cliente: { nombre: 'Ana' },
    mesa: null,
    direccion: null,
    medioPago: 'efectivo',
    propinaPorcentaje: 0,
    items: [],
    totales: { subtotal: 0, propina: 0, envio: 0, total: 0 },
    eventos: [{ estado, en: '2026-10-29T11:00:00.000Z' }],
    creadoEn: '2026-10-29T11:00:00.000Z',
  };
}

/** Las únicas transiciones permitidas, escritas a mano: si alguien cambia la máquina, esto falla. */
const VALIDAS: [EstadoPedido, EstadoPedido][] = [
  ['recibido', 'en_preparacion'],
  ['recibido', 'cancelado'],
  ['en_preparacion', 'listo'],
  ['en_preparacion', 'cancelado'],
  ['listo', 'entregado'],
];
const esValida = (d: EstadoPedido, h: EstadoPedido) => VALIDAS.some(([a, b]) => a === d && b === h);

const TODOS_LOS_PARES = ESTADOS_PEDIDO.flatMap((d) => ESTADOS_PEDIDO.map((h) => [d, h] as const));

describe('máquina de estados del pedido', () => {
  it('declara exactamente las transiciones válidas', () => {
    const declaradas = Object.entries(TRANSICIONES).flatMap(([d, hs]) => hs.map((h) => [d, h]));
    expect(declaradas.sort()).toEqual([...VALIDAS].sort());
  });

  it.each(VALIDAS)('%s → %s es válida y registra el evento', (desde, hacia) => {
    const original = pedido(desde);
    const nuevo = transicionar(original, hacia, AHORA);
    expect(nuevo.estado).toBe(hacia);
    expect(nuevo.eventos.at(-1)).toEqual({ estado: hacia, en: AHORA.toISOString() });
    expect(nuevo.eventos).toHaveLength(2);
    // No muta el original.
    expect(original.estado).toBe(desde);
    expect(original.eventos).toHaveLength(1);
  });

  it.each(TODOS_LOS_PARES.filter(([d, h]) => !esValida(d, h)))(
    '%s → %s es inválida y tira TransicionInvalidaError',
    (desde, hacia) => {
      expect(puedeTransicionar(desde, hacia)).toBe(false);
      expect(() => transicionar(pedido(desde), hacia, AHORA)).toThrow(TransicionInvalidaError);
    },
  );

  it('entregado y cancelado son finales; el resto no', () => {
    expect(ESTADOS_PEDIDO.filter(esFinal)).toEqual(['entregado', 'cancelado']);
  });

  it('avanzar recorre el camino feliz y se frena al final', () => {
    let p = pedido('recibido');
    const recorrido: EstadoPedido[] = [p.estado];
    while (siguienteEstado(p.estado)) {
      p = avanzar(p, AHORA);
      recorrido.push(p.estado);
    }
    expect(recorrido).toEqual(['recibido', 'en_preparacion', 'listo', 'entregado']);
    expect(recorrido).toEqual(PASOS_SEGUIMIENTO);
    expect(() => avanzar(p, AHORA)).toThrow(TransicionInvalidaError);
    expect(() => avanzar(pedido('cancelado'), AHORA)).toThrow(TransicionInvalidaError);
  });

  it('cada estado tiene etiqueta para el cliente y el dueño; solo los no finales tienen acción', () => {
    for (const e of ESTADOS_PEDIDO) {
      expect(ETIQUETA_ESTADO[e].cliente.length).toBeGreaterThan(0);
      expect(ETIQUETA_ESTADO[e].duenio.length).toBeGreaterThan(0);
      expect(ETIQUETA_ESTADO[e].accion === null).toBe(siguienteEstado(e) === null);
    }
  });
});
