'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { LogoWebya } from '@/brand/logo/LogoWebya';
import { CTA, HEADER, HEADER_3D as H, MARCA, RUTAS } from '@/content/home';
import { Buscador } from './Buscador';
import { WhatsApp } from './Iconos';

/** Los dos puntos de la píldora "Menú ••" (el estado del botón, no un ícono de hamburguesa). */
function Puntos({ cuantos }: { cuantos: 1 | 2 }) {
  return (
    <span aria-hidden="true" className="m3d-puntos">
      <span />
      {cuantos === 2 ? <span /> : null}
    </span>
  );
}

const FOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menú a pantalla completa (todas las medidas): todo el sitio en tipografía enorme, el buscador,
 * "Armá tu sistema" destacado y "Escribinos". Fondo negro plano. Se abre con la píldora "Menú ••" y se
 * cierra con "Cerrar", Escape o al elegir un link. El foco queda adentro mientras está abierto y vuelve a
 * la píldora al cerrar. Letra de 28 px o más y toques de 56 px: para dueños de cualquier edad.
 */
export function MenuPantalla({ contacto, externo }: { contacto: string; externo: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const abridor = useRef<HTMLButtonElement>(null);
  const cerrarBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const raiz = panel.current;
    cerrarBtn.current?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAbierto(false);
        return;
      }
      if (e.key !== 'Tab' || !raiz) return;
      // Trampa de foco: Tab y Shift+Tab dan la vuelta adentro del menú.
      const f = [...raiz.querySelectorAll<HTMLElement>(FOCABLES)].filter((el) => el.offsetParent);
      const primero = f[0];
      const ultimo = f[f.length - 1];
      if (!primero || !ultimo) return;
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', alTeclear);
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const boton = abridor.current;
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = antes;
      boton?.focus();
    };
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <>
      <button
        ref={abridor}
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={HEADER.menu.abrirAria}
        onClick={() => setAbierto(true)}
        className="m3d-pildora m3d-pildora-gris"
      >
        <span aria-hidden="true">{H.menu}</span>
        <Puntos cuantos={2} />
      </button>

      <div
        id={id}
        ref={panel}
        hidden={!abierto}
        role="dialog"
        aria-modal="true"
        aria-label={H.menu}
        className="m3d-panel tono-oscuro"
      >
        <div className="m3d-barra e-wrap">
          <Link href="/" onClick={cerrar} aria-label={MARCA.inicio} className="m3d-logo">
            <LogoWebya decorativo className="h-6 w-auto" />
          </Link>
          <button
            ref={cerrarBtn}
            type="button"
            onClick={cerrar}
            aria-label={HEADER.menu.cerrarAria}
            className="m3d-pildora m3d-pildora-clara"
          >
            <span aria-hidden="true">{H.cerrar}</span>
            <span aria-hidden="true" className="m3d-x" />
          </button>
        </div>

        <div className="m3d-cuerpo e-wrap">
          <nav aria-label={HEADER.navegacion} className="m3d-nav">
            <ul>
              {H.links.map((l, i) => (
                <li key={l.href} style={{ '--i': i } as React.CSSProperties}>
                  <Link href={l.href} onClick={cerrar} className="m3d-link">
                    {l.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="tono-claro m3d-buscar">
            <Buscador compacto etiqueta={H.buscar} />
          </div>
          <div className="m3d-acciones">
            <Link href={RUTAS.armar} onClick={cerrar} className="m3d-armar">
              {CTA.armar}
            </Link>
            <a
              href={contacto}
              target={externo ? '_blank' : undefined}
              rel={externo ? 'noopener' : undefined}
              aria-label={externo ? `${CTA.escribinos}${CTA.pestana}` : undefined}
              onClick={cerrar}
              className="m3d-escribinos"
            >
              {externo ? <WhatsApp /> : null}
              <span>{CTA.escribinos}</span>
            </a>
            <p className="m3d-zona">{H.zona}</p>
          </div>
        </div>
      </div>
    </>
  );
}

/** Píldora negra "Escribinos •" del header (el punto es el estado: estamos atendiendo). */
export function PildoraEscribinos({ href, externo }: { href: string; externo: boolean }) {
  return (
    <a
      href={href}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noopener' : undefined}
      aria-label={externo ? `${H.escribinos}${CTA.pestana}` : undefined}
      className="m3d-pildora m3d-pildora-negra"
    >
      <span>{H.escribinos}</span>
      <Puntos cuantos={1} />
    </a>
  );
}
