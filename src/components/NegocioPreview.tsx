import { getModulo, MODULO_IDS, type ModuloId } from '@/config/modulos';
import { Icon } from './icons/Icon';
import { isIconName } from './icons/paths';

interface NegocioPreviewProps {
  /** Nombre del rubro elegido; sin rubro se muestra "Tu negocio". */
  rubroNombre?: string;
  /** Clave de ícono del rubro (config). */
  rubroIcono?: string;
  /** Módulos activos: se iluminan; el resto queda apagado. */
  activos: readonly ModuloId[];
}

/**
 * Vista previa en vivo del negocio que se va armando. Siempre dibuja todos los módulos
 * (encendidos o apagados), así la altura no cambia al elegir: sin layout shift.
 * Es decorativa: lo que importa (rubro y módulos) ya está en los controles de cada paso.
 */
export function NegocioPreview({ rubroNombre, rubroIcono, activos }: NegocioPreviewProps) {
  const icono = rubroIcono && isIconName(rubroIcono) ? rubroIcono : 'mas';
  return (
    <div
      aria-hidden="true"
      data-testid="negocio-preview"
      className="rounded-card border border-line bg-surface-2 p-4"
    >
      <div className="flex items-center gap-4">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-control border bg-surface ${
            rubroNombre ? 'border-line' : 'border-dashed border-line-strong'
          }`}
        >
          <Icon name={rubroNombre ? icono : 'mas'} size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <p key={rubroNombre ?? 'sin-rubro'} className="fade-in truncate text-body font-semibold">
            {rubroNombre ?? 'Tu negocio'}
          </p>
          <span className="mt-2 block h-2 w-24 rounded-full bg-line-strong" />
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {MODULO_IDS.map((id) => {
          const activo = activos.includes(id);
          return (
            <li
              key={id}
              data-on={activo}
              // Apagado = hueco punteado; encendido = la pieza encajada en Brasa.
              className={`pop-on inline-flex items-center gap-2 rounded-full border px-4 py-2 text-small font-medium ${
                activo
                  ? 'border-accent bg-accent-soft text-fg'
                  : 'border-dashed border-line-strong text-subtle'
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
