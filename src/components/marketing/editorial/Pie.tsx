import Link from 'next/link';
import { LogoWebya } from '@/brand/logo/LogoWebya';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { CTA, FRASES, HEADER, PIE } from '@/content/home';
import { siteConfig } from '@/lib/site-config';

const TITULO = 'text-[0.75rem] font-semibold text-ed-fg';
const LINK = 'e-link e-link-nav inline-flex min-h-8 items-center text-ed-muted hover:text-ed-fg';

/**
 * Pie sobrio, como el de una marca de tecnología: gris claro, letra chica y todo ordenado en columnas
 * (productos, Webya, contacto y legales). Arriba, el logo y la promesa en una línea.
 */
export function Pie() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <footer className="tono-gris text-[0.75rem]">
      <div className="e-wrap flex flex-wrap items-center justify-between gap-3 border-b border-ed-line pt-10 pb-6">
        <LogoWebya decorativo className="h-5 w-auto" />
        <p className="text-ed-muted">{FRASES.promesa}</p>
      </div>
      <div className="e-wrap grid grid-cols-12 gap-x-6 gap-y-8 py-8">
        <nav className="col-span-6 sm:col-span-3" aria-labelledby="pie-productos">
          <h2 id="pie-productos" className={TITULO}>
            {PIE.productos}
          </h2>
          <ul className="mt-2">
            {HEADER.menu.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={LINK}>
                  {l.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="col-span-6 sm:col-span-3" aria-labelledby="pie-webya">
          <h2 id="pie-webya" className={TITULO}>
            {PIE.webya}
          </h2>
          <ul className="mt-2">
            {HEADER.menu.otros.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={LINK}>
                  {l.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 sm:col-span-3">
          <h2 className={TITULO}>{PIE.contacto}</h2>
          <ul className="mt-2">
            {contacto.canal === 'whatsapp' ? (
              <li>
                <a
                  href={contacto.href}
                  className={LINK}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${PIE.whatsapp}${CTA.pestana}`}
                >
                  {PIE.whatsapp}
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`} className={LINK}>
                {PIE.mail}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.instagramUrl}
                className={LINK}
                target="_blank"
                rel="noopener"
                aria-label={`${PIE.instagram}${CTA.pestana}`}
              >
                {PIE.instagram}
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <h2 className={TITULO}>{PIE.legal}</h2>
          <ul className="mt-2">
            <li>
              <Link href="/privacidad" className={LINK}>
                {PIE.privacidad}
              </Link>
            </li>
            <li>
              <Link href="/terminos" className={LINK}>
                {PIE.terminos}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="e-wrap border-t border-ed-line py-5">
        <p className="text-ed-muted">{PIE.derechos(new Date().getFullYear())}</p>
      </div>
    </footer>
  );
}
