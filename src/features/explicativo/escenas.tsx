import type { CSSProperties, ReactNode } from 'react';
import { Ilustracion } from '@/components/ilustraciones/Ilustracion';
import { ICONS, type IconName } from '@/components/icons/paths';
import { LOGO_TRAZOS } from '@/components/logo-trazos';
import { PALETAS_DEMO } from '@/config/demos/gastronomia/paletas';
import type { EscenaId } from '@/config/explicativo';

/**
 * Escenas del video explicativo (motion graphics). SVG propio en un lienzo de 1000×640, con los
 * tokens de la marca y el lenguaje "Encastre": las piezas llegan, se pasan apenas y asientan.
 *
 * Regla de armado: la POSICIÓN va en un <g transform> exterior y la ANIMACIÓN en un <g> interior
 * con clase `.mg-*` (si no, el transform de la animación CSS pisa el de la posición). Solo se
 * anima transform/opacity, una vez por escena; con reduced-motion todo aparece quieto.
 */
const ANCHO = 1000;
const ALTO = 640;
/** Parte del lienzo que se ve: el contenido de todas las escenas cae entre x 70–940 e y 30–610. */
const RECORTE = '70 30 870 580';

type Animacion = 'entra' | 'encaja' | 'pop' | 'desliza' | 'sale' | 'recorre' | 'pulso';

/** Pieza animada: `en` = posición, `anim` = cómo entra, `d` = demora en ms. */
function P({
  en = [0, 0],
  anim = 'entra',
  d = 0,
  children,
}: {
  en?: [number, number];
  anim?: Animacion;
  d?: number;
  children: ReactNode;
}) {
  return (
    <g transform={`translate(${en[0]} ${en[1]})`}>
      <g className={`mg mg-${anim}`} style={{ '--d': `${d}ms` } as CSSProperties}>
        {children}
      </g>
    </g>
  );
}

function Telefono({
  x,
  y,
  ancho = 260,
  alto = 540,
  papel = false,
  children,
}: {
  x: number;
  y: number;
  ancho?: number;
  alto?: number;
  papel?: boolean;
  children?: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={ancho}
        height={alto}
        rx="40"
        className="fill-surface-2 stroke-line-strong"
        strokeWidth="2"
      />
      <rect
        x="12"
        y="12"
        width={ancho - 24}
        height={alto - 24}
        rx="30"
        className={papel ? 'fill-paper' : 'fill-bg'}
      />
      <rect x={ancho / 2 - 30} y="22" width="60" height="8" rx="4" className="fill-line-strong" />
      {children}
    </g>
  );
}

