import type { ReactNode } from 'react';
import { cn } from '@/components/ui/clases';
import estilos from './Telefono.module.css';

interface TelefonoProps {
  children: ReactNode;
  /** Clases de la pantalla: su alto (lo que se ve del sitio) y el scroll, si lo lleva. */
  pantallaClassName?: string;
  className?: string;
  /** El contenido ya trae su barra de estado (los videos del hero): no se reserva lugar para otra. */
  sinBarra?: boolean;
}

/**
 * Un iPhone dibujado solo con CSS: marco de titanio, botones de los costados, isla y barra de inicio.
 * Se ve igual sobre fondo oscuro y sobre crema. El ancho se ajusta con `--tel-ancho` para que todo
 * escale junto. Decorativo: quien lo usa decide si su contenido se lee o se oculta a lectores de pantalla.
 */
export function Telefono({ children, pantallaClassName, className, sinBarra }: TelefonoProps) {
  return (
    <div className={cn(estilos.telefono, 'mx-auto w-full max-w-[20rem]', className)}>
      <span aria-hidden="true" className={cn(estilos.boton, estilos.accion)} />
      <span aria-hidden="true" className={cn(estilos.boton, estilos.volumenMas)} />
      <span aria-hidden="true" className={cn(estilos.boton, estilos.volumenMenos)} />
      <span aria-hidden="true" className={cn(estilos.boton, estilos.encendido)} />
      <div className={estilos.bisel}>
        <div className={cn(estilos.pantalla, 'h-[34rem]', pantallaClassName)}>
          {!sinBarra && <div aria-hidden="true" className={estilos.barra} />}
          <div className={estilos.contenido}>{children}</div>
          <span aria-hidden="true" className={estilos.isla} />
          <span aria-hidden="true" className={estilos.inicio} />
        </div>
      </div>
    </div>
  );
}
