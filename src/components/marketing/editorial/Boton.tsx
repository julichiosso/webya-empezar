import Link from 'next/link';
import { cn } from '@/components/ui/clases';
import { CTA } from '@/content/home';

interface BotonProps {
  href: string;
  children: React.ReactNode;
  variante?: 'primario' | 'secundario';
  chico?: boolean;
  /** Abre en otra pestaña (las demos y WhatsApp). Lo dice el nombre accesible, no el texto visible. */
  externo?: boolean;
  /** Ícono a la izquierda del texto (WhatsApp). Los botones no llevan flecha. */
  icono?: React.ReactNode | false;
  className?: string;
}

/**
 * El gesto de los botones de Webya, en vector: al pasar el mouse un trazo de 1 px dibuja el contorno del
 * botón (por fuera, separado) y el texto rueda hacia arriba. Sin sombras ni brillos; con movimiento
 * reducido, el contorno aparece de una.
 */
export function TrazoBoton() {
  return (
    <svg aria-hidden="true" focusable="false" className="e-btn-trazo">
      <rect width="100%" height="100%" pathLength={1} />
    </svg>
  );
}

/** El texto del botón dos veces, una arriba de la otra: al pasar el mouse rueda a la segunda. */
export function TextoBoton({ children }: { children: React.ReactNode }) {
  if (typeof children !== 'string') return <span>{children}</span>;
  return (
    <span className="e-btn-rol">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

/**
 * Botón-enlace del sistema editorial. Dos jerarquías: principal sólido y secundario con borde fino.
 * Pill, sin sombra, brillo ni flecha. Respuesta inmediata: el trazo y el texto al pasar el mouse, y se
 * hunde apenas al tocarlo.
 */
export function Boton({
  href,
  children,
  variante = 'primario',
  chico = false,
  externo = false,
  icono,
  className,
}: BotonProps) {
  const clases = cn(
    'e-btn',
    variante === 'primario' ? 'e-btn-primario' : 'e-btn-secundario',
    chico && 'e-btn-chico',
    className,
  );
  const contenido = (
    <>
      <TrazoBoton />
      {icono || null}
      <TextoBoton>{children}</TextoBoton>
    </>
  );
  if (externo || /^(https?:|mailto:)/.test(href)) {
    return (
      <a
        href={href}
        className={clases}
        target={externo ? '_blank' : undefined}
        rel="noopener"
        aria-label={
          externo && typeof children === 'string' ? `${children}${CTA.pestana}` : undefined
        }
      >
        {contenido}
      </a>
    );
  }
  // Las demos son pesadas y tienen CSS propio: precargarlas desde el sitio solo suma bytes.
  const prefetch = href.startsWith('/demos/') ? false : undefined;
  return (
    <Link href={href} prefetch={prefetch} className={clases}>
      {contenido}
    </Link>
  );
}

/** Botón de envío de un formulario, con el mismo gesto. */
export function BotonForm({ texto, cargando }: { texto: string; cargando: boolean }) {
  return (
    <button
      type="submit"
      aria-disabled={cargando || undefined}
      className="e-btn e-btn-primario shrink-0"
    >
      <TrazoBoton />
      <TextoBoton>{texto}</TextoBoton>
    </button>
  );
}
