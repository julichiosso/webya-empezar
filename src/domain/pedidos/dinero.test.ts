import { describe, expect, it } from 'vitest';
import { esCentavos, formatearPesos, multiplicar, pesos, porcentaje, sumar } from './dinero';

// Intl usa espacio duro entre el signo y el número: se normaliza para comparar.
const plano = (s: string) => s.replace(/\s/g, ' ');

describe('dinero', () => {
  it('formatea pesos redondos sin decimales y con punto de miles', () => {
    expect(plano(formatearPesos(2_390_000))).toBe('$ 23.900');
    expect(plano(formatearPesos(0))).toBe('$ 0');
  });

  it('muestra los centavos cuando los hay, con coma decimal', () => {
    expect(plano(formatearPesos(2_390_050))).toBe('$ 23.900,50');
    expect(plano(formatearPesos(5))).toBe('$ 0,05');
  });

  it('convierte pesos a centavos enteros sin errores de coma flotante', () => {
    expect(pesos(23_900)).toBe(2_390_000);
    expect(pesos(0.1 + 0.2)).toBe(30);
  });

  it('rechaza montos que no son centavos enteros', () => {
    expect(esCentavos(10.5)).toBe(false);
    expect(esCentavos(Number.NaN)).toBe(false);
    expect(() => formatearPesos(10.5)).toThrow();
  });

  it('suma y multiplica solo enteros', () => {
    expect(sumar(10, 20, 30)).toBe(60);
    expect(sumar()).toBe(0);
    expect(multiplicar(1_350_000, 3)).toBe(4_050_000);
    expect(() => sumar(10, 0.5)).toThrow();
    expect(() => multiplicar(100, 1.5)).toThrow();
    expect(() => multiplicar(100, -1)).toThrow();
  });

  it('porcentaje redondea al centavo una sola vez, mitad hacia arriba', () => {
    expect(porcentaje(10_000, 10)).toBe(1_000);
    // 105 × 15 % = 15,75 → 16
    expect(porcentaje(105, 15)).toBe(16);
    // 1 × 50 % = 0,5 → 1 (mitad hacia arriba)
    expect(porcentaje(1, 50)).toBe(1);
    expect(porcentaje(2_390_050, 0)).toBe(0);
    expect(() => porcentaje(100, 10.5)).toThrow();
    expect(() => porcentaje(100, 101)).toThrow();
  });
});
