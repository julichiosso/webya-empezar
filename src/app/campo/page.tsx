import { Boton } from '@/components/marketing/editorial/Boton';
import { SolucionesCampo } from '@/components/marketing/editorial/Campo';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { HeroPagina } from '@/components/marketing/editorial/Hero';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { CTA, RUTAS } from '@/content/home';
import { CAMPO as C } from '@/content/paginas';
import { metadataPagina } from '../_landing/metadata';

export const metadata = metadataPagina({
  titulo: C.seo.titulo,
  descripcion: C.seo.descripcion,
  ruta: '/campo',
});

/** Sistemas para el campo y el agro: turnos de descarga, insumos, maquinaria, contratistas. */
export default function PaginaCampo() {
  return (
    <Pagina>
      <HeroPagina rotulo={C.rotulo} titulo={C.titulo} bajada={C.bajada}>
        <Boton href={RUTAS.armarTipo('medida')}>{CTA.armar}</Boton>
        <Boton href={RUTAS.demos} variante="secundario" externo>
          {CTA.verDemo}
        </Boton>
      </HeroPagina>
      <SolucionesCampo />
      <Cierre armar={RUTAS.armarTipo('medida')} />
    </Pagina>
  );
}
