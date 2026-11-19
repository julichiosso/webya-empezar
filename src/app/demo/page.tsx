import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoCorchetes } from '@/brand/logo/LogoCorchetes';
import { Flecha } from '@/components/marketing/editorial/Iconos';
import { DEMOS, HUB_DEMOS } from '@/content/demos/hub';

export const metadata: Metadata = {
  title: HUB_DEMOS.seo.titulo,
  description: HUB_DEMOS.seo.descripcion,
  alternates: { canonical: '/demo' },
};

/** Elegir demo. Corta a propósito: en el celular las dos opciones se ven sin scrollear. */
export default function Demos() {
  return (
    <div className="tono-oscuro min-h-svh bg-ed-bg text-ed-fg">
      <header className="flex h-12 items-center justify-between border-b border-ed-line px-4 md:px-6">
        <Link href="/" aria-label={HUB_DEMOS.volver} className="flex min-h-11 items-center">
          <LogoCorchetes decorativo className="h-5 w-auto" />
        </Link>
        <Link href="/" className="e-link e-chico text-ed-muted hover:text-ed-fg">
          {HUB_DEMOS.volver}
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[44rem] px-4 pt-8 pb-10 md:pt-16">
        <h1 className="e-h2">{HUB_DEMOS.titulo}</h1>
        <p className="e-cuerpo mt-2 text-ed-muted">{HUB_DEMOS.bajada}</p>
        <ul className="mt-6 grid gap-3 md:mt-10 md:grid-cols-2 md:gap-4">
          {DEMOS.map((d) => (
            <li key={d.id}>
              <Link
                href={d.href}
                className="group flex h-full flex-col rounded-2xl border border-ed-line p-5 transition-colors hover:border-ed-fg focus-visible:border-ed-fg md:p-6"
              >
                <span className="e-rotulo text-ed-muted">{d.rubro}</span>
                <span className="e-h3 mt-2">{d.titulo}</span>
                <span className="e-chico mt-2 text-ed-muted">{d.texto}</span>
                <span className="e-chico mt-5 inline-flex items-center gap-2 font-medium md:mt-auto md:pt-6">
                  {HUB_DEMOS.abrir}
                  <Flecha />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="e-chico mt-6 max-w-[52ch] text-ed-muted md:mt-10">{HUB_DEMOS.nota}</p>
      </main>
    </div>
  );
}
