// @vitest-environment node
import { ShapeUtils } from 'three';
import { describe, expect, it } from 'vitest';
import { aVec3 } from '@/lib/color';
import { alcanza, type Capacidad } from './capacidad';
import { PIEZAS, formaCorchete, formaW } from './geometria';
import { calcularProgreso } from './progreso';

const capaz: Capacidad = {
  webgl2: true,
  nucleos: 8,
  memoria: 8,
  ahorroDatos: false,
  movimientoReducido: false,
};

describe('capacidad: WebGL solo donde no perjudica', () => {
  it('un equipo capaz carga la escena', () => expect(alcanza(capaz)).toBe(true));
  it('sin memoria informada (Safari, Firefox) decide por núcleos', () =>
    expect(alcanza({ ...capaz, memoria: null })).toBe(true));
  it.each([
    ['sin WebGL2', { webgl2: false }],
    ['ahorro de datos', { ahorroDatos: true }],
    ['movimiento reducido', { movimientoReducido: true }],
    ['2 núcleos', { nucleos: 2 }],
    ['2 GB de memoria', { memoria: 2 }],
  ])('%s → poster', (_, cambio) => expect(alcanza({ ...capaz, ...cambio })).toBe(false));
});

describe('progreso de los tres estados', () => {
  it('0 arriba, 1 al final del tramo fijo, sin pasarse', () => {
    expect(calcularProgreso(0, 1500, 900)).toBe(0);
    expect(calcularProgreso(-300, 1500, 900)).toBeCloseTo(0.5);
    expect(calcularProgreso(-600, 1500, 900)).toBe(1);
    expect(calcularProgreso(-2000, 1500, 900)).toBe(1);
    expect(calcularProgreso(200, 1500, 900)).toBe(0);
  });
  it('sin tramo fijo (movimiento reducido) avanza al irse de pantalla', () => {
    expect(calcularProgreso(0, 900, 900)).toBe(0);
    expect(calcularProgreso(-270, 900, 900)).toBeCloseTo(0.5);
  });
});

describe('geometría del símbolo <w>', () => {
  it('las formas son polígonos simples con área (se pueden extruir)', () => {
    for (const forma of [formaCorchete(false), formaW(), formaCorchete(true)]) {
      const puntos = forma.getPoints();
      expect(Math.abs(ShapeUtils.area(puntos))).toBeGreaterThan(0.3);
    }
  });
  it('la "w" es simétrica y más ancha que los corchetes', () => {
    const xs = formaW()
      .getPoints()
      .map((p) => p.x);
    expect(Math.min(...xs)).toBeCloseTo(-Math.max(...xs));
    const cx = formaCorchete()
      .getPoints()
      .map((p) => p.x);
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(Math.max(...cx) - Math.min(...cx));
  });
  it('armado, las piezas no se tocan', () => {
    const [izq, medio, der] = PIEZAS.armado;
    expect(medio.x - izq.x).toBeGreaterThan(2);
    expect(der.x - medio.x).toBeGreaterThan(2);
  });
});

describe('aVec3', () => {
  it('convierte hex a 0–1', () => {
    expect(aVec3('#ff8000')).toEqual([1, 128 / 255, 0]);
  });
});
