// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { MAX_PRODUCTOS, RUBROS_TIENDA, mensajeTienda } from '@/content/demos/tienda/datos';
import { estadoInicial, leerPrecio, reducirTienda } from './estado';

describe('demo de tienda: armado', () => {
  it('arranca con el primer rubro, su nombre de ejemplo y sus productos', () => {
    const e = estadoInicial();
    expect(e.rubroId).toBe(RUBROS_TIENDA[0]!.id);
    expect(e.nombre).toBe(RUBROS_TIENDA[0]!.ejemplo);
    expect(e.productos).toHaveLength(RUBROS_TIENDA[0]!.productos.length);
  });

  it('cambiar de rubro trae sus productos y cambia el nombre solo si era el de ejemplo', () => {
    const otro = RUBROS_TIENDA[1]!;
    const e = reducirTienda(estadoInicial(), { tipo: 'rubro', id: otro.id });
    expect(e.nombre).toBe(otro.ejemplo);
    expect(e.productos.map((p) => p.nombre)).toEqual(otro.productos.map((p) => p.nombre));

    const propio = reducirTienda(estadoInicial(), { tipo: 'nombre', valor: 'Mi Local' });
    expect(reducirTienda(propio, { tipo: 'rubro', id: otro.id }).nombre).toBe('Mi Local');
  });

  it('no pasa del máximo de productos ni deja la tienda sin ninguno', () => {
    let e = estadoInicial();
    for (let i = 0; i < 5; i++) e = reducirTienda(e, { tipo: 'agregar' });
    expect(e.productos.length).toBeLessThanOrEqual(MAX_PRODUCTOS);
    for (const p of [...e.productos]) e = reducirTienda(e, { tipo: 'quitar', id: p.id });
    expect(e.productos).toHaveLength(1);
  });

  it('el precio se lee como pesos enteros, sin signos ni puntos', () => {
    expect(leerPrecio('$ 18.500')).toBe(18500);
    expect(leerPrecio('abc')).toBe(0);
    expect(leerPrecio('123456789012')).toBe(12345678);
  });

  it('el mensaje de "Quiero esta tienda" no nombra a nadie y lleva lo elegido', () => {
    const m = mensajeTienda({
      nombre: 'Tienda Aurora',
      rubro: 'Ropa y calzado',
      color: 'Azul',
      productos: [{ nombre: 'Remera', precio: 18000 }],
    });
    expect(m).toMatch(/^Hola, vengo de webya\.dev/);
    expect(m).not.toMatch(/Julián/);
    expect(m).toContain('Tienda Aurora (Ropa y calzado)');
    expect(m).toContain('- Remera: $18.000');
  });
});
