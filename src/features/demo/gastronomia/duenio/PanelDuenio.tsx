'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { buttonClasses } from '@/components/ui/Button';
import { Encaje } from '@/components/ui/Encaje';
import { Hoja } from '@/components/ui/Hoja';
import { getCocina } from '@/content/demos/gastronomia';
import { formatearPesos } from '@/domain/pedidos/dinero';
import { ETIQUETA_ESTADO } from '@/domain/pedidos/estados';
import type { Modalidad, Pedido } from '@/domain/pedidos/types';
import { reiniciarDemo, simularPedido, useDemo } from '../store';
import {
  COLUMNAS,
  detalleModalidad,
  esReciente,
  resumenDelDia,
  TERMINADOS_VISIBLES,
} from './calculos';
import { Comanda } from './Comanda';
import { prepararSonido, sonarPedidoNuevo } from './sonido';
import { TarjetaPedido } from './TarjetaPedido';
import { useAhora } from './useAhora';

type Filtro = 'todas' | Modalidad;
const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: 'todas', nombre: 'Todos' },
  { id: 'mesa', nombre: 'Mesa' },
  { id: 'retiro', nombre: 'Retiro' },
  { id: 'delivery', nombre: 'Delivery' },
];

/**
 * La cara del dueño: tablero de pedidos por estado. Recibe en vivo lo que se pide en la carta
 * (misma pestaña u otra) y cada avance vuelve al seguimiento del cliente. Todo lo que muestra sale
 * de los pedidos de la demo: el resumen no tiene métricas inventadas.
 */
