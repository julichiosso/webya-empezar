import Image from 'next/image';
import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { MOCKUPS } from '@/content/mockups';
import { Tilde } from './Iconos';

/**
 * Mini pantallas "vectoriales" hechas con HTML y CSS (nítidas en cualquier densidad, livianas y sin
 * imágenes). Todas son decorativas: la sección que las usa cuenta lo mismo en texto.
 */

const T = MOCKUPS.turnero;
const P = MOCKUPS.pedidos;

/** Marco de teléfono: borde fino, pantalla clara. Sin sombras. */
export function Telefono({
  children,
  className,
  etiqueta,
  decorativo = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Texto alternativo del conjunto; sin él (y sin decorativo=false), el teléfono es decorativo. */
  etiqueta?: string;
  /** false: el contenido (por ejemplo, una captura con su alt) se lee tal cual. */
  decorativo?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative mx-auto aspect-[9/18.5] w-full max-w-[17.5rem] rounded-[2.4rem] border border-ed-line-strong p-2',
        className,
      )}
      role={etiqueta ? 'img' : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta || !decorativo ? undefined : true}
    >
      <div className="tono-claro relative h-full overflow-hidden rounded-[1.9rem] border border-ed-line">
        <div className="absolute top-2 left-1/2 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-ed-line" />
        {children}
      </div>
    </div>
  );
}

function BarraApp({ titulo, extra }: { titulo: string; extra?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ed-line px-4 pt-7 pb-3 text-[0.8125rem] font-semibold">
      <span>{titulo}</span>
      {extra ? <span className="font-normal text-ed-muted">{extra}</span> : null}
    </div>
  );
}

/* ---------------- Turnero: cinco escenas ---------------- */

