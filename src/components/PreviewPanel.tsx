import { getModulo, MODULO_IDS, type ModuloId } from '@/config/modulos';
import { Icon } from './icons/Icon';
import { isIconName } from './icons/paths';
import { ModuloArte } from './mini-web/ModuloArte';

interface PreviewPanelProps {
  /** Nombre del rubro elegido; sin rubro se muestra "Tu negocio". */
  rubroNombre?: string;
  /** Clave de ícono del rubro (config). */
  rubroIcono?: string;
  /** Módulos activos: se encienden; el resto queda apagado. */
  activos: readonly ModuloId[];
}

/**
 * Vista previa en vivo del negocio (panel derecho del wizard en escritorio). Siempre dibuja los
 * módulos del catálogo, encendidos o apagados: la altura no cambia al elegir (sin layout shift). Es la misma
 * mini web del hero, pero de solo lectura y decorativa: lo que importa ya está en los controles.
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
            {rubroNombre ?? 'Tu negocio'}
          </p>
          <p className="tabular text-small text-muted">
            {cantidad === 0
              ? 'Acá encajan tus módulos'
              : `${cantidad} ${cantidad === 1 ? 'módulo' : 'módulos'}`}
          </p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {MODULO_IDS.map((id) => {
          const activo = activos.includes(id);
          return (
            <li
              key={id}
              data-on={activo}
              // Apagado = hueco punteado esperando su pieza; encendido = la pieza encajada en Brasa.
              className={`pop-on rounded-card border p-4 ${
                activo ? 'border-accent bg-accent-soft' : 'border-dashed border-line-strong'
              }`}
            >
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
