import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { variablesDePaleta } from '@/brand/tokens/colores';
import { cn } from '@/components/ui/clases';
import type { ModuloId } from '@/content/modulos';
import { getPaletaCurada } from '@/content/paletas';
import { getPlantilla, type SeccionPlantilla } from '@/content/rubros';

export interface ItemSitio {
  nombre: string;
  detalle?: string;
  precio?: string;
}

export interface SitioNegocioProps {
  /** Id del rubro (content/rubros). Sin plantilla ("otro" o desconocido) no dibuja nada. */
  rubro: string;
  /** Nombre del negocio; vacío, el de ejemplo de la plantilla. */
  nombre?: string;
  /** Id de una paleta curada (content/paletas.ts). */
  paleta?: string | null;
  /** Reemplaza la bajada de ejemplo de la portada. */
  bajada?: string;
  /** Reemplaza el "Cómo llegar" del contacto. */
  ciudad?: string;
  /** Reemplaza los ítems de ejemplo de la primera lista (servicios, carta, productos). */
  items?: readonly ItemSitio[];
  /** Reemplaza los horarios de ejemplo. */
  horario?: string;
  /** Módulos encendidos: lo que dependa de uno apagado no se muestra. Sin esto, todo. */
  modulos?: readonly ModuloId[];
  /** A cuántas secciones cortar (las vitrinas muestran solo lo que entra en pantalla). */
  secciones?: number;
  /** Con link, el botón principal y el contacto son enlaces de verdad (página publicable). */
  linkContacto?: string | null;
  /** Es la página en sí (/ver): el nombre es el h1 y las secciones tienen encabezados. */
  comoPagina?: boolean;
}

/**
 * El sitio de un negocio, armado con la plantilla del rubro (content/rubros). Es uno solo para todo lo
 * que muestra "cómo te queda": la vitrina del hero, el wizard, el editor de /crear y el borrador
 * compartible de /ver. Sigue la paleta por variables CSS y usa los tokens semánticos: nunca colores en
 * línea. Sin hooks: se puede dibujar en el servidor.
 */
export function SitioNegocio({
  rubro,
  nombre,
  paleta,
  bajada,
  ciudad,
  items,
  horario,
  modulos,
  secciones,
  linkContacto,
  comoPagina = false,
}: SitioNegocioProps) {
  const plantilla = getPlantilla(rubro);
  if (!plantilla) return null;
  const { portada } = plantilla;
  const titulo = nombre?.trim() || portada.tituloDeEjemplo;
  const activo = (m?: ModuloId) => !m || !modulos || modulos.includes(m);
  const visibles = plantilla.secciones
    .filter((s) => activo(s.modulo))
    .slice(0, secciones ?? plantilla.secciones.length);
  const conAccion = activo(portada.accion.modulo);
  const Titulo = comoPagina ? 'h1' : 'p';

  return (
    <div
      data-testid="sitio-negocio"
      data-sitio={rubro}
      style={variablesDePaleta(getPaletaCurada(paleta)) as CSSProperties}
      className="papel min-h-full bg-paper text-paper-fg"
    >
      <div className="bg-accent px-4 pt-8 pb-6 text-accent-fg">
        <Titulo className="text-title font-semibold text-balance wrap-break-word">{titulo}</Titulo>
        <p className="mt-2 text-small">{bajada?.trim() || portada.bajada}</p>
        <Accion
          href={linkContacto}
          className="mt-4 inline-flex min-h-tap items-center rounded-control bg-paper-fg px-4 text-small font-semibold text-paper"
        >
          {conAccion ? portada.accion.texto : portada.accionSinModulo}
        </Accion>
      </div>
      <div className="flex flex-col gap-6 px-4 py-6">
        {visibles.map((s, i) => (
          <Bloque
            key={`${s.tipo}-${s.titulo}`}
            seccion={s}
            comoPagina={comoPagina}
            items={i === visibles.findIndex((v) => v.tipo === 'lista') ? items : undefined}
            ciudad={ciudad}
            horario={horario}
            linkContacto={linkContacto}
          />
        ))}
      </div>
    </div>
  );
}

