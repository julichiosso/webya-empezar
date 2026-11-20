import type { Metadata } from 'next';
import { BloqueProducto, ParaQuien } from '@/components/marketing/editorial/BloqueProducto';
import { Boton } from '@/components/marketing/editorial/Boton';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { HeroPagina } from '@/components/marketing/editorial/Hero';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { ProyectosGrilla } from '@/components/marketing/editorial/Proyectos';
import { CTA, RUTAS } from '@/content/home';
import type { Landing } from '@/content/landings';
import { jsonLdServicio, serializarLd } from '@/content/seo';
import { getServicio } from '@/content/servicios';
import { siteConfig } from '@/lib/site-config';
import { metadataPagina } from './metadata';

/** Metadata completa de una página de producto. */
export function metadataLanding(l: Landing): Metadata {
  return metadataPagina({ titulo: l.seo.titulo, descripcion: l.seo.descripcion, ruta: l.ruta });
}

/**
 * Plantilla de las páginas de producto: hero con las dos acciones, el producto contado (dolor →
 * solución → prueba), un bloque propio opcional (el catálogo en /tienda), para qué rubros sirve, los
 * proyectos reales de ese tipo y el cierre.
 */
export function LandingServicio({
  landing,
  children,
}: {
  landing: Landing;
  children?: React.ReactNode;
}) {
  const servicio = getServicio(landing.tipo)!;
  const ld = jsonLdServicio(siteConfig.url, servicio, landing.nombre, landing.ruta);
  const proyectos = (p: { tipo: string }) => p.tipo === landing.tipo;
  return (
    <Pagina>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarLd(ld) }} />
      <HeroPagina
        rotulo={landing.hero.rotulo}
        titulo={landing.hero.titulo}
        bajada={landing.hero.bajada}
      >
        <Boton href={RUTAS.armarTipo(landing.tipo)}>{CTA.armar}</Boton>
        <Boton href={landing.demo} variante="secundario" externo icono={false}>
          {CTA.verDemo}
        </Boton>
      </HeroPagina>
      <BloqueProducto landing={landing} />
      {children}
      <ParaQuien landing={landing} />
      <ProyectosGrilla filtro={proyectos} cabeza />
      <Cierre armar={RUTAS.armarTipo(landing.tipo)} />
    </Pagina>
  );
}
