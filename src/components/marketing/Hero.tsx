import type { CSSProperties } from 'react';
import { LOGO_TRAZOS, LOGO_VIEWBOX } from '@/brand/logo/trazos';
import { CLASES_SECCION } from '@/components/patterns/Seccion';
import { Telefono } from '@/components/patterns/Telefono';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/components/ui/clases';
import { CLIENTES } from '@/content/clientes';
import { HERO } from '@/content/empezar/hero';
import { ControlHero } from './ControlHero';
import estilos from './Hero.module.css';

const C = CLASES_SECCION.tinta;

/**
 * Los celulares del hero: cuatro poses armadas a mano, una por posición (Hero.module.css). Adelante, los
 * que muestran mejor el uso: pedir una pizza y consultar por una joya.
 */
const ORDEN_EN_ESCENA = ['abelardo', 'micios', 'petrucci', 'fonosanjorge'];
const EN_ESCENA = ORDEN_EN_ESCENA.flatMap((id) => CLIENTES.filter((c) => c.id === id));

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

/** Un iPhone con el sitio real de un cliente mientras alguien lo usa. La isla lo reproduce (ControlHero). */
function Celular({ posicion }: { posicion: number }) {
  const cliente = EN_ESCENA[posicion];
  if (!cliente) return null;
  return (
    <div className={estilos.vuelo} data-n={posicion}>
      <div className={estilos.entrada}>
        <div className={estilos.aparato}>
          <Telefono sinBarra className={estilos.celular} pantallaClassName={estilos.pantalla}>
            <video
              src={`/clientes/uso-${cliente.id}.mp4`}
              poster={`/clientes/uso-${cliente.id}.webp`}
              width={480}
              height={1038}
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
              className={estilos.video}
            />
          </Telefono>
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
 * Hero de /empezar: quién es WebYa, con el trabajo real a la vista. Abre con la cortina y los iPhones
 * suben en abanico, cada uno con el sitio de un cliente mientras alguien lo usa: pide una pizza, consulta
 * por un anillo, saca un turno. Al scrollear, el texto se va y los iPhones vuelan hasta formar una fila:
 * cada uno "hace clic" al llegar.
 *
 * Todo es CSS (solo transform y opacity; el recorrido, con animation-timeline). Sin soporte queda el
 * abanico quieto y con reduced-motion, además, sin cortina y con el póster en vez del video. La isla
 * reproduce los videos, los pausa fuera de pantalla y agrega la inclinación con el mouse.
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
        <div aria-hidden="true" className={estilos.luz} />
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
