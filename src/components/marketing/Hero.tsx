import type { CSSProperties } from 'react';
import { LOGO_TRAZOS, LOGO_VIEWBOX } from '@/brand/logo/trazos';
import { CLASES_SECCION } from '@/components/patterns/Seccion';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/components/ui/clases';
import { CLIENTES } from '@/content/clientes';
import { HERO } from '@/content/empezar/hero';
import { ControlHero } from './ControlHero';
import estilos from './Hero.module.css';

const C = CLASES_SECCION.tinta;

/** Los celulares del hero: cuatro poses armadas a mano, una por posición (Hero.module.css). */
const EN_ESCENA = CLIENTES.slice(0, 4);

/** La apertura de la página: Brasa a pantalla completa con el logo, que sube y descubre el hero. */
function Cortina() {
  return (
    <div aria-hidden="true" className={estilos.cortina}>
      <div className={estilos.cortinaTinta} />
      <div className={estilos.cortinaBrasa}>
        <svg viewBox={LOGO_VIEWBOX} className={estilos.cortinaLogo} focusable="false">
          {LOGO_TRAZOS.map((t, i) => (
            <path
              key={t.letra}
              d={t.d}
              fillRule="evenodd"
              style={{ '--i': i } as CSSProperties}
              data-par={i % 2 === 0 ? '' : undefined}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

/** Un celular con el sitio real de un cliente, que se recorre solo. */
function Celular({ posicion }: { posicion: number }) {
  const cliente = EN_ESCENA[posicion];
  if (!cliente) return null;
  return (
    <div className={estilos.vuelo} data-n={posicion}>
      <div className={estilos.entrada}>
        <div className={estilos.celular}>
          <div className={estilos.pantalla}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cliente.captura}
              alt=""
              width={cliente.capturaAncho}
              height={cliente.capturaAlto}
              fetchPriority="low"
              decoding="async"
              className={estilos.captura}
            />
          </div>
          <div className={estilos.encendido} />
        </div>
        <p className={estilos.rotulo}>
          <span className={estilos.rotuloNombre}>{cliente.nombre}</span>
          <span className={estilos.rotuloCiudad}>{cliente.ciudad}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Hero de /empezar: quién es WebYa, con el trabajo real a la vista. Abre con la cortina y los celulares
 * suben en abanico con los sitios de los clientes recorriéndose solos. Al scrollear, el texto se va y
 * los celulares vuelan hasta formar una fila: cada uno "hace clic" al llegar.
 *
 * Todo es CSS (solo transform y opacity; el recorrido, con animation-timeline). Sin soporte queda el
 * abanico quieto y con reduced-motion, además, sin cortina. La isla solo agrega la inclinación con el
 * mouse y pausa lo que corre en loop fuera de pantalla.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      data-fondo="tinta"
      className={cn(estilos.hero, C.fondo, C.texto, C.foco)}
    >
      <Cortina />
      <ControlHero className={estilos.escena}>
        <div aria-hidden="true" className={estilos.grilla} />
        <div aria-hidden="true" className={estilos.escenario}>
          <div className={estilos.mundo}>
            {EN_ESCENA.map((c, i) => (
              <Celular key={c.id} posicion={i} />
            ))}
          </div>
          <p className={estilos.final}>{HERO.final}</p>
        </div>

        <div className={estilos.contenido}>
          <div className={estilos.texto}>
            <h1 id="hero-title" className={estilos.titulo}>
              {HERO.titulo.split(' ').map((palabra, i) => (
                <span key={i}>
                  <span className={estilos.mascara}>
                    <span className={estilos.palabra} style={{ '--i': i } as CSSProperties}>
                      {palabra}
                    </span>
                  </span>{' '}
                </span>
              ))}
            </h1>
            <div className={estilos.resto}>
              <p className={estilos.subtitulo}>{HERO.subtitulo}</p>
              <p className={cn(estilos.bajada, C.secundario)}>{HERO.bajada}</p>
              <div className={estilos.acciones}>
                <ButtonLink href="#wizard">{HERO.cta}</ButtonLink>
                <ButtonLink href="#ya-lo-usan" variante="secundario">
                  {HERO.ctaTrabajos}
                </ButtonLink>
              </div>
              <p className={cn(estilos.prueba, C.secundario)}>
                {HERO.prueba.antes}{' '}
                <a
                  href="#ya-lo-usan"
                  className={cn(
                    'inline-flex min-h-tap items-center font-medium underline underline-offset-4',
                    C.texto,
                  )}
                >
                  {HERO.prueba.nombres}
                </a>
              </p>
            </div>
          </div>
        </div>
      </ControlHero>
    </section>
  );
}
