import { describe, expect, it } from 'vitest';
import { COCINAS } from '@/config/demos/gastronomia';
import { pesos } from '@/domain/pedidos/dinero';
import {
  agregar,
  CANTIDAD_MAXIMA,
  cambiarCantidad,
  cantidadTotal,
  CARRITO_VACIO,
  claveLinea,
  resolverCarrito,
  totalesCarrito,
} from './carrito';

const { menu, costoEnvio } = COCINAS.pizzeria;
const muzza = (opciones: { grupoId: string; opcionId: string }[], nota?: string) => ({
  productoId: 'muzzarella',
  cantidad: 1,
  modificadores: opciones,
  nota,
});
const MEDIANA = { grupoId: 'tamanio', opcionId: 'mediana' };
const GRANDE = { grupoId: 'tamanio', opcionId: 'grande' };
const EXTRA_QUESO = { grupoId: 'agregados', opcionId: 'extra_queso' };

describe('carrito de la demo', () => {
  it('suma en la misma línea lo idéntico, sin importar el orden de las opciones', () => {
    let c = agregar(CARRITO_VACIO, muzza([GRANDE, EXTRA_QUESO]));
    c = agregar(c, muzza([EXTRA_QUESO, GRANDE]));
    expect(c).toHaveLength(1);
    expect(c[0]?.cantidad).toBe(2);
    expect(claveLinea(muzza([GRANDE, EXTRA_QUESO]))).toBe(claveLinea(muzza([EXTRA_QUESO, GRANDE])));
  });

  it('separa en líneas distintas otras opciones u otra nota', () => {
    let c = agregar(CARRITO_VACIO, muzza([MEDIANA]));
    c = agregar(c, muzza([GRANDE]));
    c = agregar(c, muzza([GRANDE], 'bien cocida'));
    expect(c).toHaveLength(3);
    expect(cantidadTotal(c)).toBe(3);
  });

  it('cambia cantidades, quita con 0 y respeta el tope', () => {
    let c = agregar(CARRITO_VACIO, muzza([MEDIANA]));
    const clave = c[0]!.clave;
    c = cambiarCantidad(c, clave, 99);
    expect(c[0]?.cantidad).toBe(CANTIDAD_MAXIMA);
    c = agregar(c, muzza([MEDIANA]));
    expect(c[0]?.cantidad).toBe(CANTIDAD_MAXIMA);
    c = cambiarCantidad(c, clave, 0);
    expect(c).toEqual([]);
  });

  it('no muta el carrito anterior', () => {
    const antes = agregar(CARRITO_VACIO, muzza([MEDIANA]));
    const despues = cambiarCantidad(antes, antes[0]!.clave, 5);
    expect(antes[0]?.cantidad).toBe(1);
    expect(despues[0]?.cantidad).toBe(5);
  });

  it('resuelve precios contra la carta y calcula totales en centavos', () => {
    let c = agregar(CARRITO_VACIO, { ...muzza([GRANDE, EXTRA_QUESO]), cantidad: 2 });
    c = agregar(c, { productoId: 'faina', cantidad: 3, modificadores: [] });
    const lineas = resolverCarrito(menu, c);
    // Muzzarella 13.500 + grande 3.500 + extra queso 2.500 = 19.500 c/u.
    expect(lineas[0]?.item.precioUnitario).toBe(pesos(19_500));
    expect(lineas[0]?.subtotal).toBe(pesos(39_000));
    expect(lineas[1]?.subtotal).toBe(pesos(5_400));
    const t = totalesCarrito(menu, c, { propinaPorcentaje: 10, modalidad: 'delivery', costoEnvio });
    expect(t).toEqual({
      subtotal: pesos(44_400),
      propina: pesos(4_440),
      envio: costoEnvio,
      total: pesos(44_400 + 4_440) + costoEnvio,
    });
  });

  it('descarta líneas que ya no existen en la carta (cambio de tipo de cocina)', () => {
    const c = agregar(CARRITO_VACIO, {
      productoId: 'bife_chorizo',
      cantidad: 1,
      modificadores: [],
    });
    expect(resolverCarrito(menu, c)).toEqual([]);
  });
});
