import { describe, expect, it } from 'vitest';
import { hhmmAMin, minAHhmm } from '@/domain/retiro/franjas';
import {
  agregar,
  ahoraDemo,
  alternarAbierto,
  alternarBloqueo,
  alternarProducto,
  cambiarCantidad,
  cambiarCapacidad,
  confirmarPedido,
  cotizar,
  crearEstado,
  crearPedido,
  crearStore,
  franjasConConteo,
  productosVisibles,
  totalItems,
} from './store';

const T0 = 1_000_000;
const ahora = hhmmAMin('20:40');

describe('demo de pedidos: estado', () => {
  it('arranca el viernes a las 20:40, con la noche cargada y el reloj corriendo', () => {
    const e = crearEstado(T0);
    expect(minAHhmm(ahoraDemo(e, T0))).toBe('20:40');
    expect(minAHhmm(ahoraDemo(e, T0 + 5 * 60_000))).toBe('20:45');
    const llena = franjasConConteo(e).find((f) => f.inicio === hhmmAMin('20:45'))!;
    expect(llena.pedidos).toBe(llena.capacidad);
  });

  it('lo antes posible salta la franja llena de las 20:45', () => {
    const c = cotizar(crearEstado(T0), ahora, { modo: 'asap' })!;
    expect(minAHhmm(c.franja.inicio)).toBe('21:00');
    expect(c.huboSalto).toBe(true);
    expect(minAHhmm(c.retiro.hora)).toBe('21:15');
  });

  it('el carrito junta iguales, separa mitad y mitad y suma bien', () => {
    let e = crearEstado(T0);
    e = agregar(e, 'muzzarella', 'xl');
    e = agregar(e, 'muzzarella', 'xl');
    e = agregar(e, 'muzzarella', 'media_xl', 'napolitana');
    e = agregar(e, 'gaseosa', 'unico', 'napolitana');
    expect(e.carrito).toHaveLength(3);
    expect(e.carrito[0]!.cantidad).toBe(2);
    expect(e.carrito[2]!.mitadId).toBeUndefined();
    expect(totalItems(e.carrito)).toBe(14000 * 2 + 8000 + 3500);
    e = cambiarCantidad(e, e.carrito[0]!.clave, -2);
    expect(e.carrito).toHaveLength(2);
  });

  it('el pedido entra pendiente en su franja, vacía el carrito y el dueño lo confirma', () => {
    let e = agregar(crearEstado(T0), 'fugazeta', 'clasica');
    const r = crearPedido(e, ahora, {
      nombre: '  Ana Pérez ',
      modo: { modo: 'franja', inicio: hhmmAMin('21:30') },
    })!;
    e = r.estado;
    expect(r.pedido).toMatchObject({ nombre: 'Ana Pérez', estado: 'pendiente', propio: true });
    expect(r.pedido.lineas).toEqual(['1x Fugazeta (Clásica)']);
    expect(e.carrito).toHaveLength(0);
    expect(e.ultimoPropio).toBe(r.pedido.id);
    e = confirmarPedido(e, r.pedido.id);
    expect(e.pedidos.find((p) => p.id === r.pedido.id)!.estado).toBe('confirmado');
  });

  it('sin nombre, carrito vacío, local cerrado o franja llena: no hay pedido', () => {
    const e = agregar(crearEstado(T0), 'fugazeta', 'clasica');
    expect(crearPedido(e, ahora, { nombre: ' ', modo: { modo: 'asap' } })).toBeNull();
    expect(
      crearPedido(crearEstado(T0), ahora, { nombre: 'Ana', modo: { modo: 'asap' } }),
    ).toBeNull();
    expect(
      crearPedido(alternarAbierto(e), ahora, { nombre: 'Ana', modo: { modo: 'asap' } }),
    ).toBeNull();
    const llena = { modo: 'franja' as const, inicio: hhmmAMin('20:45') };
    expect(crearPedido(e, ahora, { nombre: 'Ana', modo: llena })).toBeNull();
  });

  it('pausar o subir el cupo cambia la franja que toca', () => {
    let e = cambiarCapacidad(crearEstado(T0), hhmmAMin('20:45'), 1);
    expect(minAHhmm(cotizar(e, ahora, { modo: 'asap' })!.franja.inicio)).toBe('20:45');
    e = alternarBloqueo(e, hhmmAMin('20:45'));
    expect(minAHhmm(cotizar(e, ahora, { modo: 'asap' })!.franja.inicio)).toBe('21:00');
  });

  it('ocultar un producto lo saca de la carta', () => {
    const e = alternarProducto(crearEstado(T0), 'muzzarella', 'activo');
    expect(productosVisibles(e, 'pizzas').some((p) => p.id === 'muzzarella')).toBe(false);
  });

  it('el store avisa los cambios y no avisa si nada cambió', () => {
    const s = crearStore(T0);
    let avisos = 0;
    s.subscribe(() => avisos++);
    s.set((e) => agregar(e, 'muzzarella', 'xl'));
    s.set((e) => e);
    expect(avisos).toBe(1);
  });
});
