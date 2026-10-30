import { PreviewNegocio, type PreviewNegocioProps } from './PreviewNegocio';

/** Vista previa de escritorio (panel derecho del wizard). Envoltorio fino de `PreviewNegocio`. */
export function PreviewPanel(props: PreviewNegocioProps) {
  return <PreviewNegocio layout="panel" {...props} />;
}
