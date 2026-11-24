import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ESCENA_TRABAJOS } from '@/brand/tokens/colores';
import { RUTAS, TRABAJOS as T } from '@/content/home';
import { CASOS, type ImagenProyecto, type Proyecto } from '@/content/proyectos';
import { LinkChevron } from '../editorial/LinkChevron';
import { TituloPalabras } from '../editorial/TituloPalabras';

/** Fondo de la escena de cada caso, tomado de la marca del cliente (y una luz suave arriba). */
const ESCENA: Record<string, { fondo: string; luz: string; claro: boolean }> = ESCENA_TRABAJOS;

/** La captura real del sitio, a sangre en la tarjeta, recortada desde arriba. */
function Captura({ img, clase }: { img: ImagenProyecto; clase: string }) {
  return (
    <div className={`tb-captura ${clase}`}>
      <Image
        src={img.src}
        alt=""
        fill
        sizes="(min-width: 768px) 46vw, 92vw"
        className="object-cover object-top"
      />
    </div>
  );
}

/** Teléfono en vector (CSS): marco de titanio, isla y la captura anclada arriba. */
function Telefono({ img, className }: { img: ImagenProyecto; className?: string }) {
  return (
    <div className={className ? `tb-telefono ${className}` : 'tb-telefono'}>
      <div className="tb-telefono-pantalla">
        <Image
          src={img.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 9rem, 30vw"
          className="object-cover object-top"
        />
        {img.completa ? null : <span className="tb-telefono-isla" aria-hidden="true" />}
      </div>
    </div>
  );
}

function Escena({ p }: { p: Proyecto }) {
  const e = ESCENA[p.id] ?? ESCENA_TRABAJOS.base;
  const { desktop, mobile } = p.imagenes;
  return (
    <div
      className="tb-escena"
      data-claro={e.claro || undefined}
      style={{ '--tb-fondo': e.fondo, '--tb-luz': e.luz } as CSSProperties}
    >
      <div className="tb-equipos">
        {desktop ? (
          <>
            <Captura img={desktop} clase="tb-captura-compu" />
            {mobile ? (
              <>
                {/* En el celular, la captura del celular a sangre (ya es vertical). */}
                <Captura img={mobile} clase="tb-captura-movil" />
                <Telefono img={mobile} className="tb-telefono-asoma" />
              </>
            ) : null}
          </>
        ) : mobile ? (
          <Telefono img={mobile} className="tb-telefono-solo" />
        ) : null}
      </div>
    </div>
  );
}

/**
 * "Últimos trabajos": título grande a la izquierda y una línea chica a la derecha; los casos en tarjetas
 * grandes (dos por fila en la compu) con la escena del sistema en sus equipos, qué armamos y el rubro, y
 * el nombre del cliente. Cada tarjeta lleva al caso completo.
 */
export function Trabajos() {
  return (
    <section id={T.id} className="tono-hueso tb" aria-labelledby="titulo-trabajos">
      <div className="e-wrap">
        <div className="tb-cabeza">
          <TituloPalabras lineas={[T.titulo]} id="titulo-trabajos" className="tb-titulo" />
          <p className="tb-bajada">{T.bajada}</p>
        </div>
        <ul className="tb-grilla">
          {CASOS.map((p, i) => (
            <li key={p.id} data-reveal="" style={{ '--i': i % 2 } as CSSProperties}>
              <Link href={`${RUTAS.proyectos}/${p.id}`} className="tb-tarjeta">
                <Escena p={p} />
                <p className="tb-meta">
                  {T.meta((T.que as Record<string, string>)[p.id] ?? p.sistema, p.rubro)}
                </p>
                <h3 className="tb-nombre">{p.cliente}</h3>
              </Link>
            </li>
          ))}
        </ul>
        <div className="tb-pie">
          <LinkChevron href={RUTAS.proyectos}>{T.verTodos}</LinkChevron>
        </div>
      </div>
    </section>
  );
}
