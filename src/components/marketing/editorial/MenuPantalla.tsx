'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { CTA, HEADER, HEADER_3D as H, RUTAS } from '@/content/home';
import { Buscador } from './Buscador';
import { ContactoRapido } from './ContactoRapido';
import { WhatsApp } from './Iconos';

/** Los puntos de las píldoras: el estado del botón, no un ícono de hamburguesa. */
function Puntos({ cuantos, vertical = false }: { cuantos: 1 | 2 | 3; vertical?: boolean }) {
  return (
    <span aria-hidden="true" className={vertical ? 'm3d-puntos m3d-puntos-v' : 'm3d-puntos'}>
      {Array.from({ length: cuantos }, (_, i) => (
        <span key={i} />
      ))}
    </span>
  );
}

const FOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

/** Todo el sitio, desde el mismo manifiesto que el pie: productos y el resto. */
const LINKS = [...HEADER.menu.links, ...HEADER.menu.otros];

const activo = (ruta: string, href: string) => ruta === href || ruta.startsWith(`${href}/`);

/**
 * Menú en tarjetas flotantes bajo las píldoras (la página sigue a la vista): el buscador y todo el sitio
 * con un punto en la página actual; "Armá tu sistema" destacado en negro; y "Te escribimos nosotros" para
 * dejar el WhatsApp. La píldora pasa a "Cerrar". Se cierra con Escape, tocando afuera o eligiendo un link;
 * el foco queda adentro mientras está abierto y vuelve a la píldora. En el celular, las tarjetas ocupan el
 * ancho con letra grande y toques de 56 px.
 */
export function MenuPantalla({ contacto, externo }: { contacto: string; externo: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname() ?? '/';
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const raiz = panel.current;
    const btn = boton.current;
    raiz?.querySelector<HTMLElement>('nav a[href]')?.focus();
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
        onClick={() => setAbierto((a) => !a)}
        className={abierto ? 'm3d-pildora m3d-pildora-blanca' : 'm3d-pildora m3d-pildora-gris'}
      >
        <span aria-hidden="true">{abierto ? H.cerrar : H.menu}</span>
        {abierto ? <Puntos cuantos={3} vertical /> : <Puntos cuantos={2} />}
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
        <div className="m3d-tarjeta tono-claro">
          <div className="m3d-buscar">
            <Buscador compacto etiqueta={H.buscar} />
          </div>
          <nav aria-label={HEADER.navegacion}>
            <ul className="m3d-lista">
              {LINKS.map((l, i) => {
                const aca = activo(ruta, l.href);
                return (
                  <li key={l.href} style={{ '--i': i } as React.CSSProperties}>
                    <Link
                      href={l.href}
                      onClick={cerrar}
                      aria-current={aca ? 'page' : undefined}
                      className="m3d-link"
                    >
                      <span>{l.texto}</span>
                      {aca ? <span aria-hidden="true" className="m3d-aca" /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="m3d-tarjeta m3d-tarjeta-negra tono-oscuro">
          <Link href={RUTAS.armar} onClick={cerrar} className="m3d-armar">
            <span>{CTA.armar}</span>
            <span aria-hidden="true" className="m3d-flecha" />
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
        </div>

        <div className="m3d-tarjeta tono-claro">
          <ContactoRapido compacto />
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
