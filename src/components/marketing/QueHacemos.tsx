import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { cn } from '@/components/ui/clases';
import { QUE_HACEMOS } from '@/content/empezar/empresa';
import estilos from './QueHacemos.module.css';

const C = CLASES_SECCION.crema;
const { sitio, carta, pedidos, turnos, catalogo, medida } = QUE_HACEMOS.piezas;

/** Una pieza del tablero: su nombre y qué hace se leen; el dibujo acompaña. */
function Pieza({
  n,
  id,
  nombre,
  texto,
  children,
}: {
  n: number;
  id: string;
  nombre: string;
  texto: string;
  children?: ReactNode;
}) {
  return (
    <li className={estilos.pieza} data-pieza={id} style={{ '--n': n } as CSSProperties}>
      <div className={estilos.cuerpo}>
        <div aria-hidden="true" className={estilos.dibujo}>
          {children}
        </div>
        <h3 className={estilos.nombre}>{nombre}</h3>
        <p className={estilos.texto}>{texto}</p>
        <div aria-hidden="true" className={estilos.encendido} />
      </div>
    </li>
  );
}

/** Un QR dibujado a mano, decorativo (no se escanea): las tres esquinas y un relleno. */
const QR_D =
  'M0 0h7v7H0zM1 1v5h5V1zM2 2h3v3H2zM14 0h7v7h-7zM15 1v5h5V1zM16 2h3v3h-3zM0 14h7v7H0zM1 15v5h5v-5zM2 16h3v3H2zM9 0h2v2H9zM12 2h1v3h-1zM9 4h2v2H9zM9 8h3v2H9zM0 9h2v2H0zM4 9h3v1H4zM14 9h2v3h-2zM18 9h3v2h-3zM9 12h2v3H9zM12 13h3v2h-3zM17 13h4v1h-4zM9 17h3v4H9zM14 17h2v2h-2zM18 16h3v3h-3zM14 20h3v1h-3z';

/**
 * "Qué hacemos": el tablero de lo que WebYa entrega. Al scrollear, cada pieza llega volando desde otro
 * lado y hace clic en su lugar hasta completar el tablero (en escritorio, con la sección fija; en
 * celular, a medida que entra). Todo es CSS; sin soporte o con reduced-motion el tablero ya está armado.
 */
export function QueHacemos() {
  return (
    <Seccion
      fondo="crema"
      id="que-hacemos"
      aria-labelledby="que-hacemos-title"
      className={cn(estilos.seccion, 'scroll-mt-16 overflow-clip!')}
      contenidoClassName={estilos.contenido}
    >
      <div className={estilos.escena}>
        <div>
          <h2 id="que-hacemos-title" className={estilos.titulo}>
            {QUE_HACEMOS.titulo}
          </h2>
          <p className={cn('mt-4 max-w-md text-lead', C.secundario)}>{QUE_HACEMOS.bajada}</p>
        </div>
        <ul className={estilos.tablero}>
          <Pieza n={0} id="sitio" nombre={sitio.nombre} texto={sitio.texto}>
            <div className={estilos.miniSitio}>
              <span className={estilos.miniNombre}>{sitio.muestra.negocio}</span>
              <span className={estilos.miniBoton}>{sitio.muestra.accion}</span>
            </div>
          </Pieza>
          <Pieza n={1} id="carta" nombre={carta.nombre} texto={carta.texto}>
            <svg viewBox="0 0 21 21" className={estilos.qr} focusable="false">
              <path d={QR_D} fillRule="evenodd" />
            </svg>
          </Pieza>
          <Pieza n={2} id="pedidos" nombre={pedidos.nombre} texto={pedidos.texto}>
            <div className={cn('papel', estilos.ticket)}>
              <span className="flex items-center gap-2 font-semibold">
                <Icon name="check" size={16} className="rounded-sm bg-accent text-accent-fg" />
                {pedidos.muestra.titulo}
              </span>
              <span className="text-paper-muted">{pedidos.muestra.detalle}</span>
            </div>
          </Pieza>
          <Pieza n={3} id="turnos" nombre={turnos.nombre} texto={turnos.texto}>
            <div className={estilos.agenda}>
              <span className={estilos.agendaDia}>{turnos.muestra.dia}</span>
              {turnos.muestra.franjas.map((f) => (
                <span key={f.nombre} className={estilos.franja} data-tomado={f.tomado || undefined}>
                  {f.nombre}
                </span>
              ))}
            </div>
          </Pieza>
          <Pieza n={4} id="catalogo" nombre={catalogo.nombre} texto={catalogo.texto}>
            <div className={estilos.vidriera}>
              <span />
              <span />
              <span />
            </div>
          </Pieza>
          <Pieza n={5} id="medida" nombre={medida.nombre} texto={medida.texto}>
            <span className={estilos.hueco}>
              <Icon name="mas" size={24} />
            </span>
          </Pieza>
        </ul>
      </div>
    </Seccion>
  );
}
