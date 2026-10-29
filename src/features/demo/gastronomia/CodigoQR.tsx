'use client';

import { useEffect, useState } from 'react';
import { COMPARTIR } from '@/content/demos/gastronomia/ui/compartir';

/**
 * Código QR que abre la demo (con la personalización actual) en el celular. La librería (uqr, ~8 KB)
 * se descarga recién cuando se muestra. Se dibuja con un solo <path> propio, sin innerHTML: módulos
 * negros sobre papel claro, que es lo que mejor leen las cámaras.
 */
export function CodigoQR({ url }: { url: string }) {
  const [codigo, setCodigo] = useState<{ url: string; d: string; lado: number } | null>(null);

  useEffect(() => {
    let vigente = true;
    void import('uqr').then(({ encode }) => {
      if (!vigente) return;
      const { data } = encode(url, { ecc: 'M', border: 2 });
      let d = '';
      data.forEach((fila, y) =>
        fila.forEach((oscuro, x) => {
          if (oscuro) d += `M${x} ${y}h1v1h-1z`;
        }),
      );
      setCodigo({ url, d, lado: data.length });
    });
    return () => {
      vigente = false;
    };
  }, [url]);

  // Mientras carga (o si cambió la URL), se reserva el mismo lugar: sin saltos.
  if (!codigo || codigo.url !== url) {
    return <div aria-busy="true" className="size-48 rounded-card bg-paper-2" />;
  }
  return (
    <svg
      viewBox={`0 0 ${codigo.lado} ${codigo.lado}`}
      role="img"
      aria-label={COMPARTIR.ariaQr}
      shapeRendering="crispEdges"
      className="size-48 rounded-card bg-paper-2 text-paper-fg"
    >
      <path d={codigo.d} fill="currentColor" />
    </svg>
  );
}
