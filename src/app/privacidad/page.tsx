import type { Metadata } from 'next';
import { Encabezado, ID_PRINCIPAL } from '@/components/marketing/editorial/Encabezado';
import { Pie } from '@/components/marketing/editorial/Pie';
import { PaginaLegal } from '@/components/patterns/PaginaLegal';
import { PRIVACIDAD } from '@/content/legal';

export const metadata: Metadata = {
  title: PRIVACIDAD.titulo,
  description: PRIVACIDAD.meta,
  alternates: { canonical: '/privacidad' },
};

export default function PrivacidadPage() {
  return (
    <>
      <Encabezado cta="/#armar" />
      <main id={ID_PRINCIPAL} tabIndex={-1} className="outline-none">
        <PaginaLegal texto={PRIVACIDAD} />
      </main>
      <Pie />
    </>
  );
}
