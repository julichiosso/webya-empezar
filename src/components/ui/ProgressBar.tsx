'use client';

import * as m from 'motion/react-m';

interface ProgressBarProps {
  step: number;
  total: number;
  label: string;
}

/** Barra de progreso fluida: solo escala en X (transform), nunca cambia el ancho. */
export function ProgressBar({ step, total, label }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-valuetext={`Paso ${step} de ${total}`}
      className="h-1 overflow-hidden rounded-full bg-line"
    >
      <m.div
        className="h-full origin-left rounded-full bg-accent"
        initial={false}
        animate={{ scaleX: step / total }}
        transition={{ type: 'spring', stiffness: 160, damping: 26 }}
      />
    </div>
  );
}
