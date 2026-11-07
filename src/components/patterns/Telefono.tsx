import type { ReactNode } from 'react';
import { cn } from '@/components/ui/clases';

interface TelefonoProps {
  children: ReactNode;
  /** Clases de la pantalla: su alto (lo que se ve del sitio) y el scroll, si lo lleva. */
  pantallaClassName?: string;
  className?: string;
}

/**
 * Un celular dibujado solo con un marco: el contenido es lo importante. Se usa sobre fondo oscuro y
 * sobre crema (el borde sigue al texto de la sección). Decorativo: quien lo usa decide si su contenido
 * se lee o se oculta a lectores de pantalla.
 */
export function Telefono({ children, pantallaClassName, className }: TelefonoProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[20rem] rounded-[2.25rem] border-2 border-current/25 p-2',
        className,
      )}
    >
      <div
        className={cn(
          'relative isolate h-[34rem] overflow-hidden rounded-[1.75rem] bg-paper',
          pantallaClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
