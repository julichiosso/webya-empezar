import { HeroPagina } from '@/components/marketing/editorial/Hero';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { ZonaMapa } from '@/components/marketing/editorial/Zona';
import { ZONA as Z } from '@/content/paginas';
import { metadataPagina } from '../_landing/metadata';

export const metadata = metadataPagina({
  titulo: Z.seo.titulo,
  descripcion: Z.seo.descripcion,
  ruta: '/zona',
});

/** Zona de atención: el mapa liviano (SVG propio) y las localidades. */
export default function PaginaZona() {
  return (
    <Pagina>
      <HeroPagina rotulo={Z.rotulo} titulo={Z.titulo} bajada={Z.bajada} />
      <ZonaMapa />
    </Pagina>
  );
}
