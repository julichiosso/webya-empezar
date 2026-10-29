import { describe, expect, it } from 'vitest';
import { ESTADOS_MODULO } from '@/config/modulos';
import { MODULO_IDS, MODULOS } from './modulos';
import { getNecesidad, NECESIDAD_IDS, NECESIDAD_OTRA_ID, NECESIDADES } from './necesidades';
import { RUBROS } from './rubros';

describe('catálogo de necesidades', () => {
  it('tiene las necesidades pedidas, en orden, y coincide con NECESIDAD_IDS', () => {
    expect(NECESIDADES.map((n) => n.id)).toEqual([
      'vender',
      'turnos',
      'carta',
      'cobrar',
      'clientes',
      'otra',
    ]);
    expect(NECESIDADES.map((n) => n.id)).toEqual([...NECESIDAD_IDS]);
    expect(NECESIDADES.map((n) => n.etiqueta)).toEqual([
      'Vender online',
      'Recibir turnos',
      'Mostrar la carta',
      'Cobrar',
      'Organizar clientes',
      'Otra cosa',
    ]);
  });

  it('"Otra cosa" va última y no sugiere módulos (abre el texto libre)', () => {
    expect(NECESIDADES.at(-1)?.id).toBe(NECESIDAD_OTRA_ID);
    expect(getNecesidad(NECESIDAD_OTRA_ID)?.modulosSugeridos).toEqual([]);
  });

  it.each(NECESIDADES.map((n) => [n.id, n] as const))(
    '%s sugiere módulos existentes, sin repetir, y tiene descripción corta',
    (_id, n) => {
      for (const m of n.modulosSugeridos) expect(MODULO_IDS).toContain(m);
      expect(new Set(n.modulosSugeridos).size).toBe(n.modulosSugeridos.length);
      expect(n.descripcion.length).toBeGreaterThan(0);
      expect(n.descripcion.length).toBeLessThanOrEqual(100);
      expect(n.descripcion).not.toMatch(/\d/);
    },
  );
});

describe('estado y necesidades de cada módulo', () => {
  it.each(MODULO_IDS)('%s tiene un estado válido y necesidades existentes', (id) => {
    expect(ESTADOS_MODULO).toContain(MODULOS[id].estado);
    for (const n of MODULOS[id].necesidades) expect(NECESIDAD_IDS).toContain(n);
  });

  it('la relación necesidad ↔ módulo es la misma en los dos catálogos', () => {
    for (const n of NECESIDADES) {
      for (const m of n.modulosSugeridos) {
        expect(MODULOS[m].necesidades as readonly string[], `${n.id} → ${m}`).toContain(n.id);
      }
    }
    for (const id of MODULO_IDS) {
      for (const n of MODULOS[id].necesidades) {
        expect(getNecesidad(n)?.modulosSugeridos, `${id} → ${n}`).toContain(id);
      }
    }
  });

  it('cada rubro sugiere módulos que existen', () => {
    for (const r of RUBROS) for (const m of r.modulosSugeridos) expect(MODULO_IDS).toContain(m);
  });
});
