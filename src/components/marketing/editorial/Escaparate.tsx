import Image from 'next/image';
import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { ESCAPARATE_AVISO as A } from '@/content/home';
import { getProyecto } from '@/content/proyectos';
import { Tilde } from './Iconos';
import { Telefono } from './Pantallas';

/** Alto útil de la pantalla del teléfono, en anchos: cuánto hay que bajar para recorrer la captura. */
const PANTALLA = 2;

/** Izquierda, centro (adelante y más grande) y derecha. */
const ORDEN = [
  { id: 'petrucci', clases: 'w-[29%] max-w-56 translate-y-[10%]' },
  { id: 'micios', clases: 'z-10 w-[36%] max-w-64' },
  { id: 'lorena', clases: 'w-[29%] max-w-56 translate-y-[10%]' },
] as const;

/**
 * Escaparate de la home ("El producto a la vista"): tres iPhones con los sitios reales de clientes, el del
 * medio adelante. Suben desde abajo al entrar en pantalla y cada captura se recorre sola de arriba a abajo (solo transform; se pausa
 * fuera de pantalla y queda quieta con movimiento reducido).
 */
export function Escaparate({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex items-start justify-center gap-[3%]', className)}
      data-loop=""
      aria-hidden="true"
      // El script de movimiento le pone .on al entrar en pantalla (puede ser antes de hidratar).
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
            {i === 1 ? <Aviso /> : null}
          </div>
        );
      })}
    </div>
  );
}

/** El aviso que le llega al dueño: entra, se queda un rato y se va, en bucle lento (pausa fuera de pantalla). */
function Aviso() {
  return (
    <div className="e-push a-push-bucle e-bucle tono-claro">
      <span className="e-push-icono">
        <Tilde />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex justify-between gap-2 text-ed-muted">
          <span>{A.app}</span>
          <span>{A.cuando}</span>
        </span>
        <span className="block font-semibold">{A.titulo}</span>
        <span className="block truncate">{A.texto}</span>
      </span>
    </div>
  );
}
