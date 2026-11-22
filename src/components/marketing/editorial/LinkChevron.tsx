import Link from 'next/link';
import { cn } from '@/components/ui/clases';
import { CTA } from '@/content/home';
import { Chevron } from './Iconos';

/**
 * Link de texto con chevron ("Ver demo ›"): la acción secundaria de las tarjetas y los heros. Las demos
 * abren en otra pestaña (lo dice el nombre accesible) y no se precargan.
 */
export function LinkChevron({
  href,
  children,
  externo = false,
  className,
}: {
  href: string;
  children: string;
  externo?: boolean;
  className?: string;
}) {
  const clases = cn('a-link', className);
  if (externo || /^(https?:|mailto:)/.test(href)) {
    return (
      <a
        href={href}
        target={externo ? '_blank' : undefined}
        rel="noopener"
        aria-label={externo ? `${children}${CTA.pestana}` : undefined}
        className={clases}
      >
        {children}
        <Chevron />
      </a>
    );
  }
  return (
    <Link href={href} prefetch={href.startsWith('/demos/') ? false : undefined} className={clases}>
      {children}
      <Chevron />
    </Link>
  );
}
