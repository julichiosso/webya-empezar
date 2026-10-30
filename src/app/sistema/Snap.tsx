'use client';

import { useState } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { Button } from '@/components/ui/Button';
import { SISTEMA } from '@/content/sistema';

/**
 * El snap del Encastre en vivo (clase `snap` de src/brand/motion/motion.css): cada toque vuelve a
 * montar la pieza, que llega, se pasa apenas y asienta. Con movimiento reducido aparece quieta.
 * El hueco reserva el lugar: no hay layout shift.
 */
export function Snap() {
  const [vez, setVez] = useState(0);
  const t = SISTEMA.movimiento;
  return (
    <div className="mt-4 flex items-center gap-6">
      <span className="flex size-16 items-center justify-center rounded-card border border-dashed border-hueco-borde">
        <span
          key={vez}
          role="img"
          aria-label={t.snapPieza}
          className="snap flex size-12 items-center justify-center rounded-control bg-pieza-encajada text-accent-fg"
        >
          <Icon name="check" size={24} />
        </span>
      </span>
      <Button variante="secundario" onClick={() => setVez((v) => v + 1)}>
        {t.snapRepetir}
      </Button>
    </div>
  );
}
