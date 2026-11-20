import type { Metadata } from 'next';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { PaginaLegal } from '@/components/patterns/PaginaLegal';
import { PRIVACIDAD } from '@/content/legal';

export const metadata: Metadata = {
  title: PRIVACIDAD.titulo,
  description: PRIVACIDAD.meta,
  alternates: { canonical: '/privacidad' },
};

export default function PrivacidadPage() {
  return (
    <Pagina>
      <PaginaLegal texto={PRIVACIDAD} />
    </Pagina>
  );
}
