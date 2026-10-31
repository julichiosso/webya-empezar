import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { isIconName, type IconName } from '@/brand/ilustracion/iconos/paths';
import { IlustracionRubro } from '@/brand/ilustracion/rubros/IlustracionRubro';
import { pieza } from '@/brand/motion/presets';
import { variablesDePaleta } from '@/brand/tokens/colores';
import { cn } from '@/components/ui/clases';
import { PREVIEW } from '@/content/empezar/preview';
import { getModulo, type ModuloId } from '@/content/modulos';
import { getPaletaCurada } from '@/content/paletas';
import {
  getPlantilla,
  getRubro,
  type DetalleDeModulo,
  type PlantillaRubro,
  type SeccionPlantilla,
} from '@/content/rubros';
import { MarcoDispositivo, type Dispositivo } from './MarcoDispositivo';

export type { Dispositivo } from './MarcoDispositivo';

export interface PreviewNegocioProps {
  /** Id del rubro (content/rubros). Sin plantilla ("otro" o desconocido) no dibuja nada. */
  rubro: string;
  /** Nombre del negocio que escribió la persona; vacío, el de ejemplo de la plantilla. */
  nombre: string;
  /** Id de una paleta curada (content/paletas.ts); desconocida o vacía, la por defecto. */
  paleta?: string | null;
  dispositivo: Dispositivo;
  /** Módulos encendidos: lo que dependa de uno apagado queda como hueco punteado. */
  modulos: readonly ModuloId[];
  /** Si la cargó, reemplaza el "Cómo llegar" del contacto. */
  ciudad?: string;
  /**
   * Las piezas encajan una vez al aparecer (`.snap`, solo transform/opacity). `false` con
   * movimiento reducido: el mismo estado final, quieto. motion.css también lo apaga por CSS.
   */
  animar?: boolean;
}

interface Contexto {
  activos: ReadonlySet<ModuloId>;
  escritorio: boolean;
  /** Ícono del rubro: va en las miniaturas de la lista (sin fotos de stock). */
  icono: IconName | null;
}

/**
 * Vista previa por rubro ("Así te queda"): una mini web del negocio armada por piezas (concepto
 * Encastre) dentro de un celular o de un navegador. Todo lo que dice sale de la plantilla del rubro
 * (src/content/rubros) y de PREVIEW; los colores, de la paleta curada aplicada con variables CSS en
 * este contenedor (nunca colores en línea en las piezas). Lo que sigue a la paleta usa los tokens
 * SEMÁNTICOS del acento (`bg-accent`, `bg-accent-soft`…): los de componente se resuelven en `:root`
 * y no verían la paleta del contenedor. El acento va solo como relleno (botón, pieza, selección),
 * nunca como color de texto: así pasa AA también en tema claro (paletas.test.ts).
 * Es decorativa: el resumen accesible lo da la pantalla que la usa. Sin hooks: se puede dibujar en
 * el servidor.
 */
export function PreviewNegocio({
  rubro,
  nombre,
  paleta,
  dispositivo,
  modulos,
  ciudad,
  animar = true,
}: PreviewNegocioProps) {
  const plantilla = getPlantilla(rubro);
  if (!plantilla) return null;
  const colores = getPaletaCurada(paleta);
  const titulo = nombre.trim() || plantilla.portada.tituloDeEjemplo;
  const icono = getRubro(rubro)?.icono;
  const ctx: Contexto = {
    activos: new Set(modulos),
    escritorio: dispositivo === 'escritorio',
    icono: icono && isIconName(icono) ? icono : null,
  };

  return (
    <div
      aria-hidden="true"
      data-testid="preview-negocio"
      data-rubro={rubro}
      data-dispositivo={dispositivo}
      data-paleta={colores.id}
      data-animado={animar}
      style={variablesDePaleta(colores) as CSSProperties}
    >
      <MarcoDispositivo dispositivo={dispositivo} leyenda={PREVIEW.deEjemplo}>
        {/* Cambiar de rubro o de dispositivo vuelve a armar la web pieza por pieza. */}
        <MiniWeb
          key={`${rubro}-${dispositivo}`}
          plantilla={plantilla}
          titulo={titulo}
          ciudad={ciudad?.trim()}
          ctx={ctx}
          animar={animar}
        />
      </MarcoDispositivo>
    </div>
  );
}

