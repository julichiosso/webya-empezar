'use client';

import { useState } from 'react';
import { ENCASTRE_PALABRA, estiloPalabra } from '@/brand/motion/presets';
import { Button } from '@/components/ui/Button';
import { SISTEMA } from '@/content/sistema';

/**
 * El preset de kinetic type en vivo (versión CSS: clase `palabra-encastre` + `estiloPalabra(i)`).
 * Cada toque vuelve a montar el titular. Es una MUESTRA del preset: el componente de producción
 * (TituloEncastre) vive en src/components y lo importa igual. El texto es el de muestra de la
 * tipografía; con movimiento reducido aparece quieto.
 */
export function PalabrasEncastre() {
  const [vez, setVez] = useState(0);
  const palabras = SISTEMA.tipo.muestra.split(' ');
  return (
    <div className="mt-4 grid gap-4">
      <p key={vez} className="text-title font-semibold text-balance">
        {palabras.map((p, i) => (
          <span key={`${p}-${i}`}>
            <span className={ENCASTRE_PALABRA.clase} style={estiloPalabra(i)}>
              {p}
            </span>{' '}
          </span>
        ))}
      </p>
      <div>
        <Button variante="secundario" onClick={() => setVez((v) => v + 1)}>
          {SISTEMA.movimiento.snapRepetir}
        </Button>
      </div>
    </div>
  );
}
