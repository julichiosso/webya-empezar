import type { Metadata } from 'next';
import { Logo } from '@/components/Logo';
import { ComoFunciona } from '@/components/sections/ComoFunciona';
import { Faq } from '@/components/sections/Faq';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { QueIncluye } from '@/components/sections/QueIncluye';
import { FAQ } from '@/config/faq';
import { WizardLazy } from '@/features/empezar/WizardLazy';

const TITULO = 'Creá tu negocio online';
const DESCRIPCION =
  'Elegí tu rubro y activá solo lo que tu negocio necesita: turnos, tienda, carta con QR, pagos. Lo armamos con vos.';

// La imagen Open Graph la genera opengraph-image.tsx (misma carpeta).
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: '/empezar' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'WebYa',
    url: '/empezar',
    title: `${TITULO} | WebYa`,
    description: DESCRIPCION,
  },
  twitter: { card: 'summary_large_image', title: `${TITULO} | WebYa`, description: DESCRIPCION },
};

// Datos estructurados del FAQ (mismo texto que se ve en pantalla: sale de config/faq.ts).
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.pregunta,
    acceptedAnswer: { '@type': 'Answer', text: f.respuesta },
  })),
};

export default function EmpezarPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Se escapa "<" para que ningún texto pueda cerrar la etiqueta <script>.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <header className="mx-auto flex w-full max-w-xl items-center px-4 pt-6 lg:max-w-page lg:px-8 lg:pt-8">
        <Logo armar />
      </header>
      <main className="mx-auto w-full max-w-xl px-4 pb-24 lg:max-w-page lg:px-8 lg:pb-32">
        <Hero />
        <WizardLazy />
        <ComoFunciona />
        <QueIncluye />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
