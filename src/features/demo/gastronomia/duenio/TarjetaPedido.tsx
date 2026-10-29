'use client';

import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { buttonClasses } from '@/components/ui/Button';
import { TARJETA_PEDIDO } from '@/content/demos/gastronomia/ui/panel';
import { formatearPesos } from '@/domain/pedidos/dinero';
import { ETIQUETA_ESTADO, puedeTransicionar } from '@/domain/pedidos/estados';
import type { Pedido } from '@/domain/pedidos/types';
import { avanzarPedido, cancelarPedido } from '../store';
import { detalleModalidad, minutosTotales, transcurrido } from './calculos';

interface TarjetaPedidoProps {
  pedido: Pedido;
  ahora: number;
  onComanda: (pedido: Pedido) => void;
}

/** Ítems que se listan; el resto se resume ("y 2 más") para que la tarjeta no crezca sin fin. */
const ITEMS_VISIBLES = 3;

/**
 * Un pedido en el tablero del dueño. Entra "encajando" (`.pedido-entra`, una vez al aparecer en su
 * columna) y se avanza con un solo botón que dice qué pasa ("Empezar a preparar").
 */
export function TarjetaPedido({ pedido, ahora, onComanda }: TarjetaPedidoProps) {
  const { accion } = ETIQUETA_ESTADO[pedido.estado];
  const idTitulo = `pedido-${pedido.id}`;
  const terminado = accion === null;
  const extra = pedido.items.length - ITEMS_VISIBLES;

  return (
    <article
      aria-labelledby={idTitulo}
      data-estado={pedido.estado}
      className={`pedido-entra flex flex-col gap-2 rounded-card border bg-surface p-4 ${
        pedido.estado === 'recibido' ? 'border-accent' : 'border-line'
      }`}
    >
      <header className="flex items-baseline justify-between gap-2">
        <h4 id={idTitulo} className="tabular text-heading font-semibold">
          #{pedido.numero}
        </h4>
        {terminado ? (
          <span className="text-small text-muted">
            {ETIQUETA_ESTADO[pedido.estado].duenio}
            {pedido.estado === 'entregado' && (
              <span className="tabular">{TARJETA_PEDIDO.entregadoEn(minutosTotales(pedido))}</span>
            )}
          </span>
        ) : (
          <span className="tabular flex items-center gap-1 text-small text-muted">
            <Icon name="reloj" size={16} />
            <span>
              <span className="sr-only">{TARJETA_PEDIDO.hace}</span>
              {transcurrido(pedido.creadoEn, ahora)}
            </span>
          </span>
        )}
      </header>
      <p className="text-small text-muted">
        {detalleModalidad(pedido)} · {pedido.cliente.nombre}
      </p>

      <ul className="flex flex-col gap-1 text-small">
        {pedido.items.slice(0, ITEMS_VISIBLES).map((item, i) => (
          <li key={`${item.productoId}-${i}`}>
            <span className="tabular font-semibold">{item.cantidad}×</span> {item.nombre}
            {item.modificadores.length > 0 && (
              <span className="block text-muted">
                {item.modificadores.map((m) => m.nombre).join(' · ')}
              </span>
            )}
          </li>
        ))}
        {extra > 0 && <li className="text-muted">{TARJETA_PEDIDO.yMas(extra)}</li>}
      </ul>

      <p className="tabular flex justify-between border-t border-line pt-2 font-semibold">
        <span>{TARJETA_PEDIDO.total}</span>
        <span>{formatearPesos(pedido.totales.total)}</span>
      </p>

      {!terminado && (
        <button
          type="button"
          onClick={() => avanzarPedido(pedido.id)}
          className={buttonClasses('primary', true, 'compacto')}
          aria-label={TARJETA_PEDIDO.ariaAccion(accion, pedido.numero)}
        >
          {accion}
        </button>
      )}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onComanda(pedido)}
          aria-label={TARJETA_PEDIDO.ariaComanda(pedido.numero)}
          className="-ml-2 flex min-h-tap items-center gap-2 rounded-control px-2 text-small text-muted hover:text-fg"
        >
          <Icon name="impresora" size={18} />
          {TARJETA_PEDIDO.comanda}
        </button>
        {puedeTransicionar(pedido.estado, 'cancelado') && (
          <button
            type="button"
            onClick={() => cancelarPedido(pedido.id)}
            aria-label={TARJETA_PEDIDO.ariaCancelar(pedido.numero)}
            className="-mr-2 min-h-tap rounded-control px-2 text-small text-muted hover:text-fg"
          >
            {TARJETA_PEDIDO.cancelar}
          </button>
        )}
      </div>
    </article>
  );
}
