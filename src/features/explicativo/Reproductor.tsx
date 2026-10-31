'use client';

import { buttonClasses } from '@/components/ui/Button';
import { ESCENAS_EXPLICATIVO } from '@/content/explicativo';
import { REPRODUCTOR } from '@/content/explicativo/reproductor';
import { track } from '@/lib/analytics';
import { Escena } from './escenas';
import { ReproductorBase } from './ReproductorBase';

export type OrigenExplicativo = 'empezar' | 'demo';

interface ReproductorProps {
  origen: OrigenExplicativo;
  onCerrar: () => void;
}

/**
 * "Mirá cómo funciona" de la demo de Gastronomía: video explicativo hecho con motion graphics
 * (escenas.tsx) y narrado con la voz en español del dispositivo, en un <dialog> modal nativo
 * (Escape y fondo inerte de fábrica). El motor y los controles son los de ReproductorBase.
 */
export function Reproductor({ origen, onCerrar }: ReproductorProps) {
  return (
    <ReproductorBase
      modo="modal"
      guion={ESCENAS_EXPLICATIVO}
      titulo={REPRODUCTOR.titulo}
      Escena={Escena}
      origen={origen}
      onCerrar={onCerrar}
      Cta={({ cerrar }) => (
        <>
          {origen === 'demo' ? (
            <button
              type="button"
              onClick={() => {
                track('explicativo_cta', { destino: 'demo' });
                cerrar();
              }}
              className={buttonClasses('secondary')}
            >
              {REPRODUCTOR.probarDemo}
            </button>
          ) : (
            <a
              href="/demo/gastronomia"
              onClick={() => track('explicativo_cta', { destino: 'demo' })}
              className={buttonClasses('secondary')}
            >
              {REPRODUCTOR.probarDemo}
            </a>
          )}
          <a
            href="/empezar#wizard"
            onClick={() => {
              track('explicativo_cta', { destino: 'wizard' });
              // Desde /empezar: el link solo cambia el hash; se cierra el video para ver el wizard.
              if (origen === 'empezar') cerrar();
            }}
            className={buttonClasses('primary')}
          >
            {REPRODUCTOR.quieroElMio}
          </a>
        </>
      )}
    />
  );
}