function IconoSvg({
  nombre,
  x,
  y,
  escala = 2,
  clase = 'stroke-fg',
}: {
  nombre: IconName;
  x: number;
  y: number;
  escala?: number;
  clase?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${escala})`}
      fill="none"
      className={clase}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[nombre].map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

function Texto({
  x,
  y,
  children,
  tam = 24,
  clase = 'fill-fg',
  peso = 600,
  ancla = 'start',
}: {
  x: number;
  y: number;
  children: ReactNode;
  tam?: number;
  clase?: string;
  peso?: number;
  ancla?: 'start' | 'middle' | 'end';
}) {
  return (
    <text x={x} y={y} fontSize={tam} fontWeight={peso} textAnchor={ancla} className={clase}>
      {children}
    </text>
  );
}

function Burbuja({
  x,
  y,
  ancho,
  texto,
  mia = false,
}: {
  x: number;
  y: number;
  ancho: number;
  texto: string;
  mia?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={ancho} height="44" rx="22" className={mia ? 'fill-accent' : 'fill-surface-2'} />
      <Texto x={18} y={29} tam={18} peso={500} clase={mia ? 'fill-accent-fg' : 'fill-fg'}>
        {texto}
      </Texto>
    </g>
  );
}

// --- Escenas ----------------------------------------------------------------------------------

function Problema() {
  const mensajes: [string, boolean][] = [
    ['¿Siguen abiertos?', false],
    ['Dos muzzas, porfa', false],
    ['¿A qué hora paso?', false],
    ['Mandame la carta', false],
    ['¿Me anotaste?', false],
  ];
  return (
    <>
      <Telefono x={230} y={50}>
        {mensajes.map(([t, mia], i) => (
          <P key={t} en={[24, 80 + i * 70]} anim="encaja" d={200 + i * 380}>
            <Burbuja x={0} y={0} ancho={Math.min(212, 40 + t.length * 9)} texto={t} mia={mia} />
          </P>
        ))}
      </Telefono>
      {/* El papelito de los pedidos, torcido. */}
      <g transform="translate(600 210) rotate(-8)">
        <g className="mg mg-pop" style={{ '--d': '2100ms' } as CSSProperties}>
          <rect width="200" height="230" rx="8" className="fill-paper" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M24 ${46 + i * 36}c30-10 60 8 100-2s40 6 52 0`}
              className="stroke-paper-muted"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>
      <P en={[790, 200]} anim="pop" d={2900}>
        <circle r="34" className="fill-danger" />
        <Texto x={0} y={13} tam={40} peso={700} ancla="middle" clase="fill-bg">
          !
        </Texto>
      </P>
    </>
  );
}

const PIEZAS: { icono: IconName; nombre: string }[] = [
  { icono: 'carta_qr', nombre: 'Carta' },
  { icono: 'pedidos', nombre: 'Pedidos' },
  { icono: 'pagos', nombre: 'Pagos' },
  { icono: 'notificaciones', nombre: 'Avisos' },
];

function Encastre() {
  return (
    <>
      <P en={[110, 250]} anim="desliza" d={100}>
        <rect
          width="220"
          height="64"
          rx="32"
          className="fill-surface-2 stroke-line-strong"
          strokeWidth="2"
        />
        <IconoSvg nombre="cubiertos" x={22} y={14} escala={1.5} />
        <Texto x={66} y={41} tam={22}>
          Gastronomía
        </Texto>
      </P>
      <Telefono x={420} y={50}>
        {PIEZAS.map((p, i) => {
          const x = 30 + (i % 2) * 104;
          const y = 120 + Math.floor(i / 2) * 150;
          return (
            <g key={p.nombre}>
              <rect
                x={x}
                y={y}
                width="96"
                height="120"
                rx="18"
                className="fill-none stroke-line-strong"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
              <P en={[x, y]} anim="encaja" d={500 + i * 550}>
                <rect width="96" height="120" rx="18" className="fill-accent" />
                <IconoSvg nombre={p.icono} x={24} y={20} escala={2} clase="stroke-accent-fg" />
                <Texto x={48} y={100} tam={17} ancla="middle" clase="fill-accent-fg">
                  {p.nombre}
                </Texto>
              </P>
            </g>
          );
        })}
      </Telefono>
      <P en={[740, 300]} anim="pop" d={2900}>
        <circle r="40" className="fill-accent" />
        <path
          d="M-16 0l10 10 22-22"
          className="stroke-accent-fg"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </P>
    </>
  );
}

/** Patrón fijo que "parece" un QR (decorativo: no se escanea). */
function QrFalso() {
  const celdas = [0b1110111, 0b1010101, 0b1110111, 0b0001000, 0b1101011, 0b0110110, 0b1011101];
  return (
    <g>
      <rect width="180" height="180" rx="16" className="fill-paper" />
      {celdas.flatMap((fila, y) =>
        [...Array(7).keys()].map((x) =>
          fila & (1 << (6 - x)) ? (
            <rect
              key={`${x}-${y}`}
              x={20 + x * 20}
              y={20 + y * 20}
              width="20"
              height="20"
              className="fill-paper-fg"
            />
          ) : null,
        ),
      )}
    </g>
  );
}

