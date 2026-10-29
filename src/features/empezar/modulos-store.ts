'use client';

import { useSyncExternalStore } from 'react';
import type { ModuloId } from '@/content/modulos';
import { alternarModulo, modulosSeleccionados, sanearManual, type ModulosManual } from './modulos';
import { hayProgresoGuardado } from './state';

/**
 * Store mínimo compartido entre el mockup del hero y el wizard (viven en árboles distintos).
 * `manual` se persiste en sessionStorage; `rubro` lo publica el wizard (su estado vive allá) para
 * que el hero muestre lo mismo que el wizard: sugerencias del rubro + decisiones manuales.
 */
export const MODULOS_STORAGE_KEY = 'webya:empezar:modulos:v1';

export interface ModulosSnapshot {
  manual: ModulosManual;
  rubro: string | null;
}

/** Lo que ve el servidor (y la hidratación): nada elegido. */
const VACIO: ModulosSnapshot = { manual: {}, rubro: null };

let snapshot: ModulosSnapshot | undefined;
const oyentes = new Set<() => void>();

type Storage3 = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/**
 * Lee las decisiones manuales guardadas. Solo se restauran si el wizard tiene progreso (rubro
 * elegido o más allá del paso 1): una recarga sin progreso arranca con todo apagado, así el
 * primer vistazo al hero siempre invita a tocar. Sin progreso, además, se borra lo guardado.
 */
export function leerManualGuardado(storage: Storage3): ModulosManual {
  try {
    const raw = storage.getItem(MODULOS_STORAGE_KEY);
    if (!raw) return {};
    if (!hayProgresoGuardado(storage)) {
      storage.removeItem(MODULOS_STORAGE_KEY);
      return {};
    }
    return sanearManual(JSON.parse(raw));
  } catch {
    return {};
  }
}

function leer(): ModulosSnapshot {
  return { manual: leerManualGuardado(window.sessionStorage), rubro: null };
}

function guardar(manual: ModulosManual) {
  try {
    window.sessionStorage.setItem(MODULOS_STORAGE_KEY, JSON.stringify(manual));
  } catch {
    // sessionStorage puede fallar (navegador in-app, modo privado): se sigue sin persistir
  }
}

function getSnapshot(): ModulosSnapshot {
  return (snapshot ??= leer());
}

function publicar(siguiente: ModulosSnapshot) {
  snapshot = siguiente;
  oyentes.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  oyentes.add(fn);
  return () => {
    oyentes.delete(fn);
  };
}

/** Activa o apaga un módulo (decisión manual). Devuelve si quedó activo. */
export function alternarModuloStore(id: ModuloId): boolean {
  const actual = getSnapshot();
  const manual = alternarModulo(actual.rubro, actual.manual, id);
  guardar(manual);
  publicar({ ...actual, manual });
  return manual[id] === true;
}

/** ¿La persona ya activó o apagó algún módulo a mano? (en este tab, incluso antes de recargar) */
export function hayDecisionesManuales(): boolean {
  return Object.keys(getSnapshot().manual).length > 0;
}

/** El wizard publica el rubro elegido. No toca las decisiones manuales. */
export function publicarRubro(rubro: string | null) {
  const actual = getSnapshot();
  if (actual.rubro !== rubro) publicar({ ...actual, rubro });
}

/** Borra todo (al reiniciar el flujo). */
export function reiniciarModulos() {
  try {
    window.sessionStorage.removeItem(MODULOS_STORAGE_KEY);
  } catch {
    // ver arriba
  }
  publicar({ manual: {}, rubro: null });
}

export function useModulos() {
  const { manual, rubro } = useSyncExternalStore(subscribe, getSnapshot, () => VACIO);
  return { manual, rubro, seleccionados: modulosSeleccionados(rubro, manual) };
}
