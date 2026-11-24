import type { CSSProperties, ReactNode } from 'react';
import { CALLE as K } from '@/brand/tokens/colores';
import { HERO_CALLE as H } from '@/content/home';

/**
 * La calle del hero, en SVG puro (encuadre 1600 × 560, la vereda en y = 500). Cinco frentes de pueblo
 * pegados: cuatro vecinos con su rubro y, en el medio, "Tu negocio", con la vidriera que de noche es una
 * pantalla con sitios reales hechos por Webya.
 *
 * Se dibuja en tres capas apiladas del mismo tamaño: el día (líneas negras sobre blanco), la noche (las
 * mismas formas en tonos oscuros; aparece con opacidad) y las luces (ventanas, faroles, pantalla, cartel
 * de abierto y el reloj). Así el paso del día a la noche es un fundido entre capas (lo resuelve la placa
 * de video) y lo único que se repinta son las luces, que son pocas.
 *
 * Cada luz lee `--p` (el progreso del scroll, en el hero) con su propio tramo: `--a` cuándo se prende y
 * `--c` cuándo se apaga. Todo es decorativo: el hero cuenta lo mismo en texto.
 */

export const VISTA = '0 0 1600 560';
const PISO = 500;

type Remate = 'fronton' | 'escalonado' | 'arco' | 'plano';

interface Vecino {
  x: number;
  ancho: number;
  alto: number;
  remate: Remate;
  toldo?: 'liso' | 'rayado';
  puerta: 'izq' | 'der';
  rubro: string;
  /** Tramo de `--p` en que se prende la vidriera al atardecer y en que el local cierra. */
  luz: { prende: number; cierra: number };
  /** Cuándo vuelve a encenderse, ya digital. */
  crece: number;
  /** Color de su sitio (el que muestra en la vidriera cuando crece). */
  acento: string;
}

const VECINOS: readonly Vecino[] = [
  {
    x: 40,
    ancho: 260,
    alto: 290,
    remate: 'fronton',
    toldo: 'liso',
    puerta: 'der',
    rubro: H.rubros[0],
    luz: { prende: 0.15, cierra: 0.46 },
    crece: 0.7,
    acento: K.acentos[0],
  },
  {
    x: 300,
    ancho: 280,
    alto: 335,
    remate: 'escalonado',
    puerta: 'izq',
    rubro: H.rubros[1],
    luz: { prende: 0.18, cierra: 0.42 },
    crece: 0.64,
    acento: K.acentos[1],
  },
  {
    x: 1020,
    ancho: 280,
    alto: 312,
    remate: 'arco',
    toldo: 'liso',
    puerta: 'der',
    rubro: H.rubros[2],
    luz: { prende: 0.17, cierra: 0.44 },
    crece: 0.67,
    acento: K.acentos[2],
  },
  {
    x: 1300,
    ancho: 260,
    alto: 280,
    remate: 'plano',
    toldo: 'rayado',
    puerta: 'izq',
    rubro: H.rubros[3],
    luz: { prende: 0.2, cierra: 0.5 },
    crece: 0.73,
    acento: K.acentos[3],
  },
];

/** Geometría derivada de un vecino: dónde caen el cartel, el toldo, la vidriera y la puerta. */
function partes(v: Vecino) {
  const arriba = PISO - v.alto;
  const cornisa = arriba + 30;
  const cuerpo = cornisa + 10;
  const cartel = { x: v.x + 22, y: cuerpo + 20, w: v.ancho - 44, h: 30 };
  const toldoY = cartel.y + cartel.h + 14;
  const vidrioY = v.toldo ? toldoY + 40 : cartel.y + cartel.h + 16;
  const puertaW = 64;
  const puertaX = v.puerta === 'der' ? v.x + v.ancho - 22 - puertaW : v.x + 22;
  const vidrieraX = v.puerta === 'der' ? v.x + 22 : puertaX + puertaW + 18;
  const vidrieraW = v.ancho - 44 - puertaW - 18;
  const zocalo = PISO - 36;
  return {
    arriba,
    cornisa,
    cuerpo,
    cartel,
    toldoY,
    vidriera: { x: vidrieraX, y: vidrioY, w: vidrieraW, h: zocalo - vidrioY },
    zocalo,
    puerta: { x: puertaX, y: vidrioY, w: puertaW, h: PISO - vidrioY },
  };
}

