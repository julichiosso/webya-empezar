import type { ReactNode } from 'react';
import { Seccion } from '@/components/patterns/Seccion';

/**
 * El creador (rubro → nombre → vista previa → WhatsApp) con su fondo. Todos los CTA de la página bajan
 * acá. Las pantallas las compone la página: esta sección es solo el material.
 */
export function SeccionCreador({ children }: { children: ReactNode }) {
  return (
    <Seccion
      como="div"
      fondo="tinta"
      className="overflow-clip!"
      contenidoClassName="pt-16 pb-16 lg:pt-24 lg:pb-24"
    >
      {children}
    </Seccion>
  );
}