function Carta() {
  const platos: { ilus: 'pizza' | 'empanada' | 'faina'; nombre: string; precio: string }[] = [
    { ilus: 'pizza', nombre: 'Muzzarella', precio: '$ 13.500' },
    { ilus: 'empanada', nombre: 'Empanada', precio: '$ 1.900' },
    { ilus: 'faina', nombre: 'Fainá', precio: '$ 1.800' },
  ];
  return (
    <>
      <P en={[120, 230]} anim="pop" d={100}>
        <QrFalso />
      </P>
      <P en={[330, 320]} anim="entra" d={700}>
        <path
          d="M0 0h120"
          className="stroke-line-strong"
          strokeWidth="4"
          strokeDasharray="10 10"
          strokeLinecap="round"
        />
        <path
          d="M110 -12l14 12-14 12"
          className="stroke-line-strong"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </P>
      <Telefono x={500} y={50} papel>
        <P en={[28, 70]} anim="entra" d={900}>
          <Texto x={0} y={30} tam={30} peso={700} clase="fill-paper-fg">
            Tu pizzería
          </Texto>
          <rect
            y="52"
            width="204"
            height="40"
            rx="12"
            className="fill-paper-2 stroke-paper-line"
            strokeWidth="2"
          />
        </P>
        {platos.map((p, i) => (
          <P key={p.nombre} en={[28, 190 + i * 104]} anim="desliza" d={1300 + i * 350}>
            <rect width="204" height="92" rx="16" className="fill-paper-2" />
            <g transform="translate(118 6)" className="text-paper-fg">
              <Ilustracion id={p.ilus} size={80} />
            </g>
            <Texto x={14} y={38} tam={19} clase="fill-paper-fg">
              {p.nombre}
            </Texto>
            <Texto x={14} y={68} tam={18} clase="fill-accent-ink">
              {p.precio}
            </Texto>
          </P>
        ))}
      </Telefono>
    </>
  );
}

function Pedido() {
  return (
    <>
      <Telefono x={230} y={50} papel>
        {['Retiro', 'En el local', 'Envío'].map((m, i) => (
          <P key={m} en={[28, 90 + i * 72]} anim="pop" d={200 + i * 250}>
            <rect
              width="204"
              height="56"
              rx="16"
              className={
                i === 0 ? 'fill-paper-2 stroke-accent-ink' : 'fill-paper-2 stroke-paper-line'
              }
              strokeWidth="3"
            />
            <Texto x={20} y={36} tam={20} clase="fill-paper-fg">
              {m}
            </Texto>
          </P>
        ))}
        <P en={[28, 440]} anim="pulso" d={1500}>
          <rect width="204" height="60" rx="16" className="fill-accent" />
          <Texto x={102} y={38} tam={22} ancla="middle" clase="fill-accent-fg">
            Confirmar
          </Texto>
        </P>
      </Telefono>
      <g transform="translate(600 150)">
        <g className="mg mg-desliza" style={{ '--d': '2100ms' } as CSSProperties}>
          <rect width="240" height="320" rx="16" className="fill-paper" />
          <Texto x={120} y={84} tam={56} peso={700} ancla="middle" clase="fill-paper-fg">
            #24
          </Texto>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x="32"
              y={130 + i * 40}
              width={176 - i * 30}
              height="14"
              rx="7"
              className="fill-paper-line"
            />
          ))}
        </g>
      </g>
      <P en={[830, 170]} anim="pop" d={2800}>
        <circle r="36" className="fill-accent" />
        <path
          d="M-15 0l10 10 20-20"
          className="stroke-accent-fg"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </P>
    </>
  );
}

