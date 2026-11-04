'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import estilos from './CapturaCliente.module.css';

interface Props {
  href: string;
  cliente: string;
  src: string;
  alt: string;
  /** Medidas reales del archivo (evitan CLS). */
  width: number;
  height: number;
}

/**
 * Captura de la página completa de un cliente dentro de un recorte de alto fijo. Entra en pantalla y
 * se desliza lento hacia abajo y vuelve (solo transform); se pausa fuera de pantalla, en hover y en
 * foco; con reduced-motion queda quieta. Toda la captura es el enlace al sitio.
 */
export function CapturaCliente({ href, cliente, src, alt, width, height }: Props) {
  const marco = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = marco.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      if (e) el.toggleAttribute('data-visible', e.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <a
      ref={marco}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      className={estilos.marco}
      onClick={() => track('cliente_abierto', { cliente })}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={estilos.imagen}
      />
    </a>
  );
}
