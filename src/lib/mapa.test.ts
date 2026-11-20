// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { MAPA_PROYECCION as P } from '@/config/zona-geo';
import { LOCALIDADES, principalDe } from '@/content/zona';
import { distanciaKm, envolvente, proyectar, zonaSuave } from './mapa';

describe('mapa de la zona', () => {
  it('todas las localidades caen dentro del encuadre, con lugar para el nombre', () => {
    for (const l of LOCALIDADES) {
      const [x, y] = proyectar(P, l.lat, l.lng);
      expect(x, l.nombre).toBeGreaterThan(20);
      expect(x, l.nombre).toBeLessThan(P.ancho - 20);
      expect(y, l.nombre).toBeGreaterThan(20);
      expect(y, l.nombre).toBeLessThan(P.alto - 20);
    }
  });

  it('la distancia San Francisco – San Jorge sale de las coordenadas reales', () => {
    const km = distanciaKm(principalDe('san-francisco'), principalDe('san-jorge'));
    expect(Math.round(km)).toBe(57);
  });

  it('la zona es la envolvente de sus localidades, cerrada y suave', () => {
    const h = envolvente([
      [0, 0],
      [10, 0],
      [5, 5],
      [10, 10],
      [0, 10],
    ]);
    expect(h).toHaveLength(4);
    const d = zonaSuave(h, 5);
    expect(d.startsWith('M')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
  });
});
