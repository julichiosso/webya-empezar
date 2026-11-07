import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { cn } from '@/components/ui/clases';
import { FUNDADOR, POR_QUE_WEBYA } from '@/content/por-que-webya';
import { MENSAJE_WHATSAPP } from '@/content/whatsapp';
import { siteConfig } from '@/lib/site-config';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import estilos from './PorQueWebya.module.css';

const C = CLASES_SECCION.crema;
const ENLACE = 'inline-flex min-h-tap items-center underline underline-offset-4';

/**
 * "Antes de confiar, comprobalo": lo que cualquiera puede revisar por su cuenta, con los enlaces para
 * hacerlo, y cómo hablar con WebYa. Si está cargado, quién está detrás. Sin sellos ni cifras: la prueba
 * son los sitios funcionando. Cada punto hace clic al entrar en pantalla.
 */
export function PorQueWebya() {
  const { contacto } = POR_QUE_WEBYA;
  const whatsapp = buildWhatsAppLink(siteConfig.whatsappNumber, MENSAJE_WHATSAPP.contacto);
  return (
    <Seccion fondo="crema" aria-labelledby="porque-title" className="diferido overflow-clip!">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="porque-title" className={estilos.titulo}>
              {POR_QUE_WEBYA.titulo}
            </h2>
            <p className={cn('mt-4 max-w-md text-lead', C.secundario)}>{POR_QUE_WEBYA.bajada}</p>
            {FUNDADOR && (
              <div className="mt-8 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FUNDADOR.foto}
                  alt={FUNDADOR.alt}
                  width={64}
                  height={64}
                  className="size-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{FUNDADOR.nombre}</p>
                  <p className={cn('text-small', C.secundario)}>{FUNDADOR.rol}</p>
                </div>
              </div>
            )}
            <div className={cn('mt-8 border-t pt-6', C.linea)}>
              <p className="font-semibold">{contacto.titulo}</p>
              <ul className="mt-2 flex flex-col items-start">
                {whatsapp && (
                  <li>
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={ENLACE}>
                      {contacto.whatsapp}
                      <span className="sr-only">{contacto.externo}</span>
                    </a>
                  </li>
                )}
                <li>
                  <a href={`mailto:${siteConfig.contactEmail}`} className={cn(ENLACE, 'break-all')}>
                    {siteConfig.contactEmail}
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ENLACE}
                  >
                    {contacto.instagram}
                    <span className="sr-only">{contacto.externo}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ul className={cn('mt-10 border-t lg:col-span-7 lg:mt-0', C.linea)}>
          {POR_QUE_WEBYA.puntos.map((p) => (
            <li
              key={p.titulo}
              className={cn('grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b py-6', C.linea)}
            >
              <span aria-hidden="true" className={estilos.check}>
                <Icon name="check" size={20} />
              </span>
              <div>
                <p className={estilos.punto}>{p.titulo}</p>
                <p className={cn('mt-1', C.secundario)}>{p.texto}</p>
                {'enlace' in p && (
                  <a href={p.enlace.href} className={cn(ENLACE, 'text-small font-semibold')}>
                    {p.enlace.texto}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}
