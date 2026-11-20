import type { Metadata } from 'next';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { PaginaLegal } from '@/components/patterns/PaginaLegal';
import { TERMINOS } from '@/content/legal';

export const metadata: Metadata = {
  title: TERMINOS.titulo,
  description: TERMINOS.meta,
  alternates: { canonical: '/terminos' },
};

export default function TerminosPage() {
  return (
    <Pagina>
      <PaginaLegal texto={TERMINOS} />
    </Pagina>
  );
}
