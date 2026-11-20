import Link from 'next/link';
import { LogoCorchetes } from '@/brand/logo/LogoCorchetes';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { CTA, HEADER, PIE } from '@/content/home';
import { siteConfig } from '@/lib/site-config';

const TITULO = 'e-rotulo text-ed-muted';
const LINK = 'e-link e-link-nav e-link-alto text-ed-muted hover:text-ed-fg';

/** Pie: lema, productos, Webya (demos, proyectos, nosotros, zona), contacto, legales y el logo. */
export function Pie() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <footer className="tono-oscuro border-t border-ed-line">
      <div className="e-wrap grid grid-cols-12 gap-x-6 gap-y-10 py-14 md:py-20">
        <div className="col-span-12 lg:col-span-4">
          <p className="e-h3 max-w-[22ch] font-medium">{PIE.lema}</p>
        </div>
        <nav className="col-span-6 sm:col-span-3 lg:col-span-2" aria-labelledby="pie-productos">
          <h2 id="pie-productos" className={TITULO}>
            {PIE.productos}
          </h2>
          <ul className="e-chico mt-4">
            {HEADER.menu.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={LINK}>
                  {l.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="col-span-6 sm:col-span-3 lg:col-span-2" aria-labelledby="pie-webya">
          <h2 id="pie-webya" className={TITULO}>
            {PIE.webya}
          </h2>
          <ul className="e-chico mt-4">
            {HEADER.menu.otros.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={LINK}>
                  {l.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <h2 className={TITULO}>{PIE.contacto}</h2>
          <ul className="e-chico mt-4">
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
        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <h2 className={TITULO}>{PIE.legal}</h2>
          <ul className="e-chico mt-4">
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
      <div className="e-wrap" aria-hidden="true">
        <LogoCorchetes decorativo className="h-auto w-[min(100%,34rem)]" />
      </div>
      <div className="e-wrap py-8">
        <p className="e-chico text-ed-muted">{PIE.derechos(new Date().getFullYear())}</p>
      </div>
    </footer>
  );
}
