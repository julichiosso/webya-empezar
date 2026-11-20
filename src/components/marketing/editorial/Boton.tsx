import Link from 'next/link';
import { cn } from '@/components/ui/clases';
import { CTA } from '@/content/home';
import { Flecha, FlechaDiagonal } from './Iconos';

interface BotonProps {
  href: string;
  children: React.ReactNode;
  variante?: 'primario' | 'secundario';
  chico?: boolean;
  /** Abre en otra pestaña (las demos y WhatsApp). Lo dice el nombre accesible, no el texto visible. */
  externo?: boolean;
  icono?: React.ReactNode | false;
  className?: string;
}

/**
 * Botón-enlace del sistema editorial. Dos jerarquías: principal sólido y secundario con borde fino.
 * Pill, sin sombra ni brillo. Micro-interacciones: la flecha avanza al pasar el mouse y el botón se
 * hunde apenas al tocarlo (respuesta inmediata).
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
      <span>{children}</span>
      {icono === false ? null : (icono ?? (externo ? <FlechaDiagonal /> : <Flecha />))}
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
