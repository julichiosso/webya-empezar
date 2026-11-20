import Link from 'next/link';
import { LEGAL_UI, type TextoLegal } from '@/content/legal';
import { siteConfig } from '@/lib/site-config';

/**
 * Página de texto corrido (privacidad, términos) en el sistema editorial: fondo blanco, una columna
 * angosta para leer cómodo. La página (app) le pone el header y el pie del sitio alrededor.
 */
export function PaginaLegal({ texto }: { texto: TextoLegal }) {
  const mail = siteConfig.contactEmail;
  return (
    <div className="tono-claro">
      <div className="e-wrap py-14 md:py-24">
        <div className="mx-auto max-w-[68ch]">
          <Link href="/" className="e-link e-link-alto e-chico text-ed-muted">
            {LEGAL_UI.volver}
          </Link>
          <h1 className="e-h2 mt-6">{texto.titulo}</h1>
          <p className="e-lead mt-8">{texto.intro}</p>
          {texto.secciones.map((s) => (
            <section key={s.titulo} className="mt-12 pt-8">
              <h2 className="e-h3">{s.titulo}</h2>
              {s.parrafos?.map((p) => (
                <p key={p} className="e-cuerpo mt-4 text-ed-muted">
                  {p}
                </p>
              ))}
              {s.lista && (
                <ul className="e-cuerpo mt-4 list-disc space-y-2 pl-6 text-ed-muted">
                  {s.lista.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className="e-cuerpo mt-12 pt-8">
            {LEGAL_UI.contactoPrefijo}{' '}
            <a href={`mailto:${mail}`} className="underline underline-offset-4">
              {mail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
