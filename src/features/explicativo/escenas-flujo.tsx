import type { CSSProperties, ReactNode } from 'react';
import { isIconName } from '@/brand/ilustracion/iconos/paths';
import { variablesDePaleta } from '@/brand/tokens/colores';
import type { EscenaFlujoId } from '@/content/explicativo/flujo';
import { TEXTOS_ESCENAS_FLUJO as T } from '@/content/explicativo/flujo';
import { getPaletaCurada, PALETAS_CURADAS } from '@/content/paletas';
import { getRubro, RUBRO_OTRO_ID, RUBROS } from '@/content/rubros';
import { IconoSvg, P, Telefono, Texto } from './lienzo';

/**
 * Escenas de la presentación de /empezar: las cuatro pantallas del flujo (rubro → datos → "Así te
 * queda" → WhatsApp), armándose en un celular que no se mueve de lugar entre escenas (como una
 * grabación de pantalla). Lienzo de 680×600; el celular ocupa la izquierda y a la derecha va lo que
 * esa pantalla produce. Mismo lenguaje que escenas.tsx: posición afuera, animación `.mg-*` adentro,
 * una vez por escena, solo transform/opacity y quieto con reduced-motion.
 *
 * Los contenidos de cada pantalla (`Pantalla*`) también los dibuja el poster, quietos.
 */
export const VIEWBOX_FLUJO = '0 0 680 600';
/** Celular de todas las escenas (y el de adelante del poster). */
export const TELEFONO_FLUJO = { x: 40, y: 30, ancho: 280, alto: 540 } as const;

const ANCHO_PANTALLA = 232;
const BRASA = variablesDePaleta(getPaletaCurada('brasa'));
const SEGUNDA_PALETA = 'pileta';
const PILETA = variablesDePaleta(getPaletaCurada(SEGUNDA_PALETA));

/** El "toque" de un dedo: aparece, se queda un instante y se va. */
function Toque({ en, d }: { en: [number, number]; d: number }) {
  return (
    <P en={en} anim="pop" d={d}>
      <g className="mg mg-sale" style={{ '--d': `${d + 600}ms` } as CSSProperties}>
        <circle r="22" className="fill-fg" opacity="0.18" />
        <circle r="9" className="fill-fg" opacity="0.5" />
      </g>
    </P>
  );
}

