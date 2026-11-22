'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { LogoWebya } from '@/brand/logo/LogoWebya';
import { CTA, HEADER, MARCA, RUTAS } from '@/content/home';
import { Buscador } from './Buscador';
import { Cerrar, Chevron, Menu, WhatsApp } from './Iconos';

/**
 * Menú del celular y la tablet, a pantalla completa y por encima de todo (también del cartel de arriba):
 * su propia barra con el logo y "Cerrar", el buscador para encontrar lo suyo con sus palabras, los cuatro
 * productos con una línea cada uno, el resto en filas cortas y, fijas abajo, las dos acciones grandes.
 * Letra grande y toques de 56 px: pensado para dueños de negocio de cualquier edad. Se cierra con
 * "Cerrar", con Escape o al tocar un link.
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

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={M.abrirAria}
        onClick={() => setAbierto(true)}
        className="-mr-2 flex min-h-12 items-center gap-2 rounded-full px-3 text-[1rem] font-medium active:opacity-60"
      >
        <span aria-hidden="true">{M.abrir}</span>
        <Menu />
      </button>

      <div
        id={id}
        hidden={!abierto}
        className="m-menu tono-claro fixed inset-0 z-[70] flex flex-col bg-ed-bg"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-ed-line px-4">
          <Link
            href="/"
            onClick={cerrar}
            aria-label={MARCA.inicio}
            className="flex min-h-12 items-center"
          >
            <LogoWebya decorativo className="h-6 w-auto" />
          </Link>
          <button
            type="button"
            onClick={cerrar}
            aria-label={M.cerrarAria}
            className="flex min-h-12 items-center gap-2 rounded-full bg-ed-surface px-4 text-[1.0625rem] font-semibold active:opacity-70"
          >
            <Cerrar />
            <span aria-hidden="true">{M.cerrar}</span>
          </button>
        </div>

        <nav
          aria-label={HEADER.navegacion}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-5 pb-8"
        >
          <div className="relative z-10">
            <Buscador compacto etiqueta={M.buscar} />
          </div>

          <p className="mt-7 text-[0.9375rem] font-semibold text-ed-muted">{M.productos}</p>
          <ul className="mt-1 border-t border-ed-line">
            {M.links.map((l) => (
              <li key={l.href} className="border-b border-ed-line">
                <Link
                  href={l.href}
                  onClick={cerrar}
                  className="flex min-h-18 items-center gap-3 py-3 active:opacity-60"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.3125rem] leading-tight font-semibold tracking-[-0.02em]">
                      {l.texto}
                    </span>
                    <span className="mt-0.5 block text-[1rem] text-ed-muted">{l.detalle}</span>
                  </span>
                  <Chevron />
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={RUTAS.demos}
            onClick={cerrar}
            className="mt-5 flex min-h-18 items-center gap-3 rounded-2xl bg-ed-invert px-5 py-3 text-ed-invert-fg active:opacity-80"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[1.25rem] font-semibold">{M.probar}</span>
              <span className="block text-[1rem] opacity-75">{M.probarTexto}</span>
            </span>
            <Chevron />
          </Link>

          <p className="mt-7 text-[0.9375rem] font-semibold text-ed-muted">{M.webya}</p>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {M.otros
              .filter((l) => l.href !== RUTAS.demos)
              .map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={cerrar}
                    className="flex min-h-14 items-center rounded-2xl bg-ed-surface px-4 text-[1.0625rem] leading-tight font-medium active:opacity-60"
                  >
                    {l.texto}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="grid shrink-0 grid-cols-2 gap-2.5 border-t border-ed-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <a
            href={contacto}
            target="_blank"
            rel="noopener"
            aria-label={`${CTA.escribinos}${CTA.pestana}`}
            onClick={cerrar}
            className="e-btn e-btn-secundario min-h-14 text-[1.0625rem]"
          >
            <WhatsApp />
            <span>{CTA.escribinos}</span>
          </a>
          <Link
            href={RUTAS.armar}
            onClick={cerrar}
            className="e-btn e-btn-primario min-h-14 text-[1.0625rem]"
          >
            {CTA.armar}
          </Link>
        </div>
      </div>
    </div>
  );
}
