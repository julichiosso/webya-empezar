import { describe, expect, it } from 'vitest';
import { pesos } from '@/domain/pedidos/dinero';
import type { EstadoPedido, Pedido } from '@/domain/pedidos/types';
import {
  detalleModalidad,
  esReciente,
  minutosTotales,
  resumenDelDia,
  transcurrido,
} from './calculos';

const BASE = Date.parse('2026-10-29T12:00:00.000Z');
const iso = (msDesdeBase: number) => new Date(BASE + msDesdeBase).toISOString();

function pedido(estado: EstadoPedido, total: number): Pedido {
  return {
    id: `${estado}-${total}`,
    tenantId: 'demo',
    localId: 'l',
    numero: 1,
    estado,
    modalidad: 'retiro',
    cliente: { nombre: 'Ana' },
    mesa: null,
    direccion: null,
    medioPago: 'efectivo',
    propinaPorcentaje: 0,
    items: [],
    totales: { subtotal: total, propina: 0, envio: 0, total },
    eventos: [{ estado: 'recibido', en: iso(0) }],
    creadoEn: iso(0),
  };
}

describe('cálculos del panel', () => {
  it('transcurrido: mm:ss y, desde una hora, "h min"', () => {
    expect(transcurrido(iso(0), BASE + 75_000)).toBe('01:15');
    expect(transcurrido(iso(0), BASE + 59 * 60_000 + 59_000)).toBe('59:59');
    expect(transcurrido(iso(0), BASE + 65 * 60_000)).toBe('1 h 05 min');
    // Un reloj levemente atrasado no da negativos.
    expect(transcurrido(iso(5_000), BASE)).toBe('00:00');
  });

  it('minutos totales desde que entró hasta el último evento', () => {
    const p = {
      creadoEn: iso(0),
      eventos: [{ estado: 'entregado' as const, en: iso(12 * 60_000) }],
    };
    expect(minutosTotales(p)).toBe(12);
  });

  it('el resumen sale solo de los pedidos: los cancelados no suman ventas', () => {
    const r = resumenDelDia([
      pedido('recibido', pesos(10_000)),
      pedido('listo', pesos(5_000)),
      pedido('entregado', pesos(20_000)),
      pedido('cancelado', pesos(99_000)),
    ]);
    expect(r).toEqual({
      pedidos: 3,
      enCurso: 2,
      entregados: 1,
      cancelados: 1,
      ventas: pesos(35_000),
    });
    expect(resumenDelDia([])).toEqual({
      pedidos: 0,
      enCurso: 0,
      entregados: 0,
      cancelados: 0,
      ventas: 0,
    });
  });

  it('esReciente: solo lo de los últimos segundos (no lo restaurado al recargar)', () => {
    expect(esReciente(iso(0), BASE + 3_000)).toBe(true);
    expect(esReciente(iso(0), BASE + 60_000)).toBe(false);
  });

  it('detalle de la modalidad', () => {
    expect(detalleModalidad({ modalidad: 'mesa', mesa: '4' })).toBe('Mesa 4');
    expect(detalleModalidad({ modalidad: 'retiro', mesa: null })).toBe('Retira');
    expect(detalleModalidad({ modalidad: 'delivery', mesa: null })).toBe('Delivery');
  });
});
