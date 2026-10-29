import { beforeEach, describe, expect, it } from 'vitest';
import { pesos } from '@/domain/pedidos/dinero';
import {
  agregarAlCarrito,
  cerrarSeguimiento,
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

  it('cerrar el seguimiento no borra el pedido', () => {
    fainas(1);
    confirmarPedido(RETIRO);
    cerrarSeguimiento();
    expect(getEstadoDemo().seguimientoId).toBeNull();
    expect(getEstadoDemo().pedidos).toHaveLength(1);
  });
});
