import Image from 'next/image';
import { cn } from '@/components/ui/clases';
import type { Proyecto } from '@/content/proyectos';
import { PantallaProyecto, Telefono } from './Pantallas';

type Caso = Pick<Proyecto, 'imagenes' | 'mockup' | 'sistema'>;

/**
 * Composición de dispositivos de un caso: la captura de escritorio en una ventana y la del celular en el
 * teléfono, adelante a la derecha. Marcos planos (borde de 1 px, sin sombras), proporción fija (no salta
 * al cambiar de caso) y las capturas ancladas arriba: la cabecera del sitio nunca se recorta. Sin captura
 * de escritorio, dos teléfonos: la captura real y el esquema del sistema.
 */
export function Composicion({
  caso,
  prioridad = false,
  tamanos = '(min-width: 1024px) 40rem, 92vw',
  className,
}: {
  caso: Caso;
  prioridad?: boolean;
  tamanos?: string;
  className?: string;
}) {
  const { desktop, mobile } = caso.imagenes;
  const celular = (
    <Telefono
      className="max-w-none"
      decorativo={!mobile}
      barra={!mobile?.completa}
      colorBarra={mobile?.barra}
    >
      {mobile ? (
        <Image
          src={mobile.src}
          alt={mobile.alt}
          fill
          sizes="(min-width: 1024px) 10rem, 26vw"
          priority={prioridad}
          className="object-cover object-top"
        />
      ) : (
        <PantallaProyecto mockup={caso.mockup} />
      )}
    </Telefono>
  );

  if (!desktop) {
    return (
      <div className={cn('relative aspect-[16/10]', className)}>
        <div className="absolute inset-y-[4%] left-[22%] w-[25%]">{celular}</div>
        <div className="absolute inset-y-[4%] right-[22%] w-[25%]" aria-hidden="true">
          <Telefono className="max-w-none">
            <PantallaProyecto mockup={caso.mockup} />
          </Telefono>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative aspect-[16/10]', className)}>
      <div className="absolute top-0 left-0 w-[82%] overflow-hidden rounded-xl border border-ed-line-strong bg-ed-bg">
        <div
          aria-hidden="true"
          className="flex h-[1.375rem] items-center gap-1.5 bg-ed-surface px-3"
        >
          <span className="size-2 rounded-full border border-ed-line-strong" />
          <span className="size-2 rounded-full border border-ed-line-strong" />
          <span className="size-2 rounded-full border border-ed-line-strong" />
        </div>
        <div className="relative aspect-[16/10]">
          <Image
            src={desktop.src}
            alt={desktop.alt}
            fill
            sizes={tamanos}
            priority={prioridad}
            className="object-cover object-top"
          />
        </div>
      </div>
      <div className="absolute right-0 bottom-0 w-[23%]">{celular}</div>
    </div>
  );
}
