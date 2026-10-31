import type { ReactNode } from 'react';
import { FondoPlano } from '@/brand/ilustracion/plano/FondoPlano';
import { cn } from '@/components/ui/clases';
import { SlotImagen, type SlotImagenProps } from './SlotImagen';

export type FondoSeccion = 'tinta' | 'crema' | 'brasa' | 'imagen';

/**
 * Clases del contrato (docs/plano-contrato.md) por fondo. Escritas enteras para que Tailwind las
 * encuentre. Exportadas para que el contenido de la sección use el secundario y la línea correctos
 * (`CLASES_SECCION[fondo].secundario`).
 */
export const CLASES_SECCION = {
  tinta: {
    fondo: 'bg-seccion-tinta',
    texto: 'text-seccion-tinta-fg',
    secundario: 'text-seccion-tinta-muted',
    linea: 'border-seccion-tinta-linea',
    // Sobre tinta, el foco global (Brasa) ya contrasta.
    foco: '',
  },
  crema: {
    fondo: 'bg-seccion-crema',
    texto: 'text-seccion-crema-fg',
    secundario: 'text-seccion-crema-muted',
    linea: 'border-seccion-crema-linea',
    // `papel` pasa los tokens de los controles a su versión crema y el foco a --accent-ink.
    foco: 'papel',
  },
  brasa: {
    fondo: 'bg-seccion-brasa',
    texto: 'text-seccion-brasa-fg',
    secundario: 'text-seccion-brasa-muted',
    linea: 'border-seccion-brasa-linea',
    // Brasa sobre Brasa oscura no llega a 3:1: el anillo toma el color del texto de la sección.
    foco: '[&_:focus-visible]:outline-seccion-brasa-fg',
  },
  imagen: {
    fondo: '',
    texto: 'text-velo-imagen-fg',
    secundario: 'text-velo-imagen-muted',
    linea: '',
    foco: '[&_:focus-visible]:outline-velo-imagen-fg',
  },
} as const satisfies Record<
  FondoSeccion,
  { fondo: string; texto: string; secundario: string; linea: string; foco: string }
>;

/** La foto de una sección `imagen` (va de fondo, bajo el velo). */
export type ImagenSeccion = Pick<
  SlotImagenProps,
  'fuente' | 'alt' | 'escena' | 'primerPliegue' | 'sizes' | 'duotono'
>;

interface Comunes {
  /** Elemento raíz. `section` necesita nombre: pasá `aria-labelledby` con el id del título. */
  como?: 'section' | 'div' | 'header' | 'footer';
  id?: string;
  'aria-labelledby'?: string;
  /** Grilla de plano detrás del contenido (`FondoPlano`). Sin valor, no hay grilla. */
  plano?: 'grilla' | 'cotas';
  /** Alto mínimo de una pantalla, contenido centrado en vertical. */
  pantallaCompleta?: boolean;
  className?: string;
  /** Clases del contenedor interno (ancho de página). */
  contenidoClassName?: string;
  children: ReactNode;
}

export type SeccionProps = Comunes &
  (
    | { fondo: 'tinta' | 'crema' | 'brasa'; imagen?: never }
    | { fondo: 'imagen'; imagen: ImagenSeccion }
  );

/**
 * Bloque a pantalla completa del Plano: el fondo ocupa todo el ancho de la ventana y el contenido
 * queda al ancho de página (`max-w-page`, 1200 px).
 *
 * Cómo rompe el contenedor angosto de la página (`main` con `max-w-*`): `w-screen` +
 * `mx-[calc(50%-50vw)]` lo estira a los bordes de la ventana desde cualquier columna centrada. El
 * `100vw` incluye la barra de scroll en escritorio; ese sobrante lo recorta `overflow-x: clip` del
 * body (globals.css), así que no hay scroll horizontal. Requisito: que el padre directo esté
 * centrado en la ventana (como el `main` de las páginas). Dentro de una columna lateral, no usarla.
 *
 * No es interactiva (sin estados propios); el foco de lo que tenga adentro se ajusta al fondo.
 */
export function Seccion({
  como: Raiz = 'section',
  fondo,
  imagen,
  plano,
  pantallaCompleta = false,
  id,
  'aria-labelledby': etiquetadaPor,
  className,
  contenidoClassName,
  children,
}: SeccionProps) {
  const c = CLASES_SECCION[fondo];
  return (
    <Raiz
      id={id}
      aria-labelledby={etiquetadaPor}
      data-fondo={fondo}
      className={cn(
        'relative isolate mx-[calc(50%-50vw)] w-screen max-w-none overflow-hidden',
        c.fondo,
        c.texto,
        c.foco,
        pantallaCompleta && 'grid min-h-svh content-center',
        className,
      )}
    >
      {fondo === 'imagen' && imagen && <SlotImagen {...imagen} modo="fondo" />}
      {plano && <FondoPlano variante={plano} />}
      <div
        className={cn(
          'relative mx-auto w-full max-w-page px-4 py-16 lg:px-8 lg:py-24',
          contenidoClassName,
        )}
      >
        {children}
      </div>
    </Raiz>
  );
}
