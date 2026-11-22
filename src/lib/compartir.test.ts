// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { desempaquetar, empaquetar } from './compartir';

describe('compartir una configuración por link', () => {
  it('ida y vuelta conserva el valor, con tildes y eñes', async () => {
    const valor = {
      nombre: 'Panadería Ñandú',
      productos: [{ n: 'Medialunas', p: 1500 }],
      ok: true,
    };
    const t = await empaquetar(valor);
    expect(t.startsWith('z')).toBe(true);
    expect(t).toMatch(/^[\w-]+$/);
    expect(await desempaquetar(t)).toEqual(valor);
  });

  it('comprime: una carta repetitiva ocupa menos que su JSON', async () => {
    const carta = Array.from({ length: 30 }, (_, i) => ({ nombre: `Pizza ${i}`, precio: 6000 }));
    expect((await empaquetar(carta)).length).toBeLessThan(JSON.stringify(carta).length);
  });

  it('un texto roto o ajeno devuelve null (nunca rompe la demo)', async () => {
    expect(await desempaquetar('')).toBeNull();
    expect(await desempaquetar('xabc')).toBeNull();
    expect(await desempaquetar('z!!!')).toBeNull();
    expect(await desempaquetar('jnoesjson')).toBeNull();
  });
});
