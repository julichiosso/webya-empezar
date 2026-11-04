import { describe, expect, it } from 'vitest';
import { RUBRO_IDS } from '@/content/rubros';
import { CLIENTES, clientesPorRubro, dominioDe, resumenClientes } from './clientes';

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

  it('cada caso lista lo que tiene el sitio y las cifras del resumen salen de los datos', () => {
    for (const c of CLIENTES) {
      expect(c.ciudad, c.id).not.toBe('');
      expect(c.armamos.length, c.id).toBeGreaterThanOrEqual(3);
    }
    expect(resumenClientes()).toEqual({
      sitios: CLIENTES.length,
      rubros: new Set(CLIENTES.map((c) => c.rubroId)).size,
    });
    expect(dominioDe('https://www.ejemplo.com.ar/x')).toBe('ejemplo.com.ar');
  });

  it("no usa la URL vieja de Micio's", () => {
    expect(CLIENTES.map((c) => c.url)).not.toContain('https://micios.com.ar');
  });
});
