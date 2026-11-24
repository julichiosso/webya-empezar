import type { CSSProperties } from 'react';
import { VIDRIERA_TURNO as V } from '@/content/demos/turnos/vidriera';
import { PANTALLA, VISTA } from './Calle';

const [ANCHO, ALTO] = VISTA.split(' ').slice(2).map(Number) as [number, number];
const pct = (n: number, total: number) => `${((n / total) * 100).toFixed(3)}%`;

/**
 * El momento estrella del hero: en la vidriera de "Tu negocio", de día, un turno con seña en tres pasos
 * (elegís el horario, pagás la seña con Mercado Pago, queda confirmado y al dueño le llega el aviso).
 * Va encima del dibujo, con la geometría de la pantalla de Calle.tsx; de noche se apaga y la vidriera
 * muestra los sitios reales. Con movimiento, los pasos se suceden en bucle; sin movimiento, queda el
 * turno confirmado. Decorativa: el hero cuenta lo mismo en texto.
 */
export function VidrieraTurno() {
  const lugar: CSSProperties = {
    left: pct(PANTALLA.x, ANCHO),
    top: pct(PANTALLA.y, ALTO),
    width: pct(PANTALLA.w, ANCHO),
    height: pct(PANTALLA.h, ALTO),
  };
  return (
    <div className="vt-caja" aria-hidden="true">
      <div className="vt" style={lugar}>
        <p className="vt-negocio">{V.negocio}</p>
        <div className="vt-pasos">
          <div className="vt-paso vt-paso-1">
            <p className="vt-titulo">{V.elegir.titulo}</p>
            <p className="vt-dia">{V.elegir.dia}</p>
            <div className="vt-horarios">
              {V.elegir.horarios.map((h, i) => (
                <span
                  key={h}
                  className={i === V.elegir.elegido ? 'vt-hora vt-hora-elegida' : 'vt-hora'}
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
          <div className="vt-paso vt-paso-2">
            <p className="vt-dia">{V.pagar.titulo}</p>
            <p className="vt-monto">{V.pagar.monto}</p>
            <span className="vt-mp">{V.pagar.boton}</span>
          </div>
          <div className="vt-paso vt-paso-3">
            <span className="vt-tilde">
              <svg viewBox="0 0 16 16" focusable="false">
                <path d="m3.5 8.5 3 3 6-7" />
              </svg>
            </span>
            <p className="vt-titulo">{V.listo.titulo}</p>
            <p className="vt-dia">{V.listo.detalle}</p>
          </div>
        </div>
        <span className="vt-dedo" />
        <p className="vt-aviso">{V.listo.aviso}</p>
      </div>
    </div>
  );
}
