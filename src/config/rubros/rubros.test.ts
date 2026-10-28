import { describe, expect, it } from 'vitest';
import { MODULO_IDS, MODULOS } from '../modulos';
import {
  esObjetivoDeRubro,
  getModulosDeRubro,
  getRubro,
  RUBRO_IDS,
  RUBRO_OTRO_ID,
  RUBROS,
} from './index';
import { LIMITES_RUBRO } from './types';

// Estos tests son genéricos: validan TODOS los rubros, así que sumar uno nuevo no requiere tests nuevos.
const ID_VALIDO = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

describe('config de rubros', () => {
  it('incluye los rubros iniciales pedidos', () => {
    expect(RUBRO_IDS).toEqual(
      expect.arrayContaining([
        'peluqueria_estetica',
        'gastronomia',
        'comercio',
        'profesionales',
        'gimnasio_deportes',
        'servicios_tecnicos',
        'otro',
      ]),
    );
  });

  it('tiene ids únicos y "otro" va último', () => {
    expect(new Set(RUBRO_IDS).size).toBe(RUBRO_IDS.length);
    expect(RUBROS.at(-1)?.id).toBe(RUBRO_OTRO_ID);
  });

  describe.each(RUBROS.map((r) => [r.id, r] as const))('%s', (_id, rubro) => {
    it('tiene id en snake_case ASCII', () => {
      expect(rubro.id).toMatch(ID_VALIDO);
    });

    it('respeta los límites de texto', () => {
      expect(rubro.nombre.length).toBeGreaterThan(0);
      expect(rubro.nombre.length).toBeLessThanOrEqual(LIMITES_RUBRO.nombre);
      expect(rubro.descripcionCorta.length).toBeLessThanOrEqual(LIMITES_RUBRO.descripcionCorta);
      expect(rubro.ejemploResultado.length).toBeLessThanOrEqual(LIMITES_RUBRO.ejemploResultado);
      expect(rubro.icono).toMatch(ID_VALIDO);
    });

    it('define objetivos válidos y sin repetir', () => {
      expect(rubro.objetivos.length).toBeGreaterThanOrEqual(LIMITES_RUBRO.minObjetivos);
      expect(rubro.objetivos.length).toBeLessThanOrEqual(LIMITES_RUBRO.maxObjetivos);
      const ids = rubro.objetivos.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const o of rubro.objetivos) {
        expect(o.id).toMatch(ID_VALIDO);
        expect(o.etiqueta.length).toBeLessThanOrEqual(LIMITES_RUBRO.etiquetaObjetivo);
      }
    });

    it('sugiere módulos existentes y sin repetir', () => {
      expect(rubro.modulosSugeridos.length).toBeGreaterThan(0);
      expect(new Set(rubro.modulosSugeridos).size).toBe(rubro.modulosSugeridos.length);
      for (const m of rubro.modulosSugeridos) expect(MODULO_IDS).toContain(m);
    });

    it('no promete precios ni plazos en los textos', () => {
      const textos = [rubro.descripcionCorta, rubro.ejemploResultado].join(' ');
      expect(textos).not.toMatch(/\$|USD|ARS|\d+\s*(d[ií]as|horas|semanas)|gratis/i);
    });
  });
});

describe('helpers de rubros', () => {
  it('getRubro encuentra por id y devuelve undefined si no existe', () => {
    expect(getRubro('gastronomia')?.nombre).toBe('Gastronomía');
    expect(getRubro('inexistente')).toBeUndefined();
    expect(getRubro(null)).toBeUndefined();
  });

  it('getModulosDeRubro devuelve nombre y descripción de cada módulo', () => {
    const modulos = getModulosDeRubro('gastronomia');
    expect(modulos.map((m) => m.id)).toEqual(['carta_qr', 'turnos', 'pagos', 'notificaciones']);
    expect(modulos[0]?.nombre).toBe(MODULOS.carta_qr.nombre);
    expect(getModulosDeRubro('inexistente')).toEqual([]);
  });

  it('esObjetivoDeRubro valida que el objetivo pertenezca al rubro', () => {
    expect(esObjetivoDeRubro('gastronomia', 'mostrar_carta')).toBe(true);
    expect(esObjetivoDeRubro('gastronomia', 'cobrar_cuotas')).toBe(false);
    expect(esObjetivoDeRubro('inexistente', 'mostrar_carta')).toBe(false);
  });
});

describe('catálogo de módulos', () => {
  it.each(MODULO_IDS)('%s tiene nombre y descripción', (id) => {
    expect(MODULOS[id].nombre.length).toBeGreaterThan(0);
    expect(MODULOS[id].descripcion.length).toBeGreaterThan(0);
  });
});
