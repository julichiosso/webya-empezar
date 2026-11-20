'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AVISOS_ISLA as A } from '@/content/home';
import { Cerrar } from './Iconos';

const ESPERA_MS = 400;
const DURA_MS = 4600;
const ENTRE_MS = 900;
const CLAVE = 'webya:avisos-vistos';

const ICONOS: Record<(typeof A.items)[number]['icono'], React.ReactNode> = {
  tilde: (
    <>
      <circle cx="12" cy="12" r="9" pathLength={1} />
      <path d="m8 12.5 2.8 2.8L16.5 9.5" pathLength={1} />
    </>
  ),
  probar: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" pathLength={1} />
      <path d="M11 17.5h2" pathLength={1} />
    </>
  ),
  zona: (
    <>
      <path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21Z" pathLength={1} />
      <circle cx="12" cy="10.5" r="2.2" pathLength={1} />
    </>
  ),
};

/**
 * Avisos al entrar, como la isla del iPhone: una píldora negra abajo, al centro (en el celular, arriba de la
 * barra de atajos), que se abre, muestra un dato y se
 * cierra; después el siguiente. Tres datos verdaderos, una sola vez por visita, se frenan con el mouse y se
 * pueden cerrar. Se anuncian a lectores de pantalla sin interrumpir (aria-live polite).
 */
export function AvisosIsla({ enProduccion }: { enProduccion: number }) {
  const [actual, setActual] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [pausa, setPausa] = useState(false);
  const [cerrado, setCerrado] = useState(false);

  // Arranca una sola vez por pestaña. Los navegadores automatizados (tests, bots) no los ven.
  useEffect(() => {
    if (navigator.webdriver) return;
    try {
      if (sessionStorage.getItem(CLAVE)) return;
      sessionStorage.setItem(CLAVE, '1');
    } catch {
      // Sin almacenamiento: se muestran igual.
    }
    const t = setTimeout(() => {
      setActual(0);
      setVisible(true);
    }, ESPERA_MS);
    return () => clearTimeout(t);
  }, []);

  // Cada aviso dura un rato, se cierra y abre el siguiente.
  useEffect(() => {
    if (actual < 0 || pausa || cerrado) return;
    if (visible) {
      const t = setTimeout(() => setVisible(false), DURA_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (actual + 1 < A.items.length) {
        setActual(actual + 1);
        setVisible(true);
      } else setCerrado(true);
    }, ENTRE_MS);
    return () => clearTimeout(t);
  }, [actual, visible, pausa, cerrado]);

  if (actual < 0 || cerrado) return null;
  const a = A.items[actual]!;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={A.etiqueta}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 lg:bottom-6"
    >
      <div
        data-visible={visible || undefined}
        onMouseEnter={() => setPausa(true)}
        onMouseLeave={() => setPausa(false)}
        className="e-isla pointer-events-auto flex items-center gap-1 rounded-full bg-black text-white"
      >
        <Link
          key={actual}
          href={a.href}
          className="flex min-h-12 items-center gap-3 py-2 pr-1 pl-2.5"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="e-isla-icono size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONOS[a.icono]}
            </svg>
          </span>
          <span className="e-isla-texto min-w-0 pr-1">
            <span className="block truncate text-[0.875rem] leading-tight font-semibold">
              {a.titulo(enProduccion)}
            </span>
            <span className="block truncate text-[0.75rem] leading-tight text-white/65">
              {a.texto}
            </span>
          </span>
        </Link>
        <button
          type="button"
          aria-label={A.cerrar}
          onClick={() => setCerrado(true)}
          className="mr-1 grid size-10 shrink-0 place-items-center rounded-full text-white/60 hover:text-white"
        >
          <Cerrar className="size-4" />
        </button>
      </div>
    </div>
  );
}
