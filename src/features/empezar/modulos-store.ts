'use client';

import { useSyncExternalStore } from 'react';
import type { ModuloId } from '@/config/modulos';
import { alternarModulo, modulosSeleccionados, sanearManual, type ModulosManual } from './modulos';

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

function leer(): ModulosSnapshot {
  try {
    const raw = window.sessionStorage.getItem(MODULOS_STORAGE_KEY);
    return { manual: raw ? sanearManual(JSON.parse(raw)) : {}, rubro: null };
  } catch {
    return { manual: {}, rubro: null };
  }
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
