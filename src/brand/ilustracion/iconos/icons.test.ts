import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { NECESIDAD_IDS } from '@/config/necesidades';
import { MODULO_IDS } from '@/content/modulos';
import { RUBROS } from '@/content/rubros';
import { cajaDePath } from '../geometria';
import { GRILLA_ICONO, TOKENS_USADOS } from '../grilla';
import { Icon } from './Icon';
import {
  ICONO_DE_NECESIDAD,
  ICONS,
  isIconName,
  MODULO_ICONS,
  RUBRO_ICONS,
  type IconName,
} from './paths';

// Tests genéricos: sumar un rubro o módulo sin su ícono rompe estos tests.
describe('registro de íconos', () => {
  it.each(RUBROS.map((r) => [r.id, r.icono] as const))(
    'el rubro %s tiene ícono "%s"',
    (_id, icono) => {
      expect(isIconName(icono)).toBe(true);
      expect(Object.keys(RUBRO_ICONS)).toContain(icono);
    },
  );

  it.each(MODULO_IDS)('el módulo %s tiene ícono', (id) => {
    expect(Object.keys(MODULO_ICONS)).toContain(id);
  });

  it.each(NECESIDAD_IDS)('la necesidad %s tiene ícono', (id) => {
    expect(isIconName(ICONO_DE_NECESIDAD[id])).toBe(true);
  });

  it('las necesidades no repiten el ícono de un módulo', () => {
    const deModulos = new Set<string>(Object.keys(MODULO_ICONS));
    expect(Object.values(ICONO_DE_NECESIDAD).filter((n) => deModulos.has(n))).toEqual([]);
  });
});

const NOMBRES = Object.keys(ICONS) as IconName[];

describe('grilla 24: cada ícono respeta la plantilla', () => {
  const [min, max] = GRILLA_ICONO.zona;

  it.each(NOMBRES)('%s queda dentro de la zona viva [2, 22]', (nombre) => {
    for (const d of ICONS[nombre]) {
      const c = cajaDePath(d);
      expect(c.minX, `${nombre}: ${d}`).toBeGreaterThanOrEqual(min - 0.05);
      expect(c.minY, `${nombre}: ${d}`).toBeGreaterThanOrEqual(min - 0.05);
      expect(c.maxX, `${nombre}: ${d}`).toBeLessThanOrEqual(max + 0.05);
      expect(c.maxY, `${nombre}: ${d}`).toBeLessThanOrEqual(max + 0.05);
    }
  });

  it.each(NOMBRES)('%s usa como mucho un decimal (salvo el punto .01)', (nombre) => {
    for (const d of ICONS[nombre]) {
      const finos = (d.match(/\d*\.\d{2,}/g) ?? []).filter((n) => n !== '.01');
      expect(finos, `${nombre}: ${d}`).toEqual([]);
    }
  });

  it.each(NOMBRES)('%s se dibuja en 24×24, trazo 1.5, redondo y sin relleno', (nombre) => {
    const { container } = render(createElement(Icon, { name: nombre }));
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('stroke-width', '1.5');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    // Solo <path> (para que el dibujado con stroke-dashoffset sea igual en todos), sin fill propio.
    const hijos = [...svg.children];
    expect(hijos.length).toBeGreaterThan(0);
    expect(hijos.every((h) => h.tagName === 'path' && !h.hasAttribute('fill'))).toBe(true);
  });

  it('con title, comunica: role img y <title> con el texto que viene por props', () => {
    const { container } = render(createElement(Icon, { name: 'check', title: 'Listo' }));
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).not.toHaveAttribute('aria-hidden');
    expect(svg.querySelector('title')?.textContent).toBe('Listo');
  });
});

describe('sistema de ilustración: sin colores sueltos', () => {
  const carpeta = resolve(__dirname, '..');
  const archivos = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const p = join(dir, n);
      return statSync(p).isDirectory() ? archivos(p) : [p];
    });
  const fuentes = archivos(carpeta).filter((f) => /\.(tsx?|css)$/.test(f) && !/\.test\./.test(f));

  it('cero hex, rgb() ni hsl(): todo es currentColor o tokens', () => {
    const suelto = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/i;
    const con = fuentes.filter((f) => suelto.test(readFileSync(f, 'utf8')));
    expect(con.map((f) => relative(carpeta, f))).toEqual([]);
  });

  it('los tokens que usan las clases del Encastre existen en tokens.css', () => {
    const css = readFileSync(resolve(carpeta, '../tokens/tokens.css'), 'utf8');
    for (const t of TOKENS_USADOS) expect(css, t).toContain(`${t}:`);
  });
});