interface MiniWebProps {
  plantilla: PlantillaRubro;
  titulo: string;
  ciudad?: string;
  ctx: Contexto;
  animar: boolean;
}

function MiniWeb({ plantilla, titulo, ciudad, ctx, animar }: MiniWebProps) {
  const { portada, secciones } = plantilla;
  const { escritorio } = ctx;
  const inicial = Array.from(titulo)[0]?.toLocaleUpperCase('es-AR') ?? '';

  return (
    // La web se ve como en un dispositivo real: todo un poco más chico (zoom, no transform: el
    // contenido se reacomoda al ancho y entra más de una sección en la pantalla).
    <div className={escritorio ? '[zoom:0.8]' : '[zoom:0.85] px-4'}>
      {/* Barra del sitio: inicial del negocio y menú (celular) o links a las secciones (escritorio). */}
      <div
        className={cn(
          'flex items-center justify-between gap-4',
          escritorio ? 'border-b border-line px-4 py-2' : 'pb-2',
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-surface-2 text-small font-semibold text-fg">
            {inicial}
          </span>
          {escritorio && <span className="truncate text-small font-semibold">{titulo}</span>}
        </span>
        {escritorio ? (
          <span className="flex shrink-0 gap-4 text-small text-muted">
            {secciones.slice(0, 3).map((s) => (
              <span key={s.titulo}>{s.titulo}</span>
            ))}
          </span>
        ) : (
          <span className="flex w-4 flex-col gap-1">
            <span className="h-0.5 rounded-full bg-muted" />
            <span className="h-0.5 rounded-full bg-muted" />
          </span>
        )}
      </div>

      <div className={cn(escritorio ? 'grid grid-cols-2 gap-4 p-4' : 'flex flex-col gap-4 pb-12')}>
        <Pieza
          i={0}
          animar={animar}
          estado={estadoDe(ctx, portada.accion.modulo, portada.detalle?.modulo)}
          className={escritorio ? 'col-span-2' : undefined}
        >
          <Portada plantilla={plantilla} titulo={titulo} ctx={ctx} />
        </Pieza>
        {secciones.map((s, i) => (
          <Pieza
            key={`${s.tipo}-${s.titulo}`}
            i={i + 1}
            animar={animar}
            estado={estadoDe(
              ctx,
              s.modulo,
              s.detalle?.modulo,
              s.tipo === 'lista' ? s.moduloItems : undefined,
            )}
            className={escritorio && anchoCompleto(s) ? 'col-span-2' : undefined}
          >
            <Seccion seccion={s} ctx={ctx} ciudad={ciudad} />
          </Pieza>
        ))}
      </div>
    </div>
  );
}

/** En escritorio, horarios y contacto van de a dos; lo demás ocupa el ancho. */
const anchoCompleto = (s: SeccionPlantilla) => s.tipo !== 'horarios' && s.tipo !== 'contacto';

/** Encendido/apagado de los módulos de una pieza: si cambia, la pieza vuelve a encajar. */
function estadoDe(ctx: Contexto, ...ids: (ModuloId | undefined)[]): string {
  return ids
    .filter((id): id is ModuloId => Boolean(id))
    .map((id) => `${id}:${ctx.activos.has(id) ? 1 : 0}`)
    .join(',');
}

interface PiezaProps {
  i: number;
  animar: boolean;
  estado: string;
  className?: string;
  children: ReactNode;
}

/** Una pieza de la web: llega, se pasa apenas y asienta (una vez), escalonada por su orden. */
function Pieza({ i, animar, estado, className, children }: PiezaProps) {
  return (
    <div
      key={estado}
      data-pieza={i}
      className={cn(className, animar && 'snap pieza-escalonada')}
      style={animar ? pieza(i) : undefined}
    >
      {children}
    </div>
  );
}

function Portada({
  plantilla,
  titulo,
  ctx,
}: {
  plantilla: PlantillaRubro;
  titulo: string;
  ctx: Contexto;
}) {
  const { portada, ilustracion } = plantilla;
  const conAccion = ctx.activos.has(portada.accion.modulo);
  const ilustrada = (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-card bg-surface-2 text-fg',
        ctx.escritorio ? 'size-28' : 'aspect-[2/1] w-full',
      )}
    >
      <IlustracionRubro rubro={ilustracion} className="flex size-24 items-center justify-center" />
    </div>
  );

  return (
    <div className={ctx.escritorio ? 'flex items-center gap-4' : ''}>
      {!ctx.escritorio && ilustrada}
      <div className={cn('min-w-0', ctx.escritorio ? 'flex-1' : 'mt-4')}>
        <p className="line-clamp-2 text-heading font-semibold text-balance wrap-break-word">
          {titulo}
        </p>
        <p className="mt-2 line-clamp-2 text-small text-muted">{portada.bajada}</p>
        <span
          data-modulo={portada.accion.modulo}
          data-on={conAccion}
          className={cn(
            'mt-4 flex h-10 items-center justify-center rounded-control px-4 text-small font-semibold',
            ctx.escritorio && 'inline-flex',
            conAccion
              ? 'bg-accent text-accent-fg'
              : 'border border-boton-secundario-borde text-boton-secundario-texto',
          )}
        >
          {conAccion ? portada.accion.texto : portada.accionSinModulo}
        </span>
        {portada.detalle && <Detalle detalle={portada.detalle} ctx={ctx} className="mt-2" />}
      </div>
      {ctx.escritorio && ilustrada}
    </div>
  );
}