function EscenaProblema() {
  return (
    <>
      <BarraApp titulo={T.app} extra={T.dia} />
      <ul className="space-y-2 p-4 text-[0.75rem]">
        {T.horarios.map((h) => {
          const perdido = h === T.hora;
          return (
            <li
              key={h}
              className={cn(
                'flex items-center justify-between rounded-lg border px-3 py-2.5',
                perdido ? 'border-dashed border-ed-fg' : 'border-ed-line',
              )}
            >
              <span className="tabular-nums">{h}</span>
              {perdido ? (
                <span className="flex flex-col items-end leading-tight">
                  <span className="font-semibold line-through">{T.reservado}</span>
                  <span className="text-ed-muted">
                    {T.noVino} · {T.sinAviso}
                  </span>
                </span>
              ) : (
                <span className="text-ed-muted">{h === '09:30' ? T.libre : T.reservado}</span>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

function EscenaSena() {
  return (
    <>
      <BarraApp titulo={T.app} />
      <div className="space-y-4 p-4 text-[0.75rem]">
        <div className="rounded-xl border border-ed-line p-3.5">
          <p className="text-[0.875rem] font-semibold">{T.servicio}</p>
          <p className="mt-1 text-ed-muted">{T.profesional}</p>
          <p className="mt-3 flex justify-between border-t border-ed-line pt-3 tabular-nums">
            <span>{T.dia}</span>
            <span className="font-semibold">{T.hora}</span>
          </p>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-ed-surface px-3.5 py-3">
          <span className="font-semibold">{T.sena}</span>
          <span className="h-2 w-16 overflow-hidden rounded-full bg-ed-line">
            <span className="block h-full w-1/2 bg-ed-fg" />
          </span>
        </div>
        <div className="rounded-full bg-ed-fg px-3 py-3 text-center text-[0.75rem] font-semibold text-ed-bg">
          {T.pagar}
        </div>
        <p className="e-aparece-tarde flex items-center justify-center gap-1.5 font-semibold">
          <Tilde />
          {T.asegurado}
        </p>
      </div>
    </>
  );
}

/** Captura real: la reserva confirmada y la notificación push que le llega al dueño. */
function EscenaAviso() {
  return (
    <Image
      src={T.aviso.src}
      alt={T.aviso.alt}
      width={T.aviso.ancho}
      height={T.aviso.alto}
      sizes="(min-width: 1024px) 17rem, 12.5rem"
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
  );
}

function EscenaBot() {
  return (
    <>
      <BarraApp titulo={T.chat.nombre} />
      <ul className="space-y-2.5 p-4 text-[0.75rem]">
        {T.chat.mensajes.map((m, i) => (
          <li
            key={m.texto}
            className={cn(
              'e-burbuja max-w-[85%] rounded-2xl px-3 py-2 leading-snug',
              m.de === 'bot'
                ? 'rounded-bl-sm bg-ed-surface'
                : 'ml-auto rounded-br-sm bg-ed-fg text-ed-bg',
            )}
            style={{ '--i': i } as CSSProperties}
          >
            {m.texto}
          </li>
        ))}
      </ul>
    </>
  );
}

function EscenaAgenda() {
  const A = T.agenda;
  return (
    <>
      <BarraApp titulo={A.titulo} extra={T.dia} />
      <div className="p-3 text-[0.6875rem]">
        <div className="grid grid-cols-[2.75rem_1fr_1fr] gap-1.5 pb-2 font-semibold">
          <span />
          {A.profesionales.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
        {A.filas.map((f) => (
          <div key={f.hora} className="grid grid-cols-[2.75rem_1fr_1fr] gap-1.5 py-1">
            <span className="pt-1.5 text-ed-muted tabular-nums">{f.hora}</span>
            {[f.a, f.b].map((c, i) => (
              <span
                key={i}
                className={cn(
                  'h-8 rounded-md px-1.5 pt-1.5',
                  c ? 'bg-ed-fg text-ed-bg' : 'border border-dashed border-ed-line',
                )}
              >
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export const ESCENAS_TURNERO = [EscenaProblema, EscenaSena, EscenaAviso, EscenaBot, EscenaAgenda];

/** Una escena suelta del turnero (celular y proyectos). */
export function PantallaTurnero({ paso }: { paso: number }) {
  const Escena = ESCENAS_TURNERO[paso - 1] ?? EscenaAgenda;
  return <Escena />;
}

/** Las cinco escenas apiladas: se ve la del paso activo (data-paso del contenedor [data-steps]). */
export function PantallasTurneroApiladas() {
  return (
    <>
      {ESCENAS_TURNERO.map((Escena, i) => (
        <div key={i} className="e-escena absolute inset-0" data-escena={i + 1}>
          <Escena />
        </div>
      ))}
    </>
  );
}

/* ---------------- Pedidos: flujo en bucle ---------------- */

function EstadoCarrito() {
  return (
    <>
      <BarraApp titulo={P.app} extra={P.carrito} />
      <ul className="space-y-2 p-4 text-[0.75rem]">
        {P.items.map((it) => (
          <li
            key={it.nombre}
            className="flex items-center gap-3 rounded-xl border border-ed-line p-2.5"
          >
            <span className="size-9 shrink-0 rounded-lg bg-ed-surface" />
            <span className="flex-1 font-medium">{it.nombre}</span>
            <span className="grid size-6 place-items-center rounded-full border border-ed-line tabular-nums">
              {it.cantidad}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function EstadoFranja() {
  return (
    <>
      <BarraApp titulo={P.app} extra={P.retiro} />
      <ul className="space-y-2 p-4 text-[0.75rem]">
        {P.franjas.map((f, i) => (
          <li
            key={f.hora}
            className={cn(
              'flex items-center justify-between rounded-xl border px-3 py-3 tabular-nums',
              i === 1 ? 'border-ed-fg bg-ed-fg text-ed-bg' : 'border-ed-line',
              i === 0 && 'text-ed-muted line-through',
            )}
          >
            <span className="font-semibold">{f.hora}</span>
            <span>{f.estado}</span>
          </li>
        ))}
      </ul>
      <div className="mx-4 rounded-full bg-ed-fg py-3 text-center text-[0.75rem] font-semibold text-ed-bg">
        {P.confirmar}
      </div>
    </>
  );
}

function EstadoConfirmado() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-ed-fg text-ed-bg">
        <Tilde className="size-6" />
      </span>
      <p className="text-[0.875rem] font-semibold">{P.confirmado}</p>
    </div>
  );
}

/** Teléfono que pasa por carrito → franja → confirmado, y la comanda que sale impresa al lado. */
export function FlujoPedidos() {
  return (
    <div
      className="e-flujo flex items-start justify-center gap-4 sm:gap-8"
      data-loop=""
      role="img"
      aria-label={P.alt}
    >
      <Telefono className="max-w-[15.5rem] sm:max-w-[17.5rem]">
        <div className="e-estado e-bucle absolute inset-0" style={{ '--n': 0 } as CSSProperties}>
          <EstadoCarrito />
        </div>
        <div
          className="e-estado e-estado-base e-bucle absolute inset-0"
          style={{ '--n': 1 } as CSSProperties}
        >
          <EstadoFranja />
        </div>
        <div className="e-estado e-bucle absolute inset-0" style={{ '--n': 2 } as CSSProperties}>
          <EstadoConfirmado />
        </div>
      </Telefono>
      <div className="hidden w-40 pt-20 sm:block" aria-hidden="true">
        {/* Impresora de comandas: barra sólida con la ranura; el ticket sale por debajo. */}
        <div className="relative z-10 h-6 rounded-lg bg-ed-fg">
          <span className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-ed-bg opacity-40" />
        </div>
        <div className="overflow-hidden px-2.5">
          <div className="e-ticket e-bucle border border-t-0 border-ed-line-strong bg-ed-bg p-3 font-mono text-[0.6875rem] leading-relaxed">
            <p className="font-semibold">{P.comanda.titulo}</p>
            <p className="mt-1 border-t border-dashed border-ed-line pt-1">{P.comanda.retira}</p>
            {P.items.map((it) => (
              <p key={it.nombre} className="flex justify-between">
                <span>{it.nombre}</span>
                <span>{it.cantidad}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Proyectos sin captura: pantalla fija ---------------- */

function PantallaTienda() {
  const S = MOCKUPS.tienda;
  return (
    <>
      <BarraApp titulo={S.app} />
      <div className="flex gap-1.5 px-4 pt-3 text-[0.6875rem]">
        {S.categorias.map((c, i) => (
          <span
            key={c}
            className={cn(
              'rounded-full border px-2.5 py-1',
              i === 0 ? 'border-ed-fg bg-ed-fg text-ed-bg' : 'border-ed-line',
            )}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5 p-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-ed-line p-2">
            <div className="aspect-square rounded-lg bg-ed-surface" />
            <div className="mt-2 h-1.5 w-3/4 rounded-full bg-ed-line" />
            <div className="mt-2 rounded-full border border-ed-line py-1 text-center text-[0.625rem]">
              {i % 2 ? S.agregar : S.consultar}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function PantallaWeb() {
  const W = MOCKUPS.web;
  return (
    <>
      <BarraApp titulo={W.app} />
      <div className="p-4">
        <div className="aspect-[4/3] rounded-xl bg-ed-surface" />
        <p className="mt-4 text-[1.125rem] leading-tight font-semibold">{W.titulo}</p>
        <div className="mt-2 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-ed-line" />
          <div className="h-1.5 w-4/5 rounded-full bg-ed-line" />
        </div>
        <ul className="mt-4 divide-y divide-ed-line border-y border-ed-line text-[0.75rem]">
          {W.secciones.map((s) => (
            <li key={s} className="py-2">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-full bg-ed-fg py-2.5 text-center text-[0.6875rem] font-semibold text-ed-bg">
          {W.whatsapp}
        </div>
      </div>
    </>
  );
}

export function PantallaProyecto({ mockup }: { mockup: 'pedidos' | 'tienda' | 'web' | 'turnero' }) {
  if (mockup === 'turnero') return <PantallaTurnero paso={5} />;
  if (mockup === 'tienda') return <PantallaTienda />;
  if (mockup === 'web') return <PantallaWeb />;
  return <EstadoFranja />;
}
