import { LEGAL_UI, type TextoLegal } from '@/content/legal';
import { siteConfig } from '@/lib/site-config';

/** Página de texto corrido (privacidad, términos): crema, una columna, volver a /empezar. */
export function PaginaLegal({ texto }: { texto: TextoLegal }) {
  const mail = siteConfig.contactEmail;
  return (
    <div className="papel min-h-svh bg-seccion-crema text-seccion-crema-fg">
      <main className="mx-auto w-full max-w-prose px-4 py-12 lg:py-20">
        <a
          href="/empezar"
          className="inline-flex min-h-tap items-center text-small underline underline-offset-4"
        >
          {LEGAL_UI.volver}
        </a>
        <h1 className="mt-6 text-display font-semibold text-balance">{texto.titulo}</h1>
        <p className="mt-8">{texto.intro}</p>
        {texto.secciones.map((s) => (
          <section key={s.titulo} className="mt-8">
            <h2 className="text-title font-semibold">{s.titulo}</h2>
            {s.parrafos?.map((p) => (
              <p key={p} className="mt-3">
                {p}
              </p>
            ))}
            {s.lista && (
              <ul className="mt-3 list-disc pl-6">
                {s.lista.map((li) => (
                  <li key={li} className="mt-2">
                    {li}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <p className="mt-8">
          {LEGAL_UI.contactoPrefijo}{' '}
          <a href={`mailto:${mail}`} className="underline underline-offset-4">
            {mail}
          </a>
        </p>
      </main>
    </div>
  );
}
