import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  alternarModuloStore,
  MODULOS_STORAGE_KEY,
  publicarRubro,
  reiniciarModulos,
  useModulos,
} from './modulos-store';

beforeEach(() => {
  act(() => reiniciarModulos());
});

describe('store de módulos (hero ↔ wizard)', () => {
  it('lo que se activa en el hero lo ve el wizard', () => {
    const hero = renderHook(() => useModulos());
    const wizard = renderHook(() => useModulos());
    act(() => void alternarModuloStore('turnos'));
    expect(hero.result.current.seleccionados).toEqual(['turnos']);
    expect(wizard.result.current.seleccionados).toEqual(['turnos']);
  });

  it('al elegir rubro se suman los sugeridos y se conserva lo del hero', () => {
    const { result } = renderHook(() => useModulos());
    act(() => void alternarModuloStore('carta_qr'));
    act(() => publicarRubro('comercio'));
    expect(result.current.seleccionados).toEqual(
      expect.arrayContaining(['carta_qr', 'catalogo', 'pagos']),
    );
    act(() => publicarRubro('gimnasio_deportes'));
    expect(result.current.seleccionados).toContain('carta_qr');
    expect(result.current.seleccionados).not.toContain('catalogo');
  });

  it('devuelve si el módulo quedó activo', () => {
    let activo = false;
    act(() => {
      activo = alternarModuloStore('pagos');
    });
    expect(activo).toBe(true);
    act(() => {
      activo = alternarModuloStore('pagos');
    });
    expect(activo).toBe(false);
  });

  it('persiste solo las decisiones manuales en sessionStorage', () => {
    act(() => void alternarModuloStore('turnos'));
    act(() => publicarRubro('comercio'));
    expect(JSON.parse(window.sessionStorage.getItem(MODULOS_STORAGE_KEY) ?? 'null')).toEqual({
      turnos: true,
    });
  });

  it('reiniciar borra todo', () => {
    act(() => void alternarModuloStore('turnos'));
    act(() => reiniciarModulos());
    const { result } = renderHook(() => useModulos());
    expect(result.current.seleccionados).toEqual([]);
    expect(window.sessionStorage.getItem(MODULOS_STORAGE_KEY)).toBeNull();
  });
});
