// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { BIO_INSTAGRAM, CAPTIONS_INSTAGRAM } from '@/content/instagram';

const palabras = (t: string) => t.trim().split(/\s+/).length;

describe('Instagram', () => {
  it('la bio entra en 150 caracteres, lleva el link a /empezar y la salvedad', () => {
    expect(BIO_INSTAGRAM.texto.length).toBeLessThanOrEqual(150);
    expect(BIO_INSTAGRAM.texto).toContain('/empezar');
    expect(BIO_INSTAGRAM.texto).toMatch(/a medida/);
    expect(BIO_INSTAGRAM.link).toMatch(/\/empezar$/);
  });

  it('hay una caption por pilar', () => {
    expect(CAPTIONS_INSTAGRAM.map((c) => c.pilar).sort()).toEqual(
      ['a_medida', 'confianza', 'demo_gastronomia', 'todo_lo_digital', 'turnos'].sort(),
    );
  });

  it.each(CAPTIONS_INSTAGRAM)(
    '$pilar: gancho corto, cuerpo breve, CTA a la bio, hashtags acotados',
    (c) => {
      expect(palabras(c.gancho)).toBeLessThanOrEqual(8);
      expect(c.cuerpo.length).toBeGreaterThanOrEqual(1);
      expect(c.cuerpo.length).toBeLessThanOrEqual(2);
      expect(c.cta).toMatch(/link de la bio|link en la bio/);
      expect(c.hashtags.length).toBeGreaterThanOrEqual(3);
      expect(c.hashtags.length).toBeLessThanOrEqual(5);
      for (const h of c.hashtags) expect(h).toMatch(/^#[A-Za-z]+$/);
      // Sin emojis, sin exclamaciones ni rayas (se leen como texto de IA).
      expect(c.texto).not.toMatch(/[!¡—]|\p{Extended_Pictographic}/u);
      expect(c.texto.startsWith(c.gancho)).toBe(true);
      expect(c.texto).not.toContain(c.antesDePublicar ?? '\u0000');
    },
  );

  it('"todo lo digital" va con "a medida"', () => {
    const todo = CAPTIONS_INSTAGRAM.find((c) => c.pilar === 'todo_lo_digital');
    expect(todo?.texto).toMatch(/a medida/);
  });

  it('la demo dice que es una demo', () => {
    const demo = CAPTIONS_INSTAGRAM.find((c) => c.pilar === 'demo_gastronomia');
    expect(demo?.texto).toMatch(/datos de ejemplo/);
  });
});
