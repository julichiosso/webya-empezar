import Link from 'next/link';
import { cn } from '@/components/ui/clases';
import { Flecha } from './Iconos';

interface BotonProps {
  href: string;
  children: React.ReactNode;
  variante?: 'primario' | 'secundario';
  chico?: boolean;
  /** Imán sutil con mouse: solo en los CTA principales. */
  iman?: boolean;
  /** Preselección del configurador ("turnero", "pedidos"…). */
  armar?: string;
  /** Módulo que se marca al llegar al configurador. */
  modulo?: string;
  externo?: boolean;
  icono?: React.ReactNode | false;
  className?: string;
}

/**
 * Botón-enlace del sistema editorial. Pill, sin sombra; el hover del primario es el único lugar
 * donde aparece el acento. Micro-interacciones: flecha que avanza, presión al tocar, imán opcional.
 */
export function Boton({
  href,
  children,
  variante = 'primario',
  chico = false,
  iman = false,
  armar,
  modulo,
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
      {icono === false ? null : (icono ?? <Flecha />)}
    </>
  );
  const datos = {
    'data-magnet': iman ? '' : undefined,
    'data-armar': armar,
    'data-modulo': modulo,
  };
  if (externo || /^(https?:|mailto:)/.test(href)) {
    return (
      <a
        href={href}
        className={clases}
        target={externo ? '_blank' : undefined}
        rel="noopener"
        {...datos}
      >
        {contenido}
      </a>
    );
  }
  // Las demos son pesadas y tienen CSS propio: precargarlas desde la home solo suma bytes (y el
  // navegador avisa que ese CSS precargado no se usó).
  const prefetch = href.startsWith('/demo/') ? false : undefined;
  return (
    <Link href={href} prefetch={prefetch} className={clases} {...datos}>
      {contenido}
    </Link>
  );
}
