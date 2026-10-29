// eslint-disable-next-line no-restricted-imports -- deuda registrada en tests/arquitectura/excepciones.ts
import type { ModuloId } from '@/content/modulos';

interface ModuloArteProps {
  id: ModuloId;
  /** Encendido: los acentos pasan al color de acento. Apagado: todo en gris de línea. */
  activo: boolean;
  className?: string;
}

/**
 * Dibujo (sin texto) de lo que aporta cada módulo a la mini web del negocio: una agenda, unos
 * productos, una carta con QR… SVG propio, decorativo (aria-hidden). Los cambios de estado se
 * animan afuera, con la clase `.arte` (solo opacity + transform).
 */
export function ModuloArte({ id, activo, className }: ModuloArteProps) {
  const base = 'fill-line-strong';
  const acento = activo ? 'fill-accent' : 'fill-line-strong';
  const suave = activo ? 'fill-accent-soft' : 'fill-line';
  const borde = activo ? 'stroke-accent' : 'stroke-line-strong';

  return (
    <svg
      viewBox="0 0 160 64"
      aria-hidden="true"
      focusable="false"
      className={`arte h-auto w-full ${className ?? ''}`.trim()}
    >
      {id === 'turnos' && (
        <>
          {Array.from({ length: 21 }, (_, i) => {
            const marcado = i === 4 || i === 9 || i === 16;
            return (
              <rect
                key={i}
                x={4 + (i % 7) * 22}
                y={4 + Math.floor(i / 7) * 20}
                width="18"
                height="16"
                rx="4"
                className={marcado ? acento : suave}
              />
            );
          })}
        </>
      )}

      {id === 'catalogo' && (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${4 + i * 52} 4)`}>
              <rect width="48" height="34" rx="6" className={i === 1 ? suave : base} />
              <rect y="42" width="36" height="6" rx="3" className={base} />
              <rect y="52" width="20" height="6" rx="3" className={i === 1 ? acento : base} />
            </g>
          ))}
        </>
      )}

      {id === 'carta_qr' && (
        <>
          {[
            [4, 4],
            [34, 4],
            [4, 34],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <rect width="26" height="26" rx="5" fill="none" strokeWidth="3" className={borde} />
              <rect x="8" y="8" width="10" height="10" rx="2" className={acento} />
            </g>
          ))}
          {[
            [36, 38],
            [48, 38],
            [42, 50],
            [54, 50],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="2" className={base} />
          ))}
          <rect x="76" y="8" width="64" height="8" rx="4" className={base} />
          <rect x="76" y="24" width="48" height="6" rx="3" className={suave} />
          <rect x="76" y="38" width="56" height="6" rx="3" className={suave} />
          <rect x="76" y="52" width="36" height="6" rx="3" className={suave} />
        </>
      )}

      {id === 'pagos' && (
        <>
          <rect x="4" y="6" width="90" height="52" rx="8" className={suave} />
          <rect x="14" y="16" width="30" height="8" rx="2" className={acento} />
          <rect x="14" y="34" width="70" height="6" rx="3" className={base} />
          <rect x="14" y="46" width="44" height="6" rx="3" className={base} />
          <rect x="104" y="18" width="52" height="28" rx="14" className={acento} />
        </>
      )}

      {id === 'formularios' && (
        <>
          <rect x="4" y="4" width="100" height="14" rx="5" className={suave} />
          <rect x="4" y="24" width="100" height="14" rx="5" className={suave} />
          <rect x="4" y="44" width="62" height="14" rx="7" className={acento} />
          <rect x="116" y="4" width="40" height="54" rx="6" className={base} />
        </>
      )}

      {id === 'clientes' && (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(4 ${4 + i * 20})`}>
              <circle cx="8" cy="8" r="8" className={i === 0 ? acento : base} />
              <rect x="24" y="2" width="80" height="6" rx="3" className={base} />
              <rect x="24" y="11" width="52" height="5" rx="2.5" className={suave} />
              <rect x="120" y="3" width="36" height="10" rx="5" className={suave} />
            </g>
          ))}
        </>
      )}

      {id === 'pedidos' && (
        // Tres comandas en fila (nuevo → preparando → listo): la primera, encendida.
        <>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                x={4 + i * 52}
                y="4"
                width="48"
                height="56"
                rx="6"
                className={i === 0 ? suave : 'fill-line'}
              />
              <rect
                x={10 + i * 52}
                y="12"
                width="20"
                height="6"
                rx="3"
                className={i === 0 ? acento : base}
              />
              <rect x={10 + i * 52} y="26" width="36" height="4" rx="2" className={base} />
              <rect x={10 + i * 52} y="34" width="28" height="4" rx="2" className={base} />
              <rect
                x={10 + i * 52}
                y="46"
                width="36"
                height="8"
                rx="4"
                className={i === 0 ? acento : base}
              />
            </g>
          ))}
        </>
      )}
      {id === 'notificaciones' && (
        <>
          <rect x="4" y="6" width="120" height="22" rx="11" className={suave} />
          <circle cx="18" cy="17" r="6" className={acento} />
          <rect x="32" y="12" width="76" height="6" rx="3" className={base} />
          <rect x="32" y="21" width="48" height="4" rx="2" className={base} />
          <rect x="36" y="36" width="120" height="22" rx="11" className={suave} />
          <circle cx="50" cy="47" r="6" className={base} />
          <rect x="64" y="42" width="76" height="6" rx="3" className={base} />
          <rect x="64" y="51" width="48" height="4" rx="2" className={base} />
        </>
      )}
    </svg>
  );
}
