'use client';

import { useEffect, useState, type ComponentType } from 'react';

const ESPERA_MS = 1800;

type Props = { enProduccion: number };

/**
 * Los avisos aparecen recién después de unos segundos: su código se pide en ese momento, con la página ya
 * cargada y quieta. No suma nada al JavaScript inicial.
 */
export function AvisosDiferidos(props: Props) {
  const [Avisos, setAvisos] = useState<ComponentType<Props> | null>(null);
  useEffect(() => {
    let vivo = true;
    const t = setTimeout(() => {
      import('./AvisosIsla')
        .then((m) => {
          if (vivo) setAvisos(() => m.AvisosIsla);
        })
        .catch(() => {
          // Sin red o sin el archivo: los avisos no son imprescindibles.
        });
    }, ESPERA_MS);
    return () => {
      vivo = false;
      clearTimeout(t);
    };
  }, []);
  return Avisos ? <Avisos {...props} /> : null;
}
