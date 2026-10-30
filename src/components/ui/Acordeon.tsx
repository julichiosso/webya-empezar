import type { ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import type { ContratoAcordeon } from './contratos';
import { cn } from './clases';

type Item = Omit<ContratoAcordeon['items'][number], 'respuesta'> & {
  respuesta: ReactNode;
  /** Abierto al cargar (p. ej. la pregunta más frecuente). */
  abierto?: boolean;
  /** No se puede abrir: sale del orden de Tab y se ve atenuado. */
  deshabilitado?: boolean;
};

interface AcordeonProps {
  items: Item[];
  /**
   * Si se pasa, solo queda una abierta a la vez (atributo `name` de `<details>`, sin JS). Sin
   * soporte del navegador simplemente se pueden abrir varias.
   */
  exclusivo?: string;
  className?: string;
}

/**
 * Preguntas frecuentes sobre `<details>`/`<summary>`: cero JS (componente de servidor). Teclado,
 * Enter/Espacio y el estado expandido los da el navegador. Estados: default (cerrado), hover, focus
 * (anillo global en el summary), active (abrir/cerrar), disabled. Carga, error y éxito no aplican:
 * el contenido es estático.
 */
export function Acordeon({ items, exclusivo, className }: AcordeonProps) {
  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item) => (
        <details
          key={item.id}
          name={exclusivo}
          open={item.abierto && !item.deshabilitado ? true : undefined}
          className="group"
        >
          <summary
            aria-disabled={item.deshabilitado || undefined}
            tabIndex={item.deshabilitado ? -1 : undefined}
            className={cn(
              'flex min-h-tap cursor-pointer list-none items-center justify-between gap-4 py-4 text-body font-semibold [&::-webkit-details-marker]:hidden',
              item.deshabilitado
                ? 'pointer-events-none cursor-not-allowed opacity-45'
                : 'hover:text-muted',
            )}
          >
            <span className="text-balance">{item.pregunta}</span>
            <Icon
              name="arrowDown"
              size={20}
              className="shrink-0 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <div className="pb-4 text-body text-muted">{item.respuesta}</div>
        </details>
      ))}
    </div>
  );
}
