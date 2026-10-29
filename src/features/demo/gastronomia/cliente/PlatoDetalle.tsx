'use client';

import { useRef, useState } from 'react';
import { Ilustracion } from '@/components/ilustraciones/Ilustracion';
import { buttonClasses } from '@/components/ui/Button';
import { esIlustracion } from '@/config/demos/ilustraciones';
import { formatearPesos, multiplicar, sumar } from '@/domain/pedidos/dinero';
import { LIMITES_PEDIDO, type LineaEntrada } from '@/domain/pedidos/schemas';
import type { GrupoModificador, Producto } from '@/domain/pedidos/types';
import { CANTIDAD_MAXIMA } from '../carrito';
import { Cantidad } from './Cantidad';

interface PlatoDetalleProps {
  producto: Producto;
  onAgregar: (linea: LineaEntrada) => void;
}

/** Opciones elegidas por grupo (ids). En grupos `unico` hay a lo sumo una. */
type Eleccion = Record<string, string[]>;

const masPrecio = (centavos: number) =>
  centavos > 0 ? `+ ${formatearPesos(centavos)}` : 'Sin cargo';

/**
 * Detalle de un plato: modificadores, nota y cantidad. Va adentro de la Hoja. Valida lo mismo que
 * el servidor (grupos obligatorios); si falta algo, lo dice al lado del grupo y lleva el foco ahí.
 */
export function PlatoDetalle({ producto, onAgregar }: PlatoDetalleProps) {
  const [eleccion, setEleccion] = useState<Eleccion>({});
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState('');
  const [faltan, setFaltan] = useState<string[]>([]);
  const grupos = useRef<Record<string, HTMLFieldSetElement | null>>({});

  const elegir = (g: GrupoModificador, opcionId: string, marcado: boolean) => {
    setEleccion((prev) => {
      const actuales = prev[g.id] ?? [];
      const siguiente =
        g.tipo === 'unico'
          ? opcionId
            ? [opcionId]
            : []
          : marcado
            ? [...actuales, opcionId]
            : actuales.filter((o) => o !== opcionId);
      return { ...prev, [g.id]: siguiente };
    });
    setFaltan((f) => f.filter((id) => id !== g.id));
  };

  const extras = producto.modificadores.flatMap((g) =>
    (eleccion[g.id] ?? []).map((id) => g.opciones.find((o) => o.id === id)?.precio ?? 0),
  );
  const unitario = sumar(producto.precio, ...extras);
  const total = multiplicar(unitario, cantidad);

  const agregarAlPedido = () => {
    const sinElegir = producto.modificadores
      .filter((g) => g.obligatorio && (eleccion[g.id] ?? []).length === 0)
      .map((g) => g.id);
    if (sinElegir.length > 0) {
      setFaltan(sinElegir);
      grupos.current[sinElegir[0]!]?.querySelector('input')?.focus();
      return;
    }
    onAgregar({
      productoId: producto.id,
      cantidad,
      modificadores: Object.entries(eleccion).flatMap(([grupoId, ids]) =>
        ids.map((opcionId) => ({ grupoId, opcionId })),
      ),
      nota: nota.trim() || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <span className="flex size-24 shrink-0 items-center justify-center rounded-card bg-paper-2 text-paper-fg">
          {esIlustracion(producto.ilustracion) && (
            <Ilustracion id={producto.ilustracion} size={80} />
          )}
        </span>
        <div>
          <p className="text-paper-muted">{producto.descripcion}</p>
          <p className="tabular mt-2 font-semibold">{formatearPesos(producto.precio)}</p>
        </div>
      </div>

      {producto.modificadores.map((g) => {
        const falta = faltan.includes(g.id);
        const idError = `${producto.id}-${g.id}-error`;
        const opciones =
          g.tipo === 'unico' && !g.obligatorio
            ? [{ id: '', nombre: 'Ninguno', precio: 0 }, ...g.opciones]
            : g.opciones;
        return (
          <fieldset
            key={g.id}
            ref={(el) => {
              grupos.current[g.id] = el;
            }}
            aria-describedby={falta ? idError : undefined}
          >
            <legend className="flex w-full items-center justify-between gap-4 font-semibold">
              {g.nombre}
              <span className="text-small font-normal text-paper-muted">
                {g.obligatorio
                  ? 'Elegí una'
                  : g.tipo === 'unico'
                    ? 'Opcional'
                    : 'Podés elegir varias'}
              </span>
            </legend>
            <div aria-live="polite">
              {falta && (
                <p id={idError} className="mt-1 text-small font-semibold text-accent-ink">
                  Falta elegir {g.nombre.toLowerCase()}.
                </p>
              )}
            </div>
            <ul className="mt-2 flex flex-col">
              {opciones.map((o) => {
                const elegidas = eleccion[g.id] ?? [];
                const marcada = o.id === '' ? elegidas.length === 0 : elegidas.includes(o.id);
                return (
                  <li key={o.id || 'ninguno'}>
                    <label className="flex min-h-tap cursor-pointer items-center gap-4 border-b border-paper-line py-2">
                      <input
                        type={g.tipo === 'unico' ? 'radio' : 'checkbox'}
                        name={`${producto.id}-${g.id}`}
                        checked={marcada}
                        onChange={(e) => elegir(g, o.id, e.target.checked)}
                        className="size-5 shrink-0 accent-accent-ink"
                      />
                      <span className="flex-1">{o.nombre}</span>
                      {o.id !== '' && (
                        <span className="tabular text-small text-paper-muted">
                          {masPrecio(o.precio)}
                        </span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}

      <label className="block">
        <span className="font-semibold">¿Algo para la cocina?</span>
        <span className="block text-small text-paper-muted">
          Opcional, hasta {LIMITES_PEDIDO.nota} letras.
        </span>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value.slice(0, LIMITES_PEDIDO.nota))}
          rows={2}
          placeholder="Por ejemplo: sin sal, bien cocido"
          className="mt-2 w-full rounded-control border border-paper-line bg-paper-2 p-4 text-body text-paper-fg placeholder:text-paper-muted"
        />
      </label>

      {/* Fija abajo de la hoja: la acción se ve siempre, aunque haya muchas opciones. */}
      <div className="sticky bottom-0 -mx-4 -mb-4 flex items-center justify-between gap-2 border-t border-paper-line bg-paper px-4 py-4">
        <Cantidad
          valor={cantidad}
          onCambiar={(n) => setCantidad(Math.min(CANTIDAD_MAXIMA, Math.max(1, n)))}
          max={CANTIDAD_MAXIMA}
          de={producto.nombre}
        />
        <button
          type="button"
          onClick={agregarAlPedido}
          className={`${buttonClasses()} min-w-0 flex-1 whitespace-nowrap`}
        >
          Agregar <span className="tabular">{formatearPesos(total)}</span>
        </button>
      </div>
    </div>
  );
}
