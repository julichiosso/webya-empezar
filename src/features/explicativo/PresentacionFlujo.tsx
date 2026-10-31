'use client';

import { buttonClasses } from '@/components/ui/Button';
import { ESCENAS_FLUJO } from '@/content/explicativo/flujo';
import { VIDEO_PRESENTACION } from '@/content/explicativo/presentacion';
import { track } from '@/lib/analytics';
import { EscenaFlujo } from './escenas-flujo';
import { ReproductorBase } from './ReproductorBase';

/**
 * La presentación de /empezar en código (mientras no haya MP4, o si el MP4 falla): las cuatro
 * pantallas del flujo armándose, con el mismo motor, capítulos, subtítulos y voz que el video de la
 * demo. Se descarga recién al tocar play en el poster (SlotVideo).
 */
export function PresentacionFlujo() {
  return (
    <ReproductorBase
      modo="embebido"
      guion={ESCENAS_FLUJO}
      titulo={VIDEO_PRESENTACION.reproductor}
      Escena={EscenaFlujo}
      origen="empezar"
      Cta={() => (
        <a
          href="#wizard"
          onClick={() => track('explicativo_cta', { destino: 'wizard' })}
          className={buttonClasses('primary')}
        >
          {VIDEO_PRESENTACION.cta}
        </a>
      )}
    />
  );
}
