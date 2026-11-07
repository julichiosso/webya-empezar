import type { ReactNode } from 'react';
import { siteConfig } from '@/lib/site-config';
import { Logo } from '@/brand/logo/Logo';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { cn } from '@/components/ui/clases';
import { FOOTER } from '@/content/empezar/footer';
import { MENSAJE_WHATSAPP } from '@/content/whatsapp';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import estilos from './Footer.module.css';

const C = CLASES_SECCION.tinta;
const ENLACE = '-mx-2 inline-flex min-h-tap items-center px-2 underline-offset-4 hover:underline';

/** Un grupo del pie: su título (nombre accesible de la lista) y sus renglones. */
function Grupo({
  id,
  titulo,
  children,
  className,
}: {
  id: string;
  titulo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p id={id} className={cn('text-small font-medium', C.secundario)}>
        {titulo}
      </p>
      <ul aria-labelledby={id} className="mt-2 flex flex-col">
        {children}
      </ul>
    </div>
  );
}

/**
 * Pie de /empezar (fondo tinta, fijo con el sitio en claro también). No repite la nav: el lema con
 * su salvedad, cuatro grupos (la empresa, hablemos, probalo, legales) y el wordmark grande al pie, entero y sin
 * tocar. El interruptor de tema vive en la nav. Una línea lo separa del cierre (los dos son oscuros).
 */
export function Footer() {
  const { contactEmail, instagramUrl, whatsappNumber } = siteConfig;
  const whatsapp = buildWhatsAppLink(whatsappNumber, MENSAJE_WHATSAPP.contacto);
  return (
    <Seccion
      como="footer"
      fondo="tinta"
      className={cn('diferido border-t', C.linea)}
      contenidoClassName="pt-16 pb-8 lg:pt-24 lg:pb-12"
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="text-title font-semibold text-balance">{FOOTER.lema}</p>
          <p className={cn('mt-2 max-w-sm', C.secundario)}>{FOOTER.bajada}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:flex sm:justify-between lg:col-span-8 lg:mt-0">
          <Grupo id="pie-empresa" titulo={FOOTER.empresa.titulo}>
            <li>
              <a href="#que-hacemos" className={ENLACE}>
                {FOOTER.empresa.queHacemos}
              </a>
            </li>
            <li>
              <a href="#ya-lo-usan" className={ENLACE}>
                {FOOTER.empresa.trabajos}
              </a>
            </li>
            <li>
              <a href="#como-trabajamos" className={ENLACE}>
                {FOOTER.empresa.comoTrabajamos}
              </a>
            </li>
            <li>
              <a href="#faq" className={ENLACE}>
                {FOOTER.empresa.preguntas}
              </a>
            </li>
          </Grupo>

          <Grupo
            id="pie-contacto"
            titulo={FOOTER.contacto.titulo}
            className="col-span-2 sm:col-auto"
          >
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={ENLACE}>
                  {FOOTER.contacto.whatsapp}
                  <span className="sr-only">{FOOTER.externo}</span>
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${contactEmail}`} className={ENLACE}>
                {contactEmail}
              </a>
            </li>
            <li>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={ENLACE}>
                {FOOTER.instagram}
                <span className="sr-only">{FOOTER.externo}</span>
              </a>
            </li>
          </Grupo>

          <Grupo id="pie-probar" titulo={FOOTER.probar.titulo}>
            <li>
              <a href="/crear" className={ENLACE}>
                {FOOTER.probar.crear}
              </a>
            </li>
            <li>
              <a href="/demo/peluqueria" className={ENLACE}>
                {FOOTER.probar.turnos}
              </a>
            </li>
            <li>
              <a href="/demo/gastronomia" className={ENLACE}>
                {FOOTER.probar.demo}
              </a>
            </li>
          </Grupo>

          <Grupo id="pie-legales" titulo={FOOTER.legales.titulo}>
            <li>
              <a href="/privacidad" className={ENLACE}>
                {FOOTER.legales.privacidad}
              </a>
            </li>
            <li>
              <a href="/terminos" className={ENLACE}>
                {FOOTER.legales.terminos}
              </a>
            </li>
            <li className={cn('tabular py-2 text-small', C.secundario)}>
              {FOOTER.copyright(new Date().getFullYear())}
            </li>
          </Grupo>
        </div>
      </div>

      {/* El wordmark al pie, de lado a lado del ancho de página, entero y sin recolorear (sigue el
          texto de la sección). `[&>svg]` le gana al alto fijo del Logo sin tocar el componente. */}
      <div
        className={cn(
          'mt-16 overflow-clip border-t pt-8 lg:mt-24 lg:pt-12 [&>svg]:h-auto [&>svg]:w-full',
          estilos.logo,
          C.linea,
        )}
      >
        <Logo decorativo />
      </div>
    </Seccion>
  );
}
