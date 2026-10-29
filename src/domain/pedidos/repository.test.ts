import { describe, expect, it } from 'vitest';
import { TransicionInvalidaError } from './estados';
import { crearPedidoRepositoryMemoria, PedidoNoEncontradoError } from './repository';
import type { BorradorPedido } from './types';

const borrador = (tenantId: string, cambios: Partial<BorradorPedido> = {}): BorradorPedido => ({
  tenantId,
  localId: 'l1',
  modalidad: 'retiro',
  cliente: { nombre: 'Ana' },
  mesa: null,
  direccion: null,
  medioPago: 'efectivo',
  propinaPorcentaje: 0,
  items: [
    {
      productoId: 'agua',
      nombre: 'Agua',
      cantidad: 1,
      precioUnitario: 200_000,
      modificadores: [],
      nota: null,
    },
  ],
  totales: { subtotal: 200_000, propina: 0, envio: 0, total: 200_000 },
  ...cambios,
});

function repo() {
  let n = 0;
  return crearPedidoRepositoryMemoria({
    ahora: () => new Date('2026-10-29T12:00:00.000Z'),
    nuevoId: () => `id-${++n}`,
  });
}

describe('PedidoRepository en memoria', () => {
  it('crea en estado recibido, con evento inicial y fecha', async () => {
    const p = await repo().crear(borrador('t1'));
    expect(p).toMatchObject({ id: 'id-1', numero: 1, estado: 'recibido' });
    expect(p.eventos).toEqual([{ estado: 'recibido', en: '2026-10-29T12:00:00.000Z' }]);
    expect(p.creadoEn).toBe('2026-10-29T12:00:00.000Z');
  });

  it('numera de a uno POR TENANT, sin saltos ni cruces', async () => {
    const r = repo();
    const numeros = [];
    for (const t of ['a', 'a', 'b', 'a', 'b'])
      numeros.push([t, (await r.crear(borrador(t))).numero]);
    expect(numeros).toEqual([
      ['a', 1],
      ['a', 2],
      ['b', 1],
      ['a', 3],
      ['b', 2],
    ]);
  });

  it('sigue la numeración desde los pedidos iniciales', async () => {
    const r1 = repo();
    const previo = await r1.crear(borrador('a'));
    const r2 = crearPedidoRepositoryMemoria({ iniciales: [{ ...previo, numero: 41 }] });
    expect((await r2.crear(borrador('a'))).numero).toBe(42);
  });

  it('un tenant no ve ni toca pedidos de otro', async () => {
    const r = repo();
    const p = await r.crear(borrador('a'));
    expect(await r.obtener('b', p.id)).toBeNull();
    expect(await r.listar('b')).toEqual([]);
    await expect(r.cambiarEstado('b', p.id, 'en_preparacion')).rejects.toThrow(
      PedidoNoEncontradoError,
    );
    expect((await r.obtener('a', p.id))?.estado).toBe('recibido');
  });

  it('lista más nuevos primero y filtra por estado y modalidad', async () => {
    const r = repo();
    const p1 = await r.crear(borrador('a', { modalidad: 'mesa', mesa: '1' }));
    const p2 = await r.crear(borrador('a', { modalidad: 'delivery', direccion: 'X 1' }));
    await r.crear(borrador('a'));
    await r.cambiarEstado('a', p1.id, 'en_preparacion');
    expect((await r.listar('a')).map((p) => p.numero)).toEqual([3, 2, 1]);
    expect((await r.listar('a', { estado: 'en_preparacion' })).map((p) => p.id)).toEqual([p1.id]);
    expect((await r.listar('a', { modalidad: 'delivery' })).map((p) => p.id)).toEqual([p2.id]);
  });

  it('cambia de estado con la máquina de estados y rechaza saltos', async () => {
    const r = repo();
    const p = await r.crear(borrador('a'));
    await expect(r.cambiarEstado('a', p.id, 'entregado')).rejects.toThrow(TransicionInvalidaError);
    expect((await r.obtener('a', p.id))?.estado).toBe('recibido');
    const listo = await r.cambiarEstado('a', p.id, 'en_preparacion');
    expect(listo.eventos.map((e) => e.estado)).toEqual(['recibido', 'en_preparacion']);
    await expect(r.cambiarEstado('a', 'no-existe', 'listo')).rejects.toThrow(
      PedidoNoEncontradoError,
    );
  });

  it('devuelve copias: mutar lo que sale no cambia lo guardado', async () => {
    const r = repo();
    const p = await r.crear(borrador('a'));
    p.estado = 'entregado';
    p.items[0]!.cantidad = 99;
    const guardado = await r.obtener('a', p.id);
    expect(guardado?.estado).toBe('recibido');
    expect(guardado?.items[0]?.cantidad).toBe(1);
  });
});