function Panel() {
  const columnas = ['Nuevo', 'Preparando', 'Listo'];
  return (
    <>
      {columnas.map((c, i) => (
        <P key={c} en={[90 + i * 290, 70]} anim="entra" d={i * 150}>
          <Texto x={0} y={0} tam={26}>
            {c}
          </Texto>
          <rect
            y="24"
            width="250"
            height="460"
            rx="24"
            className="fill-none stroke-line-strong"
            strokeWidth="2"
            strokeDasharray="10 10"
          />
        </P>
      ))}
      {/* Pedidos que ya estaban: quietos en sus columnas. */}
      <P en={[402, 260]} anim="entra" d={500}>
        <TarjetaMg numero="#21" />
      </P>
      <P en={[692, 120]} anim="entra" d={600}>
        <TarjetaMg numero="#20" />
      </P>
      {/* El pedido nuevo cae en "Nuevo" y recorre las columnas. */}
      <g transform="translate(112 120)">
        <g className="mg mg-encaja" style={{ '--d': '700ms' } as CSSProperties}>
          <g className="mg mg-recorre" style={{ '--d': '1500ms' } as CSSProperties}>
            <TarjetaMg numero="#24" nuevo />
          </g>
        </g>
      </g>
    </>
  );
}

function TarjetaMg({ numero, nuevo = false }: { numero: string; nuevo?: boolean }) {
  return (
    <g>
      <rect
        width="206"
        height="120"
        rx="18"
        className={nuevo ? 'fill-surface stroke-accent' : 'fill-surface stroke-line'}
        strokeWidth="3"
      />
      <Texto x={20} y={44} tam={26}>
        {numero}
      </Texto>
      <rect x="20" y="62" width="130" height="10" rx="5" className="fill-line-strong" />
      <rect
        x="20"
        y="84"
        width="166"
        height="20"
        rx="10"
        className={nuevo ? 'fill-accent' : 'fill-line'}
      />
    </g>
  );
}

function Seguimiento() {
  const pasos = ['Recibido', 'En preparación', 'Listo', 'Entregado'];
  return (
    <>
      <Telefono x={230} y={50} papel>
        <P en={[28, 80]} anim="entra" d={0}>
          <Texto x={0} y={36} tam={34} peso={700} clase="fill-paper-fg">
            Pedido #24
          </Texto>
        </P>
        {pasos.map((p, i) => (
          <g key={p} transform={`translate(44 ${190 + i * 80})`}>
            <circle
              r="18"
              className="fill-none stroke-paper-muted"
              strokeWidth="2"
              strokeDasharray="5 6"
            />
            <g className="mg mg-pop" style={{ '--d': `${300 + i * 900}ms` } as CSSProperties}>
              <circle r="19" className="fill-accent" />
              <path
                d="M-8 0l5 5 10-10"
                className="stroke-accent-fg"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </g>
            <Texto x={36} y={8} tam={21} clase="fill-paper-fg">
              {p}
            </Texto>
          </g>
        ))}
      </Telefono>
      <g transform="translate(600 230)">
        <g className="mg mg-entra" style={{ '--d': '200ms' } as CSSProperties}>
          <g className="mg mg-sale" style={{ '--d': '2600ms' } as CSSProperties}>
            <Burbuja x={0} y={0} ancho={220} texto="¿Falta mucho?" />
            <path d="M-6 22h232" className="stroke-danger" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </>
  );
}