/** La pieza Brasa con check (Encaje): el único indicador de "elegido" del sistema. */
function PiezaCheck({ lado = 36 }: { lado?: number }) {
  const m = lado / 2;
  return (
    <g>
      <rect width={lado} height={lado} rx={lado / 3.6} className="fill-accent" />
      <path
        d={`M${m - lado * 0.22} ${m}l${lado * 0.15} ${lado * 0.15} ${lado * 0.3}-${lado * 0.3}`}
        className="stroke-accent-fg"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function BurbujaLineas({
  lineas,
  ancho,
  mia = false,
}: {
  lineas: readonly string[];
  ancho: number;
  mia?: boolean;
}) {
  return (
    <g>
      <rect
        width={ancho}
        height={20 + lineas.length * 24}
        rx="18"
        className={mia ? 'fill-accent' : 'fill-bg'}
      />
      {lineas.map((l, i) => (
        <Texto
          key={l}
          x={16}
          y={34 + i * 24}
          tam={16}
          peso={500}
          clase={mia ? 'fill-accent-fg' : 'fill-fg'}
        >
          {l}
        </Texto>
      ))}
    </g>
  );
}

// --- Pantallas (lo que se ve dentro del celular) ---------------------------------------------

const RUBROS_GRILLA = RUBROS.filter((r) => r.id !== RUBRO_OTRO_ID).slice(0, 6);
const ELEGIDO = RUBROS_GRILLA.findIndex((r) => r.id === T.rubro.elegido.id);
const ICONO_ELEGIDO = (() => {
  const i = getRubro(T.rubro.elegido.id)?.icono ?? 'mas';
  return isIconName(i) ? i : 'mas';
})();

/** Pantalla 1: "¿Qué negocio tenés?" y la grilla de rubros; se toca uno y encaja su pieza. */
export function PantallaRubro({ conToque = true }: { conToque?: boolean }) {
  const celda = (i: number): [number, number] => [24 + (i % 2) * 120, 100 + Math.floor(i / 2) * 92];
  const [ex, ey] = celda(Math.max(0, ELEGIDO));
  return (
    <>
      <P en={[24, 78]} anim="entra">
        <Texto x={0} y={0} tam={21} peso={700}>
          {T.rubro.titulo}
        </Texto>
      </P>
      {RUBROS_GRILLA.map((r, i) => {
        const icono = isIconName(r.icono) ? r.icono : 'mas';
        return (
          <P key={r.id} en={celda(i)} anim="entra" d={120 + i * 90}>
            <rect
              width="112"
              height="84"
              rx="16"
              className="fill-surface stroke-line"
              strokeWidth="2"
            />
            <rect
              x="12"
              y="12"
              width="36"
              height="36"
              rx="10"
              className="fill-none stroke-line-strong"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <IconoSvg nombre={icono} x={18} y={18} escala={1} />
            <rect
              x="12"
              y="62"
              width={i % 3 === 0 ? 72 : 56}
              height="10"
              rx="5"
              className="fill-line-strong"
            />
          </P>
        );
      })}
      <P en={[24, 376]} anim="entra" d={700}>
        <rect
          width={ANCHO_PANTALLA}
          height="56"
          rx="16"
          className="fill-surface stroke-line"
          strokeWidth="2"
        />
        <IconoSvg nombre="mas" x={16} y={16} escala={1} clase="stroke-muted" />
        <rect x="52" y="23" width="64" height="10" rx="5" className="fill-line-strong" />
      </P>
      {/* El toque: la tarjeta se enciende (borde y fondo de acento) y cae la pieza con check. */}
      {conToque && <Toque en={[ex + 70, ey + 46]} d={1350} />}
      <P en={[ex, ey]} anim="pop" d={1500}>
        <rect
          width="112"
          height="84"
          rx="16"
          className="fill-accent-soft stroke-accent"
          strokeWidth="2"
        />
        <Texto x={12} y={72} tam={14} peso={700}>
          {T.rubro.elegido.nombre}
        </Texto>
      </P>
      <P en={[ex + 12, ey + 12]} anim="encaja" d={1700}>
        <PiezaCheck />
      </P>
    </>
  );
}

/** Pantalla 2: "Contanos de tu negocio" con los tres campos que se completan. */
export function PantallaDatos() {
  return (
    <>
      <P en={[24, 78]} anim="entra">
        <Texto x={0} y={0} tam={19} peso={700}>
          {T.datos.titulo}
        </Texto>
      </P>
      {T.datos.campos.map((c, i) => {
        const y = 112 + i * 100;
        return (
          <g key={c.etiqueta} transform={`translate(24 ${y})`}>
            <P anim="entra" d={150 + i * 120}>
              <Texto x={0} y={0} tam={14} peso={500} clase="fill-muted">
                {c.etiqueta}
              </Texto>
              <rect
                y="12"
                width={ANCHO_PANTALLA}
                height="52"
                rx="12"
                className="fill-surface stroke-line-strong"
                strokeWidth="2"
              />
            </P>
            {/* El campo que se está escribiendo se enciende; el valor aparece. */}
            <P anim="pop" d={600 + i * 650}>
              <g className="mg mg-sale" style={{ '--d': `${1050 + i * 650}ms` } as CSSProperties}>
                <rect
                  y="12"
                  width={ANCHO_PANTALLA}
                  height="52"
                  rx="12"
                  className="fill-none stroke-accent"
                  strokeWidth="2"
                />
              </g>
            </P>
            <P en={[16, 45]} anim="entra" d={700 + i * 650}>
              <Texto x={0} y={0} tam={18} peso={500} clase="tabular fill-fg">
                {c.valor}
              </Texto>
            </P>
          </g>
        );
      })}
      <P en={[24, 420]} anim="entra" d={500}>
        <g className="mg mg-pulso" style={{ '--d': '2700ms' } as CSSProperties}>
          <rect width={ANCHO_PANTALLA} height="56" rx="12" className="fill-accent" />
          <Texto x={ANCHO_PANTALLA / 2} y={35} tam={18} ancla="middle" clase="fill-accent-fg">
            {T.datos.enviar}
          </Texto>
        </g>
      </P>
    </>
  );
}

/** El sitio del negocio dentro del celular. `armar`: las piezas encajan una por una. */
function Sitio({ armar = true }: { armar?: boolean }) {
  const anim = armar ? 'encaja' : 'entra';
  const d = (ms: number) => (armar ? ms : 0);
  return (
    <>
      <P en={[24, 56]} anim={anim} d={d(150)}>
        <rect width={ANCHO_PANTALLA} height="150" rx="18" className="fill-accent" />
        <Texto x={18} y={50} tam={26} peso={700} clase="fill-accent-fg">
          {T.vista.negocio}
        </Texto>
        <rect
          x="18"
          y="66"
          width="170"
          height="9"
          rx="4.5"
          className="fill-accent-fg"
          opacity="0.45"
        />
        <rect
          x="18"
          y="82"
          width="120"
          height="9"
          rx="4.5"
          className="fill-accent-fg"
          opacity="0.45"
        />
        <rect x="18" y="104" width="124" height="32" rx="16" className="fill-bg" />
        <Texto x={80} y={125} tam={14} ancla="middle">
          {T.vista.accion}
        </Texto>
      </P>
      <P en={[24, 236]} anim="entra" d={d(650)}>
        <Texto x={0} y={0} tam={18} peso={700}>
          {T.vista.seccion}
        </Texto>
      </P>
      {T.vista.items.map((item, i) => (
        <P key={item} en={[24, 252 + i * 58]} anim={anim} d={d(850 + i * 260)}>
          <rect width={ANCHO_PANTALLA} height="50" rx="12" className="fill-surface-2" />
          <Texto x={14} y={30} tam={14} peso={500}>
            {item}
          </Texto>
          <circle cx="208" cy="25" r="12" className="fill-accent" />
          <path
            d="M208 19v12M202 25h12"
            className="stroke-accent-fg"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </P>
      ))}
      <P en={[24, 432]} anim={anim} d={d(1750)}>
        <rect width={ANCHO_PANTALLA} height="64" rx="12" className="fill-surface-2" />
        <IconoSvg nombre="chat" x={14} y={20} escala={1} />
        <rect x="48" y="22" width="110" height="9" rx="4.5" className="fill-line-strong" />
        <rect x="48" y="38" width="76" height="9" rx="4.5" className="fill-line" />
      </P>
    </>
  );
}

/** Pantalla 3: "Así te queda". Se arma con Brasa y después se repinta con otra paleta. */
export function PantallaVista({ repintar = true }: { repintar?: boolean }) {
  return (
    <>
      <g style={BRASA as CSSProperties}>
        <Sitio />
      </g>
      {repintar && (
        <P anim="entra" d={3300}>
          <g style={PILETA as CSSProperties}>
            <rect x="12" y="40" width="256" height="488" className="fill-bg" />
            <Sitio armar={false} />
          </g>
        </P>
      )}
    </>
  );
}

/** Pantalla 4: el sitio, con la barra fija y el CTA que se toca. */
export function PantallaWhatsapp({ conToque = true }: { conToque?: boolean }) {
  return (
    <>
      <g style={PILETA as CSSProperties}>
        <Sitio armar={false} />
      </g>
      <P en={[12, 424]} anim="entra" d={150}>
        <rect width="256" height="104" className="fill-surface" />
        <rect width="256" height="2" className="fill-line" />
        <g transform="translate(12 22)">
          <g className="mg mg-pulso" style={{ '--d': '1050ms' } as CSSProperties}>
            <rect width={ANCHO_PANTALLA} height="56" rx="12" className="fill-accent" />
            <Texto
              x={ANCHO_PANTALLA / 2}
              y={35}
              tam={15}
              peso={700}
              ancla="middle"
              clase="fill-accent-fg"
            >
              {T.whatsapp.cta}
            </Texto>
          </g>
        </g>
      </P>
      {conToque && <Toque en={[180, 474]} d={900} />}
    </>
  );
}

// --- Escenas ----------------------------------------------------------------------------------

function Celular({ children }: { children: ReactNode }) {
  const t = TELEFONO_FLUJO;
  return (
    <Telefono x={t.x} y={t.y} ancho={t.ancho} alto={t.alto}>
      {children}
    </Telefono>
  );
}

function EscenaRubro() {
  return (
    <>
      <Celular>
        <PantallaRubro />
      </Celular>
      {/* Lo elegido sale del celular: la pieza del rubro, grande. */}
      <P en={[340, 160]} anim="entra" d={2050}>
        <path
          d="M0 0c40 0 30 120 70 120"
          className="fill-none stroke-line-strong"
          strokeWidth="3"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
      </P>
      <P en={[380, 240]} anim="desliza" d={2250}>
        <rect
          width="270"
          height="88"
          rx="20"
          className="fill-surface-2 stroke-accent"
          strokeWidth="2"
        />
        <rect x="20" y="20" width="48" height="48" rx="14" className="fill-accent" />
        <IconoSvg nombre={ICONO_ELEGIDO} x={26} y={26} escala={1.5} clase="stroke-accent-fg" />
        <Texto x={86} y={54} tam={24}>
          {T.rubro.elegido.nombre}
        </Texto>
      </P>
    </>
  );
}

function EscenaDatos() {
  return (
    <>
      <Celular>
        <PantallaDatos />
      </Celular>
      {/* El nombre del negocio, como una etiqueta de papel: es lo que va a encabezar su sitio. */}
      <P en={[380, 190]} anim="encaja" d={1100}>
        <g>
          <rect width="260" height="160" rx="16" className="fill-paper" />
          <IconoSvg nombre={ICONO_ELEGIDO} x={24} y={22} escala={1.5} clase="stroke-paper-fg" />
          <Texto x={24} y={100} tam={28} peso={700} clase="fill-paper-fg">
            {T.datos.campos[0].valor}
          </Texto>
          <rect x="24" y="118" width="120" height="2" className="fill-paper-line" />
        </g>
      </P>
      <P en={[404, 330]} anim="entra" d={2150}>
        <Texto x={0} y={0} tam={17} peso={500} clase="fill-paper-muted">
          {T.datos.campos[2].valor}
        </Texto>
      </P>
    </>
  );
}

function EscenaVista() {
  return (
    <>
      <Celular>
        <PantallaVista />
      </Celular>
      {/* Las piezas que lo hacen funcionar encajan a medida que se arma el sitio. */}
      {T.vista.piezas.map((nombre, i) => (
        <P key={nombre} en={[372, 80 + i * 68]} anim="encaja" d={600 + i * 450}>
          <rect
            width="280"
            height="56"
            rx="28"
            className="fill-surface-2 stroke-accent"
            strokeWidth="2"
          />
          <g transform="translate(10 10)">
            <PiezaCheck />
          </g>
          <Texto x={60} y={35} tam={17}>
            {nombre}
          </Texto>
        </P>
      ))}
      <P en={[372, 330]} anim="entra" d={2300}>
        <Texto x={0} y={0} tam={16} peso={500} clase="fill-muted">
          {T.vista.colores}
        </Texto>
      </P>
      {PALETAS_CURADAS.map((p, i) => (
        <P key={p.id} en={[392 + i * 46, 372]} anim="pop" d={2400 + i * 80}>
          <g style={variablesDePaleta(p) as CSSProperties}>
            <circle r="17" className="fill-accent" />
          </g>
        </P>
      ))}
      {/* Se elige otra paleta: el anillo de selección y el sitio se repinta. */}
      <P
        en={[392 + PALETAS_CURADAS.findIndex((p) => p.id === SEGUNDA_PALETA) * 46, 372]}
        anim="pop"
        d={3100}
      >
        <circle r="23" className="fill-none stroke-fg" strokeWidth="3" />
      </P>
    </>
  );
}

function EscenaWhatsapp() {
  const [mia, suya] = [T.whatsapp.mensaje, T.whatsapp.respuesta];
  return (
    <>
      <Celular>
        <PantallaWhatsapp />
      </Celular>
      <P en={[340, 500]} anim="entra" d={1250}>
        <path
          d="M0 0c40 0 20-80 40-120"
          className="fill-none stroke-line-strong"
          strokeWidth="3"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
      </P>
      {/* Se abre WhatsApp con lo que armó; del otro lado contesta una persona. */}
      <P en={[360, 60]} anim="pop" d={1400}>
        <rect
          width="290"
          height="400"
          rx="24"
          className="fill-surface-2 stroke-line"
          strokeWidth="2"
        />
        <circle cx="38" cy="40" r="20" className="fill-line" />
        <IconoSvg nombre="chat" x={26} y={28} escala={1} />
        <Texto x={70} y={47} tam={18}>
          {T.whatsapp.contacto}
        </Texto>
        <rect y="78" width="290" height="2" className="fill-line" />
      </P>
      <P en={[374, 160]} anim="encaja" d={1900}>
        <BurbujaLineas lineas={mia} ancho={262} mia />
      </P>
      <P en={[374, 260]} anim="pop" d={2600}>
        <g className="mg mg-sale" style={{ '--d': '3300ms' } as CSSProperties}>
          <rect width="76" height="40" rx="20" className="fill-bg" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={22 + i * 16} cy="20" r="4" className="fill-muted" />
          ))}
        </g>
      </P>
      <P en={[374, 260]} anim="encaja" d={3400}>
        <BurbujaLineas lineas={suya} ancho={220} />
      </P>
    </>
  );
}

const ESCENAS: Record<EscenaFlujoId, () => ReactNode> = {
  rubro: EscenaRubro,
  datos: EscenaDatos,
  vista: EscenaVista,
  whatsapp: EscenaWhatsapp,
};

/** Lienzo de una escena del flujo. Se remonta con `key`: así cada animación corre una vez. */
export function EscenaFlujo({ id }: { id: EscenaFlujoId }) {
  const Dibujo = ESCENAS[id];
  return (
    <svg
      viewBox={VIEWBOX_FLUJO}
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
