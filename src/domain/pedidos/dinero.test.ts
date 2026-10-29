import { describe, expect, it } from 'vitest';
import { esCentavos, formatearPesos, pesos } from './dinero';

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
});
