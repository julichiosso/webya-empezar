import type { CSSProperties } from 'react';
import { LOGO_TRAZOS, LOGO_VIEWBOX } from './trazos';

/**
 * Entrada en celular: el wordmark de WebYa "se escribe" (trazo) y se rellena, ~2 s, una vez por
 * sesión. Es CSS puro (sin JS en el cliente): el script inline de abajo solo lo oculta si ya se vio
 * en esta sesión. No bloquea nada: `pointer-events: none` y la página carga debajo.
 * Excepción documentada del presupuesto de animación: stroke-dashoffset/fill-opacity en el logo.
 */
const SCRIPT = `try{var s=document.getElementById('splash');if(sessionStorage.getItem('webya:splash')){s.style.display='none'}else{sessionStorage.setItem('webya:splash','1')}}catch(e){}`;

export function SplashLogo() {
  return (
    <>
      <div
        id="splash"
        aria-hidden="true"
        suppressHydrationWarning
        className="splash pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-bg lg:hidden"
      >
        <svg viewBox={LOGO_VIEWBOX} className="w-64 text-fg" fill="none">
          {LOGO_TRAZOS.map((t, i) => (
            <path
              key={t.letra}
              d={t.d}
              pathLength={1}
              className="splash-trazo"
              style={{ '--i': i } as CSSProperties}
            />
          ))}
        </svg>
      </div>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </>
  );
}
