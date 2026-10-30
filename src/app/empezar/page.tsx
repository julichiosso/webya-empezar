import type { Metadata } from 'next';
import { SplashLogo } from '@/brand/logo/SplashLogo';
import { AMedida } from '@/components/marketing/AMedida';
import { ID_CONTENIDO, Nav } from '@/components/marketing/Nav';
import { HeroMockupConectado } from '@/features/empezar/HeroMockupConectado';
import { BotonExplicativo } from '@/features/explicativo/BotonExplicativo';
import { ComoFunciona } from '@/components/marketing/ComoFunciona';
import { Confianza, VitrinaDemo } from '@/components/marketing/Confianza';
import { Faq } from '@/components/marketing/Faq';
import { Footer } from '@/components/marketing/Footer';
import { Hero } from '@/components/marketing/Hero';
import { QueIncluye } from '@/components/marketing/QueIncluye';
import { FAQ } from '@/content/faq';
import { SEO_EMPEZAR, SEO_SITIO } from '@/content/seo';
import { WizardLazy } from '@/features/empezar/WizardLazy';

const { titulo: TITULO, descripcion: DESCRIPCION } = SEO_EMPEZAR;
const TITULO_CON_MARCA = SEO_SITIO.tituloConMarca(TITULO);

// La imagen Open Graph la genera opengraph-image.tsx (misma carpeta).
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: '/empezar' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: SEO_SITIO.nombre,
    url: '/empezar',
    title: TITULO_CON_MARCA,
    description: DESCRIPCION,
  },
  twitter: { card: 'summary_large_image', title: TITULO_CON_MARCA, description: DESCRIPCION },
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
      <SplashLogo />
      <script
        type="application/ld+json"
        // Se escapa "<" para que ningún texto pueda cerrar la etiqueta <script>.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <Nav />
      <main
        id={ID_CONTENIDO}
        className="mx-auto w-full max-w-xl px-4 pb-24 lg:max-w-page lg:px-8 lg:pb-32"
      >
        <Hero mockup={<HeroMockupConectado />} accion={<BotonExplicativo origen="empezar" />} />
        <WizardLazy />
        <VitrinaDemo />
        <ComoFunciona />
        <QueIncluye />
        <AMedida />
        <Confianza />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
