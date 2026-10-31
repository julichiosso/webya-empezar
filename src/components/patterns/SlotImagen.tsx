import type { ReactNode } from 'react';
import { IlustracionPlano } from '@/brand/ilustracion/plano/IlustracionPlano';
import { FondoPlano } from '@/brand/ilustracion/plano/FondoPlano';
import { cn } from '@/components/ui/clases';

export type EscenaPlano = 'hero' | 'como-funciona' | 'cierre';

/**
 * Un archivo exportado en varios anchos y dos formatos. Convención de nombres:
 * `${base}-${ancho}.avif` y `${base}-${ancho}.webp` (p. ej. `/plano/hero-1280.avif`).
 */
export interface FuenteImagen {
  base: string;
  /** Anchos exportados, en px (p. ej. [640, 1280, 1920]). */
  anchos: readonly number[];
  /** Tamaño intrínseco del original: reserva el espacio (CLS 0). */
  ancho: number;
  alto: number;
}

export interface SlotImagenProps {
  /** `null` mientras no hay foto: se muestra la ilustración del plano de `escena`, terminada. */
  fuente: FuenteImagen | null;
  /** Texto alternativo (desde src/content). Vacío si la foto es decorativa. */
  alt: string;
  /** Escena del plano para el fallback (y la proporción si no hay foto). */
  escena: EscenaPlano;
  /** En el primer pliegue: carga inmediata y prioridad alta. Si no, `loading="lazy"`. */
  primerPliegue?: boolean;
  /** Ancho en pantalla para elegir del srcset. Por defecto, pantalla completa. */
  sizes?: string;
  /**
   * `bloque`: ocupa el ancho de su contenedor con la proporción de la foto reservada.
   * `fondo`: llena (absolute) un contenedor posicionado que ya reserva su alto (Seccion).
   */
  modo?: 'bloque' | 'fondo';
  /** Duotono Brasa/tinta (por defecto). Sin él, la foto en color bajo el velo. */
  duotono?: boolean;
  /** Proporción del fallback sin foto, `ancho / alto`. */
  proporcion?: readonly [number, number];
  /** Texto encima del velo (solo en modo bloque). */
  children?: ReactNode;
  className?: string;
}

const srcset = (f: FuenteImagen, ext: 'avif' | 'webp') =>
  f.anchos.map((w) => `${f.base}-${w}.${ext} ${w}w`).join(', ');

/** El ancho exportado más chico que cubre `objetivo` (o el más grande). */
function anchoPara(f: FuenteImagen, objetivo: number) {
  const orden = [...f.anchos].sort((a, b) => a - b);
  return orden.find((w) => w >= objetivo) ?? orden[orden.length - 1];
}

/**
 * Imagen a pantalla completa del Plano: `<picture>` AVIF + WebP con srcset/sizes, espacio
 * reservado (width/height + aspect-ratio), tratamiento duotono Brasa/tinta y velo para el texto.
 *
 * Duotono sin filtros: la foto se pinta con `mix-blend-mode: luminosity` sobre el fondo tinta
 * (queda en escala de grises con el tono de la tinta) y una capa `bg-seccion-brasa` en `multiply`
 * tiñe las luces de Brasa oscura (las sombras quedan tinta). Son dos capas de composición
 * estáticas dentro de un grupo aislado (`isolate`): se resuelven al pintar, sin costo por frame,
 * sin `filter` (que en Safari/Firefox es CPU) y sin un `<filter>` SVG que bloquea la rasterización.
 * Encima, `bg-velo-imagen` garantiza AA para `text-velo-imagen-fg`.
 *
 * Sin foto (`fuente: null`): la ilustración del plano de la escena, sobre fondo tinta con la grilla
 * de cotas. Nada de "TODO" en pantalla: el pendiente vive en src/content.
 */
export function SlotImagen({
  fuente,
  alt,
  escena,
  primerPliegue = false,
  sizes = '100vw',
  modo = 'bloque',
  duotono = true,
  proporcion = [16, 9],
  children,
  className,
}: SlotImagenProps) {
  const [w, h] = fuente ? [fuente.ancho, fuente.alto] : proporcion;
  const enBloque = modo === 'bloque';

  return (
    <div
      data-slot-imagen={fuente ? 'foto' : 'plano'}
      data-modo={modo}
      className={cn(
        'bg-seccion-tinta isolate overflow-hidden',
        enBloque ? 'relative grid w-full' : 'absolute inset-0 -z-10',
        className,
      )}
      // La proporción reserva el alto antes de que llegue la foto. Si el texto de encima es más
      // alto, el bloque crece (aspect-ratio es un mínimo con min-height: auto).
      style={enBloque ? { aspectRatio: `${w} / ${h}` } : undefined}
    >
      {fuente ? (
        <picture>
          <source type="image/avif" srcSet={srcset(fuente, 'avif')} sizes={sizes} />
          <source type="image/webp" srcSet={srcset(fuente, 'webp')} sizes={sizes} />
          {/* <img> y no next/image: <picture> con AVIF/WebP pre-exportados y un <source> por formato. */}
          <img
            src={`${fuente.base}-${anchoPara(fuente, 1280)}.webp`}
            alt={alt}
            width={fuente.ancho}
            height={fuente.alto}
            sizes={sizes}
            loading={primerPliegue ? 'eager' : 'lazy'}
            fetchPriority={primerPliegue ? 'high' : 'auto'}
            decoding={primerPliegue ? 'sync' : 'async'}
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              duotono && 'mix-blend-luminosity',
            )}
          />
        </picture>
      ) : (
        <div aria-hidden="true" data-plano-fallback="" className="text-seccion-tinta-muted">
          <FondoPlano variante="cotas" />
          <IlustracionPlano escena={escena} className="absolute inset-0 h-full w-full" />
        </div>
      )}
      {fuente && duotono && (
        <div
          aria-hidden="true"
          data-duotono=""
          className="bg-seccion-brasa absolute inset-0 mix-blend-multiply"
        />
      )}
      <div aria-hidden="true" data-velo="" className="bg-velo-imagen absolute inset-0" />
      {enBloque && children && (
        <div className="text-velo-imagen-fg relative grid content-end">{children}</div>
      )}
    </div>
  );
}
