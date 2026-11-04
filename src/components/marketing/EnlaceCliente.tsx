'use client';

import type { ReactNode } from 'react';
import { track } from '@/lib/analytics';

interface Props {
  href: string;
  /** Id del cliente, para medir cuál se abre. */
  cliente: string;
  className?: string;
  children: ReactNode;
}

/** Enlace externo a un sitio de cliente: se abre en otra pestaña y mide el clic (sin cookies). */
export function EnlaceCliente({ href, cliente, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track('cliente_abierto', { cliente })}
    >
      {children}
    </a>
  );
}
