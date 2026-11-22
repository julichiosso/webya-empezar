import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Boton } from '@/components/marketing/editorial/Boton';
import { Composicion } from '@/components/marketing/editorial/Composicion';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { FondoGrilla } from '@/components/marketing/editorial/FondoGrilla';
import { WhatsApp } from '@/components/marketing/editorial/Iconos';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { TituloPalabras } from '@/components/marketing/editorial/TituloPalabras';
import { CTA, PROYECTOS_UI as UI, RUTAS } from '@/content/home';
import { CASOS, ESTADO_PROYECTO, dominioDe, getProyecto } from '@/content/proyectos';
import { SEO_SITIO, serializarLd } from '@/content/seo';
import { siteConfig } from '@/lib/site-config';
import { metadataPagina } from '../../_landing/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return CASOS.map((p) => ({ slug: p.id }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProyecto((await params).slug);
  if (!p) return {};
  const base = metadataPagina({
    titulo: UI.caso.seoTitulo(p.cliente, p.sistema),
    descripcion: `${p.desafio} ${p.ve}`,
    ruta: `${RUTAS.proyectos}/${p.id}`,
  });
  const imagen = p.imagenes.desktop ?? p.imagenes.mobile;
  return imagen
    ? {
        ...base,
        openGraph: {
          ...base.openGraph,
          images: [{ url: imagen.src, width: imagen.ancho, height: imagen.alto, alt: imagen.alt }],
        },
      }
    : base;
}

/**
 * Página de un caso: cabecera, composición de capturas, el desafío, lo que armamos, cómo se usa, resultado y
 * testimonio (solo si existen) y el cierre con "Armá tu sistema" (tipo y rubro ya elegidos) y "Escribinos"
 * (con el caso en el mensaje). Estática, generada desde el manifiesto.
 */
