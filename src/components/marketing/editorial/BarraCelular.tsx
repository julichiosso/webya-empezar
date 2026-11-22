import Link from 'next/link';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { BARRA_CELULAR, CTA, RUTAS } from '@/content/home';
import { enlaceContacto } from './contacto';
import { WhatsApp } from './Iconos';
import { TecladoAbierto } from './TecladoAbierto';

/**
 * Barra fija abajo, solo en el celular y la tablet: "Escribinos" (WhatsApp) y "Armá tu sistema" a un
 * toque del pulgar en cualquier página. Discreta: fondo plano y una línea fina arriba. El espacio de
 * abajo evita que tape el final de la página. Mientras se escribe en un campo, se corre.
 */
export function BarraCelular() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <>
      <div aria-hidden="true" className="h-[calc(4.25rem+env(safe-area-inset-bottom))] lg:hidden" />
      <TecladoAbierto />
      <nav
        aria-label={BARRA_CELULAR.etiqueta}
        className="e-barra-celular tono-oscuro fixed inset-x-0 bottom-0 z-30 bg-ed-surface px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <div className="mx-auto grid max-w-136 grid-cols-2 gap-2.5">
          <a
            href={contacto.href}
            target="_blank"
            rel="noopener"
            aria-label={`${CTA.escribinos}${CTA.pestana}`}
            className="e-btn e-btn-secundario e-btn-chico"
          >
            <WhatsApp />
            <span>{CTA.escribinos}</span>
          </a>
          {/* Sin precarga: en la home la barra arranca escondida y el configurador pesa. */}
          <Link href={RUTAS.armar} prefetch={false} className="e-btn e-btn-primario e-btn-chico">
            {CTA.armar}
          </Link>
        </div>
      </nav>
    </>
  );
}
