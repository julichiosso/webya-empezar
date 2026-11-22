// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { LARGO_BUSQUEDA } from '@/content/buscador';
import { DESTINOS_BUSQUEDA, RUBRO_POR_PALABRA } from '@/content/buscador-destinos';
import { RUBROS_CONFIG } from '@/content/configurador';
import { buscar, detectarRubro, distancia, limpiarConsulta, normalizar } from './busqueda';

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
    // Una letra sola ya sugiere (ver "consultas cortas"): acá solo lo vacío y lo que no dice nada.
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

describe('búsqueda por intención: errores de tipeo, demos y rubro', () => {
  it('tolera errores de tipeo comunes', () => {
    expect(primero('peluqeria')).toBe('turnero');
    expect(primero('pizeria')).toBe('pedidos');
    expect(primero('turnso')).toBe('turnero');
    expect(primero('hamburgesas')).toBe('pedidos');
  });

  it('las palabras cortas no se confunden por un error de tipeo', () => {
    expect(distancia('bar', 'mar', 0)).toBe(1);
    expect(primero('xyz')).toBeUndefined();
  });

  it('junto al sistema aparece su demo', () => {
    const ids = buscar(DESTINOS_BUSQUEDA, 'peluquería').map((d) => d.id);
    expect(ids.slice(0, 2)).toEqual(['turnero', 'demo-turnos']);
  });

  it('detecta el rubro aunque esté mal escrito', () => {
    expect(detectarRubro('turnos para mi peluqeria', RUBRO_POR_PALABRA)).toBe('estetica');
    expect(detectarRubro('pedidos de mi pizzerías', RUBRO_POR_PALABRA)).toBe('gastronomia');
    expect(detectarRubro('quiero vender ropa', RUBRO_POR_PALABRA)).toBe('comercio');
    expect(detectarRubro('quiero algo', RUBRO_POR_PALABRA)).toBeNull();
  });

  it('cada rubro del mapa existe en el configurador', () => {
    const ids = new Set(RUBROS_CONFIG.map((r) => r.id));
    for (const r of Object.values(RUBRO_POR_PALABRA)) expect(ids.has(r), r).toBe(true);
  });

  it('distancia corta apenas supera el máximo', () => {
    expect(distancia('turnos', 'turnso', 1)).toBe(1);
    expect(distancia('a', 'abcdef', 2)).toBe(3);
  });
});

describe('consultas cortas', () => {
  const items = [
    { titulo: 'Pedidos online', palabras: ['pizzería', 'delivery'] },
    { titulo: 'Turnero', palabras: ['peluquería', 'turnos'] },
    { titulo: 'Tienda', palabras: ['ropa'] },
  ];
  it('con una letra sugiere lo que empieza así', () => {
    expect(buscar(items, 'p').map((i) => i.titulo)).toEqual(['Pedidos online', 'Turnero']);
    expect(buscar(items, 'ro').map((i) => i.titulo)).toEqual(['Tienda']);
  });
  it('vacío no sugiere nada', () => {
    expect(buscar(items, '  ')).toEqual([]);
  });
});

describe('el buscador que escucha', () => {
  it('reconoce el problema dicho con palabras de todos los días', async () => {
    const { PROBLEMAS } = await import('@/content/buscador-destinos');
    const { detectarProblema } = await import('./busqueda');
    expect(detectarProblema('Me reservan y NO VIENEN', PROBLEMAS)?.destino).toBe('turnero');
    expect(detectarProblema('los viernes no doy abasto', PROBLEMAS)?.destino).toBe('pedidos');
    expect(detectarProblema('nadie me encuentra en Google', PROBLEMAS)?.destino).toBe('web');
    expect(detectarProblema('hola', PROBLEMAS)).toBeNull();
  });

  it('cada problema lleva a un destino que existe', async () => {
    const { PROBLEMAS, DESTINOS_BUSQUEDA } = await import('@/content/buscador-destinos');
    const ids = new Set(DESTINOS_BUSQUEDA.map((d) => d.id));
    for (const p of PROBLEMAS) {
      expect(ids.has(p.destino), p.id).toBe(true);
      if (p.demo) expect(ids.has(p.demo), p.id).toBe(true);
    }
  });
});
