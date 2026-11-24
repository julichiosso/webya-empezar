import type { CSSProperties } from 'react';
import { LOGO_TRAZOS } from '@/brand/logo/trazos';
import { ESCRIBINOS_FLOTANTE as E } from '@/content/home';

/** La "w" del logo, para el centro del botón. */
const W = LOGO_TRAZOS[0];

/** Líneas de una grilla isométrica (dos familias de diagonales), en un cuadro de 64 × 64. */
const GRILLA = Array.from({ length: 9 }, (_, i) => {
  const d = i * 16 - 64;
  return `M${d} 0l64 32M${d} 64l64 -32`;
}).join('');

/**
 * Botón flotante para escribirnos (en la compu, abajo a la derecha, cuando el hero ya pasó). Un cuadro
 * negro con dos grillas isométricas que flotan a distinto ritmo y la "w" de Webya. Al pasar el mouse (o
 * con el foco) se abre hacia la izquierda con una frase que va cambiando y la invitación a escribir.
 * Todo CSS: se abre con clip-path, que también recorta dónde se puede tocar.
 */
export function EscribinosFlotante({ href, externo }: { href: string; externo: boolean }) {
  return (
    <a
      href={href}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noopener' : undefined}
      aria-label={externo ? E.aria : E.ariaMail}
      className="ef"
    >
      <span className="ef-mensaje" aria-hidden="true">
        <span className="ef-frases">
          {E.frases.map((f, i) => (
            <span key={f} className="ef-frase" style={{ '--i': i } as CSSProperties}>
              {f}
            </span>
          ))}
        </span>
        <span className="ef-cta">
          {externo ? E.cta : E.ctaMail}
          <svg viewBox="0 0 16 16" focusable="false">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </span>
      <span className="ef-cuadro" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="ef-grilla ef-grilla-atras" focusable="false">
          <path d={GRILLA} />
        </svg>
        <svg viewBox="0 0 64 64" className="ef-grilla ef-grilla-adelante" focusable="false">
          <path d={GRILLA} />
        </svg>
        <svg viewBox="136 50 300 170" className="ef-w" focusable="false">
          <path d={W.d} />
        </svg>
      </span>
    </a>
  );
}
