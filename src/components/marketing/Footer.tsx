import { siteConfig } from '@/lib/site-config';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { FOOTER } from '@/content/empezar/footer';

export function Footer() {
  const { contactEmail, instagramUrl } = siteConfig;
  return (
    <footer className="mx-auto w-full max-w-xl border-t border-line px-4 py-12 lg:max-w-page lg:px-8 lg:py-16">
      <div className="lg:flex lg:items-start lg:justify-between lg:gap-12">
        <div>
          <p className="text-heading font-semibold">{FOOTER.lema}</p>
          <p className="mt-1 text-muted">{FOOTER.bajada}</p>
        </div>
        <ul className="mt-8 flex flex-col gap-1 lg:mt-0 lg:items-end">
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
            </a>
          </li>
        </ul>
      </div>
      <p className="tabular mt-8 text-small text-subtle">
        {FOOTER.copyright(new Date().getFullYear())}
      </p>
    </footer>
  );
}
