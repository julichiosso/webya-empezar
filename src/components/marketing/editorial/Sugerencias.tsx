'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import {
  REGLAS_SUGERENCIAS as R,
  SUGERENCIAS,
  SUGERENCIAS_UI as UI,
  type Sugerencia,
} from '@/content/sugerencias';
import { track } from '@/lib/analytics';
import { enlaceContacto } from './contacto';
import { Cerrar } from './Iconos';
import { LogoWebya } from '@/brand/logo/LogoWebya';

const CLAVE = 'webya:sugerencias';

interface Registro {
  vistas: string[];
}

function leer(): Registro {
  try {
    const r = JSON.parse(sessionStorage.getItem(CLAVE) ?? 'null') as Registro | null;
    return r && Array.isArray(r.vistas) ? r : { vistas: [] };
  } catch {
    return { vistas: [] };
  }
}

function guardar(r: Registro) {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(r));
  } catch {
    // Sin almacenamiento: dentro de la página igual se respeta (estado en memoria).
  }
}

/** ¿La persona está escribiendo? Entonces nada aparece: no se tapa el campo ni el teclado. */
const escribiendo = () => {
  const el = document.activeElement;
  return el instanceof HTMLElement && el.matches('input, textarea, select, [contenteditable]');
};

/**
 * Sugerencias según lo que se está mirando (no por reloj). Reglas: una visible a la vez, como mucho tres
 * por visita, ninguna se repite (vista o cerrada no vuelve), nunca mientras se escribe, se van solas y
 * siempre se pueden cerrar. Se carga solo en el celular y la tablet, y no con movimiento reducido.
 */
export function Sugerencias() {
  const ruta = usePathname();
  const [actual, setActual] = useState<Sugerencia | null>(null);
  const registro = useRef<Registro>({ vistas: [] });

  useEffect(() => {
    registro.current = leer();
    const propias = SUGERENCIAS.filter((s) => s.ruta === ruta);
    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    let visible: string | null = null;

    const mostrar = (s: Sugerencia) => {
      const r = registro.current;
      if (visible || r.vistas.includes(s.id) || r.vistas.length >= R.maxPorVisita) return;
      if (escribiendo()) return;
      visible = s.id;
      registro.current = { vistas: [...r.vistas, s.id] };
      guardar(registro.current);
      setActual(s);
      track('sugerencia', { id: s.id, accion: 'vista' });
    };

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const s = propias.find((p) => e.target.matches(p.seccion));
          if (!s) continue;
          if (e.isIntersecting) {
            if (!timers.has(s.id))
              timers.set(
                s.id,
                setTimeout(() => mostrar(s), R.esperaMs),
              );
          } else {
            clearTimeout(timers.get(s.id));
            timers.delete(s.id);
            // Si la persona ya pasó de largo, la sugerencia de esa sección se va.
            if (visible === s.id) {
              visible = null;
              setActual(null);
            }
          }
        }
      },
      // Franja del medio de la pantalla: vale igual para secciones cortas y para las que miden varias
      // pantallas (con un porcentaje de la sección, las largas nunca llegaban).
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
    );
    for (const s of propias) {
      const el = document.querySelector(s.seccion);
      if (el) io.observe(el);
    }
    const alEscribir = () => {
      if (!escribiendo()) return;
      visible = null;
      setActual(null);
    };
    document.addEventListener('focusin', alEscribir);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      document.removeEventListener('focusin', alEscribir);
    };
  }, [ruta]);

  // Se va sola después de unos segundos.
  useEffect(() => {
    if (!actual) return;
    const t = setTimeout(() => setActual(null), R.duraMs);
    return () => clearTimeout(t);
  }, [actual]);

  if (!actual) return null;
  const whatsapp = actual.href === 'whatsapp';
  const href = whatsapp ? enlaceContacto(MENSAJE_CONTACTO).href : actual.href;
  const tocar = () => {
    track('sugerencia', { id: actual.id, accion: 'toque' });
    setActual(null);
  };

  return (
    <aside aria-label={UI.etiqueta} className="e-sugerencia tono-claro" aria-live="polite">
      <span className="e-sugerencia-marca" aria-hidden="true">
        <LogoWebya className="h-2.5 w-auto" />
      </span>
      <p className="min-w-0 flex-1 text-[0.8125rem] leading-snug">
        {actual.texto}{' '}
        {whatsapp ? (
          <a
            href={href}
            target="_blank"
            rel="noopener"
            onClick={tocar}
            className="font-semibold underline underline-offset-2"
          >
            {actual.accion}
          </a>
        ) : (
          <Link href={href} onClick={tocar} className="font-semibold underline underline-offset-2">
            {actual.accion}
          </Link>
        )}
      </p>
      <button
        type="button"
        aria-label={UI.cerrar}
        onClick={() => {
          track('sugerencia', { id: actual.id, accion: 'cerrada' });
          setActual(null);
        }}
        className="-my-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ed-muted"
      >
        <Cerrar />
      </button>
    </aside>
  );
}
