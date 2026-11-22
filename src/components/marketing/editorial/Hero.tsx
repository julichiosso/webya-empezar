import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { CTA, HERO, RUTAS } from '@/content/home';
import { PROYECTOS } from '@/content/proyectos';
import { Boton } from './Boton';
import { enlaceContacto } from './contacto';
import { Escaparate } from './Escaparate';
import { WhatsApp } from './Iconos';
import { TituloPalabras } from './TituloPalabras';

const aparece = (i: number) => ({ '--i': i }) as CSSProperties;

/** Prueba al toque: los negocios que ya trabajan con su sistema. */
const EN_PRODUCCION = PROYECTOS.filter((p) => p.estado === 'produccion');

/**
 * Hero de la home, como la portada de un producto: el nombre arriba, el lema enorme y centrado, una línea,
 * dos acciones y, abajo, tres iPhones con sitios reales de clientes. Poco texto: la imagen convence.
 * En el celular, "Escribinos" vive en la barra fija de abajo (a mano del pulgar).
 */
export function HeroInicio() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <section className="tono-claro overflow-hidden" aria-labelledby="titulo-hero">
      <div className="e-wrap flex flex-col items-center pt-10 text-center md:pt-16">
        <p className="a-ceja e-hero-aparece text-ed-muted" style={aparece(0)}>
          {HERO.ceja}
        </p>
        <TituloPalabras
          as="h1"
          id="titulo-hero"
          lineas={[HERO.titulo.join(' ')]}
          alCargar
          className="a-hero mt-2 max-w-[12ch] md:mt-3 md:max-w-none"
        />
        <p
          // Sin animación de entrada: es candidato a LCP y se pinta en el primer cuadro.
          className="a-sub mt-4 max-w-[28ch] text-ed-muted md:mt-5 md:max-w-none"
        >
          {HERO.bajada}
        </p>
        <div className="e-hero-aparece mt-7 flex flex-wrap justify-center gap-3" style={aparece(2)}>
          <Boton href={RUTAS.demos}>{HERO.verDemos}</Boton>
          <span className="hidden lg:contents">
            <Boton
              href={contacto.href}
              variante="secundario"
              externo
              icono={contacto.canal === 'whatsapp' ? <WhatsApp /> : false}
            >
              {CTA.escribinos}
            </Boton>
          </span>
        </div>
        <p className="e-hero-aparece e-chico mt-6 text-ed-muted" style={aparece(3)}>
          {HERO.confianza}{' '}
          {EN_PRODUCCION.map((p, i) => (
            <span key={p.id}>
              {i === 0 ? null : i === EN_PRODUCCION.length - 1 ? ` ${HERO.y} ` : ', '}
              <Link
                href={`${RUTAS.proyectos}/${p.id}`}
                prefetch={false}
                className="e-link e-link-nav font-medium text-ed-fg"
              >
                {p.cliente}
              </Link>
            </span>
          ))}
        </p>
      </div>
      <Escaparate className="e-wrap mt-10 max-w-5xl pb-[10%] md:mt-14 md:pb-16" />
    </section>
  );
}

interface HeroPaginaProps {
  rotulo: string;
  titulo: readonly string[];
  bajada?: string;
  /** Botones u otro contenido debajo de la bajada. */
  children?: React.ReactNode;
  /** Abajo, a todo el ancho: la vidriera de trabajos hechos. */
  vidriera?: React.ReactNode;
}

/**
 * Hero de las páginas propias (productos, proyectos, nosotros, zona), como la portada de un producto:
 * nombre, titular grande y centrado, una línea y las acciones. La vidriera va abajo, a todo el ancho.
 */
export function HeroPagina({ rotulo, titulo, bajada, children, vidriera }: HeroPaginaProps) {
  return (
    <section className="tono-claro overflow-hidden" aria-labelledby="titulo-hero">
      <div className="e-wrap flex flex-col items-center pt-10 pb-12 text-center md:pt-16 md:pb-16">
        <p className="a-ceja e-hero-aparece text-ed-muted" style={aparece(0)}>
          {rotulo}
        </p>
        <TituloPalabras
          as="h1"
          id="titulo-hero"
          lineas={titulo}
          alCargar
          className="a-hero mt-2 max-w-[16ch] md:mt-3"
        />
        {bajada ? (
          <p
            className="a-sub e-hero-aparece mt-4 max-w-[36ch] text-ed-muted md:mt-5"
            style={aparece(1)}
          >
            {bajada}
          </p>
        ) : null}
        {children ? (
          <div
            className="e-hero-aparece mt-7 flex flex-wrap justify-center gap-3"
            style={aparece(2)}
          >
            {children}
          </div>
        ) : null}
      </div>
      {vidriera ? (
        <div className="e-hero-aparece e-wrap pb-14 md:pb-20" style={aparece(3)}>
          {vidriera}
        </div>
      ) : null}
    </section>
  );
}
