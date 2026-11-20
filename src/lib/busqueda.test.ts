// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { DESTINOS_BUSQUEDA, LARGO_BUSQUEDA } from '@/content/buscador';
import { buscar, limpiarConsulta, normalizar } from './busqueda';

const primero = (q: string) => buscar(DESTINOS_BUSQUEDA, q)[0]?.id;

describe('buscador del hero', () => {
  it('entiende lo que escribe un dueño de negocio, con o sin tildes', () => {
    expect(primero('turnos para mi peluquería')).toBe('turnero');
    expect(primero('Peluqueria')).toBe('turnero');
    expect(primero('quiero tomar pedidos para mi pizzería')).toBe('pedidos');
    expect(primero('vender ropa')).toBe('tienda');
    expect(primero('cuánto sale?')).toBe('precio');
    expect(primero('turnos de descarga para el acopio')).toBe('campo');
    expect(primero('que me encuentren en google')).toBe('web');
    expect(primero('San Francisco')).toBe('zona');
  });

  it('tolera plurales y palabras a medio escribir', () => {
    expect(primero('reserva')).toBe('turnero');
    expect(primero('hambur')).toBe('pedidos');
    expect(primero('catálogos')).toBe('catalogo');
  });

  it('no devuelve nada con texto vacío, de relleno o sin sentido', () => {
    expect(buscar(DESTINOS_BUSQUEDA, '')).toEqual([]);
    expect(buscar(DESTINOS_BUSQUEDA, 'a')).toEqual([]);
    expect(buscar(DESTINOS_BUSQUEDA, 'para mi')).toEqual([]);
    expect(buscar(DESTINOS_BUSQUEDA, 'xqzwv')).toEqual([]);
  });

  it('no se rompe con texto raro: etiquetas, símbolos, control y textos larguísimos', () => {
    const raro = '<script>alert(1)</script> \u0000\u0007 ((([[ .*+?^${}| \\';
    expect(() => buscar(DESTINOS_BUSQUEDA, raro)).not.toThrow();
    expect(normalizar(raro)).not.toMatch(/[<>()[\]{}$^*+?|\\]/);
    const largo = limpiarConsulta('turnos '.repeat(500), LARGO_BUSQUEDA);
    expect(largo.length).toBeLessThanOrEqual(LARGO_BUSQUEDA);
    expect(limpiarConsulta('a\u0000b\u001fc', 10)).toBe('abc');
  });

  it('como mucho cinco sugerencias, la mejor primero', () => {
    const r = buscar(DESTINOS_BUSQUEDA, 'turnos pedidos tienda web campo stock precio demo');
    expect(r.length).toBeLessThanOrEqual(5);
  });
});