export default async function PaginaCaso({ params }: Props) {
  const p = getProyecto((await params).slug);
  if (!p || p.estado === 'construccion') notFound();
  const i = CASOS.findIndex((c) => c.id === p.id);
  const anterior = CASOS[(i - 1 + CASOS.length) % CASOS.length]!;
  const siguiente = CASOS[(i + 1) % CASOS.length]!;
  const contacto = enlaceContacto(UI.caso.mensaje(p.cliente));
  const url = `${siteConfig.url}${RUTAS.proyectos}/${p.id}`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.cliente,
    headline: UI.caso.seoTitulo(p.cliente, p.sistema),
    about: p.sistema,
    description: `${p.desafio} ${p.ve}`,
    url,
    ...(p.imagenes.desktop ? { image: `${siteConfig.url}${p.imagenes.desktop.src}` } : {}),
    creator: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organizacion`,
      name: SEO_SITIO.nombre,
    },
    locationCreated: { '@type': 'City', name: p.ciudad },
  };

  return (
    <Pagina>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarLd(ld) }} />
      <section className="tono-claro" aria-labelledby="titulo-hero">
        <div className="e-wrap flex flex-col items-center pt-8 pb-10 text-center md:pt-12 md:pb-14">
          <Link href={RUTAS.proyectos} className="e-link e-chico text-ed-muted">
            {UI.caso.volver}
          </Link>
          <p className="a-ceja mt-8 text-ed-muted">
            {p.rubro} · {p.ciudad} · {ESTADO_PROYECTO[p.estado]}
          </p>
          <TituloPalabras
            as="h1"
            id="titulo-hero"
            lineas={[p.cliente]}
            alCargar
            className="a-hero mt-2 max-w-[16ch]"
          />
          <p className="a-sub mt-3 text-ed-muted">{p.sistema}</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
            {p.etiquetas.map((e) => (
              <li key={e} className="rounded-full bg-ed-surface px-3 py-1.5 text-[0.8125rem]">
                {e}
              </li>
            ))}
          </ul>
          {p.url && p.estado === 'produccion' ? (
            <div className="mt-7">
              <Boton href={p.url} externo variante="secundario">
                {`${UI.verSitio} ${dominioDe(p.url)}`}
              </Boton>
            </div>
          ) : null}
          <div className="mt-10 w-full rounded-[1.75rem] bg-ed-surface p-4 text-left sm:p-7 md:mt-14 md:p-10">
            <Composicion caso={p} prioridad tamanos="(min-width: 1024px) 56rem, 92vw" />
          </div>
        </div>
      </section>

      <section className="tono-claro e-seccion e-con-fondo" aria-label={UI.desafio}>
        <FondoGrilla />
        <div className="e-wrap grid grid-cols-12 gap-y-10 md:gap-x-10">
          <div className="col-span-12 md:col-span-5">
            <p className="e-rotulo text-ed-muted">{UI.desafio}</p>
            <p className="e-h3 mt-3 max-w-[28ch] font-medium">{p.desafio}</p>
            <p className="e-rotulo mt-10 text-ed-muted">{UI.ve}</p>
            <p className="e-lead mt-3 max-w-[36ch]">{p.ve}</p>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="e-rotulo text-ed-muted">{UI.armamos}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {p.armamos.map((a) => (
                <li key={a} className="rounded-2xl bg-ed-surface px-4 py-3.5 text-[0.9375rem]">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="tono-oscuro e-seccion" aria-label={UI.uso}>
        <div className="e-wrap">
          <p className="e-rotulo text-ed-muted">{UI.uso}</p>
          <ol className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4">
            {p.uso.map((u, n) => (
              <li key={u.texto} className="rounded-[1.5rem] bg-ed-surface p-6">
                <span className="text-[0.8125rem] text-ed-muted tabular-nums">
                  {String(n + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 font-semibold">{u.quien}</p>
                <p className="e-cuerpo mt-1 text-ed-muted">{u.texto}</p>
              </li>
            ))}
          </ol>
          {p.resultado ? (
            <div className="mt-10">
              <p className="e-rotulo text-ed-muted">{UI.resultado}</p>
              <p className="e-h3 mt-3">{p.resultado}</p>
            </div>
          ) : null}
          {p.testimonio ? (
            <figure className="mt-12 max-w-[48ch]">
              <blockquote className="e-h3 font-medium">{p.testimonio.cita}</blockquote>
              <figcaption className="e-chico mt-4 text-ed-muted">
                {p.testimonio.autor} · {p.testimonio.cargo}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      <section className="tono-oscuro" aria-labelledby="titulo-cierre-caso">
        <div className="e-wrap pb-[clamp(4rem,8vw,7rem)]">
          <div className="rounded-[1.75rem] bg-ed-surface p-6 md:p-10">
            <h2 id="titulo-cierre-caso" className="e-h2 max-w-[18ch]">
              {UI.caso.cierre}
            </h2>
            <p className="e-lead mt-4 max-w-[46ch] text-ed-muted">{UI.caso.cierreBajada}</p>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:flex">
              <Boton href={RUTAS.armarCaso(p.tipo, p.rubroConfigurador)}>{CTA.armar}</Boton>
              <Boton
                href={contacto.href}
                variante="secundario"
                externo
                icono={contacto.canal === 'whatsapp' ? <WhatsApp /> : false}
              >
                {CTA.escribinos}
              </Boton>
            </div>
          </div>
          <nav aria-label={UI.caso.volver} className="mt-10 grid grid-cols-2 gap-3">
            <Link
              href={`${RUTAS.proyectos}/${anterior.id}`}
              className="e-celda rounded-[1.25rem] bg-ed-surface p-5 active:opacity-70"
            >
              <span className="e-chico block text-ed-muted">{UI.caso.anterior}</span>
              <span className="mt-1 block font-semibold">{anterior.cliente}</span>
            </Link>
            <Link
              href={`${RUTAS.proyectos}/${siguiente.id}`}
              className="e-celda rounded-[1.25rem] bg-ed-surface p-5 text-right active:opacity-70"
            >
              <span className="e-chico block text-ed-muted">{UI.caso.siguiente}</span>
              <span className="mt-1 block font-semibold">{siguiente.cliente}</span>
            </Link>
          </nav>
        </div>
      </section>
    </Pagina>
  );
}
