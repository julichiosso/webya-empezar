import { PREVIEW } from '@/content/empezar/preview';
import { getModulo, MODULO_IDS, type ModuloId } from '@/content/modulos';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { isIconName } from '@/brand/ilustracion/iconos/paths';
import { ModuloArte } from '@/brand/ilustracion/modulos/ModuloArte';

export interface PreviewPanelProps {
  /** Nombre del rubro elegido; sin rubro se muestra "Tu negocio". */
  rubroNombre?: string;
  /** Clave de ícono del rubro (config). */
  rubroIcono?: string;
  /** Módulos activos: se encienden; el resto queda apagado (hueco punteado). */
  activos: readonly ModuloId[];
}

/**
 * Panel de escritorio de la pantalla 1 (y de "Otro"): el negocio todavía sin rubro, con todos los
 * módulos del catálogo como huecos esperando su pieza. Sin hooks ni JS: lo dibuja el HTML del
 * servidor. Con el rubro elegido, el wizard lo cambia por la vista previa por rubro
 * (`PreviewNegocio`). La altura no cambia al elegir (sin layout shift). Es decorativo.
 */
export function PreviewPanel({ rubroNombre, rubroIcono, activos }: PreviewPanelProps) {
  const icono = rubroNombre && rubroIcono && isIconName(rubroIcono) ? rubroIcono : 'mas';
  const cantidad = activos.length;

  return (
    <div
      aria-hidden="true"
      data-testid="negocio-preview-panel"
      className="rounded-panel border border-line-strong bg-surface p-4 shadow-raised"
    >
      <div className="flex items-center gap-4 rounded-control bg-surface-2 p-4">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-control border bg-surface ${
            rubroNombre ? 'border-line' : 'border-dashed border-line-strong'
          }`}
        >
          <Icon name={icono} size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <p key={rubroNombre ?? 'sin-rubro'} className="fade-in truncate text-body font-semibold">
            {rubroNombre ?? PREVIEW.sinRubro}
          </p>
          <p className="tabular text-small text-muted">
            {cantidad === 0 ? PREVIEW.sinModulos : PREVIEW.cantidadModulos(cantidad)}
          </p>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {MODULO_IDS.map((id) => {
          const activo = activos.includes(id);
          // Apagado = hueco punteado esperando su pieza; encendido = la pieza encajada en Brasa.
          const estado = activo
            ? 'border-accent bg-accent-soft'
            : 'border-dashed border-line-strong';
          return (
            <li key={id} data-on={activo} className={`pop-on rounded-card border p-4 ${estado}`}>
              <p
                className={`truncate text-small font-medium ${activo ? 'text-fg' : 'text-subtle'}`}
              >
                {getModulo(id).nombre}
              </p>
              <ModuloArte id={id} activo={activo} className="panel-arte mt-2" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
