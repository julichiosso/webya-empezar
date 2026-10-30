import { describe, expect, it } from 'vitest';
import { CLAVE_TRASPASO_DEMO, dejarTraspasoDemo } from '@/domain/traspaso/demo-wizard';
import { aplicarTraspasoDemo } from './desde-demo';
import { modulosSeleccionados } from './modulos';
import { leerManualGuardado } from './modulos-store';
import { leerEstadoGuardado, sanearDemo, STORAGE_KEY } from './state';

function storage() {
  const datos = new Map<string, string>();
  return {
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => void datos.set(k, v),
    removeItem: (k: string) => void datos.delete(k),
  };
}

const TRASPASO = {
  origen: 'demo_gastronomia',
  rubro: 'gastronomia',
  modulos: ['carta_qr', 'pagos', 'notificaciones'],
  nombreNegocio: 'Lo de Tito',
  demo: { paleta: 'pileta', cocina: 'parrilla' },
} as const;

describe('de la demo al wizard (traspaso por domain/traspaso)', () => {
  it('deja el wizard en el paso 3 (módulos) con rubro, nombre, origen y lo armado en la demo', () => {
    const s = storage();
    dejarTraspasoDemo(TRASPASO, s);
    expect(aplicarTraspasoDemo(s)).toBe(true);
    const e = leerEstadoGuardado(s);
    expect(e).toMatchObject({
      paso: 3,
      rubro: 'gastronomia',
      origen: 'demo_gastronomia',
      demo: { paleta: 'pileta', cocina: 'parrilla' },
    });
    expect(e?.datos.nombreNegocio).toBe('Lo de Tito');

    // Los módulos activos son EXACTAMENTE los de la demo (lo sugerido que no está, apagado).
    const manual = leerManualGuardado(s);
    expect(modulosSeleccionados('gastronomia', manual).sort()).toEqual(
      ['carta_qr', 'notificaciones', 'pagos'].sort(),
    );
  });

  it('se toma una sola vez: después no queda nada que aplicar', () => {
    const s = storage();
    dejarTraspasoDemo(TRASPASO, s);
    aplicarTraspasoDemo(s);
    expect(s.getItem(CLAVE_TRASPASO_DEMO)).toBeNull();
    expect(aplicarTraspasoDemo(s)).toBe(false);
  });

  it('un traspaso adulterado no se aplica y lo desconocido se descarta', () => {
    const s = storage();
    s.setItem(CLAVE_TRASPASO_DEMO, JSON.stringify({ ...TRASPASO, rubro: 'hackeado' }));
    expect(aplicarTraspasoDemo(s)).toBe(false);
    expect(s.getItem(STORAGE_KEY)).toBeNull();

    s.setItem(
      CLAVE_TRASPASO_DEMO,
      JSON.stringify({ ...TRASPASO, modulos: ['carta_qr', 'virus'], demo: { paleta: 'x' } }),
    );
    expect(aplicarTraspasoDemo(s)).toBe(true);
    expect(leerEstadoGuardado(s)?.demo).toBeNull();
    expect(modulosSeleccionados('gastronomia', leerManualGuardado(s))).toEqual(['carta_qr']);

    s.setItem(CLAVE_TRASPASO_DEMO, '{roto');
    expect(aplicarTraspasoDemo(s)).toBe(false);
  });

  it('al leer, sanea origen y demo: nada fuera de las listas cerradas', () => {
    const s = storage();
    s.setItem(
      STORAGE_KEY,
      JSON.stringify({
        paso: 3,
        rubro: 'gastronomia',
        origen: 'hackeado',
        demo: { paleta: 'arcoiris', cocina: 'parrilla' },
      }),
    );
    const e = leerEstadoGuardado(s);
    expect(e?.origen).toBeNull();
    expect(e?.demo).toBeNull();
    // Sin origen es el flujo de siempre: sin necesidades marcadas vuelve al paso 1.
    expect(e?.paso).toBe(1);
    expect(sanearDemo({ paleta: 'brasa', cocina: 'sushi' })).toBeNull();
    expect(sanearDemo('nada')).toBeNull();
    expect(sanearDemo({ paleta: 'brasa', cocina: 'cafe', extra: 1 })).toEqual({
      paleta: 'brasa',
      cocina: 'cafe',
    });
  });

  it('al leer, sanea el lead guardado: un token con otro formato se descarta', () => {
    const s = storage();
    const base = { paso: 5, necesidades: ['turnos'], rubro: 'comercio' };
    s.setItem(STORAGE_KEY, JSON.stringify({ ...base, lead: { id: 'abc', token: 'corto' } }));
    expect(leerEstadoGuardado(s)).toMatchObject({ lead: null, paso: 4 });
    s.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...base, lead: { id: 'abc-123', token: 'a'.repeat(43) } }),
    );
    expect(leerEstadoGuardado(s)).toMatchObject({ paso: 5, lead: { id: 'abc-123' } });
  });
});