function Marca() {
  const paletas = PALETAS_DEMO.filter((p) => ['brasa', 'pileta', 'ciruela'].includes(p.id));
  return (
    <>
      <Telefono x={370} y={50}>
        {paletas.map((p, i) => (
          // Cada capa repinta el local con otra paleta (los colores salen de la config curada).
          <P key={p.id} en={[12, 12]} anim="entra" d={200 + i * 1300}>
            <rect width="236" height="516" rx="30" className="fill-bg" />
            <rect
              x="20"
              y="40"
              width="196"
              height="120"
              rx="20"
              style={{ fill: p.accent } as CSSProperties}
            />
            <Texto x={36} y={112} tam={30} peso={700} clase="fill-bg">
              Tu local
            </Texto>
            {[0, 1, 2].map((j) => (
              <g key={j} transform={`translate(20 ${190 + j * 100})`}>
                <rect width="196" height="80" rx="16" className="fill-surface-2" />
                <circle cx="166" cy="40" r="18" style={{ fill: p.accent } as CSSProperties} />
                <rect x="18" y="26" width="100" height="12" rx="6" className="fill-line-strong" />
              </g>
            ))}
          </P>
        ))}
      </Telefono>
      {PALETAS_DEMO.map((p, i) => (
        <P
          key={p.id}
          en={[170 + (i % 2) * 70, 200 + Math.floor(i / 2) * 80]}
          anim="pop"
          d={100 + i * 120}
        >
          <circle r="26" style={{ fill: p.accent } as CSSProperties} />
        </P>
      ))}
    </>
  );
}

function Nosotros() {
  return (
    <>
      <P en={[270, 60]} anim="entra" d={0}>
        <g transform="scale(0.33)" className="fill-fg">
          {LOGO_TRAZOS.map((t) => (
            <path key={t.letra} d={t.d} fillRule="evenodd" />
          ))}
        </g>
      </P>
      <g transform="translate(200 170)">
        <rect
          width="600"
          height="400"
          rx="24"
          className="fill-surface-2 stroke-line-strong"
          strokeWidth="2"
        />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={34 + i * 24} cy="32" r="7" className="fill-line-strong" />
        ))}
        <P en={[30, 66]} anim="encaja" d={300}>
          <rect width="540" height="120" rx="18" className="fill-surface" />
          <rect x="30" y="34" width="260" height="22" rx="11" className="fill-fg" />
          <rect x="30" y="72" width="120" height="26" rx="13" className="fill-accent" />
        </P>
        {[0, 1, 2].map((i) => (
          <P key={i} en={[30 + i * 184, 210]} anim="encaja" d={900 + i * 400}>
            <rect width="172" height="150" rx="18" className="fill-surface" />
            <rect x="20" y="24" width="60" height="60" rx="14" className="fill-line" />
            <rect x="20" y="104" width="120" height="12" rx="6" className="fill-line-strong" />
          </P>
        ))}
      </g>
      <P en={[740, 170]} anim="pop" d={2600}>
        <rect x="-90" y="-30" width="180" height="60" rx="30" className="fill-accent" />
        <Texto x={0} y={9} tam={24} ancla="middle" clase="fill-accent-fg">
          Online
        </Texto>
      </P>
    </>
  );
}

function Cta() {
  return (
    <>
      <g transform="translate(220 200)">
        <g className="logo-armado fill-fg" transform="scale(0.46)">
          {LOGO_TRAZOS.map((t, i) => (
            <path
              key={t.letra}
              d={t.d}
              fillRule="evenodd"
              className="logo-pieza"
              style={{ '--i': i } as CSSProperties}
            />
          ))}
        </g>
      </g>
      <P en={[500, 420]} anim="entra" d={900}>
        <Texto x={0} y={0} tam={44} peso={700} ancla="middle">
          Creá. Digitalizá. Crecé.
        </Texto>
      </P>
    </>
  );
}

const ESCENAS: Record<EscenaId, () => ReactNode> = {
  problema: Problema,
  encastre: Encastre,
  carta: Carta,
  pedido: Pedido,
  panel: Panel,
  seguimiento: Seguimiento,
  marca: Marca,
  nosotros: Nosotros,
  cta: Cta,
};

/** Lienzo de una escena. Se remonta con `key` al cambiar de escena: así cada animación corre una vez. */
export function Escena({ id }: { id: EscenaId }) {
  const Dibujo = ESCENAS[id];
  return (
    <svg
      viewBox={RECORTE}
      data-lienzo={`${ANCHO}x${ALTO}`}
      aria-hidden="true"
      focusable="false"
      data-escena={id}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <Dibujo />
    </svg>
  );
}
