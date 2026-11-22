import Image from 'next/image';
import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { getProyecto } from '@/content/proyectos';
import { Telefono } from './Pantallas';

/** Alto útil de la pantalla del teléfono, en anchos: cuánto hay que bajar para recorrer la captura. */
const PANTALLA = 2;

/** Izquierda, centro (adelante y más grande) y derecha. */
const ORDEN = [
  { id: 'petrucci', clases: 'w-[38%] max-w-60 translate-y-[12%] -mr-[6%]' },
  { id: 'micios', clases: 'z-10 w-[44%] max-w-72' },
  { id: 'lorena', clases: 'w-[38%] max-w-60 translate-y-[12%] -ml-[6%]' },
] as const;

/**
 * Escaparate del hero de la home: tres iPhones con los sitios reales de clientes, el del medio adelante.
 * Entran desde abajo al cargar y cada captura se recorre sola de arriba a abajo (solo transform; se pausa
 * fuera de pantalla y queda quieta con movimiento reducido).
 */
export function Escaparate({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex items-start justify-center', className)}
      data-loop=""
      aria-hidden="true"
      // El script de movimiento le pone .on antes de hidratar (está en la primera pantalla).
      suppressHydrationWarning
    >
      {ORDEN.map((o, i) => {
        const img = getProyecto(o.id)?.imagenes.mobile;
        if (!img) return null;
        const bajar = img.completa ? 0 : Math.max(0, 1 - PANTALLA / (img.alto / img.ancho));
        return (
          <div
            key={o.id}
            className={cn('a-escaparate-tel relative shrink-0', o.clases)}
            style={{ '--i': i } as CSSProperties}
          >
            <Telefono className="max-w-none" barra={!img.completa} colorBarra={img.barra}>
              <div className="relative h-full overflow-hidden">
                <Image
                  src={img.src}
                  alt=""
                  width={img.ancho}
                  height={img.alto}
                  priority={i === 1}
                  sizes="(min-width: 768px) 18rem, 44vw"
                  className={
                    bajar
                      ? 'e-vidriera-recorre e-bucle h-auto w-full'
                      : 'h-full w-full object-cover object-top'
                  }
                  style={bajar ? ({ '--bajar': `${-bajar * 100}%` } as CSSProperties) : undefined}
                />
              </div>
            </Telefono>
          </div>
        );
      })}
    </div>
  );
}
