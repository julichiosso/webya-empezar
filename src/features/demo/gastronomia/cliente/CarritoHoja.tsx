'use client';

import { useState, type ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import type { IconName } from '@/brand/ilustracion/iconos/paths';
import { buttonClasses } from '@/components/ui/Button';
import type { CocinaDemo } from '@/content/demos/gastronomia';
import { CARRITO } from '@/content/demos/gastronomia/ui/carrito';
import { formatearPesos, sumar } from '@/domain/pedidos/dinero';
import { LIMITES_PEDIDO } from '@/domain/pedidos/schemas';
import { PROPINAS } from '@/domain/pedidos/totales';
import type { MedioPago, Modalidad } from '@/domain/pedidos/types';
import { CANTIDAD_MAXIMA, resolverCarrito, totalesCarrito, type Carrito } from '../carrito';
import { cambiarCantidadCarrito, confirmarPedido } from '../store';
import { Cantidad } from './Cantidad';

interface CarritoHojaProps {
  cocina: CocinaDemo;
  carrito: Carrito;
  paso: 'resumen' | 'datos';
  onPaso: (paso: 'resumen' | 'datos') => void;
  onConfirmado: () => void;
}

const MODALIDADES: { id: Modalidad; nombre: string; icono: IconName }[] = [
  { id: 'mesa', nombre: CARRITO.modalidad.opciones.mesa, icono: 'mesa' },
  { id: 'retiro', nombre: CARRITO.modalidad.opciones.retiro, icono: 'bolsa' },
  { id: 'delivery', nombre: CARRITO.modalidad.opciones.delivery, icono: 'moto' },
];

const MEDIOS: { id: MedioPago; nombre: string; detalle: string; icono: IconName }[] = [
  { id: 'efectivo', ...CARRITO.pago.medios.efectivo, icono: 'billete' },
  { id: 'mercado_pago', ...CARRITO.pago.medios.mercado_pago, icono: 'pagos' },
];

const campo =
  'mt-2 w-full rounded-control border border-paper-line bg-paper-2 px-4 py-3 text-body text-paper-fg placeholder:text-paper-muted';

/**
 * Carrito en dos pasos dentro de la Hoja: resumen (cantidades y propina) y datos (cómo lo recibe,
 * nombre y medio de pago). Confirmar pasa por la misma validación que un pedido real.
 */
export function CarritoHoja({ cocina, carrito, paso, onPaso, onConfirmado }: CarritoHojaProps) {
  const [propina, setPropina] = useState<number>(0);
  const [modalidad, setModalidad] = useState<Modalidad>('mesa');
  // La demo arranca como si hubieras escaneado el QR de la mesa 4.
  const [mesa, setMesa] = useState('4');
  const [direccion, setDireccion] = useState('');
  const [nombre, setNombre] = useState('');
  const [medioPago, setMedioPago] = useState<MedioPago>('efectivo');
  const [errores, setErrores] = useState<string[]>([]);

  const lineas = resolverCarrito(cocina.menu, carrito);
  const totales = totalesCarrito(cocina.menu, carrito, {
    propinaPorcentaje: propina,
    modalidad,
    costoEnvio: cocina.costoEnvio,
  });

  const confirmar = () => {
    const r = confirmarPedido({
      modalidad,
      mesa: modalidad === 'mesa' ? mesa : undefined,
      direccion: modalidad === 'delivery' ? direccion : undefined,
      cliente: { nombre },
      medioPago,
      propinaPorcentaje: propina,
    });
    if (r.ok) onConfirmado();
    else setErrores(r.errores);
  };

  if (paso === 'resumen' && lineas.length === 0) {
    // Estado vacío del concepto Encastre: un hueco punteado esperando la primera pieza.
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span
          aria-hidden="true"
          className="size-20 rounded-full border-2 border-dashed border-line-strong"
        />
        <p className="font-semibold">{CARRITO.vacio.titulo}</p>
        <p className="text-paper-muted">{CARRITO.vacio.bajada}</p>
      </div>
    );
  }

  if (paso === 'resumen') {
    return (
      <div className="flex flex-col gap-6">
        <ul>
          {lineas.map(({ clave, item, subtotal }) => (
            <li key={clave} className="flex flex-col gap-2 border-b border-paper-line py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">{item.nombre}</p>
                  {item.modificadores.length > 0 && (
                    <p className="text-small text-paper-muted">
                      {item.modificadores.map((m) => m.nombre).join(' · ')}
                    </p>
                  )}
                  {item.nota && <p className="text-small text-paper-muted">“{item.nota}”</p>}
                </div>
                <p className="tabular font-semibold">{formatearPesos(subtotal)}</p>
              </div>
              <Cantidad
                valor={item.cantidad}
                onCambiar={(n) => cambiarCantidadCarrito(clave, n)}
                min={0}
                max={CANTIDAD_MAXIMA}
                de={item.nombre}
              />
            </li>
          ))}
        </ul>

        <fieldset>
          <legend className="font-semibold">{CARRITO.propina.titulo}</legend>
          <div className="mt-2 flex gap-2">
            {PROPINAS.map((p) => (
              <label key={p} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="propina"
                  checked={propina === p}
                  onChange={() => setPropina(p)}
                  className="peer sr-only"
                />
                <span className="tabular flex min-h-tap items-center justify-center rounded-control border border-paper-line bg-paper-2 font-medium peer-checked:border-accent-ink peer-checked:bg-accent peer-checked:text-accent-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink">
                  {p === 0 ? CARRITO.propina.sin : CARRITO.propina.porcentaje(p)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Todavía no se eligió cómo lo recibe: el envío se suma en el paso siguiente. */}
        <Totales
          filas={[
            [CARRITO.filas.subtotal, totales.subtotal],
            [CARRITO.filas.propina, totales.propina],
          ]}
          total={sumar(totales.subtotal, totales.propina)}
        />

        <div className="sticky bottom-0 -mx-4 -mb-4 border-t border-paper-line bg-paper px-4 py-4">
          <button
            type="button"
            onClick={() => onPaso('datos')}
            disabled={lineas.length === 0}
            className={buttonClasses('primary', true)}
          >
            {CARRITO.seguir}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        confirmar();
      }}
      className="flex flex-col gap-6"
    >
      <fieldset>
        <legend className="font-semibold">{CARRITO.modalidad.titulo}</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {MODALIDADES.map((m) => (
            <Opcion
              key={m.id}
              name="modalidad"
              checked={modalidad === m.id}
              onChange={() => setModalidad(m.id)}
            >
              <Icon name={m.icono} size={24} />
              <span className="text-small font-medium">{m.nombre}</span>
            </Opcion>
          ))}
        </div>
      </fieldset>

      {modalidad === 'mesa' && (
        <label className="block">
          <span className="font-semibold">{CARRITO.mesa}</span>
          <input
            value={mesa}
            onChange={(e) => setMesa(e.target.value.slice(0, LIMITES_PEDIDO.mesa))}
            inputMode="numeric"
            className={campo}
          />
        </label>
      )}
      {modalidad === 'delivery' && (
        <label className="block">
          <span className="font-semibold">{CARRITO.direccion.titulo}</span>
          <input
            value={direccion}
            onChange={(e) => setDireccion(e.target.value.slice(0, LIMITES_PEDIDO.direccion))}
            autoComplete="street-address"
            placeholder={CARRITO.direccion.placeholder}
            className={campo}
          />
        </label>
      )}

      <label className="block">
        <span className="font-semibold">{CARRITO.nombre.titulo}</span>
        <span className="block text-small text-paper-muted">{CARRITO.nombre.ayuda}</span>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value.slice(0, LIMITES_PEDIDO.nombre))}
          autoComplete="given-name"
          className={campo}
        />
      </label>

      <fieldset>
        <legend className="font-semibold">{CARRITO.pago.titulo}</legend>
        <div className="mt-2 flex flex-col gap-2">
          {MEDIOS.map((m) => (
            <Opcion
              key={m.id}
              name="medio"
              checked={medioPago === m.id}
              onChange={() => setMedioPago(m.id)}
              horizontal
            >
              <Icon name={m.icono} size={24} />
              <span>
                <span className="block font-medium">{m.nombre}</span>
                <span className="block text-small text-paper-muted">{m.detalle}</span>
              </span>
            </Opcion>
          ))}
        </div>
      </fieldset>

      <Totales
        filas={[
          [CARRITO.filas.subtotal, totales.subtotal],
          [CARRITO.filas.propina, totales.propina],
          ...(modalidad === 'delivery' ? ([[CARRITO.filas.envio, totales.envio]] as const) : []),
        ]}
        total={totales.total}
      />

      <div aria-live="assertive">
        {errores.length > 0 && (
          <ul className="flex flex-col gap-1 text-small font-semibold text-accent-ink">
            {errores.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="sticky bottom-0 -mx-4 -mb-4 flex gap-2 border-t border-paper-line bg-paper px-4 py-4">
        <button
          type="button"
          onClick={() => onPaso('resumen')}
          className="min-h-tap rounded-control px-4 font-semibold text-paper-fg"
        >
          {CARRITO.volver}
        </button>
        <button type="submit" className={`${buttonClasses()} flex-1`}>
          {CARRITO.confirmar} <span className="tabular">{formatearPesos(totales.total)}</span>
        </button>
      </div>
    </form>
  );
}

function Opcion({
  name,
  checked,
  onChange,
  horizontal = false,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  horizontal?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`flex min-h-tap rounded-control border border-paper-line bg-paper-2 p-2 peer-checked:border-accent-ink peer-checked:shadow-[inset_0_0_0_1px_var(--accent-ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink ${
          horizontal
            ? 'items-center gap-4 px-4'
            : 'flex-col items-center justify-center gap-1 text-center'
        }`}
      >
        {children}
      </span>
    </label>
  );
}

/** Filas de detalle y el total ya calculado por el dominio (acá no se suma nada). */
function Totales({
  filas,
  total,
}: {
  filas: readonly (readonly [string, number])[];
  total: number;
}) {
  return (
    <dl className="tabular flex flex-col gap-1">
      {filas.map(([k, v]) => (
        <div key={k} className="flex justify-between text-paper-muted">
          <dt>{k}</dt>
          <dd>{formatearPesos(v)}</dd>
        </div>
      ))}
      <div className="flex justify-between text-heading font-semibold">
        <dt>{CARRITO.filas.total}</dt>
        <dd>{formatearPesos(total)}</dd>
      </div>
    </dl>
  );
}
