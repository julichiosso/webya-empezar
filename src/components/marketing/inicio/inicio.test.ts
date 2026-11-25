// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { CONFIAN, HERO_MAPA } from '@/content/home';

describe('el pueblo del hero', () => {
  it('cinco negocios distintos, cada uno con su demo o con armar el tuyo', () => {
    const ids = HERO_MAPA.negocios.map((n) => n.id);
    expect(new Set(ids).size).toBe(5);
    for (const n of HERO_MAPA.negocios) expect(n.href).toMatch(/^\/(demos\/[a-z]+|armar)$/);
  });
});

describe('confían en Webya', () => {
  it('cada logo tiene nombre, archivo propio y medidas', () => {
    const ids = CONFIAN.logos.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of CONFIAN.logos) {
      expect(l.nombre.length).toBeGreaterThan(2);
      expect(l.src).toMatch(/^\/confian\/[a-z]+\.(svg|webp)$/);
      expect(l.ancho).toBeGreaterThan(0);
      expect(l.alto).toBeGreaterThan(0);
    }
  });
});
