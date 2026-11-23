// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { CONFIAN, HERO_CALLE } from '@/content/home';
import { NOCHE, calcularProgreso, pasoDe } from './ProgresoCalle';

describe('progreso de la calle', () => {
  it('arriba es 0, al soltar el escenario es 1 y no se pasa', () => {
    expect(calcularProgreso(0, 2600, 1000)).toBe(0);
    expect(calcularProgreso(-800, 2600, 1000)).toBe(0.5);
    expect(calcularProgreso(-1600, 2600, 1000)).toBe(1);
    expect(calcularProgreso(-4000, 2600, 1000)).toBe(1);
    expect(calcularProgreso(300, 2600, 1000)).toBe(0);
  });

  it('sin tramo (sección de una pantalla) avanza con lo que se scrolleó', () => {
    expect(calcularProgreso(0, 1000, 1000)).toBe(0);
    expect(calcularProgreso(-300, 1000, 1000)).toBe(0.5);
  });

  it('una palabra del lema por momento, en orden', () => {
    expect([0, 0.29, 0.3, 0.59, 0.6, 1].map(pasoDe)).toEqual([0, 0, 1, 1, 2, 2]);
    expect(HERO_CALLE.lineas).toHaveLength(HERO_CALLE.lema.length);
  });

  it('se hace de noche antes de que tu negocio quede solo abierto (paso 1)', () => {
    expect(pasoDe(NOCHE)).toBe(0);
    expect(NOCHE).toBeLessThan(0.3);
  });
});

describe('confían en Webya', () => {
  it('cada logo tiene nombre, archivo propio y medidas', () => {
    const ids = CONFIAN.logos.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of CONFIAN.logos) {
      expect(l.nombre.length).toBeGreaterThan(2);
      expect(l.src).toMatch(/^\/confian\/[a-z]+\.(svg|webp)$/);
      expect(l.ancho).toBeGreaterThan(0);
      expect(l.alto).toBeGreaterThan(0);
    }
  });
});
