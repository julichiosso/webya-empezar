'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ASISTENTE as A } from '@/content/asistente';
import type { PanelAsistente as Panel } from './PanelAsistente';

/** Líneas de una grilla isométrica (dos familias de diagonales), en un cuadro de 64 × 64. */
const GRILLA = Array.from({ length: 9 }, (_, i) => {
  const d = i * 16 - 64;
  return `M${d} 0l64 32M${d} 64l64 -32`;
}).join('');

/**
 * La carita de Webya, flotando abajo a la derecha en todo el sitio: un cuadro negro con dos grillas
 * isométricas que flotan, dos ojos que parpadean (y en la compu miran hacia el puntero) y una sonrisa.
 * En la compu, al pasar el mouse se abre hacia la izquierda con una frase que va cambiando. Al tocarla se
 * abre el asistente; el chat (y su búsqueda) se pide recién la primera vez: no suma al JS inicial.
 */
export function BotonAsistente() {
  const [abierto, setAbierto] = useState(false);
  const [PanelChat, setPanel] = useState<typeof Panel | null>(null);
  const boton = useRef<HTMLButtonElement>(null);

  // Los ojos siguen al puntero (solo con mouse y con movimiento permitido).
  useEffect(() => {
    const el = boton.current;
    if (!el || !matchMedia('(pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const mover = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const dx = x - (r.right - 32);
        const dy = y - (r.top + 32);
        const d = Math.max(1, Math.hypot(dx, dy));
        el.style.setProperty('--ox', ((dx / d) * 2.2).toFixed(2));
        el.style.setProperty('--oy', ((dy / d) * 2).toFixed(2));
      });
    };
    window.addEventListener('pointermove', mover, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', mover);
    };
  }, []);

  const abrir = () => {
    if (!PanelChat) void import('./PanelAsistente').then((m) => setPanel(() => m.PanelAsistente));
    setAbierto(true);
  };

  return (
    <>
      <button
        ref={boton}
        type="button"
        className="ast"
        aria-label={A.abrir}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        data-abierto={abierto || undefined}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
      >
        <span className="ast-mensaje" aria-hidden="true">
          <span className="ast-frases">
            {A.frases.map((f, i) => (
              <span key={f} className="ast-frase" style={{ '--i': i } as CSSProperties}>
                {f}
              </span>
            ))}
          </span>
          <span className="ast-invita">{A.invitacion}</span>
        </span>
        <span className="ast-cara" aria-hidden="true">
          <svg viewBox="0 0 64 64" className="ast-grilla ast-grilla-atras" focusable="false">
            <path d={GRILLA} />
          </svg>
          <svg viewBox="0 0 64 64" className="ast-grilla ast-grilla-adelante" focusable="false">
            <path d={GRILLA} />
          </svg>
          <svg viewBox="0 0 64 64" className="ast-rostro" focusable="false">
            <g className="ast-ojos">
              <rect x="21" y="23" width="6" height="10" rx="3" />
              <rect x="37" y="23" width="6" height="10" rx="3" />
            </g>
            <path className="ast-boca" d="M24 41q8 7 16 0" />
          </svg>
        </span>
      </button>
      {abierto && PanelChat ? <PanelChat cerrar={() => setAbierto(false)} volverA={boton} /> : null}
    </>
  );
}