/** Remate de la fachada (el "falso frente" de los pueblos): cuatro variantes. */
function remate(v: Vecino, arriba: number, cornisa: number) {
  const { x, ancho } = v;
  const cx = x + ancho / 2;
  const base = `M${x + 8} ${cornisa}V${arriba + 14}H${x + ancho - 8}V${cornisa}Z`;
  switch (v.remate) {
    case 'fronton':
      return `${base}M${cx - 58} ${arriba + 14}L${cx} ${arriba - 16}L${cx + 58} ${arriba + 14}Z`;
    case 'escalonado':
      return (
        `M${x + 8} ${cornisa}V${arriba + 16}H${x + 52}V${arriba + 4}H${cx - 44}V${arriba - 10}` +
        `H${cx + 44}V${arriba + 4}H${x + ancho - 52}V${arriba + 16}H${x + ancho - 8}V${cornisa}Z`
      );
    case 'arco':
      return `${base}M${cx - 64} ${arriba + 14}Q${cx} ${arriba - 34} ${cx + 64} ${arriba + 14}Z`;
    default:
      return `M${x + 8} ${cornisa}V${arriba + 8}H${x + ancho - 8}V${cornisa}Z`;
  }
}

/** Toldo: trapecio con el borde de abajo en ondas. Rayado o liso. */
function Toldo({
  x,
  w,
  y,
  tipo,
  id,
}: {
  x: number;
  w: number;
  y: number;
  tipo: 'liso' | 'rayado';
  id: string;
}) {
  const alto = 30;
  const ondas = Math.round((w + 20) / 26);
  const paso = (w + 20) / ondas;
  // Contorno: arriba de izquierda a derecha, baja por la derecha, ondas de derecha a izquierda, sube.
  let ondasVuelta = '';
  for (let i = ondas - 1; i >= 0; i--) {
    const x1 = x - 10 + i * paso;
    ondasVuelta += `Q${(x1 + paso / 2).toFixed(1)} ${y + alto + 9} ${x1.toFixed(1)} ${y + alto}`;
  }
  const contorno = `M${x} ${y}H${x + w}L${x + w + 10} ${y + alto}${ondasVuelta}Z`;
  return (
    <g className="c-toldo">
      <clipPath id={id}>
        <path d={contorno} />
      </clipPath>
      <path d={contorno} className={tipo === 'rayado' ? 'c-toldo-claro' : 'c-toldo-liso'} />
      {tipo === 'rayado' ? (
        <g clipPath={`url(#${id})`} className="c-toldo-raya">
          {Array.from({ length: Math.ceil((w + 20) / 28) }, (_, i) => (
            <path key={i} d={`M${x - 10 + i * 28 + 14} ${y}h14l3 ${alto + 10}h-14Z`} />
          ))}
        </g>
      ) : null}
      <path d={contorno} className="c-linea" />
      <path d={`M${x - 2} ${y + 6}H${x + w + 2}`} className="c-fina" />
    </g>
  );
}

/** Una vidriera con su carpintería: travesaño arriba y parante al medio. */
function Vidriera({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="c-vidrio" />
      {/* Luz tibia que se prende al pasar por el local (la maneja el CSS con :has). */}
      <rect x={x} y={y} width={w} height={h} className="c-encendido" />
      <path d={`M${x} ${y + 26}H${x + w}M${x + w / 2} ${y + 26}V${y + h}`} className="c-fina" />
      {/* Reflejo: dos diagonales cortas, solo de día. */}
      <path
        d={`M${x + 12} ${y + h - 14}l26 -34M${x + 26} ${y + h - 14}l14 -18`}
        className="c-reflejo"
      />
      <rect x={x} y={y} width={w} height={h} className="c-linea" fill="none" />
    </g>
  );
}

/**
 * Puerta: el vano oscuro de adentro y la hoja, con la bisagra a la izquierda (el picaporte está a la
 * derecha). Al pasar por el local, la hoja se abre hacia adentro (se angosta contra la bisagra).
 */
