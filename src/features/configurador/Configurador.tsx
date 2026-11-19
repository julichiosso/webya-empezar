'use client';

import { useEffect, useReducer, useRef } from 'react';
import { CONFIGURADOR, RUBROS_CONFIG, modulosDe } from '@/content/configurador';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { SERVICIOS, type TipoId } from '@/content/servicios';
import { track } from '@/lib/analytics';
import { ESTADO_INICIAL, mensajeDe, reducir, resumen, type EstadoConfigurador } from './estado';

const C = CONFIGURADOR;

/** Clases de una opción (input oculto dentro del label): seleccionada = invertida; foco visible. */
const OPCION =
  'relative flex cursor-pointer rounded-xl border border-ed-line transition-colors duration-200 hover:border-ed-fg has-[:checked]:border-ed-fg has-[:checked]:bg-ed-invert has-[:checked]:text-ed-invert-fg has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-[color:var(--e-foco)]';

function Paso({ n, titulo, id }: { n: number; titulo: string; id: string }) {
  return (
    <legend id={id} className="mb-5 flex w-full items-baseline gap-4">
      <span className="e-rotulo text-ed-muted tabular-nums">{String(n).padStart(2, '0')}</span>
      <span className="e-h3">{titulo}</span>
    </legend>
  );
}

/**
 * "Armá tu sistema": tres pasos en una sola vista (qué, rubro, módulos), resumen en vivo y un único
 * botón que abre WhatsApp con el pedido escrito. Estado 100 % en el cliente: cero requests.
 * Toques mínimos hasta el botón: tipo → rubro → enviar (los módulos ya vienen marcados).
 */
