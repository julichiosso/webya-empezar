import { describe, expect, it } from 'vitest';
import { CLAVE_TRASPASO_DEMO, dejarTraspasoDemo } from '@/domain/traspaso/demo-wizard';
import { aplicarTraspasoDemo } from './desde-demo';
import { leerEstadoGuardado, modulosDe, sanearDemo, STORAGE_KEY } from './state';

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

describe('de la demo al flujo (traspaso por domain/traspaso)', () => {
  it('deja el flujo en la pantalla 2 con rubro, nombre, origen y lo armado en la demo', () => {
    const s = storage();
    dejarTraspasoDemo(TRASPASO, s);
    expect(aplicarTraspasoDemo(s)).toBe(true);
    const e = leerEstadoGuardado(s);
    expect(e).toMatchObject({
      paso: 'negocio',
      rubro: 'gastronomia',
      origen: 'demo_gastronomia',
      demo: { paleta: 'pileta', cocina: 'parrilla' },
    });
    expect(e?.datos.nombreNegocio).toBe('Lo de Tito');
    // Los módulos activos son EXACTAMENTE los de la demo (lo sugerido que no está, apagado).
    expect(modulosDe(e!).sort()).toEqual(['carta_qr', 'notificaciones', 'pagos'].sort());
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
    const e = leerEstadoGuardado(s)!;
    expect(e.demo).toBeNull();
    expect(modulosDe(e)).toEqual(['carta_qr']);

    s.setItem(CLAVE_TRASPASO_DEMO, '{roto');
    expect(aplicarTraspasoDemo(s)).toBe(false);
  });

  it('sanearDemo: solo paletas y cocinas de la demo', () => {
    expect(sanearDemo({ paleta: 'brasa', cocina: 'sushi' })).toBeNull();
    expect(sanearDemo('nada')).toBeNull();
    expect(sanearDemo({ paleta: 'brasa', cocina: 'cafe', extra: 1 })).toEqual({
      paleta: 'brasa',
      cocina: 'cafe',
    });
  });
});
