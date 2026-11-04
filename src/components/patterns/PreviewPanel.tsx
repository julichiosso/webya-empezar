import { PREVIEW } from '@/content/empezar/preview';
import { getModulo, type ModuloId } from '@/content/modulos';

export interface PreviewPanelProps {
  /** Nombre del rubro o del negocio; sin él se muestra "Tu negocio". */
  rubroNombre?: string;
  /** Módulos activos, listados debajo del nombre. */
  activos: readonly ModuloId[];
}

/**
 * Panel de escritorio de la pantalla 1 (y de "Otro" o rubros sin plantilla): el nombre del negocio y,
 * debajo, lo que tiene activado, en líneas finas. Sin hooks ni JS: lo dibuja el HTML del servidor.
 * Con Gastronomía elegida el wizard lo cambia por la carta real. Es decorativo.
 */
export function PreviewPanel({ rubroNombre, activos }: PreviewPanelProps) {
  return (
    <div
      aria-hidden="true"
      data-testid="negocio-preview-panel"
      className="rounded-panel border border-line-strong bg-surface p-6"
    >
      <p key={rubroNombre ?? 'sin-rubro'} className="fade-in truncate text-heading font-semibold">
        {rubroNombre ?? PREVIEW.sinRubro}
      </p>
      <p className="tabular mt-1 text-small text-muted">
        {activos.length === 0 ? PREVIEW.sinModulos : PREVIEW.cantidadModulos(activos.length)}
      </p>
      <ul className="mt-5 border-t border-line">
        {activos.map((id) => (
          <li key={id} className="border-b border-line py-3 text-small font-medium">
            {getModulo(id).nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
