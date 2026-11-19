'use client';

import { Flecha } from './Iconos';

/**
 * Anterior / siguiente para el carril horizontal (con mouse no hay gesto de deslizar). Mueve el
 * scroll una tarjeta; el snap la alinea. Solo se muestra desde tablet: en celular se desliza.
 */
export function ControlesCarril({
  carrilId,
  anterior,
  siguiente,
}: {
  carrilId: string;
  anterior: string;
  siguiente: string;
}) {
  const mover = (dir: 1 | -1) => {
    const carril = document.getElementById(carrilId);
    const tarjeta = carril?.firstElementChild as HTMLElement | null;
    if (!carril || !tarjeta) return;
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    carril.scrollBy({
      left: dir * (tarjeta.offsetWidth + 16),
      behavior: quieto ? 'auto' : 'smooth',
    });
  };
  return (
    <div className="hidden gap-2 md:flex">
      <button
        type="button"
        onClick={() => mover(-1)}
        aria-label={anterior}
        aria-controls={carrilId}
        className="e-btn e-btn-secundario e-btn-chico w-11 px-0"
      >
        <Flecha className="rotate-180" />
      </button>
      <button
        type="button"
        onClick={() => mover(1)}
        aria-label={siguiente}
        aria-controls={carrilId}
        className="e-btn e-btn-secundario e-btn-chico w-11 px-0"
      >
        <Flecha />
      </button>
    </div>
  );
}