function Puerta({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="c-adentro" />
      <g className="c-hoja">
        <rect x={x} y={y} width={w} height={h} className="c-puerta" />
        <rect x={x + 9} y={y + 10} width={w - 18} height={h * 0.52} className="c-vidrio" />
        <rect
          x={x + 9}
          y={y + 10}
          width={w - 18}
          height={h * 0.52}
          className="c-fina"
          fill="none"
        />
        <path d={`M${x + 9} ${y + h * 0.7}H${x + w - 9}`} className="c-fina" />
        <circle cx={x + w - 14} cy={y + h * 0.62} r={2.6} className="c-tinta" />
      </g>
      <rect x={x} y={y} width={w} height={h} className="c-linea" fill="none" />
    </g>
  );
}

function FrenteVecino({ v, i, capa }: { v: Vecino; i: number; capa: string }) {
  const p = partes(v);
  return (
    <g className={`c-v${i}`}>
      <path d={remate(v, p.arriba, p.cornisa)} className={`c-pared c-pared-${i % 2}`} />
      <path d={remate(v, p.arriba, p.cornisa)} className="c-linea" fill="none" />
      <rect
        x={v.x}
        y={p.cuerpo}
        width={v.ancho}
        height={PISO - p.cuerpo}
        className={`c-pared c-pared-${i % 2}`}
      />
      <rect x={v.x - 5} y={p.cornisa} width={v.ancho + 10} height={10} className="c-cornisa" />
      <path
        d={`M${v.x} ${p.cuerpo}V${PISO}M${v.x + v.ancho} ${p.cuerpo}V${PISO}`}
        className="c-linea"
      />
      <rect {...cuadro(p.cartel)} rx={3} className="c-cartel" />
      <text
        x={p.cartel.x + p.cartel.w / 2}
        y={p.cartel.y + p.cartel.h / 2 + 4.5}
        textAnchor="middle"
        className="c-rubro"
      >
        {v.rubro}
      </text>
      {v.toldo ? (
        <Toldo
          x={v.x + 16}
          w={v.ancho - 32}
          y={p.toldoY}
          tipo={v.toldo}
          id={`${capa}-toldo-${i}`}
        />
      ) : null}
      <Vidriera {...p.vidriera} />
      <rect
        x={p.vidriera.x - 4}
        y={p.zocalo}
        width={p.vidriera.w + 8}
        height={PISO - p.zocalo}
        className="c-zocalo"
      />
      <path
        d={`M${p.vidriera.x - 4} ${p.zocalo + 0.5}H${p.vidriera.x + p.vidriera.w + 4}`}
        className="c-linea"
      />
      <Puerta {...p.puerta} />
    </g>
  );
}

const cuadro = (r: { x: number; y: number; w: number; h: number }) => ({
  x: r.x,
  y: r.y,
  width: r.w,
  height: r.h,
});

/* ── El frente del medio: "Tu negocio" ─────────────────────────────────────────────────────────── */
const C = { x: 580, ancho: 440, arriba: 100 };
const C_CORNISA = 140;
const C_CUERPO = 152;
export const PANTALLA = { x: 612, y: 304, w: 244, h: 162 };
const C_PUERTA = { x: 884, y: 304, w: 112, h: PISO - 304 };
const C_CARTEL = { x: 690, y: 80, w: 220, h: 56 };
const C_TOLDO = { x: 600, w: 400, y: 252 };
export const RELOJ = { cx: 642, cy: 204, r: 24 };
const FAROL_PARED = { x: 962, y: 196 };
export const NEON = { x: 902, y: 330, w: 76, h: 28 };

