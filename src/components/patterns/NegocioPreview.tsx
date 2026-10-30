import { PreviewNegocio, type PreviewNegocioProps } from './PreviewNegocio';

/** Vista previa compacta (paso 1 en celular). Envoltorio fino de `PreviewNegocio`. */
export function NegocioPreview(props: PreviewNegocioProps) {
  return <PreviewNegocio layout="compacta" {...props} />;
}
