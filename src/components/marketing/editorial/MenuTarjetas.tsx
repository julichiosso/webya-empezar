'use client';

import Link from 'next/link';
import { CTA, HEADER, RUTAS, HEADER_3D as H } from '@/content/home';
import { Buscador } from './Buscador';
import { ContactoRapido } from './ContactoRapido';
import { WhatsApp } from './Iconos';

/** Todo el sitio, desde el mismo manifiesto que el pie: productos y el resto. */
const LINKS = [...HEADER.menu.links, ...HEADER.menu.otros];

const activo = (ruta: string, href: string) => ruta === href || ruta.startsWith(`${href}/`);

/** Las tarjetas del menú (ver MenuPantalla): se cargan aparte, la primera vez que se abre. */
export function MenuTarjetas({
  ruta,
  contacto,
  externo,
  cerrar,
}: {
  ruta: string;
  contacto: string;
  externo: boolean;
  cerrar: () => void;
}) {
  return (
    <>
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
    </>
  );
}
