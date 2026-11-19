import { LOGO_TRAZOS } from './trazos';

/**
 * Logo `<webya>`: el wordmark original (mismos trazos que public/webya-logo.svg) entre dos chevrones
 * del mismo grosor de trazo, centrados en la altura de la x. Hereda `currentColor`: blanco sobre negro
 * en secciones oscuras, negro sobre blanco en las claras. Componente de servidor, sin JS.
 */
export const LOGO_CORCHETES_VIEWBOX = '0 0 1205 281';

export function LogoCorchetes({
  className,
  decorativo = false,
}: {
  className?: string;
  /** Al lado del nombre escrito: se oculta a lectores de pantalla. */
  decorativo?: boolean;
}) {
  return (
    <svg
      viewBox={LOGO_CORCHETES_VIEWBOX}
      width={1205}
      height={281}
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
      <g fill="none" stroke="currentColor" strokeWidth={40} strokeLinejoin="miter">
        <polyline points="100,58 40,135 100,212" />
        <polyline points="1105,58 1165,135 1105,212" />
      </g>
    </svg>
  );
}
