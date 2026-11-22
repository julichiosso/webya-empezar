import { describe, expect, it } from 'vitest';
import { APELLIDOS, NOMBRES, generador, persona, pesos } from './semilla';

describe('datos de ejemplo con semilla', () => {
  it('la misma semilla repite la secuencia y otra semilla no', () => {
    const a = generador(42);
    const b = generador(42);
    const c = generador(7);
    const sa = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(sa);
    expect([c(), c(), c()]).not.toEqual(sa);
    expect(sa.every((x) => x >= 0 && x < 1)).toBe(true);
  });

  it('las personas salen de las listas ficticias', () => {
    const [n, ap] = persona(generador(1)).split(' ');
    expect(NOMBRES).toContain(n);
    expect(APELLIDOS).toContain(ap);
  });

  it('pesos con formato argentino', () => {
    expect(pesos(12500).replace(/\s/g, ' ')).toMatch(/\$ ?12\.500/);
  });
});
