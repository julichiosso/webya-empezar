import { describe, expect, it } from 'vitest';
import { RUBRO_IDS } from '@/content/rubros';
import { CLIENTES, clientesPorRubro } from './clientes';

describe('clientes', () => {
  it('cada cliente tiene un rubro válido, https y captura con alt', () => {
    for (const c of CLIENTES) {
      expect(RUBRO_IDS, c.id).toContain(c.rubroId);
      expect(c.url, c.id).toMatch(/^https:\/\//);
      expect(c.captura, c.id).toMatch(/^\/clientes\/.+\.webp$/);
      expect(c.alt.length, c.id).toBeGreaterThan(20);
    }
  });

  it('agrupa por rubro y nunca deja un grupo vacío', () => {
    const grupos = clientesPorRubro();
    expect(grupos.length).toBeGreaterThan(0);
    for (const g of grupos) expect(g.clientes.length).toBeGreaterThan(0);
    expect(grupos.flatMap((g) => g.clientes)).toHaveLength(CLIENTES.length);
  });

  it("no usa la URL vieja de Micio's", () => {
    expect(CLIENTES.map((c) => c.url)).not.toContain('https://micios.com.ar');
  });
});
