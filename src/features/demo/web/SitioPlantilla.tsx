'use client';

import { useRef, type CSSProperties } from 'react';
import { fuenteMarca } from '@/content/demos/studio';
import { DEMO_WEB_UI, RUBROS_WEB as TODOS, type RubroWeb } from '@/content/demos/web/datos';
import { useMarca } from '../studio/MarcaContexto';

const UI = DEMO_WEB_UI;

type SeccionId = keyof typeof UI.nav;

function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      className={className}
    >
      <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
      <path
        d="M9.2 9.2c.3 2.4 2.2 4.4 4.6 4.8l1-1.2 2 .9-.4 1.6c-3.8.4-7.6-3.3-7.3-7.2l1.6-.4.9 2Z"
        strokeWidth={1.3}
      />
    </svg>
  );
}

function Tilde() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      aria-hidden="true"
      className="mt-0.5 size-4 shrink-0 text-(--sitio)"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * La página web de ejemplo: una sola plantilla que toma el contenido y el color de cada rubro. Se
 * adapta al ancho con container queries (la misma página en el celular y en la compu). El menú lleva
 * a cada sección dentro de la vista previa y WhatsApp avisa qué haría en la página real.
 */
export function SitioPlantilla({ rubro, onWhatsApp }: { rubro: RubroWeb; onWhatsApp: () => void }) {
  const caja = useRef<HTMLDivElement>(null);
  const ir = (id: SeccionId) => {
    const raiz = caja.current;
    const destino = raiz?.querySelector<HTMLElement>(`[data-seccion="${id}"]`);
    if (raiz && destino) raiz.scrollTo({ top: destino.offsetTop - 56, behavior: 'smooth' });
  };
  const N = rubro.negocio;
  const marca = useMarca();
  // El nombre que escribió la persona; si dejó el de ejemplo, el de cada rubro.
  const nombre =
    marca && !NOMBRES_EJEMPLO.has(marca.nombre) && marca.nombre.trim() ? marca.nombre : N.nombre;
  const inicial = (nombre.trim()[0] ?? N.inicial).toUpperCase();
  const fuente = marca ? { fontFamily: fuenteMarca(marca.fuenteId).pila } : undefined;
  const boton =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-(--sitio) px-5 text-[0.9375rem] font-semibold text-white active:opacity-80';
  return (
    <div
      ref={caja}
      className="d-sin-barra @container relative h-full overflow-y-auto bg-white text-neutral-900"
      style={{ '--sitio': marca ? 'var(--marca-texto)' : rubro.color } as CSSProperties}
    >
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-200 bg-white px-5 @3xl:px-10">
        {marca?.logo ? (
          // Foto local (blob:) ya achicada: next/image no aplica.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={marca.logo} alt="" className="size-8 rounded-lg object-cover" />
        ) : (
          <span className="grid size-8 place-items-center rounded-lg bg-(--sitio) text-[0.9375rem] font-bold text-white">
            {inicial}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-semibold" style={fuente}>
          {nombre}
        </span>
        <nav aria-label={UI.navAria} className="hidden @3xl:block">
          <ul className="flex gap-6 text-[0.875rem] text-neutral-600">
            {(Object.keys(UI.nav) as SeccionId[]).map((id) => (
              <li key={id}>
                <button type="button" onClick={() => ir(id)} className="hover:text-neutral-900">
                  {UI.nav[id]}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={onWhatsApp}
          aria-label={UI.whatsapp}
          className="grid size-10 place-items-center rounded-full text-(--sitio) active:opacity-70 @3xl:hidden"
        >
          <IconoWhatsApp className="size-6" />
        </button>
      </header>

      <section
        data-seccion="inicio"
        className="px-5 pt-10 pb-12 @3xl:grid @3xl:grid-cols-2 @3xl:items-center @3xl:gap-12 @3xl:px-10 @3xl:py-20"
      >
        <div>
          <p className="text-[0.8125rem] font-semibold tracking-wide text-(--sitio) uppercase">
            {N.actividad}
          </p>
          <h2 className="mt-3 text-[2.125rem] leading-[1.05] font-bold tracking-tight @3xl:text-[3.25rem]">
            {rubro.hero.titulo}
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-neutral-600">
            {rubro.hero.bajada}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onWhatsApp} className={boton}>
              <IconoWhatsApp className="size-5" />
              {UI.whatsapp}
            </button>
            <button
              type="button"
              onClick={() => ir('servicios')}
              className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 px-5 text-[0.9375rem] font-semibold active:opacity-70"
            >
              {rubro.servicios.titulo}
            </button>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="mt-8 grid aspect-4/3 place-items-center rounded-3xl bg-[color-mix(in_srgb,var(--sitio)_12%,white)] @3xl:mt-0"
        >
          {marca?.logo ? (
            // Foto local (blob:) ya achicada.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={marca.logo} alt="" className="size-full rounded-3xl object-cover" />
          ) : (
            <Composicion />
          )}
        </div>
      </section>

      <section
        data-seccion="servicios"
        className="border-t border-neutral-200 px-5 py-12 @3xl:px-10 @3xl:py-16"
      >
        <h3 className="text-[1.5rem] font-bold tracking-tight @3xl:text-[2rem]">
          {rubro.servicios.titulo}
        </h3>
        <ul className="mt-6 grid gap-3 @3xl:grid-cols-3 @3xl:gap-5">
          {rubro.servicios.items.map((s) => (
            <li key={s.nombre} className="rounded-2xl border border-neutral-200 p-5">
              <span className="block size-2 rounded-full bg-(--sitio)" aria-hidden="true" />
              <p className="mt-4 text-[1.0625rem] font-semibold">{s.nombre}</p>
              <p className="mt-1 text-[0.9375rem] text-neutral-600">{s.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        data-seccion="sobre"
        className="bg-neutral-50 px-5 py-12 @3xl:grid @3xl:grid-cols-2 @3xl:gap-12 @3xl:px-10 @3xl:py-16"
      >
        <div>
          <h3 className="text-[1.5rem] font-bold tracking-tight @3xl:text-[2rem]">
            {rubro.sobre.titulo}
          </h3>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-neutral-600">
            {rubro.sobre.texto}
          </p>
          <ul className="mt-5 space-y-2.5">
            {rubro.sobre.puntos.map((p) => (
              <li key={p} className="flex gap-2.5 text-[0.9375rem]">
                <Tilde />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 @3xl:mt-0">
          <p className="text-[0.8125rem] font-semibold tracking-wide text-neutral-500 uppercase">
            {rubro.extra.titulo}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {rubro.extra.items.map((x) => (
              <li
                key={x}
                className="rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-[0.875rem]"
              >
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        data-seccion="contacto"
        className="px-5 py-12 @3xl:grid @3xl:grid-cols-2 @3xl:gap-12 @3xl:px-10 @3xl:py-16"
      >
        <div>
          <h3 className="text-[1.5rem] font-bold tracking-tight @3xl:text-[2rem]">
            {UI.contactoTitulo}
          </h3>
          <dl className="mt-5 space-y-4 text-[0.9375rem]">
            <div>
              <dt className="text-neutral-500">{UI.horario}</dt>
              <dd className="mt-0.5 font-medium">{rubro.contacto.horario}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">{UI.direccion}</dt>
              <dd className="mt-0.5 font-medium">{rubro.contacto.direccion}</dd>
            </div>
          </dl>
          <button type="button" onClick={onWhatsApp} className={`${boton} mt-6`}>
            <IconoWhatsApp className="size-5" />
            {UI.whatsapp}
          </button>
        </div>
        <div
          aria-hidden="true"
          className="relative mt-8 aspect-4/3 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 @3xl:mt-0"
        >
          <svg
            viewBox="0 0 200 150"
            className="absolute inset-0 size-full text-neutral-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={6}
          >
            <path d="M-10 40h220M-10 105h220M60-10v170M140-10v170" />
            <path d="M-10 150 200 10" strokeWidth={3} />
          </svg>
          <span className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-full [transform:translate(-50%,-100%)_rotate(45deg)] place-items-center rounded-full rounded-br-none bg-(--sitio)">
            <span className="size-3 rounded-full bg-white" />
          </span>
        </div>
      </section>

      <footer className="border-t border-neutral-200 px-5 py-8 text-[0.8125rem] text-neutral-500 @3xl:px-10">
        {UI.pie(nombre)}
      </footer>
    </div>
  );
}

/** Los nombres de ejemplo de cada rubro: si la persona no escribió el suyo, cada rubro muestra el propio. */
const NOMBRES_EJEMPLO = new Set(TODOS.map((r) => r.negocio.nombre));

/**
 * La imagen del hero cuando no hay foto: una composición plana en el color del negocio (círculo, arco y
 * bandas), en lugar de una letra sola. Decorativa.
 */
function Composicion() {
  return (
    <svg viewBox="0 0 400 300" className="size-full" aria-hidden="true">
      <circle cx="285" cy="118" r="78" fill="var(--sitio)" />
      <path
        d="M40 260a160 160 0 0 1 320 0"
        fill="none"
        stroke="var(--sitio)"
        strokeWidth="18"
        opacity="0.35"
      />
      <rect x="48" y="62" width="120" height="16" rx="8" fill="var(--sitio)" opacity="0.55" />
      <rect x="48" y="94" width="84" height="16" rx="8" fill="var(--sitio)" opacity="0.3" />
      <circle cx="285" cy="118" r="30" fill="white" opacity="0.9" />
    </svg>
  );
}
