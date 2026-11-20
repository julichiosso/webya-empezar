import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoCorchetes } from '@/brand/logo/LogoCorchetes';
import { Flecha } from '@/components/marketing/editorial/Iconos';
import { DEMOS, HUB_DEMOS } from '@/content/demos/hub';
import { RUBROS_HOME } from '@/content/home';
import { metadataPagina } from '../_landing/metadata';

export const metadata: Metadata = metadataPagina({
  titulo: HUB_DEMOS.seo.titulo,
  descripcion: HUB_DEMOS.seo.descripcion,
  ruta: '/demos',
});

/**
 * Elegir demo, por sistema o por rubro. Corta a propósito: en el celular las opciones se ven casi sin
 * scrollear. Se abre aparte del sitio, como otro sistema.
 */
export default function Demos() {
  return (
    <div className="tono-oscuro min-h-svh bg-ed-bg text-ed-fg">
      <header className="flex h-12 items-center justify-between border-b border-ed-line px-4 md:px-6">
        <Link href="/" aria-label={HUB_DEMOS.volver} className="flex min-h-11 items-center">
          <LogoCorchetes decorativo className="h-5 w-auto" />
        </Link>
        <Link href="/" className="e-link e-link-nav e-chico text-ed-muted hover:text-ed-fg">
          {HUB_DEMOS.volver}
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[60rem] px-4 pt-8 pb-12 md:pt-16">
        <h1 className="e-h2">{HUB_DEMOS.titulo}</h1>
        <p className="e-cuerpo mt-2 text-ed-muted">{HUB_DEMOS.bajada}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-10 md:gap-4">
          {DEMOS.map((d) => (
            <li key={d.id}>
              <Link
                href={d.href}
                prefetch={false}
                className="group flex h-full flex-col rounded-2xl border border-ed-line p-5 transition-colors hover:border-ed-fg focus-visible:border-ed-fg active:opacity-70 md:p-6"
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
        <h2 className="e-rotulo mt-10 text-ed-muted md:mt-14">{HUB_DEMOS.rubros}</h2>
        <ul className="mt-3 border-t border-ed-line">
          {RUBROS_HOME.map((r) => (
            <li key={r.id} className="border-b border-ed-line">
              <Link
                href={r.href}
                prefetch={false}
                className="group flex min-h-14 items-center gap-4 py-2 active:opacity-60"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{r.nombre}</span>
                  <span className="block truncate text-[0.8125rem] text-ed-muted">{r.ejemplo}</span>
                </span>
                <span className="e-chico hidden text-ed-muted group-hover:text-ed-fg sm:block">
                  {r.sistema}
                </span>
                <Flecha className="text-ed-muted group-hover:text-ed-fg" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="e-chico mt-8 max-w-[56ch] text-ed-muted">{HUB_DEMOS.nota}</p>
      </main>
    </div>
  );
}