function Accion({
  href,
  className,
  children,
}: {
  href?: string | null;
  className?: string;
  children: ReactNode;
}) {
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
}

function Bloque({
  seccion: s,
  comoPagina,
  items,
  ciudad,
  horario,
  linkContacto,
}: {
  seccion: SeccionPlantilla;
  comoPagina: boolean;
  items?: readonly ItemSitio[];
  ciudad?: string;
  horario?: string;
  linkContacto?: string | null;
}) {
  const Encabezado = comoPagina ? 'h2' : 'p';
  return (
    <div>
      <Encabezado className="text-small font-semibold">{s.titulo}</Encabezado>
      <div className="mt-2">
        <Cuerpo
          seccion={s}
          items={items}
          ciudad={ciudad}
          horario={horario}
          linkContacto={linkContacto}
        />
      </div>
    </div>
  );
}

const CHIP = 'flex min-h-10 items-center justify-center rounded-control border px-2 text-small';

function Cuerpo({
  seccion: s,
  items,
  ciudad,
  horario,
  linkContacto,
}: {
  seccion: SeccionPlantilla;
  items?: readonly ItemSitio[];
  ciudad?: string;
  horario?: string;
  linkContacto?: string | null;
}) {
  switch (s.tipo) {
    case 'lista': {
      const lista: readonly ItemSitio[] = items && items.length > 0 ? items : s.items;
      return (
        <ul className="border-t border-paper-line">
          {lista.map((it) => (
            <li
              key={it.nombre}
              className="flex items-baseline justify-between gap-4 border-b border-paper-line py-2"
            >
              <span className="min-w-0">
                <span className="block font-medium wrap-break-word">{it.nombre}</span>
                {it.detalle && (
                  <span className="block text-small text-paper-muted">{it.detalle}</span>
                )}
              </span>
              {it.precio && <span className="tabular shrink-0 font-medium">{it.precio}</span>}
            </li>
          ))}
        </ul>
      );
    }
    case 'agenda':
      return (
        <>
          <div className="grid auto-cols-fr grid-flow-col gap-2">
            {s.dias.map((d, i) => (
              <span
                key={d}
                className={cn(
                  CHIP,
                  i === 0
                    ? 'border-paper-fg bg-paper-fg font-semibold text-paper'
                    : 'border-paper-line text-paper-muted',
                )}
              >
                {d}
              </span>
            ))}
          </div>
          <div className="mt-2 grid auto-cols-fr grid-flow-col gap-2">
            {s.franjas.map((f) => (
              <span key={f} className={cn(CHIP, 'border-paper-line text-paper-muted')}>
                {f}
              </span>
            ))}
          </div>
        </>
      );
    case 'formulario':
      return (
        <div className="flex flex-col gap-2">
          {s.campos.map((c) => (
            <span
              key={c}
              className="flex min-h-10 items-center rounded-control border border-paper-line px-2 text-small text-paper-muted"
            >
              {c}
            </span>
          ))}
          <span className="flex min-h-10 items-center justify-center rounded-control bg-paper-fg px-4 text-small font-semibold text-paper">
            {s.accion}
          </span>
        </div>
      );
    case 'horarios':
      return horario?.trim() ? (
        <p className="text-small whitespace-pre-line">{horario}</p>
      ) : (
        <div className="flex flex-col gap-1 text-small">
          {s.filas.map((f) => (
            <p key={f.dias} className="flex justify-between gap-2">
              <span>{f.dias}</span>
              <span className="text-paper-muted">{f.horario}</span>
            </p>
          ))}
        </div>
      );
    case 'contacto':
      return (
        <div className="flex flex-col gap-2 text-small">
          <Accion
            href={linkContacto}
            className="flex min-h-tap items-center gap-2 font-medium underline-offset-4 hover:underline"
          >
            <Icon name="chat" size={16} className="shrink-0" />
            {s.whatsapp}
          </Accion>
          <p className="text-paper-muted">{ciudad?.trim() || s.ubicacion}</p>
        </div>
      );
  }
}
