import Link from 'next/link';
import { LogoCorchetes } from '@/brand/logo/LogoCorchetes';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { MARCA, PIE } from '@/content/home';
import { SERVICIOS } from '@/content/servicios';
import { siteConfig } from '@/lib/site-config';

const TITULO = 'e-rotulo text-ed-muted';

/** Pie: lema, zona, servicios, contacto, legales y el logo de lado a lado. */
export function Pie() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  const conPagina = SERVICIOS.filter((s) => s.pagina);
  return (
    <footer className="tono-oscuro border-t border-ed-line">
      <div className="e-wrap grid grid-cols-12 gap-x-6 gap-y-12 py-16 md:py-20">
        <div className="col-span-12 md:col-span-5">
          <p className="e-h3 max-w-[22ch] font-medium">{PIE.lema}</p>
          <p className="e-chico mt-6 flex items-center gap-3 text-ed-muted">
            <span className="e-punto" aria-hidden="true" />
            {MARCA.zona}
          </p>
        </div>
        <nav
          className="col-span-12 sm:col-span-4 md:col-span-2 md:col-start-7"
          aria-labelledby="pie-servicios"
        >
          <h2 id="pie-servicios" className={TITULO}>
            {PIE.servicios}
          </h2>
          <ul className="e-chico mt-5 space-y-1">
            {conPagina.map((s) => (
              <li key={s.id}>
                <Link href={s.pagina ?? '/'} className="e-link e-link-alto">
                  {s.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 sm:col-span-4 md:col-span-2">
          <h2 className={TITULO}>{PIE.contacto}</h2>
          <ul className="e-chico mt-5 space-y-1">
            {contacto.canal === 'whatsapp' ? (
              <li>
                <a
                  href={contacto.href}
                  className="e-link e-link-alto"
                  target="_blank"
                  rel="noopener"
                >
                  {PIE.whatsapp}
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`} className="e-link e-link-alto">
                {PIE.mail}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.instagramUrl}
                className="e-link e-link-alto"
                target="_blank"
                rel="noopener"
              >
                {PIE.instagram}
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-6 sm:col-span-4 md:col-span-2">
          <h2 className={TITULO}>{PIE.legal}</h2>
          <ul className="e-chico mt-5 space-y-1">
            <li>
              <Link href="/privacidad" className="e-link e-link-alto">
                {PIE.privacidad}
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="e-link e-link-alto">
                {PIE.terminos}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="e-wrap" aria-hidden="true">
        <LogoCorchetes decorativo className="h-auto w-[min(100%,34rem)]" />
      </div>
      <div className="e-wrap flex flex-col gap-2 py-8 sm:flex-row sm:justify-between">
        <p className="e-chico text-ed-muted">{PIE.derechos(new Date().getFullYear())}</p>
        <p className="e-chico text-ed-muted">{MARCA.fundador}</p>
      </div>
    </footer>
  );
}
