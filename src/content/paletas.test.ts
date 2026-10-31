import { describe, expect, it } from 'vitest';
import {
  ALFA_SELECCION,
  BASE,
  combinaciones,
  TEMA_CLARO,
  variablesDePaleta,
} from '@/brand/tokens/colores';
import { getPaletaDemo, PALETA_DEMO_POR_DEFECTO, PALETAS_DEMO } from '@/content/demos/gastronomia';
import { AA_TEXTO, contraste, mezclar } from '@/lib/color';
import {
  esPaletaCurada,
  getPaletaCurada,
  PALETA_CURADA_IDS,
  PALETA_CURADA_POR_DEFECTO,
  PALETAS_CURADAS,
  type PaletaCurada,
} from './paletas';

const HEX = /^#[0-9a-f]{6}$/;

describe('paletas curadas (compartidas)', () => {
  it('los ids son estables: viajan en la URL de la demo, en sessionStorage y en el lead', () => {
    expect(PALETA_CURADA_IDS).toEqual([
      'brasa',
      'mostaza',
      'albahaca',
      'pileta',
      'ciruela',
      'frutilla',
    ]);
    expect(PALETAS_CURADAS.map((p) => p.id)).toEqual(PALETA_CURADA_IDS);
    expect(PALETA_CURADA_POR_DEFECTO).toBe('brasa');
  });

  it('cada color es un hex de 6 dígitos y el error nunca es el acento', () => {
    for (const p of PALETAS_CURADAS) {
      for (const c of [p.accent, p.accentFg, p.accentInk, p.danger]) expect(c, p.id).toMatch(HEX);
      expect(p.danger, p.id).not.toBe(p.accent);
      expect(p.nombre.length, p.id).toBeGreaterThan(0);
    }
  });

  it('getPaletaCurada cae en la por defecto con un id desconocido', () => {
    expect(getPaletaCurada('pileta').id).toBe('pileta');
    expect(getPaletaCurada('no-existe').id).toBe('brasa');
    expect(getPaletaCurada(null).id).toBe('brasa');
    expect(esPaletaCurada('ciruela')).toBe(true);
    expect(esPaletaCurada('gris')).toBe(false);
    expect(esPaletaCurada(undefined)).toBe(false);
  });

  it('la demo sigue leyendo las mismas paletas (re-export, mismos valores)', () => {
    expect(PALETAS_DEMO).toBe(PALETAS_CURADAS);
    expect(PALETA_DEMO_POR_DEFECTO).toBe(PALETA_CURADA_POR_DEFECTO);
    expect(getPaletaDemo('frutilla')).toBe(getPaletaCurada('frutilla'));
  });

  it('se aplica con variables CSS (contenedor con scope), nunca con colores en línea', () => {
    const vars = variablesDePaleta(getPaletaCurada('albahaca'));
    expect(Object.keys(vars).every((k) => k.startsWith('--'))).toBe(true);
    expect(vars['--accent']).toBe('#4ade80');
  });
});

/**
 * Lo que dibuja la vista previa de /empezar con una paleta (PreviewNegocio): el botón de la portada
 * (acento + su texto), la pieza con check y el día elegido de la agenda (fondo de selección con
 * texto principal), sobre el fondo y las tarjetas, en tema oscuro y en claro. El acento nunca se
 * usa como color de texto en la vista previa: en claro no llegaría a AA sobre blanco.
 */
function combinacionesVistaPrevia(p: PaletaCurada) {
  const temas = [
    { tema: 'oscuro', fg: BASE.fg, fondos: { fondo: BASE.bg, tarjeta: BASE.surface } },
    {
      tema: 'claro',
      fg: TEMA_CLARO.fg,
      fondos: { fondo: TEMA_CLARO.bg, tarjeta: TEMA_CLARO.surface },
    },
  ];
  return [
    { nombre: 'Texto del botón', texto: p.accentFg, fondo: p.accent },
    ...temas.flatMap(({ tema, fg, fondos }) =>
      Object.entries(fondos).map(([donde, fondo]) => ({
        nombre: `${tema}: texto sobre selección (${donde})`,
        texto: fg,
        fondo: mezclar(p.accent, fondo, ALFA_SELECCION),
      })),
    ),
  ];
}

describe.each(PALETAS_CURADAS.map((p) => [p.nombre, p] as const))('%s', (_n, p) => {
  it('pasa AA en todas las combinaciones de la UI', () => {
    for (const c of combinaciones(p)) {
      expect(contraste(c.texto, c.fondo), c.nombre).toBeGreaterThanOrEqual(c.minimo);
    }
  });

  it('pasa AA en la vista previa, en oscuro y en claro', () => {
    for (const c of combinacionesVistaPrevia(p)) {
      expect(contraste(c.texto, c.fondo), c.nombre).toBeGreaterThanOrEqual(AA_TEXTO);
    }
  });
});