function FrenteTuNegocio({ capa }: { capa: string }) {
  const { x, ancho } = C;
  return (
    <g className="c-tu">
      <path
        d={`M${x + 8} ${C_CORNISA}V${C.arriba + 20}H${x + ancho - 8}V${C_CORNISA}Z`}
        className="c-pared c-pared-1"
      />
      <path
        d={`M${x + 8} ${C_CORNISA}V${C.arriba + 20}H${x + ancho - 8}V${C_CORNISA}`}
        className="c-linea"
        fill="none"
      />
      {/* Cartel sobre el remate. */}
      <rect {...cuadro(C_CARTEL)} rx={8} className="c-cartel-tu" />
      <text x={800} y={116} textAnchor="middle" className="c-tu-negocio">
        {H.carteles.tuNegocio}
      </text>
      <rect x={x - 8} y={C_CORNISA} width={ancho + 16} height={12} className="c-cornisa" />
      <rect
        x={x}
        y={C_CUERPO}
        width={ancho}
        height={PISO - C_CUERPO}
        className="c-pared c-pared-0"
      />
      <path d={`M${x} ${C_CUERPO}V${PISO}M${x + ancho} ${C_CUERPO}V${PISO}`} className="c-linea" />
      {/* Pilastras. */}
      <path
        d={`M${x + 14} ${C_CUERPO}V${PISO}M${x + ancho - 14} ${C_CUERPO}V${PISO}`}
        className="c-fina"
      />
      {/* Farol de pared (de noche se prende en la capa de luces). */}
      <path
        d={`M${FAROL_PARED.x} ${FAROL_PARED.y - 18}v8m-9 0h18l-3 22h-12Z`}
        className="c-farol"
      />
      <Toldo x={C_TOLDO.x} w={C_TOLDO.w} y={C_TOLDO.y} tipo="rayado" id={`${capa}-toldo-tu`} />
      {/* Vidriera grande: de noche, la pantalla. Marco grueso. */}
      <rect
        x={PANTALLA.x - 6}
        y={PANTALLA.y - 6}
        width={PANTALLA.w + 12}
        height={PANTALLA.h + 12}
        rx={4}
        className="c-marco"
      />
      <rect {...cuadro(PANTALLA)} className="c-vidrio" />
      <path
        d={`M${PANTALLA.x + 18} ${PANTALLA.y + PANTALLA.h - 18}l46 -60M${PANTALLA.x + 40} ${PANTALLA.y + PANTALLA.h - 18}l24 -31`}
        className="c-reflejo"
      />
      <rect
        x={PANTALLA.x - 12}
        y={PISO - 34}
        width={PANTALLA.w + 24}
        height={34}
        className="c-zocalo"
      />
      <path
        d={`M${PANTALLA.x - 12} ${PISO - 33.5}H${PANTALLA.x + PANTALLA.w + 12}`}
        className="c-linea"
      />
      <Puerta {...C_PUERTA} />
      {/* Cartel de abierto apagado (el de noche está en las luces). De día, el tuyo se prende al cargar. */}
      <rect {...cuadro(NEON)} rx={14} className="c-neon-apagado" />
      {capa === 'dia' ? (
        <g className="c-neon-dia">
          <rect {...cuadro(NEON)} rx={14} />
          <text x={NEON.x + NEON.w / 2} y={NEON.y + 18.5} textAnchor="middle">
            {H.carteles.abierto}
          </text>
        </g>
      ) : null}
      <rect x={C_PUERTA.x - 8} y={PISO} width={C_PUERTA.w + 16} height={6} className="c-escalon" />
    </g>
  );
}

/* ── Calle: vereda con baldosas, cordón, faroles y una bici ──────────────────────────────────────── */
const FAROLES = [300, 1300];

function Farol({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 8} y={PISO - 8} width={16} height={8} rx={2} className="c-tinta" />
      <path d={`M${x} ${PISO - 8}V${PISO - 168}q0 -14 14 -14h20`} className="c-poste" />
      <path d={`M${x + 28} ${PISO - 186}h20l-4 14h-12Z`} className="c-tinta" />
    </g>
  );
}

function Bici() {
  return (
    <g className="c-bici">
      <circle cx={1066} cy={476} r={23} />
      <circle cx={1146} cy={476} r={23} />
      <path d="M1066 476 1100 476 1088 446M1100 476 1132 448H1088M1132 448 1146 476M1128 438l6 10M1122 438h12M1082 446h14" />
    </g>
  );
}

/** Lo que se ve igual de día y de noche (cambian los colores por la capa). */
function Escena({ capa }: { capa: string }) {
  return (
    <>
      <rect x={-1200} y={PISO} width={4000} height={28} className="c-vereda" />
      <path d={`M-1200 ${PISO + 14}H2800`} className="c-baldosas" />
      <rect x={-1200} y={PISO + 28} width={4000} height={8} className="c-cordon" />
      <rect x={-1200} y={PISO + 36} width={4000} height={200} className="c-asfalto" />
      <path d={`M-1200 ${PISO}H2800M-1200 ${PISO + 28}H2800`} className="c-linea" />
      {VECINOS.map((v, i) => (
        <FrenteVecino key={v.rubro} v={v} i={i} capa={capa} />
      ))}
      <FrenteTuNegocio capa={capa} />
      {FAROLES.map((x) => (
        <Farol key={x} x={x} />
      ))}
      <Bici />
    </>
  );
}

