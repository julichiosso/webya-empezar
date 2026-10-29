'use client';

import { useRef, useState } from 'react';
import { Hoja } from '@/components/ui/Hoja';
import { getCocina } from '@/config/demos/gastronomia';
import { formatearPesos } from '@/domain/pedidos/dinero';
import type { Producto } from '@/domain/pedidos/types';
import { cantidadTotal, totalesCarrito } from '../carrito';
import { agregarAlCarrito, cerrarSeguimiento, useDemo } from '../store';
import { CarritoHoja } from './CarritoHoja';
import { Carta } from './Carta';
import { PlatoDetalle } from './PlatoDetalle';
import { Seguimiento } from './Seguimiento';

/**
 * La cara del cliente: la carta dentro de un celular (en escritorio) o a pantalla completa (en
 * celular). Las hojas (plato y pedido) se abren dentro de ese marco y dejan inerte lo de atrás.
 */
export function DemoCliente() {
  const { cocinaId, nombreLocal, carrito, pedidos, seguimientoId } = useDemo();
  const cocina = getCocina(cocinaId);
  const nombre = nombreLocal ?? cocina.nombreLocalPorDefecto;

  const pantalla = useRef<HTMLDivElement>(null);
  const [plato, setPlato] = useState<Producto | null>(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [paso, setPaso] = useState<'resumen' | 'datos'>('resumen');

  const enSeguimiento = pedidos.find((p) => p.id === seguimientoId) ?? null;
  const cantidad = cantidadTotal(carrito);
  const { subtotal } = totalesCarrito(cocina.menu, carrito, {
    propinaPorcentaje: 0,
    modalidad: 'mesa',
    costoEnvio: 0,
  });

  const abrirCarrito = () => {
    setPaso('resumen');
    setCarritoAbierto(true);
  };

  return (
    // Marco del celular (solo escritorio) por fuera del papel: así el borde no toma los tokens claros.
    <div className="lg:h-[46rem] lg:rounded-[2.5rem] lg:border-8 lg:border-surface-2 lg:shadow-raised">
      <div
        data-testid="demo-cliente"
        className="papel relative bg-paper text-paper-fg lg:h-full lg:overflow-hidden lg:rounded-[2rem]"
      >
        <div ref={pantalla} className="lg:h-full lg:overflow-y-auto lg:overscroll-contain">
          {enSeguimiento ? (
            <Seguimiento pedido={enSeguimiento} onOtroPedido={cerrarSeguimiento} />
          ) : (
            <>
              <Carta
                cocina={cocina}
                nombreLocal={nombre}
                scroller={pantalla}
                onAbrirPlato={setPlato}
              />
              {cantidad > 0 && (
                // Barra del pedido: fija abajo del celular (o de la pantalla en mobile).
                <div className="sticky bottom-0 z-10 px-4 pb-4">
                  <button
                    type="button"
                    onClick={abrirCarrito}
                    className="flex min-h-tap w-full items-center justify-between gap-4 rounded-control bg-accent px-4 py-3 font-semibold text-accent-fg shadow-raised active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="tabular flex size-7 items-center justify-center rounded-full bg-accent-fg text-small text-accent">
                        {cantidad}
                      </span>
                      Ver mi pedido
                    </span>
                    <span className="tabular">{formatearPesos(subtotal)}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <Hoja
          abierta={plato !== null}
          onCerrar={() => setPlato(null)}
          titulo={plato?.nombre ?? ''}
          fondo={pantalla}
        >
          {plato && (
            <PlatoDetalle
              key={plato.id}
              producto={plato}
              onAgregar={(linea) => {
                agregarAlCarrito(linea);
                setPlato(null);
              }}
            />
          )}
        </Hoja>

        <Hoja
          abierta={carritoAbierto}
          onCerrar={() => setCarritoAbierto(false)}
          titulo={paso === 'resumen' ? 'Tu pedido' : '¿Cómo lo querés?'}
          fondo={pantalla}
        >
          <CarritoHoja
            cocina={cocina}
            carrito={carrito}
            paso={paso}
            onPaso={setPaso}
            onConfirmado={() => setCarritoAbierto(false)}
          />
        </Hoja>
      </div>
    </div>
  );
}
