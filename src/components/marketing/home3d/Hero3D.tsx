import type { CSSProperties } from 'react';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { HERO_3D as H, NECESITA, RUTAS } from '@/content/home';
import { NOSOTROS } from '@/content/paginas';
import { PROYECTOS } from '@/content/proyectos';
import { enlaceContacto } from '../editorial/contacto';
import { Funcionando } from './Funcionando';
import { Globo } from './Globo';
import { ObjetoHero } from './ObjetoHero';
import { ProgresoHero } from './ProgresoHero';
import { Sello } from './Sello';
import { Surcos } from './Surcos';

const ID = 'hero';

/** Los clientes con su sistema funcionando hoy (verificados en TRUST_CLAIMS.md). */
const CLIENTES = PROYECTOS.filter((p) => p.estado === 'produccion').map((p) => ({
  id: p.id,
  nombre: p.cliente,
  href: `${RUTAS.proyectos}/${p.id}`,
}));

/**
 * Hero de la home: el símbolo `<w>` enorme en el centro, que pasa por los tres estados del lema al
 * scrollear (Creá: tres piezas sueltas; Digitalizá: alineadas, con la grilla; Crecé: armado, y brotan los
 * surcos). El lema a la izquierda con la última palabra en cursiva, la bajada con la zona a la derecha,
 * el globo arriba, el sello para escribirnos abajo y los clientes reales al pie. En el celular, lo mismo
 * en una columna pensada para el pulgar.
 *
 * Con movimiento permitido el escenario queda fijo un tramo (la sección mide más que la pantalla) y el
 * scroll mueve `--p`; con movimiento reducido mide una pantalla y todo se ve quieto y completo.
 */
export function Hero3D() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  const externo = contacto.canal === 'whatsapp';
  return (
    <section id={ID} className="tono-hueso h3d" aria-labelledby="titulo-hero">
      <ProgresoHero id={ID} />
      <div className="h3d-escenario">
        <Surcos className="h3d-surcos" />
        <ObjetoHero className="h3d-zona-objeto" />

        <h1 id="titulo-hero" className="h3d-lema">
          {H.lema.map((palabra, i) => (
            <span
              key={palabra}
              className={i === H.cursiva ? 'h3d-palabra h3d-cursiva' : 'h3d-palabra'}
              style={{ '--i': i } as CSSProperties}
            >
              {palabra}
              {i < H.lema.length - 1 ? ' ' : null}
            </span>
          ))}
        </h1>

        <p className="h3d-bajada">{H.bajada}</p>

        <a href={`#${NECESITA.id}`} className="h3d-necesita">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <span>{H.necesita}</span>
        </a>

        <Globo href={RUTAS.zona} aria={H.globo.aria} className="h3d-zona-globo" />

        <Sello
          href={contacto.href}
          externo={externo}
          aria={externo ? H.sello.aria : H.sello.ariaMail}
          giro={H.sello.giro}
          foto={NOSOTROS.foto}
          className="h3d-zona-sello"
        />

        <Funcionando rotulo={H.funcionando} clientes={CLIENTES} className="h3d-zona-franja" />
      </div>
      {/* En la compu el sello queda fijo abajo a la derecha cuando el hero ya pasó (CSS). */}
      <Sello
        href={contacto.href}
        externo={externo}
        aria={externo ? H.sello.aria : H.sello.ariaMail}
        giro={H.sello.giro}
        foto={NOSOTROS.foto}
        className="h3d-sello-fijo"
        idArco="h3d-sello-arco-fijo"
      />
    </section>
  );
}
