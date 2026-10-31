import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { ModuloArte } from '@/brand/ilustracion/modulos/ModuloArte';
import { NotasPendientes } from '@/components/patterns/NotasPendientes';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { QUE_INCLUYE } from '@/content/empezar/que-incluye';
import { ESTADO_MODULO_UI, ESTADOS_MODULO_TEXTO } from '@/content/estados-modulo';
import { MODULO_IDS, getModulo, notasPendientes, type ModuloId } from '@/content/modulos';
import { URL_DEMO_GASTRONOMIA } from '@/domain/traspaso/demo-wizard';

const T = CLASES_SECCION.tinta;

/**
 * Cuánto ocupa cada pieza en el mapa de escritorio (12 columnas, tres filas que suman 12). Anchos
 * distintos a propósito: es un plano de piezas que encastran, no una grilla de tarjetas iguales.
 * Clases escritas enteras para que Tailwind las encuentre.
 */
const ANCHO: Record<ModuloId, string> = {
  turnos: 'lg:col-span-5',
  catalogo: 'lg:col-span-4',
  carta_qr: 'lg:col-span-3',
  formularios: 'lg:col-span-4',
  pedidos: 'lg:col-span-5',
  pagos: 'lg:col-span-3',
  clientes: 'lg:col-span-7',
  notificaciones: 'lg:col-span-5',
};

/** En tablet (2 columnas), las piezas que van a lo ancho: rompen la serie de cuadros iguales. */
const ANCHA_EN_TABLET: ReadonlySet<ModuloId> = new Set(['turnos', 'pedidos', 'clientes']);

/**
 * "Qué podés activar" (dirección Plano, fondo tinta con el plano acotado): el mapa de piezas. Los
 * módulos de content/modulos.ts encastran en un solo tablero —las juntas de 1 px son el fondo de
 * línea que asoma entre piezas— con anchos distintos por fila, y cada pieza lleva la muesca del
 * encastre arriba (`.encastre`, máscara estática; la pieza no es enfocable y el enlace queda lejos
 * de la muesca, así que no recorta ningún foco). Cada pieza dice su estado real tal
 * cual, y las que ya tienen demo llevan a probarla. Lo que falta confirmar va una sola vez, abajo
 * (`NotasPendientes`). Componente de servidor, sin JS.
 */
export function QueIncluye() {
  return (
    <Seccion fondo="tinta" plano="cotas" aria-labelledby="incluye-title">
      <div className="max-w-2xl">
        <h2 id="incluye-title" className="text-title font-semibold text-balance">
          {QUE_INCLUYE.titulo}
        </h2>
        <p className={`mt-4 text-lead ${T.secundario}`}>{QUE_INCLUYE.bajada}</p>
      </div>
      {/* El gap de 1 px deja ver el fondo de línea: son las juntas entre piezas. */}
      <ul
        data-mapa-piezas=""
        className={`mt-8 grid gap-px overflow-hidden rounded-panel border ${T.linea} bg-seccion-tinta-linea sm:grid-cols-2 lg:mt-12 lg:grid-cols-12`}
      >
        {MODULO_IDS.map((id) => {
          const mod = getModulo(id);
          const estado = ESTADOS_MODULO_TEXTO[mod.estado].etiqueta;
          const conDemo = mod.estado === 'en_demo';
          return (
            <li
              key={id}
              data-modulo={id}
              className={`encastre flex flex-col gap-4 bg-surface p-6 lg:p-8 ${ANCHO[id]} ${ANCHA_EN_TABLET.has(id) ? 'sm:col-span-2' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="flex items-center gap-2 text-body font-semibold">
                  <Icon name={id} size={24} className="shrink-0" />
                  {mod.nombre}
                  <span className="sr-only">{ESTADO_MODULO_UI.accesible(estado)}</span>
                </h3>
                {/* Estado honesto, tal cual: texto, sin pastilla de color. */}
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-small leading-6 ${T.secundario}`}
                >
                  {estado}
                </span>
              </div>
              <p className={`max-w-md text-small ${T.secundario}`}>{mod.descripcion}</p>
              <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
                <div aria-hidden="true" className="w-30">
                  <ModuloArte id={id} activo={false} />
                </div>
                {conDemo && (
                  <a
                    href={URL_DEMO_GASTRONOMIA}
                    className="inline-flex min-h-tap items-center text-small font-semibold underline underline-offset-4 hover:no-underline"
                  >
                    {ESTADO_MODULO_UI.verDemo}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <NotasPendientes notas={notasPendientes()} className="mt-6 max-w-3xl" />
    </Seccion>
  );
}
