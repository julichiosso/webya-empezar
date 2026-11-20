import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { CTA, HERO, MARCA, RUTAS } from '@/content/home';
import { AVISO_HERO } from '@/content/mockups';
import { PROYECTOS } from '@/content/proyectos';
import { AvisosDiferidos } from './AvisosDiferidos';
import { Boton } from './Boton';
import { Buscador } from './Buscador';
import { enlaceContacto } from './contacto';
import { Tilde, WhatsApp } from './Iconos';
import { PantallaTurnero, Telefono } from './Pantallas';
import { TituloPalabras } from './TituloPalabras';

const aparece = (i: number) => ({ '--i': i }) as CSSProperties;

/** Prueba al toque: los negocios que ya trabajan con su sistema. */
const EN_PRODUCCION = PROYECTOS.filter((p) => p.estado === 'produccion');

/**
 * El producto como protagonista: el turnero con la agenda del día y, encima, el aviso que le llega al
 * dueño cuando alguien reserva. Todo dibujado en el servidor: no suma JavaScript.
 */
function ProductoHero() {
  const P = AVISO_HERO;
  return (
    <div
      className="relative mx-auto w-full max-w-[16rem] lg:max-w-[19rem]"
      role="img"
      aria-label={P.alt}
    >
      <Telefono>
        <PantallaTurnero paso={5} />
      </Telefono>
      <div aria-hidden="true" className="e-push tono-claro">
        <span className="e-push-icono">
          <Tilde />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex justify-between gap-2 text-ed-muted">
            <span>{P.app}</span>
            <span>{P.cuando}</span>
          </span>
          <span className="block font-semibold">{P.titulo}</span>
          <span className="block truncate">{P.texto}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Hero de la home. En cinco segundos: la marca (Creá. Digitalizá. Crecé.), qué armamos y para quién,
 * qué hacer ahora (buscar, armar, escribir) y por qué confiar (negocios reales y la zona). A la
 * derecha, el producto funcionando; en el celular asoma abajo e invita a seguir.
 */
export function HeroInicio() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <section className="tono-oscuro overflow-hidden" aria-labelledby="titulo-hero">
      <AvisosDiferidos enProduccion={EN_PRODUCCION.length} />
      <div className="e-wrap grid grid-cols-12 pt-7 lg:items-center lg:gap-x-12 lg:pt-14 lg:pb-12">
        <div className="col-span-12 min-w-0 lg:col-span-7">
          <TituloPalabras
            as="h1"
            id="titulo-hero"
            lineas={HERO.titulo}
            alCargar
            className="e-lema"
          />
          <p
            // Sin animación de entrada: es el LCP de la home y se pinta en el primer cuadro.
            className="e-lead mt-5 max-w-[38ch] text-ed-muted lg:mt-7"
          >
            {HERO.bajada}
          </p>
          <div
            className="e-hero-aparece relative z-20 mt-6 max-w-[34rem] lg:mt-8"
            style={aparece(2)}
          >
            <Buscador />
          </div>
          {/* En el celular y la tablet las dos acciones viven en la barra fija de abajo, a mano del pulgar. */}
          <div className="e-hero-aparece mt-6 hidden gap-3 lg:flex" style={aparece(3)}>
            <Boton href={RUTAS.armar}>{CTA.armar}</Boton>
            <Boton
              href={contacto.href}
              variante="secundario"
              externo
              icono={contacto.canal === 'whatsapp' ? <WhatsApp /> : false}
            >
              {CTA.escribinos}
            </Boton>
          </div>
          <div
            className="e-hero-aparece e-chico mt-6 space-y-1 text-ed-muted lg:mt-8"
            style={aparece(4)}
          >
            <p>
              {HERO.confianza}{' '}
              {EN_PRODUCCION.map((p, i) => (
                <span key={p.id}>
                  {i === 0 ? null : i === EN_PRODUCCION.length - 1 ? ` ${HERO.y} ` : ', '}
                  <Link
                    href={`${RUTAS.proyectos}/${p.id}`}
                    className="e-link e-link-nav text-ed-fg"
                  >
                    {p.cliente}
                  </Link>
                </span>
              ))}
            </p>
            <p className="flex flex-wrap items-center gap-x-3">
              <span>{MARCA.zona}</span>
              <Link href={RUTAS.zona} className="e-link text-ed-fg">
                {HERO.verZona}
              </Link>
            </p>
          </div>
        </div>
        <div
          className="e-hero-aparece e-hero-producto col-span-12 mt-9 min-w-0 lg:col-span-5 lg:mt-0"
          style={aparece(3)}
        >
          <ProductoHero />
        </div>
      </div>
    </section>
  );
}

interface HeroPaginaProps {
  rotulo: string;
  titulo: readonly string[];
  bajada?: string;
  /** Botones u otro contenido debajo de la bajada. */
  children?: React.ReactNode;
  /** A la derecha (abajo en el celular): la vidriera de trabajos hechos. */
  vidriera?: React.ReactNode;
}

/** Hero de las páginas propias (productos, proyectos, nosotros, zona): rótulo, titular, bajada y CTA. */
export function HeroPagina({ rotulo, titulo, bajada, children, vidriera }: HeroPaginaProps) {
  return (
    <section className="tono-oscuro overflow-hidden" aria-labelledby="titulo-hero">
      <div
        className={
          vidriera
            ? 'e-wrap grid grid-cols-12 gap-y-10 pt-8 pb-10 md:pt-14 md:pb-14 lg:items-center lg:gap-x-10 lg:pt-16'
            : 'e-wrap pt-8 pb-10 md:pt-16 md:pb-16 lg:pt-20'
        }
      >
        <div className={vidriera ? 'col-span-12 min-w-0 lg:col-span-6' : undefined}>
          <p className="e-rotulo e-hero-aparece text-ed-muted" style={aparece(0)}>
            {rotulo}
          </p>
          <TituloPalabras
            as="h1"
            id="titulo-hero"
            lineas={titulo}
            alCargar
            className="e-display e-hero-compacto mt-4 max-w-[18ch] md:mt-6"
          />
          {bajada ? (
            <p
              className="e-lead e-hero-aparece mt-5 max-w-[46ch] text-ed-muted md:mt-7"
              style={aparece(1)}
            >
              {bajada}
            </p>
          ) : null}
          {children ? (
            <div
              className="e-hero-aparece mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3 md:mt-8"
              style={aparece(2)}
            >
              {children}
            </div>
          ) : null}
        </div>
        {vidriera ? (
          <div className="e-hero-aparece col-span-12 min-w-0 lg:col-span-6" style={aparece(3)}>
            {vidriera}
          </div>
        ) : null}
      </div>
    </section>
  );
}