/** Tramo de `--p` de cada luz, como variables CSS. */
const tramo = (a: number, c?: number) =>
  ({ '--a': a, ...(c === undefined ? {} : { '--c': c }) }) as CSSProperties;

/** El sitio del vecino en su vidriera, en miniatura: barra, portada de su color y tres tarjetas. */
function SitioVidriera({
  x,
  y,
  w,
  h,
  acento,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  acento: string;
}) {
  const m = 7;
  const c = { x: x + m, y: y + m, w: w - m * 2, h: h - m * 2 };
  const portada = c.h * 0.42;
  const tarjeta = (c.w - 12 - 8) / 3;
  return (
    <g>
      <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={3} fill={K.papel} />
      <rect x={c.x + 6} y={c.y + 6} width={c.w * 0.3} height={4} rx={2} fill={K.tinta} />
      <rect x={c.x + c.w - 6 - 14} y={c.y + 5} width={14} height={6} rx={3} fill={acento} />
      <rect x={c.x + 6} y={c.y + 16} width={c.w - 12} height={portada} rx={2.5} fill={acento} />
      <rect
        x={c.x + 12}
        y={c.y + 16 + portada * 0.3}
        width={c.w * 0.4}
        height={4}
        rx={2}
        fill={K.papel}
      />
      <rect
        x={c.x + 12}
        y={c.y + 16 + portada * 0.3 + 8}
        width={c.w * 0.26}
        height={4}
        rx={2}
        fill={K.papel}
        opacity={0.7}
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={c.x + 6 + i * (tarjeta + 4)}
          y={c.y + 22 + portada}
          width={tarjeta}
          height={Math.max(8, c.h - portada - 28)}
          rx={2}
          fill={K.tarjeta}
        />
      ))}
    </g>
  );
}

