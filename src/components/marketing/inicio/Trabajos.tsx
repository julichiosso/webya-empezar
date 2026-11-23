import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ESCENA_TRABAJOS } from '@/brand/tokens/colores';
import { RUTAS, TRABAJOS as T } from '@/content/home';
import { CASOS, type ImagenProyecto, type Proyecto } from '@/content/proyectos';
import { LinkChevron } from '../editorial/LinkChevron';

/** Fondo de la escena de cada caso, tomado de la marca del cliente (y una luz suave arriba). */
const ESCENA: Record<string, { fondo: string; luz: string; claro: boolean }> = ESCENA_TRABAJOS;

/** Notebook en vector (CSS): pantalla con borde negro, cámara y la base de aluminio con su muesca. */
function Notebook({ img }: { img: ImagenProyecto }) {
  return (
    <div className="tb-notebook">
      <div className="tb-notebook-tapa">
        <div className="tb-notebook-pantalla">
          <Image
            src={img.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 34rem, 80vw"
            className="object-cover object-top"
          />
        </div>
      </div>
      <div className="tb-notebook-base" aria-hidden="true" />
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
            <Notebook img={desktop} />
            {mobile ? <Telefono img={mobile} className="tb-telefono-lado" /> : null}
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
          <h2 id="titulo-trabajos" className="tb-titulo">
            {T.titulo}
          </h2>
          <p className="tb-bajada">{T.bajada}</p>
        </div>
        <ul className="tb-grilla">
          {CASOS.map((p, i) => (
            <li key={p.id} data-reveal="" style={{ '--i': i % 2 } as CSSProperties}>
              <Link href={`${RUTAS.proyectos}/${p.id}`} className="tb-tarjeta">
                <Escena p={p} />
                <p className="tb-meta">
                  <span>{(T.que as Record<string, string>)[p.id] ?? p.sistema}</span>
                  <span aria-hidden="true">•</span>
                  <span>{p.rubro}</span>
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
