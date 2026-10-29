import { beforeEach, describe, expect, it } from 'vitest';
import { pesos } from '@/domain/pedidos/dinero';
import {
  agregarAlCarrito,
  avanzarPedido,
  cancelarPedido,
  cerrarSeguimiento,
  MAXIMO_PEDIDOS,
  reiniciarDemo,
  simularPedido,
  confirmarPedido,
  ESTADO_INICIAL_DEMO,
  getEstadoDemo,
  reiniciarStoreDemo,
  type DatosCheckout,
} from './store';

const RETIRO: DatosCheckout = {
  modalidad: 'retiro',
  cliente: { nombre: 'Ana' },
  medioPago: 'efectivo',
  propinaPorcentaje: 0,
};

const fainas = (cantidad: number) =>
  agregarAlCarrito({ productoId: 'faina', cantidad, modificadores: [] });

describe('store de la demo', () => {
  beforeEach(() => reiniciarStoreDemo());

  it('confirma el carrito como pedido #1 en estado recibido, vacía el carrito y lo sigue', () => {
    fainas(2);
    const r = confirmarPedido(RETIRO, { id: 'p1', ahora: new Date('2026-10-29T12:00:00Z') });
    expect(r.ok).toBe(true);
    const e = getEstadoDemo();
    expect(e.carrito).toEqual([]);
    expect(e.seguimientoId).toBe('p1');
    expect(e.pedidos).toHaveLength(1);
    expect(e.pedidos[0]).toMatchObject({
      numero: 1,
      estado: 'recibido',
      tenantId: 'demo',
      totales: { total: pesos(3_600) },
    });
  });

  it('numera los pedidos de a uno', () => {
    for (let i = 0; i < 3; i++) {
      fainas(1);
      confirmarPedido(RETIRO);
    }
    expect(getEstadoDemo().pedidos.map((p) => p.numero)).toEqual([1, 2, 3]);
  });

  it('si la validación falla, devuelve los errores y no toca nada', () => {
    fainas(1);
    const antes = getEstadoDemo();
    const r = confirmarPedido({ ...RETIRO, modalidad: 'delivery' });
    expect(r.ok).toBe(false);
    expect(r.ok ? [] : r.errores).toContain('Decinos a dónde te lo llevamos.');
    expect(getEstadoDemo()).toBe(antes);
  });

  it('con el carrito vacío no se puede confirmar', () => {
    const r = confirmarPedido(RETIRO);
    expect(r.ok).toBe(false);
    expect(getEstadoDemo()).toEqual(ESTADO_INICIAL_DEMO);
  });

  it('el dueño avanza el pedido por la máquina de estados y puede cancelarlo', () => {
    fainas(1);
    const r = confirmarPedido(RETIRO, { id: 'p1' });
    expect(r.ok).toBe(true);
    avanzarPedido('p1');
    expect(getEstadoDemo().pedidos[0]?.estado).toBe('en_preparacion');
    avanzarPedido('p1');
    avanzarPedido('p1');
    expect(getEstadoDemo().pedidos[0]?.estado).toBe('entregado');
    // Ya terminado: avanzar o cancelar es una transición inválida.
    expect(() => avanzarPedido('p1')).toThrow();
    expect(() => cancelarPedido('p1')).toThrow();

    fainas(1);
    confirmarPedido(RETIRO, { id: 'p2' });
    cancelarPedido('p2');
    expect(getEstadoDemo().pedidos[1]?.estado).toBe('cancelado');
  });

  it('simular un pedido usa los ejemplos de la cocina, valida igual y no toca el carrito ni el seguimiento', () => {
    fainas(3);
    const p = simularPedido({ id: 's1' });
    expect(p?.numero).toBe(1);
    expect(p?.estado).toBe('recibido');
    expect(getEstadoDemo().carrito).toHaveLength(1);
    expect(getEstadoDemo().seguimientoId).toBeNull();
    // En rotación: el segundo es otro ejemplo.
    const p2 = simularPedido({ id: 's2' });
    expect(p2?.modalidad).not.toBe(p?.modalidad);
  });

  it(`guarda como mucho ${MAXIMO_PEDIDOS} pedidos y descarta primero los terminados viejos`, () => {
    for (let i = 0; i < MAXIMO_PEDIDOS; i++) simularPedido({ id: `s${i}` });
    // Entrega el primero: es el que debe salir al pasarse del tope.
    avanzarPedido('s0');
    avanzarPedido('s0');
    avanzarPedido('s0');
    simularPedido({ id: 'extra' });
    const ids = getEstadoDemo().pedidos.map((p) => p.id);
    expect(ids).toHaveLength(MAXIMO_PEDIDOS);
    expect(ids).not.toContain('s0');
    expect(ids).toContain('extra');
  });

  it('reiniciar la demo borra pedidos y carrito pero conserva la personalización', () => {
    reiniciarStoreDemo({ ...ESTADO_INICIAL_DEMO, nombreLocal: 'Lo de Tito', paletaId: 'pileta' });
    fainas(1);
    simularPedido();
    reiniciarDemo();
    const e = getEstadoDemo();
    expect(e.pedidos).toEqual([]);
    expect(e.carrito).toEqual([]);
    expect(e.nombreLocal).toBe('Lo de Tito');
    expect(e.paletaId).toBe('pileta');
  });

  it('cerrar el seguimiento no borra el pedido', () => {
    fainas(1);
    confirmarPedido(RETIRO);
    cerrarSeguimiento();
    expect(getEstadoDemo().seguimientoId).toBeNull();
    expect(getEstadoDemo().pedidos).toHaveLength(1);
  });
});