function Luces({ sitios }: { sitios: readonly string[] }) {
  return (
    <>
      <defs>
        <linearGradient id="c-calido" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={K.calidoArriba} />
          <stop offset="1" stopColor={K.calidoAbajo} />
        </linearGradient>
        <linearGradient id="c-frio" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={K.frioArriba} />
          <stop offset="1" stopColor={K.frioAbajo} />
        </linearGradient>
        <linearGradient id="c-derrame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={K.derrame} stopOpacity="0.5" />
          <stop offset="1" stopColor={K.derrame} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="c-derrame-frio" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={K.derrameFrio} stopOpacity="0.45" />
          <stop offset="1" stopColor={K.derrameFrio} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="c-cono" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={K.farol} stopOpacity="0.42" />
          <stop offset="1" stopColor={K.farol} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="c-halo">
          <stop offset="0" stopColor={K.farol} stopOpacity="0.9" />
          <stop offset="1" stopColor={K.farol} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="c-halo-pantalla" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={K.haloPantalla} stopOpacity="0.5" />
          <stop offset="1" stopColor={K.haloPantalla} stopOpacity="0" />
        </radialGradient>
        <clipPath id="c-recorte-pantalla">
          <rect {...cuadro(PANTALLA)} />
        </clipPath>
      </defs>

      {/* Vecinos: al atardecer se prenden (cálidas), al cerrar se apagan; al crecer vuelven, digitales. */}
      {VECINOS.map((v) => {
        const p = partes(v);
        const vid = p.vidriera;
        const derrame = `M${vid.x} ${PISO}h${vid.w}l26 28H${vid.x - 26}Z`;
        return (
          <g key={v.rubro}>
            <g className="c-luz-rato" style={tramo(v.luz.prende, v.luz.cierra)}>
              <rect {...cuadro(vid)} fill="url(#c-calido)" />
              <path d={derrame} fill="url(#c-derrame)" />
            </g>
            <g className="c-luz" style={tramo(v.crece)}>
              <rect {...cuadro(vid)} fill="url(#c-frio)" />
              <path
                d={`M${vid.x} ${vid.y + 26}H${vid.x + vid.w}`}
                className="c-carpinteria-noche"
              />
              <SitioVidriera x={vid.x} y={vid.y + 26} w={vid.w} h={vid.h - 26} acento={v.acento} />
            </g>
            {/* El cartel encendido y la luz en la vereda: solo mientras es de noche. */}
            <g className="c-luz c-de-noche" style={tramo(v.crece)}>
              <path d={derrame} fill="url(#c-derrame-frio)" />
              <rect {...cuadro(p.cartel)} rx={3} className="c-cartel-luz" />
              <text
                x={p.cartel.x + p.cartel.w / 2}
                y={p.cartel.y + p.cartel.h / 2 + 4.5}
                textAnchor="middle"
                className="c-rubro-luz"
              >
                {v.rubro}
              </text>
            </g>
          </g>
        );
      })}

      {/* Faroles de la calle. */}
      {FAROLES.map((x) => (
        <g key={x} className="c-luz c-de-noche" style={tramo(0.22)}>
          <path d={`M${x + 32} ${PISO - 172}h12l66 172H${x - 34}Z`} fill="url(#c-cono)" />
          <ellipse cx={x + 38} cy={PISO + 8} rx={86} ry={9} fill="url(#c-halo)" opacity={0.5} />
          <circle cx={x + 38} cy={PISO - 176} r={18} fill="url(#c-halo)" />
          <path d={`M${x + 28} ${PISO - 186}h20l-4 14h-12Z`} fill={K.lampara} />
        </g>
      ))}

      {/* Tu negocio: cartel iluminado, farol de pared, pantalla y "Abierto". */}
      <g className="c-luz c-de-noche" style={tramo(0.24)}>
        <rect {...cuadro(C_CARTEL)} rx={8} fill={K.cartel} />
        <text x={800} y={116} textAnchor="middle" className="c-tu-negocio c-tu-negocio-luz">
          {H.carteles.tuNegocio}
        </text>
        <circle cx={FAROL_PARED.x} cy={FAROL_PARED.y + 12} r={34} fill="url(#c-halo)" />
        <path d={`M${FAROL_PARED.x - 6} ${FAROL_PARED.y}h12l-2 18h-8Z`} fill={K.lampara} />
      </g>
      <g className="c-luz c-de-noche" style={tramo(0.3)}>
        <ellipse
          cx={PANTALLA.x + PANTALLA.w / 2}
          cy={PANTALLA.y + PANTALLA.h / 2}
          rx={PANTALLA.w * 0.85}
          ry={PANTALLA.h * 0.95}
          fill="url(#c-halo-pantalla)"
        />
        <path
          d={`M${PANTALLA.x - 12} ${PISO}h${PANTALLA.w + 24}l60 28H${PANTALLA.x - 72}Z`}
          fill="url(#c-derrame-frio)"
        />
      </g>
      <g className="c-luz" style={tramo(0.3)}>
        <g clipPath="url(#c-recorte-pantalla)">
          <rect {...cuadro(PANTALLA)} fill={K.pantalla} />
          {sitios.map((src, i) => (
            <image
              key={src}
              href={src}
              x={PANTALLA.x}
              y={PANTALLA.y}
              width={PANTALLA.w}
              height={PANTALLA.h}
              preserveAspectRatio="xMidYMin slice"
              className="c-sitio"
              style={{ '--i': i, '--n': sitios.length } as CSSProperties}
            />
          ))}
        </g>
        <rect {...cuadro(PANTALLA)} className="c-pantalla-borde" />
      </g>
      <g className="c-luz c-de-noche" style={tramo(0.37)}>
        <rect {...cuadro(NEON)} rx={14} className="c-neon-halo" />
        <rect {...cuadro(NEON)} rx={14} className="c-neon" />
        <text
          x={NEON.x + NEON.w / 2}
          y={NEON.y + 18.5}
          textAnchor="middle"
          className="c-neon-texto"
        >
          {H.carteles.abierto}
        </text>
      </g>

      {/* Reloj de pared: iluminado de noche; las agujas avanzan con el scroll (de las 19 a la 1). */}
      <g>
        <circle
          cx={RELOJ.cx}
          cy={RELOJ.cy}
          r={RELOJ.r + 14}
          className="c-luz c-de-noche c-reloj-halo"
          style={tramo(0.22)}
        />
        <path d={`M${RELOJ.cx} ${RELOJ.cy - RELOJ.r - 10}v10`} className="c-reloj-soporte" />
        <circle cx={RELOJ.cx} cy={RELOJ.cy} r={RELOJ.r} className="c-reloj" />
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d={`M${RELOJ.cx} ${RELOJ.cy - RELOJ.r + 4}v${i % 3 === 0 ? 6 : 3.5}`}
            transform={`rotate(${i * 30} ${RELOJ.cx} ${RELOJ.cy})`}
            className="c-reloj-marca"
          />
        ))}
        <path d={`M${RELOJ.cx} ${RELOJ.cy}v-12`} className="c-aguja c-aguja-hora" />
        <path d={`M${RELOJ.cx} ${RELOJ.cy}v-18`} className="c-aguja c-aguja-minuto" />
        <circle cx={RELOJ.cx} cy={RELOJ.cy} r={2.4} className="c-tinta" />
      </g>
    </>
  );
}

