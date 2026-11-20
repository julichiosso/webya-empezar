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
 * Botón-enlace del sistema editorial. Dos jerarquías: principal sólido y secundario con borde fino.
 * Pill, sin sombra, brillo ni flecha. Respuesta inmediata: cambia de tono al pasar el mouse y se hunde
 * apenas al tocarlo.
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
      {icono || null}
      <span>{children}</span>
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
