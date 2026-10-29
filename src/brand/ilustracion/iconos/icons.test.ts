import { describe, expect, it } from 'vitest';
import { MODULO_IDS } from '@/content/modulos';
import { RUBROS } from '@/content/rubros';
import { isIconName, MODULO_ICONS, RUBRO_ICONS } from './paths';

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
});
