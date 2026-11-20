import { PROTECTORAS as P } from '@/content/protectoras';
import { jsonLdServicio, serializarLd } from '@/content/seo';
import { LandingProtectoras } from '@/features/demo/protectora/Landing';
import { siteConfig } from '@/lib/site-config';
import { metadataPagina } from '../_landing/metadata';
import '@/brand/demos/protectora.css';

export const metadata = metadataPagina({
  titulo: P.seo.titulo,
  descripcion: P.seo.descripcion,
  ruta: P.ruta,
});

/** El Service de esta página: rubro nuevo sobre el sistema a medida, con la misma zona de atención. */
const LD = jsonLdServicio(
  siteConfig.url,
  {
    id: 'medida',
    nombre: P.hero.rotulo,
    frase: P.hero.bajada,
    descripcionSeo: P.seo.servicio,
    pagina: P.ruta,
  },
  P.hero.rotulo,
  P.ruta,
);

export default function PaginaProtectoras() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarLd(LD) }} />
      <LandingProtectoras />
    </>
  );
}
