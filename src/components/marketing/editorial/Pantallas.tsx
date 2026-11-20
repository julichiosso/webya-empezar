import Image from 'next/image';
import { Fragment, type CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { AVISO_HERO, MOCKUPS } from '@/content/mockups';
import { Tilde } from './Iconos';

/**
 * Mini pantallas "vectoriales" hechas con HTML y CSS (nítidas en cualquier densidad, livianas y sin
 * imágenes). Todas son decorativas: la sección que las usa cuenta lo mismo en texto.
 */

const T = MOCKUPS.turnero;
const P = MOCKUPS.pedidos;

/**
 * Barra de estado de iOS: hora a la izquierda de la isla; señal, wifi y batería a la derecha.
 * Mide en unidades del contenedor (el teléfono), así escala igual en cualquier tamaño.
 */
function BarraEstado({ fondo, claro }: { fondo?: string; claro?: boolean }) {
  return (
    <div
      className={cn('e-tel-barra', claro && 'e-tel-barra-clara')}
      style={fondo ? { background: fondo } : undefined}
      aria-hidden="true"
    >
      <span className="e-tel-hora">{MOCKUPS.estado.hora}</span>
      <span className="e-tel-iconos">
        <svg viewBox="0 0 18 12" className="h-full w-auto" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-full w-auto">
          <path
            d="M.93 4.43a10 10 0 0 1 14.14 0M3.4 6.9a6.5 6.5 0 0 1 9.2 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path d="M8 11.5 5.88 9.38a3 3 0 0 1 4.24 0z" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 27 13" className="h-full w-auto">
          <rect
            x="0.5"
            y="0.5"
            width="23"
            height="12"
            rx="3.6"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <rect x="2" y="2" width="17" height="9" rx="2.2" fill="currentColor" />
          <path
            d="M25 4.3v4.4c.9-.3 1.5-1.2 1.5-2.2s-.6-1.9-1.5-2.2Z"
            fill="currentColor"
            fillOpacity="0.45"
          />
        </svg>
      </span>
    </div>
  );
}

/**
 * iPhone de la línea Pro Max dibujado con CSS: marco de titanio con sus botones (acción, volumen,
 * encendido y control de cámara), bisel negro finito, isla flotante con la lente, barra de estado y
 * barra de inicio. Todo mide en `cqw` del propio teléfono: escala sin perder proporción.
 * `barra={false}`: el contenido es una captura real que ya trae su barra de estado.
 */
export function Telefono({
  children,
  className,
  etiqueta,
  decorativo = true,
  barra = true,
  colorBarra,
}: {
  children: React.ReactNode;
  className?: string;
  /** Texto alternativo del conjunto; sin él (y sin decorativo=false), el teléfono es decorativo. */
  etiqueta?: string;
  /** false: el contenido (por ejemplo, una captura con su alt) se lee tal cual. */
  decorativo?: boolean;
  barra?: boolean;
  /** Color de la barra de estado para capturas de sitios (el de arriba de la página). */
  colorBarra?: { fondo: string; claro: boolean };
}) {
  return (
    <div
      className={cn('e-tel relative mx-auto w-full max-w-[17.5rem]', className)}
      role={etiqueta ? 'img' : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta || !decorativo ? undefined : true}
    >
      <span aria-hidden="true" className="e-tel-boton e-tel-accion" />
      <span aria-hidden="true" className="e-tel-boton e-tel-volumen-mas" />
      <span aria-hidden="true" className="e-tel-boton e-tel-volumen-menos" />
      <span aria-hidden="true" className="e-tel-boton e-tel-encendido" />
      <span aria-hidden="true" className="e-tel-boton e-tel-camara" />
      <div className="e-tel-bisel">
        <div className="e-tel-pantalla tono-claro">
          <div className={barra ? 'e-tel-contenido' : 'absolute inset-0'}>{children}</div>
          {barra ? <BarraEstado fondo={colorBarra?.fondo} claro={colorBarra?.claro} /> : null}
          <span aria-hidden="true" className="e-tel-isla">
            <span className="e-tel-lente" />
          </span>
          <span aria-hidden="true" className="e-tel-inicio" />
        </div>
      </div>
    </div>
  );
}

function BarraApp({ titulo, extra }: { titulo: string; extra?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ed-line px-4 pt-1 pb-3 text-[0.8125rem] font-semibold">
      <span>{titulo}</span>{' '}
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

/**
 * Captura real: la reserva confirmada y la notificación push que le llega al dueño. Sube hasta el
 * borde de la pantalla para que su propia barra de estado quede bajo la del marco (miden lo mismo:
 * la captura es de un iPhone con isla).
 */
function EscenaAviso() {
  return (
    <div className="absolute inset-x-0 -top-[var(--tel-barra)] bottom-0">
      <Image
        src={T.aviso.src}
        alt={T.aviso.alt}
        width={T.aviso.ancho}
        height={T.aviso.alto}
        sizes="(min-width: 1024px) 17rem, 12.5rem"
        className="h-full w-full object-cover object-top"
      />
    </div>
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
            <Fragment key={p}>
              {' '}
              <span>{p}</span>
            </Fragment>
          ))}
        </div>
        {A.filas.map((f) => (
          <div key={f.hora} className="grid grid-cols-[2.75rem_1fr_1fr] gap-1.5 py-1">
            <span className="pt-1.5 text-ed-muted tabular-nums">{f.hora}</span>
            {[f.a, f.b].map((c, i) => (
              <Fragment key={i}>
                {/* Espacio entre celdas: en el texto de la página no se pegan ("Reservado Reservado"). */}{' '}
                <span
                  className={cn(
                    'h-8 rounded-md px-1.5 pt-1.5',
                    c ? 'bg-ed-fg text-ed-bg' : 'border border-dashed border-ed-line',
                  )}
                >
                  {c}
                </span>
              </Fragment>
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

/**
 * El aviso que le llega al dueño cuando alguien reserva y paga la seña: plano, borde de 1 px, entra sobre
 * la pantalla del teléfono (el contenedor tiene que ser `relative`). Decorativo: el conjunto lleva su alt.
 */
export function AvisoPush() {
  const P = AVISO_HERO;
  return (
    <div aria-hidden="true" className="e-push tono-claro">
      <span className="e-push-icono">
        <Tilde />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex justify-between gap-2 text-ed-muted">
          <span>{P.app}</span>
          <span>{P.cuando}</span>
        </span>
        <span className="block font-semibold">{P.titulo}</span>
        <span className="block truncate">{P.texto}</span>
      </span>
    </div>
  );
}
