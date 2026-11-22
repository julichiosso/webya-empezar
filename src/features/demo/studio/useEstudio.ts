'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { ControlesEstudio } from '@/domain/studio/controles';
import { conHistorial, historialDe } from '@/domain/studio/historial';
import { desempaquetar, empaquetar } from '@/lib/compartir';

export type { ControlesEstudio };

interface Opciones<E, A> {
  /** Clave de guardado en este dispositivo (una por demo). */
  clave: string;
  reducir: (e: E, a: A) => E;
  inicial: () => E;
  /** Valida lo que llega de un link o del guardado; null si no sirve (se ignora, nunca rompe). */
  validar: (v: unknown) => E | null;
  /** Lo que se guarda y se comparte: sin fotos locales (`blob:`), que no sobreviven fuera de la pestaña. */
  portable?: (e: E) => unknown;
  resumen: (e: E) => readonly string[];
}

const HASH = /[#&]demo=([\w-]+)/;

/**
 * Estado de una demo personalizable: historial (deshacer, rehacer, empezar de nuevo), carga desde un link
 * compartido o desde lo guardado, guardado automático en este dispositivo y link para compartir.
 * El almacenamiento puede fallar (modo privado): todo sigue en memoria sin avisar errores técnicos.
 */
export function useEstudio<E, A>({
  clave,
  reducir,
  inicial,
  validar,
  portable = (e) => e,
  resumen,
}: Opciones<E, A>) {
  const reducirHistorial = useMemo(() => conHistorial(reducir), [reducir]);
  const [h, despachar] = useReducer(reducirHistorial, undefined, () => historialDe(inicial()));
  const cargado = useRef(false);

  // Primero el link compartido; si no hay, lo guardado en este dispositivo.
  useEffect(() => {
    let vivo = true;
    void (async () => {
      let valor: E | null = null;
      const m = HASH.exec(window.location.hash);
      if (m?.[1]) valor = validar(await desempaquetar(m[1]));
      if (!valor) {
        try {
          const crudo = window.localStorage.getItem(clave);
          if (crudo) valor = validar(JSON.parse(crudo));
        } catch {
          // Sin almacenamiento o dato viejo: se arranca con el ejemplo.
        }
      }
      if (vivo && valor) despachar({ tipo: 'cargar', estado: valor });
      cargado.current = true;
    })();
    return () => {
      vivo = false;
    };
    // Solo al abrir la demo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cargado.current) return;
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(clave, JSON.stringify(portable(h.presente)));
      } catch {
        // Lleno o bloqueado: sigue en memoria.
      }
    }, 400);
    return () => clearTimeout(t);
  }, [clave, h.presente, portable]);

  const aplicar = useCallback((accion: A) => despachar({ tipo: 'aplicar', accion }), []);
  const presente = h.presente;

  const controles: ControlesEstudio = {
    deshacer: () => despachar({ tipo: 'deshacer' }),
    rehacer: () => despachar({ tipo: 'rehacer' }),
    reiniciar: () => despachar({ tipo: 'reiniciar', estado: inicial() }),
    puedeDeshacer: h.pasado.length > 0,
    puedeRehacer: h.futuro.length > 0,
    enlace: async () => {
      const { origin, pathname } = window.location;
      return `${origin}${pathname}#demo=${await empaquetar(portable(presente))}`;
    },
    resumen: resumen(presente),
  };

  return { estado: presente, aplicar, controles };
}
