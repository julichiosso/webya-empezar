import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEY } from './state';
import {
  alternarModuloStore,
  leerManualGuardado,
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

describe('leerManualGuardado: el hero arranca apagado salvo que haya progreso', () => {
  const guardarWizard = (estado: object) =>
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  const guardarManual = () =>
    window.sessionStorage.setItem(
      MODULOS_STORAGE_KEY,
      JSON.stringify({ turnos: true, pagos: true }),
    );

  it('sin wizard guardado: descarta lo guardado y lo borra', () => {
    guardarManual();
    expect(leerManualGuardado(window.sessionStorage)).toEqual({});
    expect(window.sessionStorage.getItem(MODULOS_STORAGE_KEY)).toBeNull();
  });

  it('wizard en el paso 1 sin rubro: no hay progreso, se descarta', () => {
    guardarWizard({ paso: 1, rubro: null });
    guardarManual();
    expect(leerManualGuardado(window.sessionStorage)).toEqual({});
  });

  it('con rubro elegido: se restaura', () => {
    guardarWizard({ paso: 1, rubro: 'comercio' });
    guardarManual();
    expect(leerManualGuardado(window.sessionStorage)).toEqual({ turnos: true, pagos: true });
  });

  it('con el wizard más allá del paso 1: se restaura', () => {
    guardarWizard({ paso: 2, rubro: 'comercio', objetivos: [] });
    guardarManual();
    expect(leerManualGuardado(window.sessionStorage)).toEqual({ turnos: true, pagos: true });
  });

  it('con storage corrupto no rompe y devuelve vacío', () => {
    window.sessionStorage.setItem(MODULOS_STORAGE_KEY, '{no es json');
    expect(leerManualGuardado(window.sessionStorage)).toEqual({});
  });
});
