import { siteConfig } from '@/lib/site-config';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { InterruptorTema } from '@/brand/tema/InterruptorTema';
import { FOOTER } from '@/content/empezar/footer';
import { MENSAJE_WHATSAPP } from '@/content/whatsapp';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export function Footer() {
  const { contactEmail, instagramUrl, whatsappNumber } = siteConfig;
  const whatsapp = buildWhatsAppLink(whatsappNumber, MENSAJE_WHATSAPP.contacto);
  return (
    <footer className="mx-auto w-full max-w-xl border-t border-line px-4 py-12 lg:max-w-page lg:px-8 lg:py-16">
      <div className="lg:flex lg:items-start lg:justify-between lg:gap-12">
        <div>
          <p className="text-heading font-semibold">{FOOTER.lema}</p>
          <p className="mt-1 text-muted">{FOOTER.bajada}</p>
        </div>
        <ul
          aria-label={FOOTER.enlaces.aria}
          className="mt-8 flex flex-col gap-1 lg:mt-0 lg:items-end"
        >
          <li>
            <a
              href="/demo/gastronomia"
              className="-mx-2 inline-flex min-h-tap items-center px-2 text-muted hover:text-fg"
            >
              {FOOTER.enlaces.demo}
            </a>
          </li>
          {whatsapp && (
            <li>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-2 inline-flex min-h-tap items-center px-2 text-muted hover:text-fg"
              >
                {FOOTER.enlaces.whatsapp}
                <span className="sr-only">{FOOTER.enlaces.externo}</span>
              </a>
            </li>
          )}
          <li>
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="-mx-2 inline-flex min-h-tap items-center gap-2 px-2 text-muted hover:text-fg"
              >
                <Icon name="mail" size={20} />
                {contactEmail}
              </a>
            ) : (
              // TODO: completar NEXT_PUBLIC_CONTACT_EMAIL para mostrar el mail de contacto.
              process.env.NODE_ENV !== 'production' && (
                <span className="text-small text-subtle">{FOOTER.todoEmail}</span>
              )
            )}
          </li>
          <li>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-2 inline-flex min-h-tap items-center px-2 text-muted hover:text-fg"
            >
              {FOOTER.instagram}
              <span className="sr-only">{FOOTER.enlaces.externo}</span>
            </a>
          </li>
        </ul>
      </div>
      {/* Interruptor discreto de tema (el oscuro es el default); en el pie para no sumar nada a la nav. */}
      <InterruptorTema etiqueta={FOOTER.tema.aClaro} className="mt-8" />
      <p className="mt-8 text-small text-subtle">{FOOTER.todoPrivacidad}</p>
      <p className="tabular mt-2 text-small text-subtle">
        {FOOTER.copyright(new Date().getFullYear())}
      </p>
    </footer>
  );
}