export function PanelDuenio() {
  const { pedidos, cocinaId, nombreLocal } = useDemo();
  const nombre = nombreLocal ?? getCocina(cocinaId).nombreLocalPorDefecto;
  const raiz = useRef<HTMLElement>(null);
  const ahora = useAhora(raiz);
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [sonido, setSonido] = useState(false);
  const [comanda, setComanda] = useState<Pedido | null>(null);
  const [anuncio, setAnuncio] = useState('');

  // Anuncia (y suena, si está prendido) lo que pasó RECIÉN: no lo restaurado al recargar.
  const vistos = useRef(new Map<string, string>());
  useEffect(() => {
    const t = Date.now();
    const mensajes: string[] = [];
    let hayNuevo = false;
    for (const p of pedidos) {
      const antes = vistos.current.get(p.id);
      const ultimo = p.eventos.at(-1);
      if (antes === undefined && esReciente(p.creadoEn, t)) {
        mensajes.push(`Entró el pedido #${p.numero}: ${detalleModalidad(p)}.`);
        hayNuevo = true;
      } else if (antes !== undefined && antes !== p.estado && ultimo && esReciente(ultimo.en, t)) {
        mensajes.push(`Pedido #${p.numero}: ${ETIQUETA_ESTADO[p.estado].duenio.toLowerCase()}.`);
      }
      vistos.current.set(p.id, p.estado);
    }
    if (mensajes.length > 0) {
      // Se actualiza fuera del render para no encadenar renders dentro del efecto.
      queueMicrotask(() => setAnuncio(mensajes.join(' ')));
    }
    if (hayNuevo && sonido) sonarPedidoNuevo();
  }, [pedidos, sonido]);

  const filtrados = filtro === 'todas' ? pedidos : pedidos.filter((p) => p.modalidad === filtro);
  const resumen = resumenDelDia(pedidos);

  const alternarSonido = () => {
    if (!sonido && !prepararSonido()) return;
    setSonido(!sonido);
  };

  return (
    <section
      ref={raiz}
      aria-labelledby="panel-titulo"
      data-testid="panel-duenio"
      className="relative flex flex-col gap-6 rounded-panel border border-line bg-surface-2 p-4 lg:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-small text-muted">Panel del dueño</p>
          <h2 id="panel-titulo" className="text-heading font-semibold">
            Pedidos de {nombre}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => simularPedido()}
            className={buttonClasses('secondary', false, 'compacto')}
          >
            <Icon name="mas" size={18} />
            Simular un pedido
          </button>
          <button
            type="button"
            onClick={alternarSonido}
            aria-pressed={sonido}
            className={buttonClasses('secondary', false, 'compacto')}
          >
            {/* Nombre fijo; el estado lo dicen aria-pressed y la pieza (apagado por defecto). */}
            <Encaje on={sonido} size="sm" />
            Sonido al entrar un pedido
          </button>
        </div>
      </div>

      {/* Anuncios para lectores de pantalla: pedidos nuevos y cambios de estado. */}
      <p aria-live="polite" className="sr-only">
        {anuncio}
      </p>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Dato titulo="Pedidos" valor={String(resumen.pedidos)} />
        <Dato titulo="En curso" valor={String(resumen.enCurso)} />
        <Dato titulo="Entregados" valor={String(resumen.entregados)} />
        <Dato titulo="Ventas" valor={formatearPesos(resumen.ventas)} />
      </dl>
      <p className="-mt-4 text-small text-muted">Calculado con los pedidos de esta demo.</p>

      <fieldset>
        <legend className="sr-only">Filtrar por cómo se recibe</legend>
        <div className="flex flex-wrap gap-2">
          {FILTROS.map((f) => (
            <label key={f.id} className="cursor-pointer">
              <input
                type="radio"
                name="filtro-modalidad"
                checked={filtro === f.id}
                onChange={() => setFiltro(f.id)}
                className="peer sr-only"
              />
              <span className="flex min-h-tap items-center rounded-full border border-line px-4 text-small font-semibold text-muted peer-checked:border-fg peer-checked:text-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {f.nombre}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {pedidos.length === 0 ? (
        // Estado vacío del concepto Encastre: el hueco donde va a caer la primera pieza.
        <div className="flex flex-col items-center gap-4 rounded-card border-2 border-dashed border-line-strong px-4 py-12 text-center">
          <p className="font-semibold">Acá encaja tu primer pedido.</p>
          <p className="max-w-sm text-muted">
            Hacé uno desde la carta o tocá “Simular un pedido”. Todavía no entró nada, pero ya va a
            picar.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {COLUMNAS.map((col) => {
            let lista = filtrados.filter((p) => col.estados.includes(p.estado));
            // Columnas activas en orden de llegada (el más viejo arriba, como en la cocina);
            // terminados: los últimos N, el más reciente arriba.
            lista =
              col.id === 'terminados'
                ? lista.slice(-TERMINADOS_VISIBLES).reverse()
                : [...lista].sort((a, b) => a.numero - b.numero);
            return (
              <section
                key={col.id}
                aria-labelledby={`col-${col.id}`}
                className="flex flex-col gap-2"
              >
                <h3
                  id={`col-${col.id}`}
                  className="flex items-center justify-between font-semibold"
                >
                  {col.titulo}
                  <span className="tabular text-small font-normal text-muted">{lista.length}</span>
                </h3>
                {lista.length === 0 ? (
                  <p className="rounded-card border border-dashed border-line px-4 py-6 text-center text-small text-muted">
                    Nada por acá.
                  </p>
                ) : (
                  lista.map((p) => (
                    <TarjetaPedido key={p.id} pedido={p} ahora={ahora} onComanda={setComanda} />
                  ))
                )}
              </section>
            );
          })}
        </div>
      )}

      {pedidos.length > 0 && (
        <button
          type="button"
          onClick={reiniciarDemo}
          className="self-start rounded-control text-small text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          <span className="flex min-h-tap items-center">Borrar los pedidos de la demo</span>
        </button>
      )}

      <Hoja
        abierta={comanda !== null}
        onCerrar={() => setComanda(null)}
        titulo={comanda ? `Comanda #${comanda.numero}` : ''}
      >
        {comanda && <Comanda pedido={comanda} nombreLocal={nombre} />}
      </Hoja>
    </section>
  );
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <dt className="text-small text-muted">{titulo}</dt>
      <dd className="tabular mt-1 text-heading font-semibold">{valor}</dd>
    </div>
  );
}
