import { describe, expect, it } from 'vitest';
import { conAlfa, contraste, mezclar } from './color';

describe('color', () => {
  it('calcula el contraste WCAG (blanco/negro = 21, igual = 1)', () => {
    expect(contraste('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contraste('#ff5b24', '#ff5b24')).toBeCloseTo(1, 5);
    // Es simétrico.
    expect(contraste('#ff5b24', '#0b0b0c')).toBeCloseTo(contraste('#0b0b0c', '#ff5b24'), 10);
  });

  it('mezcla un color con alfa sobre un fondo opaco', () => {
    expect(mezclar('#ffffff', '#000000', 0.5)).toBe('#808080');
    expect(mezclar('#ff5b24', '#0b0b0c', 1)).toBe('#ff5b24');
  });

  it('pasa a rgb() con alfa en el formato de globals.css', () => {
    expect(conAlfa('#ff5b24', 0.14)).toBe('rgb(255 91 36 / 0.14)');
  });

  it('rechaza colores que no son #rrggbb', () => {
    expect(() => contraste('red', '#000000')).toThrow();
  });
});
