import Image from 'next/image';
import { CONFIAN as C } from '@/content/home';

/** Ancho de un tramo del horizonte (se repite dos veces para que la vuelta no se note). */
const TRAMO = 1200;
const SUELO = 70;

/**
 * El horizonte del pueblo en línea: techos, un frontón, una cúpula, el tanque de agua, la torre de la
 * iglesia y un silo. Un solo trazo, calculado una vez (no cambia entre visitas).
 */
function horizonte(): string {
  const piezas: string[] = [];
  let x = 0;
  const plano = (w: number, h: number) => {
    piezas.push(`V${SUELO - h}H${x + w}V${SUELO}`);
    x += w;
  };
  const fronton = (w: number, h: number) => {
    piezas.push(
      `V${SUELO - h}H${x + w * 0.3}L${x + w / 2} ${SUELO - h - 12}L${x + w * 0.7} ${SUELO - h}H${x + w}V${SUELO}`,
    );
    x += w;
  };
  const cupula = (w: number, h: number) => {
    piezas.push(
      `V${SUELO - h}H${x + w * 0.25}A${w * 0.25} ${w * 0.25} 0 0 1 ${x + w * 0.75} ${SUELO - h}H${x + w}V${SUELO}`,
    );
    x += w;
  };
  const torre = (w: number, h: number) => {
    piezas.push(
      `V${SUELO - h}H${x + w * 0.35}L${x + w / 2} ${SUELO - h - 22}L${x + w * 0.65} ${SUELO - h}H${x + w}V${SUELO}`,
    );
    x += w;
  };
  const tanque = () => {
    // Patas y tanque de agua sobre la línea del suelo.
    piezas.push(
      `H${x + 8}V${SUELO - 30}H${x + 4}V${SUELO - 52}H${x + 36}V${SUELO - 30}H${x + 32}V${SUELO}`,
    );
    x += 40;
  };
  const silo = () => {
    piezas.push(`V${SUELO - 44}A13 9 0 0 1 ${x + 26} ${SUELO - 44}V${SUELO}`);
    x += 26;
  };
  const hueco = (w: number) => {
    piezas.push(`H${x + w}`);
    x += w;
  };
  // Un tramo de pueblo, de izquierda a derecha.
  plano(70, 22);
  fronton(80, 26);
  hueco(30);
  torre(36, 40);
  plano(90, 20);
  cupula(80, 24);
  hueco(40);
  tanque();
  hueco(30);
  plano(60, 28);
  fronton(70, 22);
  plano(50, 16);
  hueco(50);
  silo();
  hueco(6);
  silo();
  hueco(50);
  plano(80, 24);
  cupula(70, 20);
  fronton(90, 30);
  hueco(40);
  plano(Math.max(20, TRAMO - x), 18);
  return `M0 ${SUELO}${piezas.join('')}`;
}

const TECHOS = horizonte();

/**
 * "Confían en Webya": los logos de los clientes pasan en una cinta continua y suave (como en un juego de
 * desplazamiento lateral), con el horizonte del pueblo en línea detrás, que pasa más lento (profundidad),
 * y la vereda abajo. Los logos van en gris y toman su color al pasar el mouse. Sin movimiento, la cinta
 * queda quieta y se desliza con el dedo.
 */
export function Confian() {
  const fila = (copia: boolean) => (
    <ul className="cf-fila" aria-hidden={copia || undefined}>
      {C.logos.map((l) => (
        <li key={l.id} className="cf-logo-caja">
          <Image
            src={l.src}
            alt={copia ? '' : l.nombre}
            width={l.ancho}
            height={l.alto}
            sizes="10rem"
            unoptimized={l.src.endsWith('.svg')}
            className={'redondo' in l && l.redondo ? 'cf-logo cf-logo-redondo' : 'cf-logo'}
          />
        </li>
      ))}
    </ul>
  );
  return (
    <section id={C.id} className="tono-hueso cf" aria-labelledby="titulo-confian">
      {/* El toldo de la calle, a todo el ancho: se despliega al entrar en pantalla. */}
      <div className="cf-toldo" data-reveal="" aria-hidden="true">
        <span className="cf-toldo-tela">
          <span className="cf-toldo-lima" />
        </span>
      </div>
      <div className="cf-marco">
        <h2 id="titulo-confian" className="cf-rotulo">
          {C.rotulo}
        </h2>
        <div className="cf-ventana">
          <svg
            className="cf-techos"
            viewBox={`0 0 ${TRAMO * 2} ${SUELO + 1}`}
            preserveAspectRatio="xMinYMax meet"
            aria-hidden="true"
            focusable="false"
          >
            <path d={TECHOS} />
            <path d={TECHOS} transform={`translate(${TRAMO} 0)`} />
          </svg>
          <div className="cf-cinta">
            {fila(false)}
            {fila(true)}
            {fila(true)}
            {fila(true)}
          </div>
          <span className="cf-vereda" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
