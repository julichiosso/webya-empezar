'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { CTA, HEADER, HEADER_3D as H } from '@/content/home';
import type { MenuTarjetas as TarjetasMenu } from './MenuTarjetas';

/** Las tarjetas (buscador, sitio, formulario) se piden recién al abrir el menú: fuera del JS inicial. */
type Tarjetas = typeof TarjetasMenu;

/**
 * Ícono de la píldora del menú: dos líneas que se cruzan en una X al abrir (un solo trazo por línea, sin
 * puntos ni hamburguesa de tres rayas).
 */
function IconoMenu({ abierto }: { abierto: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className="m3d-icono"
      data-abierto={abierto || undefined}
    >
      <path d="M2.5 5.5h11" />
      <path d="M2.5 10.5h11" />
    </svg>
  );
}

const FOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Menú en tarjetas flotantes bajo las píldoras (la página sigue a la vista): el buscador y todo el sitio
 * con un punto en la página actual; "Armá tu sistema" destacado en negro; y "Te escribimos nosotros" para
 * dejar el WhatsApp. La píldora pasa a "Cerrar". Se cierra con Escape, tocando afuera o eligiendo un link;
 * el foco queda adentro mientras está abierto y vuelve a la píldora. En el celular, las tarjetas ocupan el
 * ancho con letra grande y toques de 56 px.
 */
export function MenuPantalla({ contacto, externo }: { contacto: string; externo: boolean }) {
  const [abierto, setAbierto] = useState(false);
  /** Una vez pedidas, las tarjetas quedan (cerrar y abrir no las vuelve a pedir). */
  const [MenuTarjetas, setTarjetas] = useState<Tarjetas | null>(null);
  const ruta = usePathname() ?? '/';
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const raiz = panel.current;
    const btn = boton.current;
    // El primer link recibe el foco apenas llegan las tarjetas (la primera vez se cargan aparte).
    const enfocar = () => raiz?.querySelector<HTMLElement>('nav a[href]')?.focus();
    enfocar();
    const espera = raiz
      ? new MutationObserver(() => {
          if (raiz.querySelector('nav a[href]')) {
            enfocar();
            espera?.disconnect();
          }
        })
      : null;
    espera?.observe(raiz!, { childList: true, subtree: true });
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAbierto(false);
        return;
      }
      if (e.key !== 'Tab' || !raiz || !btn) return;
      // Trampa de foco: el botón "Cerrar" y las tarjetas; Tab y Shift+Tab dan la vuelta.
      const f = [btn, ...raiz.querySelectorAll<HTMLElement>(FOCABLES)].filter(
        (el) => el.offsetParent && el.getAttribute('aria-hidden') !== 'true',
      );
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
    document.documentElement.toggleAttribute('data-menu', true);
    return () => {
      espera?.disconnect();
      document.removeEventListener('keydown', alTeclear);
      document.documentElement.removeAttribute('data-menu');
      btn?.focus();
    };
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <>
      <button
        ref={boton}
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={abierto ? HEADER.menu.cerrarAria : HEADER.menu.abrirAria}
        onClick={() => {
          if (!MenuTarjetas)
            void import('./MenuTarjetas').then((mod) => setTarjetas(() => mod.MenuTarjetas));
          setAbierto((a) => !a);
        }}
        className={abierto ? 'm3d-pildora m3d-pildora-blanca' : 'm3d-pildora m3d-pildora-gris'}
      >
        <span aria-hidden="true">{abierto ? H.cerrar : H.menu}</span>
        <IconoMenu abierto={abierto} />
      </button>

      {abierto ? <div className="m3d-fondo" aria-hidden="true" onClick={cerrar} /> : null}
      <div
        id={id}
        ref={panel}
        hidden={!abierto}
        role="dialog"
        aria-modal="true"
        aria-label={H.menu}
        className="m3d-panel"
      >
        {MenuTarjetas ? (
          <MenuTarjetas ruta={ruta} contacto={contacto} externo={externo} cerrar={cerrar} />
        ) : null}
      </div>
    </>
  );
}

/** Píldora negra "Escribinos" del header. */
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
    </a>
  );
}
