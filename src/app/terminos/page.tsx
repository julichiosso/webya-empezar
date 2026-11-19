import type { Metadata } from 'next';
import { Encabezado, ID_PRINCIPAL } from '@/components/marketing/editorial/Encabezado';
import { Pie } from '@/components/marketing/editorial/Pie';
import { PaginaLegal } from '@/components/patterns/PaginaLegal';
import { TERMINOS } from '@/content/legal';

export const metadata: Metadata = {
  title: TERMINOS.titulo,
  description: TERMINOS.meta,
  alternates: { canonical: '/terminos' },
};

export default function TerminosPage() {
  return (
    <>
      <Encabezado cta="/#armar" />
      <main id={ID_PRINCIPAL} tabIndex={-1} className="outline-none">
        <PaginaLegal texto={TERMINOS} />
      </main>
      <Pie />
    </>
  );
}
