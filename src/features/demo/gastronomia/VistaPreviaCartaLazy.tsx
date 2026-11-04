'use client';

import dynamic from 'next/dynamic';
import type { VistaPreviaCartaProps } from './VistaPreviaCarta';

/**
 * La carta real, descargada aparte: la plantilla y las cartas de ejemplo no entran al JS inicial de
 * /empezar. Mientras llega se reserva el mismo alto (CLS 0).
 */
export const VistaPreviaCartaLazy = dynamic<VistaPreviaCartaProps>(
  () => import('./VistaPreviaCarta').then((m) => m.VistaPreviaCarta),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        aria-busy="true"
        className="h-[30rem] rounded-card border border-line-strong bg-surface-2 lg:h-[34rem]"
      />
    ),
  },
);
