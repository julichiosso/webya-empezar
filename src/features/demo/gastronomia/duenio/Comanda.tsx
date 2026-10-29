'use client';

import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { buttonClasses } from '@/components/ui/Button';
import { COMANDA } from '@/content/demos/gastronomia/ui/panel';
import type { Pedido } from '@/domain/pedidos/types';
import { detalleModalidad } from './calculos';

const HORA = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' });

/**
 * Comanda para la cocina (sin precios: la cocina no los necesita), en papel crema con la muesca
 * de encastre. "Imprimir" usa la impresión del navegador; el CSS de impresión deja solo el ticket.
 */
export function Comanda({ pedido, nombreLocal }: { pedido: Pedido; nombreLocal: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="comanda-imprimible encastre rounded-card bg-paper-2 p-4 pt-6 text-paper-fg">
        <p className="text-center text-small text-paper-muted">{nombreLocal}</p>
        <p className="tabular mt-1 text-center text-title font-semibold">#{pedido.numero}</p>
        <p className="tabular text-center text-small text-paper-muted">
          {HORA.format(new Date(pedido.creadoEn))} · {detalleModalidad(pedido)} ·{' '}
          {pedido.cliente.nombre}
        </p>
        {pedido.modalidad === 'delivery' && pedido.direccion && (
          <p className="mt-1 text-center text-small">{pedido.direccion}</p>
        )}
        <ul className="mt-4 flex flex-col gap-2 border-t border-dashed border-line-strong pt-4">
          {pedido.items.map((item, i) => (
            <li key={`${item.productoId}-${i}`}>
              <span className="tabular font-semibold">{item.cantidad}×</span> {item.nombre}
              {item.modificadores.length > 0 && (
                <span className="block pl-6 text-small">
                  {item.modificadores.map((m) => m.nombre).join(' · ')}
                </span>
              )}
              {item.nota && <span className="block pl-6 text-small italic">“{item.nota}”</span>}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-dashed border-line-strong pt-2 text-center text-small text-paper-muted">
          {COMANDA.pie}
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className={buttonClasses('primary', true)}
      >
        <Icon name="impresora" size={20} />
        {COMANDA.imprimir}
      </button>
    </div>
  );
}
