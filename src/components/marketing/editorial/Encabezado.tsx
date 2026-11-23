import Link from 'next/link';
import { LogoWebya } from '@/brand/logo/LogoWebya';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { HEADER, MARCA } from '@/content/home';
import { enlaceContacto } from './contacto';
import { MenuPantalla, PildoraEscribinos } from './MenuPantalla';
import { TonoHeader } from './TonoHeader';

export const ID_PRINCIPAL = 'contenido';

/**
 * Header fijo y transparente: el logo `webya` a la izquierda y dos píldoras, "Escribinos" (negra) y "Menú"
 * (gris), que abre el menú en tarjetas. Sin fondo ni línea: sobre secciones oscuras pasa a blanco
 * (TonoHeader). Con `encima`, la página arranca debajo del header (el hero lo lleva por arriba).
 * En el celular, solo "Menú": "Escribinos" vive en el menú y en la barra de abajo.
 */
export function Encabezado({ encima = false }: { encima?: boolean }) {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  const externo = contacto.canal === 'whatsapp';
  return (
    <header
      className={
        encima
          ? 'tono-hueso a-nav a-nav-encima sticky top-0 z-40'
          : 'tono-hueso a-nav sticky top-0 z-40'
      }
    >
      <a
        href={`#${ID_PRINCIPAL}`}
        className="e-saltar e-btn e-btn-primario e-btn-chico top-2 left-4 z-50 -translate-y-24 focus:translate-y-0"
      >
        {HEADER.saltar}
      </a>
      <div className="e-wrap flex h-14 items-center justify-between gap-4 lg:h-16">
        <Link
          href="/"
          aria-label={MARCA.inicio}
          data-logo=""
          className="-m-2 inline-flex min-h-11 items-center p-2"
        >
          <LogoWebya decorativo className="h-[1.375rem] w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <PildoraEscribinos href={contacto.href} externo={externo} />
          <MenuPantalla contacto={contacto.href} externo={externo} />
        </div>
      </div>
      <TonoHeader />
    </header>
  );
}
