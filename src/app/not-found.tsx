import type { Metadata } from 'next';
import { Ilustracion } from '@/brand/ilustracion/dibujos/Ilustracion';
import { ButtonLink } from '@/components/ui/Button';
import { ESTADOS_PAGINA } from '@/content/estados-pagina';

const { noEncontrada: TXT } = ESTADOS_PAGINA;

export const metadata: Metadata = { title: TXT.titulo, robots: { index: false } };

/** 404 de todo el sitio: la pieza que no encaja (humor liviano, una salida clara). */
export default function NoEncontrada() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <Ilustracion id="no-encontrado" size={120} className="text-fg" />
      <h1 className="mt-8 text-title font-semibold text-balance">{TXT.titulo}</h1>
      <p className="mt-4 text-lead text-muted">{TXT.texto}</p>
      <ButtonLink href="/empezar" className="mt-8">
        {TXT.cta}
      </ButtonLink>
    </main>
  );
}
