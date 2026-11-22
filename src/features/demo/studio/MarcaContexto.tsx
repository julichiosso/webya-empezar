'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { fuenteMarca } from '@/content/demos/studio';
import type { Marca } from './marca';

const Contexto = createContext<Marca | null>(null);

/** La marca que armó la persona, para cualquier pantalla de la demo (sin pasarla de mano en mano). */
export function ProveedorMarca({ marca, children }: { marca: Marca; children: ReactNode }) {
  return <Contexto.Provider value={marca}>{children}</Contexto.Provider>;
}

/** null fuera de una demo personalizable: la pantalla usa su texto de siempre. */
export const useMarca = () => useContext(Contexto);

/** Logo (si subió uno) y nombre del negocio, con su estilo de letra. */
export function NombreMarca({
  respaldo,
  className,
  conFuente = true,
}: {
  /** Lo que se muestra si no hay marca (fuera del estudio). */
  respaldo: string;
  className?: string;
  /** false: respeta la letra propia de la app (por ejemplo, la de la pizzería). */
  conFuente?: boolean;
}) {
  const m = useMarca();
  if (!m) return <span className={className}>{respaldo}</span>;
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      {m.logo ? (
        // Foto local (blob:) ya achicada: next/image no aplica.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.logo} alt="" className="size-[1.6em] shrink-0 rounded-full object-cover" />
      ) : null}
      <span
        className="truncate"
        style={conFuente ? { fontFamily: fuenteMarca(m.fuenteId).pila } : undefined}
      >
        {m.nombre || respaldo}
      </span>
    </span>
  );
}
