import type { Metadata } from 'next';
import { VER } from '@/content/crear';
import { VerBorrador } from '@/features/empezar/crear/VerBorrador';

// Texto escrito por cualquiera: no se indexa, ni se sigue, ni entra al sitemap.
export const metadata: Metadata = {
  title: VER.meta.titulo,
  description: VER.meta.descripcion,
  robots: { index: false, follow: false },
};

export default function VerPage() {
  return (
    <main>
      <VerBorrador />
    </main>
  );
}
