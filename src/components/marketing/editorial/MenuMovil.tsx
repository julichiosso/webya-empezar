'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { CTA, HEADER, RUTAS } from '@/content/home';
import { Cerrar, Menu, WhatsApp } from './Iconos';

/**
 * Menú del celular y la tablet: un botón que abre la lista completa (productos, demos, proyectos,
 * nosotros, zona) y los dos atajos. Se cierra con Escape, al tocar un link o el mismo botón.
 */
export function MenuMovil({ contacto }: { contacto: string }) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('keydown', alTeclear);
    // Sin scroll de fondo mientras el menú tapa la página.
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = antes;
    };
  }, [abierto]);

  const cerrar = () => setAbierto(false);
  const M = HEADER.menu;
  const fila =
    'flex min-h-14 items-center justify-between text-[1.375rem] font-medium tracking-[-0.02em] active:opacity-60';

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={abierto ? M.cerrarAria : M.abrirAria}
        onClick={() => setAbierto((a) => !a)}
        className="-mr-2 flex min-h-11 items-center gap-2 px-2 text-[0.9375rem] font-medium active:opacity-60"
      >
        <span aria-hidden="true">{M.abrir}</span>
        {abierto ? <Cerrar /> : <Menu />}
      </button>
      <div
        id={id}
        hidden={!abierto}
        className="tono-oscuro fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto"
      >
        <nav
          aria-label={HEADER.navegacion}
          className="e-wrap pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]"
        >
          <p className="e-rotulo pt-4 pb-2 text-ed-muted">{M.productos}</p>
          <ul>
            {M.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={cerrar} className={fila}>
                  {l.texto}
                </Link>
              </li>
            ))}
          </ul>
          <p className="e-rotulo pt-8 pb-2 text-ed-muted">{M.webya}</p>
          <ul>
            {M.otros.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={cerrar} className={fila}>
                  {l.texto}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <a
              href={contacto}
              target="_blank"
              rel="noopener"
              aria-label={`${CTA.escribinos}${CTA.pestana}`}
              onClick={cerrar}
              className="e-btn e-btn-secundario"
            >
              <WhatsApp />
              <span>{CTA.escribinos}</span>
            </a>
            <Link href={RUTAS.armar} onClick={cerrar} className="e-btn e-btn-primario">
              {CTA.armar}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
