import { LOGO_TRAZOS } from './trazos';

/**
 * Logo de Webya: el wordmark del SVG de Julián (public/webya-logo.svg), sin corchetes. El encuadre se
 * ajusta a las letras. Hereda `currentColor`: blanco sobre negro en secciones oscuras, negro sobre blanco
 * en las claras. Componente de servidor, sin JS.
 */
export const LOGO_ENCUADRE = '136 0 934 281';
export const LOGO_ANCHO_ENCUADRE = 934;
export const LOGO_ALTO_ENCUADRE = 281;

export function LogoWebya({
  className,
  decorativo = false,
}: {
  className?: string;
  /** Al lado del nombre escrito: se oculta a lectores de pantalla. */
  decorativo?: boolean;
}) {
  return (
    <svg
      viewBox={LOGO_ENCUADRE}
      width={LOGO_ANCHO_ENCUADRE}
      height={LOGO_ALTO_ENCUADRE}
      role={decorativo ? undefined : 'img'}
      aria-label={decorativo ? undefined : 'Webya'}
      aria-hidden={decorativo || undefined}
      focusable="false"
      className={className}
    >
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        {LOGO_TRAZOS.map((t) => (
          <path key={t.letra} d={t.d} />
        ))}
      </g>
    </svg>
  );
}
