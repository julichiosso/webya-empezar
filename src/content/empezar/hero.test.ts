import { describe, expect, it } from 'vitest';
import { SEO_EMPEZAR } from '@/content/seo';
import { HERO } from './hero';
import { HERO_VARIANTES } from './hero-variantes';

const palabras = (t: string) => t.trim().split(/\s+/).length;

describe('hero de /empezar', () => {
  it('hay 3 variantes razonadas y se publica una sola', () => {
    expect(HERO_VARIANTES).toHaveLength(3);
    expect(HERO_VARIANTES.filter((v) => v.elegida)).toHaveLength(1);
    for (const v of HERO_VARIANTES) expect(v.razonamiento.length).toBeGreaterThan(80);
  });

  it('HERO es la variante elegida', () => {
    const elegida = HERO_VARIANTES.find((v) => v.elegida)!;
    expect({
      titulo: HERO.titulo,
      subtitulo: HERO.subtitulo,
      bajada: HERO.bajada,
      cta: HERO.cta,
    }).toEqual({
      titulo: elegida.titulo,
      subtitulo: elegida.subtitulo,
      bajada: elegida.bajada,
      cta: elegida.cta,
    });
  });

  it.each(HERO_VARIANTES.map((v) => [v.id, v] as const))(
    '%s: cada línea del titular con hasta 8 palabras y la salvedad "a medida"',
    (_id, v) => {
      expect(palabras(v.titulo)).toBeLessThanOrEqual(8);
      expect(palabras(v.subtitulo)).toBeLessThanOrEqual(8);
      expect(`${v.titulo} ${v.subtitulo} ${v.bajada}`).toMatch(/a medida/);
    },
  );

  it('el SEO y la imagen para compartir dicen lo mismo que el hero', () => {
    expect(SEO_EMPEZAR.og.titulo).toBe(HERO.titulo);
    expect(SEO_EMPEZAR.og.subtitulo).toBe(HERO.subtitulo);
    expect(SEO_EMPEZAR.descripcion).toMatch(/a medida/);
    expect(SEO_EMPEZAR.descripcion.length).toBeLessThanOrEqual(160);
  });
});