function Capa({ clase, children }: { clase: string; children: ReactNode }) {
  return (
    <svg
      viewBox={VISTA}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMax meet"
      className={`hc-svg ${clase}`}
    >
      {children}
    </svg>
  );
}

/** Las tres capas de la calle. `sitios`: capturas reales que pasan por la pantalla de tu negocio. */
export function Calle({ sitios }: { sitios: readonly string[] }) {
  return (
    <div className="hc-calle">
      <Capa clase="hc-dia">
        <g className="c-dia">
          <Escena capa="dia" />
        </g>
      </Capa>
      <Capa clase="hc-noche">
        <g className="c-noche">
          <Escena capa="noche" />
        </g>
      </Capa>
      <Capa clase="hc-luces">
        <Luces sitios={sitios} />
      </Capa>
    </div>
  );
}

/** Caja de cada local en el encuadre (izquierda a derecha), para los links que van encima del dibujo. */
/** `frente`: la clase del frente en el dibujo (c-v0…c-v3, c-tu), para que el CSS abra su puerta. */
const CAJAS = [
  ...VECINOS.slice(0, 2).map((v, i) => ({
    frente: `v${i}`,
    x: v.x,
    ancho: v.ancho,
    arriba: PISO - v.alto,
  })),
  { frente: 'tu', x: C.x, ancho: C.ancho, arriba: C_CARTEL.y },
  ...VECINOS.slice(2).map((v, i) => ({
    frente: `v${i + 2}`,
    x: v.x,
    ancho: v.ancho,
    arriba: PISO - v.alto,
  })),
];
const [ANCHO_VISTA, ALTO_VISTA] = VISTA.split(' ').slice(2).map(Number) as [number, number];
const pct = (n: number, total: number) => `${((n / total) * 100).toFixed(3)}%`;

/**
 * Los locales se tocan: un link invisible sobre cada fachada (misma geometría que el dibujo) que lleva a
 * la demo de su rubro; el del medio, a armar el tuyo. Al pasar el mouse o con el foco, el local se marca
 * y aparece qué demo abre. La pista ("Tocá un local…") va sobre la vereda, arriba del primer local.
 */
export function LocalesCalle() {
  return (
    <div className="hc-locales">
      <p className="hc-pista" aria-hidden="true">
        {H.pista}
      </p>
      {CAJAS.map((c, i) => {
        const local = H.locales[i];
        if (!local) return null;
        return (
          <a
            key={local.href}
            href={local.href}
            aria-label={local.texto}
            className="hc-local"
            data-frente={c.frente}
            style={{
              left: pct(c.x, ANCHO_VISTA),
              width: pct(c.ancho, ANCHO_VISTA),
              top: pct(c.arriba, ALTO_VISTA),
              height: pct(PISO - c.arriba, ALTO_VISTA),
            }}
          >
            <span className="hc-local-rotulo" aria-hidden="true">
              {local.texto.split(': ')[1]}
            </span>
          </a>
        );
      })}
    </div>
  );
}
