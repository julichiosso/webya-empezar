import type { Metadata } from 'next';
import { ID_CONTENIDO, Nav } from '@/components/marketing/Nav';
import { Marco } from '@/features/empezar/Marco';
import { PantallaRubro } from '@/features/empezar/PantallaRubro';
import { Cierre } from '@/components/marketing/Cierre';
import { INTRO_ACTIVA, Telon } from '@/components/marketing/Telon';
import { TickerRubros } from '@/components/marketing/TickerRubros';
import { StickyCta } from '@/components/marketing/StickyCta';
import { RubrosFlotantes } from '@/components/marketing/RubrosFlotantes';
import { YaCrearon } from '@/components/marketing/YaCrearon';
import { MensajeRubro } from '@/components/marketing/MensajeRubro';
import { Objeciones } from '@/components/marketing/Objeciones';
import { PorQueWebya } from '@/components/marketing/PorQueWebya';
import { Faq } from '@/components/marketing/Faq';
import { Footer } from '@/components/marketing/Footer';
import { Hero } from '@/components/marketing/Hero';
import { VitrinaRubros } from '@/components/marketing/VitrinaRubros';
import { ComoTrabajamos } from '@/components/marketing/ComoTrabajamos';
import { Productos } from '@/components/marketing/Productos';
import { QueHacemos } from '@/components/marketing/QueHacemos';
import { SeccionCreador } from '@/components/marketing/SeccionCreador';
import { QueIncluye } from '@/components/marketing/QueIncluye';
import { FAQ } from '@/content/faq';
import { siteConfig } from '@/lib/site-config';
import { SEO_EMPEZAR, SEO_SITIO } from '@/content/seo';
import { VistaPreviaCartaLazy } from '@/features/demo/gastronomia/VistaPreviaCartaLazy';
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
// Qué es WebYa y quién lo ofrece, para buscadores y asistentes (mismos textos que la página).
const empresaJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO_SITIO.nombre,
  url: siteConfig.url,
  email: siteConfig.contactEmail,
  sameAs: [siteConfig.instagramUrl],
  description: DESCRIPCION,
  areaServed: { '@type': 'Country', name: SEO_EMPEZAR.zona },
};

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
    <div className="fondo-rubros papel relative bg-seccion-crema text-seccion-crema-fg">
      <script
        type="application/ld+json"
        // Se escapa "<" para que ningún texto pueda cerrar la etiqueta <script>.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(empresaJsonLd).replace(/</g, '\\u003c') }}
      />
      <RubrosFlotantes />
      <Nav />
      <main
        id={ID_CONTENIDO}
        className="mx-auto w-full max-w-xl px-4 lg:max-w-page lg:px-8"
      >
        <Hero />
        <TickerRubros />
        <QueHacemos />
        <Objeciones donde="hero" />
        {INTRO_ACTIVA && <Telon />}
        <YaCrearon />
        <Objeciones donde="clientes" />
        <Productos />
        <ComoTrabajamos />
        <SeccionCreador>
          <WizardLazy VistaPrevia={VistaPreviaCartaLazy} vitrina={<VitrinaRubros />}>
            <Marco pantalla={1} aside={<VitrinaRubros />} asideEnCelular>
              <PantallaRubro animar />
            </Marco>
          </WizardLazy>
        </SeccionCreador>
        <MensajeRubro />
        <QueIncluye />
        <Objeciones donde="modulos" />
        <PorQueWebya />
        <Faq />
        <Cierre />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
}
