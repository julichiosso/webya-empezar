import Image from 'next/image';
import { CONFIAN as C } from '@/content/home';

/**
 * "Confían en Webya": la calle del hero sigue, ya de noche, y cada vidriera encendida es un cliente con
 * su logo (en sus colores, sobre el vidrio iluminado). La luz de cada vidriera cae sobre la vereda. En la
 * compu, una fila quieta; en el celular, la calle pasa despacio (la copia es decorativa) y con movimiento
 * reducido se desliza con el dedo.
 */
export function Confian() {
  const fila = (copia: boolean) => (
    <ul className="cf-fila" aria-hidden={copia || undefined}>
      {C.logos.map((l) => (
        <li key={l.id} className="cf-local">
          <div className="cf-vidriera">
            <Image
              src={l.src}
              alt={copia ? '' : l.nombre}
              width={l.ancho}
              height={l.alto}
              sizes="10rem"
              unoptimized={l.src.endsWith('.svg')}
              className={'redondo' in l && l.redondo ? 'cf-logo cf-logo-redondo' : 'cf-logo'}
            />
          </div>
          <span className="cf-derrame" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <section id={C.id} className="tono-oscuro cf" aria-labelledby="titulo-confian">
      <h2 id="titulo-confian" className="cf-rotulo">
        {C.rotulo}
      </h2>
      <div className="cf-calle">
        <div className="cf-pista">
          {fila(false)}
          {fila(true)}
        </div>
      </div>
      <div className="cf-vereda" aria-hidden="true" />
    </section>
  );
}
