import { describe, expect, it } from 'vitest';
import { pesos } from './dinero';
import { armarPedido, type EntradaPedido } from './schemas';
import type { Menu } from './types';

const MENU: Menu = {
  categorias: [{ id: 'c', nombre: 'Carnes' }],
  productos: [
    {
      id: 'bife',
      categoriaId: 'c',
      nombre: 'Bife',
      descripcion: '',
      precio: pesos(20_000),
      ilustracion: 'carne',
      modificadores: [
        {
          id: 'punto',
          nombre: 'Punto de cocción',
          tipo: 'unico',
          obligatorio: true,
          opciones: [
            { id: 'jugoso', nombre: 'Jugoso', precio: 0 },
            { id: 'cocido', nombre: 'Cocido', precio: 0 },
          ],
        },
        {
          id: 'extras',
          nombre: 'Extras',
          tipo: 'multiple',
          obligatorio: false,
          opciones: [
            { id: 'huevo', nombre: 'Huevo', precio: pesos(1_500) },
            { id: 'sin_sal', nombre: 'Sin sal', precio: 0 },
          ],
        },
      ],
    },
    {
      id: 'agua',
      categoriaId: 'c',
      nombre: 'Agua',
      descripcion: '',
      precio: pesos(2_000),
      ilustracion: 'agua',
      modificadores: [],
    },
  ],
};

const CTX = { tenantId: 't1', localId: 'l1', costoEnvio: pesos(2_500) };

const base = (cambios: Partial<EntradaPedido> = {}): EntradaPedido => ({
  modalidad: 'retiro',
  cliente: { nombre: 'Ana' },
  medioPago: 'efectivo',
  propinaPorcentaje: 0,
  items: [
    {
      productoId: 'bife',
      cantidad: 2,
      modificadores: [
        { grupoId: 'punto', opcionId: 'jugoso' },
        { grupoId: 'extras', opcionId: 'huevo' },
      ],
    },
  ],
  ...cambios,
});

const errores = (entrada: unknown) => {
  const r = armarPedido(MENU, entrada, CTX);
  return r.ok ? [] : r.errores;
};

describe('armarPedido (validación del servidor)', () => {
  it('resuelve precios y nombres desde la carta', () => {
    const r = armarPedido(MENU, base({ propinaPorcentaje: 10 }), CTX);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const [item] = r.borrador.items;
    expect(item?.nombre).toBe('Bife');
    expect(item?.precioUnitario).toBe(pesos(21_500));
    expect(item?.modificadores.map((m) => m.nombre)).toEqual(['Jugoso', 'Huevo']);
    expect(r.borrador.totales).toEqual({
      subtotal: pesos(43_000),
      propina: pesos(4_300),
      envio: 0,
      total: pesos(47_300),
    });
    expect(r.borrador.tenantId).toBe('t1');
  });

  it('ignora cualquier precio que mande el cliente', () => {
    const tramposo = {
      ...base(),
      items: [{ productoId: 'agua', cantidad: 1, modificadores: [], precio: 1 }],
      totales: { total: 1 },
    };
    const r = armarPedido(MENU, tramposo, CTX);
    expect(r.ok && r.borrador.totales.total).toBe(pesos(2_000));
  });

  it('cobra envío solo en delivery y exige la dirección', () => {
    expect(errores(base({ modalidad: 'delivery' }))).toContain('Decinos a dónde te lo llevamos.');
    const r = armarPedido(MENU, base({ modalidad: 'delivery', direccion: 'Calle 123' }), CTX);
    expect(r.ok && r.borrador.totales.envio).toBe(pesos(2_500));
    expect(r.ok && r.borrador.direccion).toBe('Calle 123');
  });

  it('en mesa exige el número de mesa y no guarda dirección', () => {
    expect(errores(base({ modalidad: 'mesa' }))).toContain('Decinos en qué mesa estás.');
    const r = armarPedido(MENU, base({ modalidad: 'mesa', mesa: '4', direccion: 'no va' }), CTX);
    expect(r.ok && r.borrador.mesa).toBe('4');
    expect(r.ok && r.borrador.direccion).toBeNull();
  });

  it('rechaza platos y opciones que no están en la carta', () => {
    expect(
      errores(base({ items: [{ productoId: 'langosta', cantidad: 1, modificadores: [] }] })),
    ).toEqual(['El plato langosta no está en la carta.']);
    expect(
      errores(
        base({
          items: [
            {
              productoId: 'agua',
              cantidad: 1,
              // Opción de OTRO plato: no vale.
              modificadores: [{ grupoId: 'extras', opcionId: 'huevo' }],
            },
          ],
        }),
      ),
    ).toEqual(['Agua: esa opción no existe.']);
  });

  it('exige los grupos obligatorios y una sola opción en los de tipo único', () => {
    expect(
      errores(base({ items: [{ productoId: 'bife', cantidad: 1, modificadores: [] }] })),
    ).toEqual(['Bife: elegí punto de cocción.']);
    expect(
      errores(
        base({
          items: [
            {
              productoId: 'bife',
              cantidad: 1,
              modificadores: [
                { grupoId: 'punto', opcionId: 'jugoso' },
                { grupoId: 'punto', opcionId: 'cocido' },
              ],
            },
          ],
        }),
      ),
    ).toEqual(['Bife: elegí una sola opción de punto de cocción.']);
  });

  it('rechaza opciones repetidas', () => {
    expect(
      errores(
        base({
          items: [
            {
              productoId: 'bife',
              cantidad: 1,
              modificadores: [
                { grupoId: 'punto', opcionId: 'jugoso' },
                { grupoId: 'extras', opcionId: 'sin_sal' },
                { grupoId: 'extras', opcionId: 'sin_sal' },
              ],
            },
          ],
        }),
      ),
    ).toEqual(['Bife: hay opciones repetidas.']);
  });

  it.each([
    ['carrito vacío', { items: [] }],
    ['cantidad 0', { items: [{ productoId: 'agua', cantidad: 0, modificadores: [] }] }],
    ['cantidad 21', { items: [{ productoId: 'agua', cantidad: 21, modificadores: [] }] }],
    [
      'cantidad con decimales',
      { items: [{ productoId: 'agua', cantidad: 1.5, modificadores: [] }] },
    ],
    ['propina que no se ofrece', { propinaPorcentaje: 12 }],
    ['medio de pago desconocido', { medioPago: 'bitcoin' }],
    ['modalidad desconocida', { modalidad: 'drone' }],
    ['nombre de 1 letra', { cliente: { nombre: 'A' } }],
    [
      'nota demasiado larga',
      { items: [{ productoId: 'agua', cantidad: 1, modificadores: [], nota: 'x'.repeat(141) }] },
    ],
  ])('rechaza: %s', (_caso, cambios) => {
    expect(errores({ ...base(), ...cambios }).length).toBeGreaterThan(0);
  });

  it('rechaza lo que no es un objeto', () => {
    expect(errores(null).length).toBeGreaterThan(0);
    expect(errores('pedido').length).toBeGreaterThan(0);
  });
});
