import { VIDRIERA_TURNO as V } from '@/content/demos/turnos/vidriera';

/**
 * El turno con seña en tres pasos (elegís el horario, pagás la seña con Mercado Pago, queda confirmado y
 * al dueño le llega el aviso), con los datos de la demo de turnos. Va en el globo de la peluquería del
 * mapa del hero. Con movimiento, los pasos se suceden en bucle; sin movimiento, queda el turno confirmado.
 * Las medidas van en unidades del contenedor (pueblo.css): escala con el globo.
 */
export function TurnoAnimado() {
  return (
    <div className="vt">
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
  );
}