export function Configurador({ inicial }: { inicial?: TipoId }) {
  const [estado, despachar] = useReducer(
    reducir,
    inicial ? reducir(ESTADO_INICIAL, { tipo: 'elegirTipo', valor: inicial }) : ESTADO_INICIAL,
  );
  const primerTipo = useRef<HTMLInputElement>(null);
  const raiz = useRef<HTMLDivElement>(null);

  // Atajos desde toda la página: cualquier enlace con data-armar / data-modulo preselecciona acá.
  useEffect(() => {
    const alTocar = (ev: MouseEvent) => {
      const el = (ev.target as Element | null)?.closest<HTMLElement>('[data-armar], [data-modulo]');
      if (!el) return;
      const tipoSistema = el.dataset.armar || undefined;
      const modulo = el.dataset.modulo || undefined;
      if (!tipoSistema && !modulo) return;
      despachar({ tipo: 'preseleccionar', tipoSistema, modulo });
      if (tipoSistema) track('configurador_tipo', { tipo: tipoSistema, origen: 'atajo' });
    };
    document.addEventListener('click', alTocar);
    // Señal de que ya responde (la página se hidrata por partes): la usan los tests e2e.
    raiz.current?.setAttribute('data-hidratado', '');
    return () => document.removeEventListener('click', alTocar);
  }, []);

  const r = resumen(estado);
  const mensaje = mensajeDe(estado);
  const destino = mensaje ? enlaceContacto(mensaje) : null;
  const modulos = modulosDe(estado.tipo);
  // El canal se sabe antes de elegir nada (depende solo de si hay número cargado).
  const textoEnviar = enlaceContacto('').canal === 'mail' ? C.enviarMail : C.enviar;

  const enviar = () => {
    if (!destino) return;
    track('configurador_enviar', {
      tipo: estado.tipo ?? '',
      rubro: estado.rubro ?? '',
      modulos: r.modulos.length,
      canal: destino.canal,
    });
  };

  return (
    <div ref={raiz} className="grid grid-cols-12 gap-x-6 gap-y-12">
      <form
        className="col-span-12 space-y-14 lg:col-span-7"
        onSubmit={(e) => e.preventDefault()}
        aria-describedby="configurador-ayuda"
      >
        <p id="configurador-ayuda" className="sr-only">
          {C.bajada}
        </p>

        <fieldset>
          <Paso n={1} titulo={C.pasos.tipo} id="paso-tipo" />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {SERVICIOS.map((s, i) => (
              <label
                key={s.id}
                className={`${OPCION} min-h-[4.5rem] flex-col justify-center gap-3 p-4 sm:min-h-[6.5rem] sm:justify-between sm:p-5`}
              >
                <input
                  ref={i === 0 ? primerTipo : undefined}
                  type="radio"
                  name="tipo"
                  value={s.id}
                  checked={estado.tipo === s.id}
                  onChange={() => {
                    despachar({ tipo: 'elegirTipo', valor: s.id });
                    track('configurador_tipo', { tipo: s.id, origen: 'tarjeta' });
                  }}
                  className="sr-only"
                />
                <span className="text-[0.9375rem] leading-tight font-semibold tracking-[-0.01em] sm:text-[1.0625rem]">
                  {s.nombre}
                </span>
                <span className="e-chico hidden opacity-70 sm:block">{s.frase}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <Paso n={2} titulo={C.pasos.rubro} id="paso-rubro" />
          <div className="flex flex-wrap gap-2.5">
            {RUBROS_CONFIG.map((rb) => (
              <label key={rb.id} className={`${OPCION} min-h-12 items-center rounded-full px-5`}>
                <input
                  type="radio"
                  name="rubro"
                  value={rb.id}
                  checked={estado.rubro === rb.id}
                  onChange={() => despachar({ tipo: 'elegirRubro', valor: rb.id })}
                  className="sr-only"
                />
                <span className="e-cuerpo font-medium">{rb.nombre}</span>
              </label>
            ))}
          </div>
          {estado.rubro === 'otro' ? (
            <label className="mt-5 block">
              <span className="e-chico text-ed-muted">{C.otroEtiqueta}</span>
              <input
                type="text"
                value={estado.rubroOtro}
                onChange={(e) => despachar({ tipo: 'escribirRubroOtro', valor: e.target.value })}
                placeholder={C.otroPlaceholder}
                maxLength={60}
                autoComplete="off"
                className="mt-2 block min-h-12 w-full rounded-xl border border-ed-line-strong bg-transparent px-4 text-base placeholder:text-ed-muted focus:border-ed-fg"
              />
            </label>
          ) : null}
          <label className="mt-5 block">
            <span className="e-chico text-ed-muted">{C.nombreEtiqueta}</span>
            <input
              type="text"
              value={estado.negocio}
              onChange={(e) => despachar({ tipo: 'escribirNegocio', valor: e.target.value })}
              placeholder={C.nombrePlaceholder}
              maxLength={60}
              autoComplete="organization"
              className="mt-2 block min-h-12 w-full rounded-xl border border-ed-line-strong bg-transparent px-4 text-base placeholder:text-ed-muted focus:border-ed-fg"
            />
          </label>
        </fieldset>

        <fieldset aria-describedby="ayuda-modulos">
          <Paso n={3} titulo={C.pasos.modulos} id="paso-modulos" />
          <p id="ayuda-modulos" className="e-chico -mt-2 mb-5 text-ed-muted">
            {estado.tipo ? C.ayudaModulos : C.falta}
          </p>
          {modulos.length > 0 ? (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {modulos.map((m) => {
                const activo = estado.modulos.includes(m.id);
                return (
                  <li key={m.id}>
                    <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-xl border border-ed-line px-4 py-3 transition-colors duration-200 hover:border-ed-fg has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-[color:var(--e-foco)]">
                      <span>
                        <span className="block text-[0.9375rem] font-medium">{m.nombre}</span>
                        <span className="e-chico block text-ed-muted">{m.ayuda}</span>
                      </span>
                      <input
                        type="checkbox"
                        role="switch"
                        checked={activo}
                        onChange={() => despachar({ tipo: 'alternarModulo', valor: m.id })}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="relative h-7 w-12 shrink-0 rounded-full border border-ed-line-strong transition-colors duration-200 peer-checked:border-ed-fg peer-checked:bg-ed-fg"
                      >
                        <span
                          className={`absolute top-1/2 left-1 size-5 -translate-y-1/2 rounded-full transition-transform duration-200 ${activo ? 'translate-x-5 bg-ed-bg' : 'bg-ed-muted'}`}
                        />
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </fieldset>
      </form>

      <aside className="col-span-12 lg:col-span-5" aria-labelledby="titulo-resumen">
        <div className="rounded-2xl border border-ed-line p-6 md:p-8 lg:sticky lg:top-24">
          <h3 id="titulo-resumen" className="e-rotulo text-ed-muted">
            {C.resumen.titulo}
          </h3>
          <Resumen estado={estado} />
          <div className="mt-8 hidden flex-col gap-3 lg:flex">
            <BotonEnviar
              href={destino?.href}
              texto={textoEnviar}
              onEnviar={enviar}
              alFaltar={() => primerTipo.current?.focus()}
            />
          </div>
          <p className="e-chico mt-5 text-ed-muted">{C.aclaracion}</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ed-line pt-5">
            <a
              href={r.demo?.href ?? '#proyectos'}
              {...(r.demo?.href.startsWith('/demo') ? { target: '_blank', rel: 'noopener' } : {})}
              className="e-link e-chico font-medium"
              onClick={() => track('configurador_demo', { rubro: estado.rubro ?? '' })}
            >
              {r.demo ? r.demo.texto : C.verDemo}
            </a>
            {estado.tipo ? (
              <button
                type="button"
                onClick={() => despachar({ tipo: 'reiniciar' })}
                className="e-link e-link-alto e-chico text-ed-muted"
              >
                {C.reiniciar}
              </button>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Celular: el botón queda a mano (abajo, con el pulgar) mientras se recorre el configurador. */}
      <div className="sticky bottom-0 z-30 col-span-12 -mx-[clamp(1rem,4vw,3rem)] border-t border-ed-line bg-ed-bg px-[clamp(1rem,4vw,3rem)] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <p className="e-chico mb-2 truncate text-ed-muted" aria-hidden="true">
          {r.tipo
            ? [r.tipo, r.rubro, r.modulos.length ? `+${r.modulos.length}` : '']
                .filter(Boolean)
                .join(' · ')
            : C.falta}
        </p>
        <BotonEnviar
          href={destino?.href}
          texto={textoEnviar}
          onEnviar={enviar}
          alFaltar={() => primerTipo.current?.focus()}
        />
      </div>
    </div>
  );
}

function Resumen({ estado }: { estado: EstadoConfigurador }) {
  const r = resumen(estado);
  if (!r.listo) {
    return (
      <p className="e-cuerpo mt-5 text-ed-muted" aria-live="polite">
        {C.resumen.vacio}
      </p>
    );
  }
  const fila = 'grid grid-cols-[6rem_1fr] gap-4 border-t border-ed-line py-3';
  return (
    <dl className="e-chico mt-5" aria-live="polite">
      <div className={fila}>
        <dt className="text-ed-muted">{C.resumen.tipo}</dt>
        <dd className="font-semibold">{r.tipo}</dd>
      </div>
      {r.rubro ? (
        <div className={fila}>
          <dt className="text-ed-muted">{C.resumen.rubro}</dt>
          <dd>{r.rubro}</dd>
        </div>
      ) : null}
      {r.negocio ? (
        <div className={fila}>
          <dt className="text-ed-muted">{C.resumen.negocio}</dt>
          <dd className="break-words">{r.negocio}</dd>
        </div>
      ) : null}
      <div className={fila}>
        <dt className="text-ed-muted">{C.resumen.modulos}</dt>
        <dd>
          {r.modulos.length > 0 ? (
            <ul className="space-y-1">
              {r.modulos.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          ) : (
            C.resumen.sinModulos
          )}
        </dd>
      </div>
    </dl>
  );
}

function BotonEnviar({
  href,
  texto,
  onEnviar,
  alFaltar,
}: {
  href?: string;
  texto: string;
  onEnviar: () => void;
  alFaltar: () => void;
}) {
  const clases = 'e-btn e-btn-primario w-full whitespace-normal py-3 text-center leading-tight';
  if (!href) {
    return (
      <button type="button" aria-disabled="true" onClick={alFaltar} className={clases}>
        {texto}
      </button>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={onEnviar}
      className={clases}
      data-magnet=""
    >
      {texto}
    </a>
  );
}
