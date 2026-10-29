import { describe, expect, it } from 'vitest';
import { prepararWizardDesdeDemo } from './desde-demo';
import { modulosSeleccionados } from './modulos';
import { leerManualGuardado } from './modulos-store';
import { leerEstadoGuardado, sanearDemo } from './state';

function storage() {
  const datos = new Map<string, string>();
  return {
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => void datos.set(k, v),
    removeItem: (k: string) => void datos.delete(k),
  };
}

describe('de la demo al wizard', () => {
  it('deja el wizard en el paso 2 con rubro, nombre, origen y lo armado en la demo', () => {
    const s = storage();
    prepararWizardDesdeDemo(
      {
        origen: 'demo_gastronomia',
        rubro: 'gastronomia',
        modulos: ['carta_qr', 'pagos', 'notificaciones'],
        nombreNegocio: 'Lo de Tito',
        demo: { paleta: 'pileta', cocina: 'parrilla' },
      },
      s,
    );
    const e = leerEstadoGuardado(s);
    expect(e).toMatchObject({
      paso: 2,
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

  it('al leer, sanea origen y demo: nada fuera de las listas cerradas', () => {
    const s = storage();
    s.setItem(
      'webya:empezar:v1',
      JSON.stringify({
        paso: 2,
        rubro: 'gastronomia',
        origen: 'hackeado',
        demo: { paleta: 'arcoiris', cocina: 'parrilla' },
      }),
    );
    const e = leerEstadoGuardado(s);
    expect(e?.origen).toBeNull();
    expect(e?.demo).toBeNull();
    expect(sanearDemo({ paleta: 'brasa', cocina: 'sushi' })).toBeNull();
    expect(sanearDemo('nada')).toBeNull();
    expect(sanearDemo({ paleta: 'brasa', cocina: 'cafe', extra: 1 })).toEqual({
      paleta: 'brasa',
      cocina: 'cafe',
    });
  });
});
