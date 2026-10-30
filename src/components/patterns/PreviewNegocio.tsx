import { PREVIEW } from '@/content/empezar/preview';
import { getModulo, MODULO_IDS, type ModuloId } from '@/content/modulos';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { isIconName } from '@/brand/ilustracion/iconos/paths';
import { ModuloArte } from '@/brand/ilustracion/modulos/ModuloArte';

export interface PreviewNegocioProps {
  /** Nombre del rubro elegido; sin rubro se muestra "Tu negocio". */
  rubroNombre?: string;
  /** Clave de ícono del rubro (config). */
  rubroIcono?: string;
  /** Módulos activos: se encienden; el resto queda apagado (hueco punteado). */
  activos: readonly ModuloId[];
}

interface Props extends PreviewNegocioProps {
  /** `compacta`: dentro del paso 1 en celular (pastillas). `panel`: columna derecha en escritorio. */
  layout: 'compacta' | 'panel';
}

/**
 * Vista previa en vivo del negocio que se va armando (fusiona NegocioPreview y PreviewPanel).
 * Siempre dibuja todos los módulos del catálogo, encendidos o apagados: la altura no cambia al
 * elegir (sin layout shift). Es decorativa: lo que importa ya está en los controles del paso.
 */
export function PreviewNegocio({ layout, rubroNombre, rubroIcono, activos }: Props) {
  const icono = rubroNombre && rubroIcono && isIconName(rubroIcono) ? rubroIcono : 'mas';
  const panel = layout === 'panel';
  const cantidad = activos.length;

  const cabecera = (
    <div
      className={`flex items-center gap-4 ${panel ? 'rounded-control bg-surface-2 p-4' : ''}`.trim()}
    >
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
        {panel ? (
          <p className="tabular text-small text-muted">
            {cantidad === 0 ? PREVIEW.sinModulos : PREVIEW.cantidadModulos(cantidad)}
          </p>
        ) : (
          <span className="mt-2 block h-2 w-24 rounded-full bg-line-strong" />
        )}
      </div>
    </div>
  );

  return (
    <div
      aria-hidden="true"
      data-testid={panel ? 'negocio-preview-panel' : 'negocio-preview'}
      className={
        panel
          ? 'rounded-panel border border-line-strong bg-surface p-4 shadow-raised'
          : 'rounded-card border border-line bg-surface-2 p-4'
      }
    >
      {cabecera}
      <ul className={panel ? 'mt-4 grid grid-cols-2 gap-3' : 'mt-4 flex flex-wrap gap-2'}>
        {MODULO_IDS.map((id) => {
          const activo = activos.includes(id);
          // Apagado = hueco punteado esperando su pieza; encendido = la pieza encajada en Brasa.
          const estado = activo
            ? 'border-accent bg-accent-soft'
            : 'border-dashed border-line-strong';
          return panel ? (
            <li key={id} data-on={activo} className={`pop-on rounded-card border p-4 ${estado}`}>
              <p
                className={`truncate text-small font-medium ${activo ? 'text-fg' : 'text-subtle'}`}
              >
                {getModulo(id).nombre}
              </p>
              <ModuloArte id={id} activo={activo} className="panel-arte mt-2" />
            </li>
          ) : (
            <li
              key={id}
              data-on={activo}
              className={`pop-on inline-flex items-center gap-2 rounded-full border px-4 py-2 text-small font-medium ${estado} ${
                activo ? 'text-fg' : 'text-subtle'
              }`}
            >
              <Icon name={id} size={16} />
              {getModulo(id).nombre}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
