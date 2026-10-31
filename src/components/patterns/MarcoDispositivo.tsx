import type { ReactNode } from 'react';

export type Dispositivo = 'celular' | 'escritorio';

interface MarcoDispositivoProps {
  dispositivo: Dispositivo;
  /** Texto chico debajo del marco (p. ej. "Textos de ejemplo"). */
  leyenda: string;
  /** La pantalla. Lo que no entra se corta abajo, como una web que sigue al hacer scroll. */
  children?: ReactNode;
}

/**
 * Marco de la vista previa: un celular o una ventana de navegador. Las medidas salen del ancho
 * disponible y de una proporción fija, así que el marco vacío (mientras se descarga la vista previa)
 * ocupa exactamente lo mismo que el lleno: sin layout shift. Sin hooks ni JS propio.
 */
export function MarcoDispositivo({ dispositivo, leyenda, children }: MarcoDispositivoProps) {
  const pantalla = (
    <>
      {children}
      {/* La web sigue más abajo: se esfuma contra el fondo en vez de cortarse en seco. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-bg to-transparent" />
    </>
  );

  return (
    <div data-marco={dispositivo}>
      {dispositivo === 'celular' ? (
        <div className="mx-auto w-full max-w-64 rounded-panel border border-line-strong bg-surface-2 p-2 shadow-raised">
          <div className="relative aspect-[9/16] overflow-hidden rounded-card bg-bg">
            {/* Cámara: una pastilla arriba al centro. */}
            <div className="flex h-6 items-center justify-center">
              <span className="h-2 w-12 rounded-full bg-surface-2" />
            </div>
            {pantalla}
          </div>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-card border border-line-strong bg-surface-2 shadow-raised">
          <div className="flex h-8 items-center gap-2 border-b border-line px-4">
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            {/* Barra de direcciones vacía: no inventamos un dominio. */}
            <span className="mx-auto h-4 w-1/2 rounded-full bg-line" />
            <span className="w-10" />
          </div>
          <div className="relative aspect-[5/4] overflow-hidden bg-bg">{pantalla}</div>
        </div>
      )}
      <p className="mt-2 text-center text-small text-muted">{leyenda}</p>
    </div>
  );
}
