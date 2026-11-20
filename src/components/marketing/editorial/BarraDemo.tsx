'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { BARRA_DEMOS, getDemo, type DemoInfo } from '@/content/demos/hub';
import { track } from '@/lib/analytics';
import { TextoBoton, TrazoBoton } from './Boton';
import { enlaceContacto } from './contacto';
import { EnUso } from './EnUso';
import { WhatsApp } from './Iconos';

/**
 * Barra fina de arriba de cada demo: dice que es una demo, abre "qué más hace el sistema real",
 * reinicia y vuelve a la lista. La demo se siente como otro sistema: no lleva el encabezado del sitio.
 */
export function BarraDemo({
  demo,
  onReiniciar,
}: {
  demo: DemoInfo['id'];
  onReiniciar?: () => void;
}) {
  const d = getDemo(demo);
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  const caja = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  // La primera vez que se entra a cada demo, el aviso se abre solo (una vez por pestaña).
  useEffect(() => {
    const clave = `webya:demo-aviso:${demo}`;
    let visto = false;
    try {
      visto = window.sessionStorage.getItem(clave) === '1';
      window.sessionStorage.setItem(clave, '1');
    } catch {
      // Sin almacenamiento (modo privado estricto): se muestra igual.
    }
    if (visto) return;
    const t = setTimeout(() => setAbierto(true), 200);
    return () => clearTimeout(t);
  }, [demo]);

  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setAbierto(false);
      boton.current?.focus();
    };
    const afuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    window.addEventListener('keydown', tecla);
    window.addEventListener('pointerdown', afuera);
    return () => {
      window.removeEventListener('keydown', tecla);
      window.removeEventListener('pointerdown', afuera);
    };
  }, [abierto]);

  const cta = () => track('demo_cta_click', { demo, origen: 'barra' });
  const whatsapp = enlaceContacto(BARRA_DEMOS.mensaje(d.barra)).href;

  return (
    <div ref={caja} className="tono-oscuro sticky top-0 z-40 border-b border-ed-line bg-ed-bg">
      <div className="flex h-11 items-center gap-2 px-3 md:h-12 md:px-5">
        <span className="rounded-full bg-ed-fg/12 px-2.5 py-1 text-[0.6875rem] leading-none font-semibold tracking-[0.06em] uppercase">
          {BARRA_DEMOS.marca}
        </span>
        <p className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium">{d.barra}</p>
        <button
          ref={boton}
          type="button"
          aria-expanded={abierto}
          aria-controls={id}
          aria-label={BARRA_DEMOS.infoAria}
          onClick={() => setAbierto((a) => !a)}
          className="flex min-h-10 items-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] text-ed-muted hover:text-ed-fg aria-expanded:text-ed-fg"
        >
          <Info />
          <span className="hidden sm:inline">{BARRA_DEMOS.info}</span>
        </button>
        {onReiniciar ? (
          <button
            type="button"
            onClick={onReiniciar}
            aria-label={BARRA_DEMOS.reiniciar}
            className="grid size-10 place-items-center rounded-full text-ed-muted hover:text-ed-fg"
          >
            <Reinicio />
          </button>
        ) : null}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener"
          aria-label={BARRA_DEMOS.escribinosAria}
          onClick={() => track('demo_whatsapp_click', { demo })}
          className="flex min-h-10 items-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] text-ed-muted hover:text-ed-fg"
        >
          <WhatsApp />
          <span className="hidden sm:inline">{BARRA_DEMOS.escribinos}</span>
        </a>
        <Link
          href="/demos"
          aria-label={BARRA_DEMOS.salirAria}
          className="flex min-h-10 items-center rounded-full px-2.5 text-[0.8125rem] text-ed-muted hover:text-ed-fg"
        >
          {BARRA_DEMOS.salir}
        </Link>
        <span className="hidden md:block">
          <a href={d.cta.href} onClick={cta} className="e-btn e-btn-primario e-btn-chico">
            <TrazoBoton />
            <TextoBoton>{d.cta.texto}</TextoBoton>
          </a>
        </span>
      </div>
      {abierto ? (
        <div
          id={id}
          role="region"
          aria-label={BARRA_DEMOS.aviso.titulo}
          className="absolute inset-x-0 top-full border-b border-ed-line bg-ed-bg px-4 py-5 md:right-5 md:left-auto md:w-[24rem] md:rounded-b-2xl md:border-x"
        >
          <p className="text-[0.9375rem] font-semibold">{BARRA_DEMOS.aviso.titulo}</p>
          <p className="mt-1 text-[0.8125rem] text-ed-muted">{BARRA_DEMOS.aviso.texto}</p>
          <p className="mt-4 text-[0.8125rem] font-semibold">{BARRA_DEMOS.aviso.ademas}</p>
          <ul className="mt-2 space-y-1.5 text-[0.8125rem] text-ed-muted">
            {d.ademas.map((a) => (
              <li key={a} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-ed-fg" />
                {a}
              </li>
            ))}
          </ul>
          {d.enUso ? <EnUso proyecto={d.enUso} className="mt-5" /> : null}
          <div className="mt-5 flex items-center gap-3">
            <a href={d.cta.href} onClick={cta} className="e-btn e-btn-primario e-btn-chico">
              <TrazoBoton />
              <TextoBoton>{d.cta.texto}</TextoBoton>
            </a>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="min-h-10 px-2 text-[0.8125rem] text-ed-muted hover:text-ed-fg"
            >
              {BARRA_DEMOS.aviso.cerrar}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Info() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-[1.125rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8" />
      <path d="M10 9v5M10 6.2v.1" strokeLinecap="round" />
    </svg>
  );
}

function Reinicio() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
