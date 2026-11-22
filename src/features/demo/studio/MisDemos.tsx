'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { DEMOS, HUB_DEMOS } from '@/content/demos/hub';

interface Guardada {
  id: string;
  titulo: string;
  nombre: string;
  href: string;
}

let cache: { clave: string; lista: Guardada[] } = { clave: '', lista: [] };

/** Las demos que la persona ya empezó en este dispositivo (lo guarda el motor del estudio). */
function leer(): Guardada[] {
  try {
    const crudos = DEMOS.map((d) => window.localStorage.getItem(`webya:demo:${d.id}`) ?? '');
    const clave = crudos.join('|');
    if (clave === cache.clave) return cache.lista;
    const lista = DEMOS.flatMap((d, i): Guardada[] => {
      if (!crudos[i]) return [];
      const v = JSON.parse(crudos[i]!) as { nombre?: unknown };
      const nombre = typeof v.nombre === 'string' ? v.nombre.trim().slice(0, 40) : '';
      return nombre ? [{ id: d.id, titulo: d.titulo, nombre, href: d.href }] : [];
    });
    cache = { clave, lista };
    return lista;
  } catch {
    return cache.lista;
  }
}

const VACIA: Guardada[] = [];
const suscribir = (avisar: () => void) => {
  window.addEventListener('storage', avisar);
  return () => window.removeEventListener('storage', avisar);
};

/** "Seguí donde dejaste": aparece solo si hay demos guardadas en este dispositivo. */
export function MisDemos() {
  const lista = useSyncExternalStore(suscribir, leer, () => VACIA);
  if (lista.length === 0) return null;
  return (
    <section aria-labelledby="mis-demos" className="mx-auto mt-14 max-w-3xl">
      <h2 id="mis-demos" className="a-ceja text-center">
        {HUB_DEMOS.misDemos}
      </h2>
      <p className="mt-1 text-center text-[1rem] text-ed-muted">{HUB_DEMOS.misDemosAyuda}</p>
      <ul className="mt-5 divide-y divide-ed-line border-y border-ed-line">
        {lista.map((d) => (
          <li key={d.id}>
            <Link
              href={d.href}
              prefetch={false}
              className="flex min-h-16 items-center justify-between gap-4 py-3 text-[1.125rem]"
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold">{d.nombre}</span>
                <span className="block text-[1rem] text-ed-muted">{d.titulo}</span>
              </span>
              <span className="shrink-0 font-medium underline underline-offset-4">
                {HUB_DEMOS.retomar}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