function Seccion({
  seccion: s,
  ctx,
  ciudad,
}: {
  seccion: SeccionPlantilla;
  ctx: Contexto;
  ciudad?: string;
}) {
  const contenido = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-small font-semibold text-fg">{s.titulo}</p>
        {s.modulo && <Icon name={s.modulo} size={16} className="shrink-0 text-muted" />}
      </div>
      <div className="mt-2">
        <Cuerpo seccion={s} ctx={ctx} ciudad={ciudad} />
      </div>
      {s.detalle && <Detalle detalle={s.detalle} ctx={ctx} className="mt-2" />}
    </>
  );
  return s.modulo ? (
    <ConHueco modulo={s.modulo} activo={ctx.activos.has(s.modulo)} forma="rounded-card">
      {contenido}
    </ConHueco>
  ) : (
    contenido
  );
}

function Cuerpo({
  seccion: s,
  ctx,
  ciudad,
}: {
  seccion: SeccionPlantilla;
  ctx: Contexto;
  ciudad?: string;
}) {
  switch (s.tipo) {
    case 'lista': {
      const conBoton = s.moduloItems ? ctx.activos.has(s.moduloItems) : null;
      // Escritorio: productos o carta (con botón para sumar) en una grilla con miniatura; servicios,
      // en tarjetas de texto.
      return ctx.escritorio ? (
        <ul className="grid grid-cols-3 gap-2">
          {s.items.map((it) => (
            <li key={it.nombre} className="rounded-control border border-line bg-surface p-2">
              {s.moduloItems && (
                <span className="relative mb-2 flex aspect-[3/2] items-center justify-center rounded-control bg-surface-2 text-subtle">
                  {ctx.icono && <Icon name={ctx.icono} size={24} />}
                  <BotonItem
                    modulo={s.moduloItems}
                    activo={Boolean(conBoton)}
                    className="absolute right-2 bottom-2"
                  />
                </span>
              )}
              <span className="line-clamp-2 block text-small font-medium">{it.nombre}</span>
              {it.detalle && !s.moduloItems && (
                <span className="line-clamp-2 block text-small text-muted">{it.detalle}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-line rounded-card border border-line bg-surface">
          {s.items.map((it) => (
            <li key={it.nombre} className="flex items-center gap-2 p-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-surface-2 text-subtle">
                {ctx.icono && <Icon name={ctx.icono} size={16} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-small font-medium">{it.nombre}</span>
                {it.detalle && (
                  <span className="block truncate text-small text-muted">{it.detalle}</span>
                )}
              </span>
              {s.moduloItems && <BotonItem modulo={s.moduloItems} activo={Boolean(conBoton)} />}
            </li>
          ))}
        </ul>
      );
    }
    case 'agenda':
      return (
        <div className={ctx.escritorio ? 'flex items-center gap-4' : ''}>
          <div className="grid flex-1 auto-cols-fr grid-flow-col gap-2">
            {s.dias.map((d, i) => (
              <span
                key={d}
                className={cn(
                  'rounded-control border py-2 text-center text-small',
                  i === 0
                    ? 'border-accent bg-accent-soft font-semibold text-fg'
                    : 'border-line text-muted',
                )}
              >
                {d}
              </span>
            ))}
          </div>
          <div className={cn('flex gap-2', !ctx.escritorio && 'mt-2')}>
            {s.franjas.map((f) => (
              <span
                key={f}
                className="flex h-8 items-center rounded-full border border-line px-4 text-small text-muted"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      );
    case 'formulario':
      return (
        <div
          className={ctx.escritorio ? 'grid grid-cols-[1fr_1fr_auto] gap-2' : 'flex flex-col gap-2'}
        >
          {s.campos.map((c) => (
            <span
              key={c}
              className="flex h-10 min-w-0 items-center rounded-control border border-control-borde bg-control-fondo px-4 text-small text-control-ayuda"
            >
              <span className="truncate">{c}</span>
            </span>
          ))}
          <span className="flex h-10 items-center justify-center rounded-control border border-boton-secundario-borde px-4 text-small font-semibold text-boton-secundario-texto">
            {s.accion}
          </span>
        </div>
      );
    case 'horarios':
      return (
        <div className="flex flex-col gap-2">
          {s.filas.map((f) => (
            <p
              key={f.dias}
              className={ctx.escritorio ? 'text-small' : 'flex justify-between gap-2 text-small'}
            >
              <span className="block text-fg">{f.dias}</span>
              <span className="block text-muted">{f.horario}</span>
            </p>
          ))}
        </div>
      );
    case 'contacto':
      return (
        <div className="flex flex-col gap-2 text-small">
          <p className="flex items-center gap-2 text-fg">
            <Icon name="chat" size={16} className="shrink-0" />
            <span className="truncate">{s.whatsapp}</span>
          </p>
          <p className="truncate pl-6 text-muted">{ciudad || s.ubicacion}</p>
        </div>
      );
  }
}

/** "+" de cada ítem (sumar al pedido o al carrito). Con su módulo apagado, un hueco del mismo tamaño. */
function BotonItem({
  modulo,
  activo,
  className,
}: {
  modulo: ModuloId;
  activo: boolean;
  className?: string;
}) {
  return (
    <span
      data-modulo={modulo}
      data-on={activo}
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full',
        activo ? 'bg-accent text-accent-fg' : 'border border-dashed border-hueco-borde',
        className,
      )}
    >
      {activo && <Icon name="mas" size={16} />}
    </span>
  );
}

/** Lo que un cliente ve gracias a un módulo ("Te recordamos el turno"), con su pieza y su check. */
function Detalle({
  detalle,
  ctx,
  className,
}: {
  detalle: DetalleDeModulo;
  ctx: Contexto;
  className?: string;
}) {
  return (
    <ConHueco
      modulo={detalle.modulo}
      activo={ctx.activos.has(detalle.modulo)}
      forma="rounded-full"
      className={className}
    >
      <p className="flex min-h-6 items-center gap-2 text-small text-muted">
        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">
          <Icon name="check" size={12} />
        </span>
        <span className="truncate">{detalle.texto}</span>
      </p>
    </ConHueco>
  );
}

interface ConHuecoProps {
  modulo: ModuloId;
  activo: boolean;
  /** Radio del hueco: el de la forma que reemplaza. */
  forma: 'rounded-card' | 'rounded-full';
  className?: string;
  children: ReactNode;
}

/**
 * Encastre: con el módulo encendido se ve la pieza; apagado, en su lugar queda el hueco punteado
 * "Acá encaja…" con EXACTAMENTE el mismo tamaño (el contenido sigue ahí, invisible), así nada se
 * mueve dentro de la pantalla al prender o apagar un módulo.
 */
function ConHueco({ modulo, activo, forma, className, children }: ConHuecoProps) {
  return (
    <div data-modulo={modulo} data-on={activo} className={cn('relative', className)}>
      <div className={activo ? undefined : 'invisible'}>{children}</div>
      {!activo && (
        <div
          data-hueco
          className={cn(
            'absolute inset-0 flex items-center justify-center border border-dashed border-hueco-borde px-4 text-small text-muted',
            forma,
          )}
        >
          <span className="truncate">{PREVIEW.hueco(getModulo(modulo).nombre)}</span>
        </div>
      )}
    </div>
  );
}
