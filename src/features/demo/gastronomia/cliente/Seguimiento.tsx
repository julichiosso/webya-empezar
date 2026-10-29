'use client';

import { useEffect, useRef } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { Encaje } from '@/components/ui/Encaje';
import { formatearPesos } from '@/domain/pedidos/dinero';
import { ETIQUETA_ESTADO, PASOS_SEGUIMIENTO } from '@/domain/pedidos/estados';
import type { Pedido } from '@/domain/pedidos/types';

/** Qué le decimos al cliente en cada estado (depende de cómo lo recibe). */
export function mensajeCliente(p: Pick<Pedido, 'estado' | 'modalidad'>): string {
  switch (p.estado) {
    case 'recibido':
      return 'El local recibió tu pedido.';
    case 'en_preparacion':
      return 'Lo están preparando.';
    case 'listo':
      return p.modalidad === 'mesa'
        ? 'Está listo: ya te lo llevan a la mesa.'
        : p.modalidad === 'retiro'
          ? 'Está listo: pasá a buscarlo.'
          : 'Está listo: sale para tu casa.';
    case 'entregado':
      return '¡Que lo disfrutes!';
    case 'cancelado':
      return 'El local canceló el pedido.';
  }
}

interface SeguimientoProps {
  pedido: Pedido;
  onOtroPedido: () => void;
}

/**
 * Seguimiento en vivo: cada paso es una pieza que encaja cuando el local avanza el pedido. El
 * mensaje vive en una región aria-live, así el cambio de estado se anuncia solo.
 */
export function Seguimiento({ pedido, onOtroPedido }: SeguimientoProps) {
  const titulo = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titulo.current?.focus();
  }, [pedido.id]);

  const actual = PASOS_SEGUIMIENTO.indexOf(pedido.estado);
  const detalle =
    pedido.modalidad === 'mesa'
      ? `Mesa ${pedido.mesa}`
      : pedido.modalidad === 'delivery'
        ? `Delivery a ${pedido.direccion}`
        : 'Para retirar';

  return (
    <section aria-labelledby="seguimiento-titulo" className="flex flex-col gap-6 px-4 pt-6 pb-8">
      <div>
        <p className="tabular text-small text-paper-muted">
          {detalle} · {pedido.cliente.nombre}
        </p>
        <h3
          id="seguimiento-titulo"
          ref={titulo}
          tabIndex={-1}
          className="tabular mt-1 text-title font-semibold outline-none"
        >
          Pedido #{pedido.numero}
        </h3>
        <p aria-live="polite" className="mt-2 text-lead font-medium">
          {mensajeCliente(pedido)}
        </p>
      </div>

      {pedido.estado !== 'cancelado' && (
        <ol className="flex flex-col gap-4">
          {PASOS_SEGUIMIENTO.map((estado, i) => (
            <li
              key={estado}
              aria-current={i === actual ? 'step' : undefined}
              className={`flex items-center gap-4 ${i <= actual ? 'font-semibold' : 'text-paper-muted'}`}
            >
              <Encaje on={i <= actual} />
              {ETIQUETA_ESTADO[estado].cliente}
              <span className="sr-only">
                {i < actual ? ' (hecho)' : i === actual ? ' (ahora)' : ''}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className="rounded-card bg-paper-2 p-4">
        <ul className="flex flex-col gap-1">
          {pedido.items.map((item, i) => (
            <li key={`${item.productoId}-${i}`}>
              <span className="tabular">{item.cantidad} ×</span> {item.nombre}
              {item.modificadores.length > 0 && (
                <span className="block text-small text-paper-muted">
                  {item.modificadores.map((m) => m.nombre).join(' · ')}
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="tabular mt-2 flex justify-between border-t border-paper-line pt-2 font-semibold">
          <span>Total</span>
          <span>{formatearPesos(pedido.totales.total)}</span>
        </p>
      </div>

      <p className="text-small text-paper-muted">
        Es una demo: este pedido no llega a ninguna cocina. Lo recibe el panel del dueño:{' '}
        <span className="lg:hidden">tocá “Ver como dueño” abajo para avanzarlo.</span>
        <span className="max-lg:hidden">avanzalo desde el panel de al lado.</span>
      </p>

      <button type="button" onClick={onOtroPedido} className={buttonClasses('primary', true)}>
        Hacer otro pedido
      </button>
    </section>
  );
}
