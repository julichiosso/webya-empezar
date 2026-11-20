import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { CTA, NOSOTROS_HOME, RUTAS, SECCIONES } from '@/content/home';
import { NOSOTROS } from '@/content/paginas';
import { siteConfig } from '@/lib/site-config';
import { CabezaSeccion } from './CabezaSeccion';
import { FondoGrilla } from './FondoGrilla';
import { enlaceContacto } from './contacto';
import { ProyectosInicio } from './Proyectos';

/** Retrato de Julián o, mientras falte la foto, sus iniciales en un cuadro prolijo. */
export function Retrato({ className }: { className?: string }) {
  const f = NOSOTROS.foto;
  return (
    <div
      className={cn(
        'relative aspect-[4/5] overflow-hidden rounded-2xl border border-ed-line bg-ed-surface',
        className,
      )}
    >
      {f ? (
        <Image
          src={f.src}
          alt={NOSOTROS.fotoAlt}
          fill
          sizes="(min-width: 1024px) 24rem, 80vw"
          className="object-cover"
        />
      ) : (
        <span
          role="img"
          aria-label={NOSOTROS.fotoAlt}
          className="absolute inset-0 grid place-items-center text-[clamp(2.5rem,9vw,5.5rem)] font-semibold tracking-[-0.05em] text-ed-muted"
        >
          {NOSOTROS.iniciales}
        </span>
      )}
    </div>
  );
}

/**
 * /nosotros: la presentación de Julián con su firma, cómo trabajamos (cuatro pasos), los proyectos y
 * el contacto directo.
 */
export function NosotrosPagina() {
  const N = NOSOTROS;
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  const canales = [
    ...(contacto.canal === 'whatsapp'
      ? [{ texto: N.contacto.whatsapp, href: contacto.href, externo: true }]
      : []),
    { texto: N.contacto.mail, href: `mailto:${siteConfig.contactEmail}`, externo: false },
    { texto: N.contacto.instagram, href: siteConfig.instagramUrl, externo: true },
  ];
  return (
    <>
      <section className="tono-claro e-seccion e-con-fondo" aria-label={N.rotulo}>
        <FondoGrilla />
        <div className="e-wrap grid grid-cols-12 items-center gap-x-6 gap-y-8">
          <Retrato className="col-span-8 sm:col-span-5 lg:col-span-4" />
          <figure className="col-span-12 sm:col-span-7 lg:col-span-6 lg:col-start-6">
            <blockquote className="e-h3 max-w-[34ch] font-medium">{N.presentacion}</blockquote>
            <figcaption className="mt-6">
              <span className="block font-semibold">{N.firma}</span>
              <span className="e-chico block text-ed-muted">{N.cargo}</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="tono-oscuro e-seccion" aria-labelledby="titulo-proceso">
        <div className="e-wrap">
          <CabezaSeccion
            rotulo={N.proceso.rotulo}
            titulo={N.proceso.titulo}
            idTitulo="titulo-proceso"
          />
          <ol className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
            {N.proceso.pasos.map((p, i) => (
              <li
                key={p.titulo}
                className="py-5 sm:pr-6"
                data-reveal=""
                style={{ '--i': i } as CSSProperties}
              >
                <span className="e-rotulo text-ed-muted tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="e-h3 mt-3">{p.titulo}</p>
                <p className="e-chico mt-2 max-w-[32ch] text-ed-muted">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ProyectosInicio />
      <section className="tono-claro e-seccion e-con-fondo" aria-labelledby="titulo-contacto">
        <FondoGrilla />
        <div className="e-wrap">
          <CabezaSeccion
            rotulo={N.contacto.rotulo}
            titulo={N.contacto.titulo}
            idTitulo="titulo-contacto"
          />
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 md:mt-12">
            {canales.map((c) => (
              <li key={c.texto}>
                <a
                  href={c.href}
                  target={c.externo ? '_blank' : undefined}
                  rel="noopener"
                  aria-label={c.externo ? `${c.texto}${CTA.pestana}` : undefined}
                  className="e-link e-link-alto e-h3"
                >
                  {c.texto}
                </a>
              </li>
            ))}
            <li>
              <Link href={RUTAS.zona} className="e-link e-link-alto e-h3">
                {N.contacto.zona}
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

/** Home: quiénes somos en pocas líneas, con el retrato y el link a /nosotros. */
export function NosotrosInicio() {
  const S = SECCIONES.nosotros;
  return (
    <section
      id={S.id}
      className="tono-claro e-seccion e-con-fondo"
      aria-labelledby="titulo-nosotros"
    >
      <FondoGrilla />
      <div className="e-wrap">
        <CabezaSeccion rotulo={S.rotulo} titulo={S.titulo} idTitulo="titulo-nosotros" />
        <div className="mt-8 grid grid-cols-12 items-center gap-x-6 gap-y-6 md:mt-12">
          <Retrato className="col-span-4 sm:col-span-3 md:col-span-2 md:col-start-4" />
          <div className="col-span-12 sm:col-span-9 md:col-span-6" data-reveal="">
            <p className="e-lead max-w-[46ch]">{NOSOTROS_HOME.texto}</p>
            <Link href={RUTAS.nosotros} className="e-link e-cuerpo mt-6 font-medium">
              {NOSOTROS_HOME.link}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
