'use client';

import { useState, type Dispatch, type FormEvent } from 'react';
import { cn } from '@/components/ui/clases';
import {
  ACTIVIDADES,
  CAMPANA,
  CUOTAS,
  ESPECIES,
  ESPECIE_NECESARIA,
  ESTADOS,
  TAMANOS,
  UI_PROTECTORA as U,
  type Animal,
  type Especie,
} from '@/content/demos/protectora';
import type { Accion, EstadoDemo } from './estado';
import { Ilustracion } from './Ilustracion';
import { pesos, fechaActividad } from './formato';

type Seccion = 'adoptar' | 'socios' | 'donar' | 'sumate';

const SECCIONES: readonly Seccion[] = ['adoptar', 'socios', 'donar', 'sumate'];

/** Lo que ve el público: adoptar, hacerse socio, donar y sumarse. Nunca datos de otras personas. */
export function Publica({
  e,
  d,
  onCompartir,
}: {
  e: EstadoDemo;
  d: Dispatch<Accion>;
  onCompartir: (a: Animal) => void;
}) {
  const [seccion, setSeccion] = useState<Seccion>('adoptar');
  return (
    <div>
      <nav aria-label={U.vistas.publica} className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
        {SECCIONES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={seccion === s}
            onClick={() => setSeccion(s)}
            className={cn(
              'min-h-11 shrink-0 rounded-full px-4 text-[0.9375rem] font-medium',
              seccion === s
                ? 'bg-(--pr-tinta) text-(--pr-fondo)'
                : 'bg-(--pr-papel) text-(--pr-tinta-2)',
            )}
          >
            {U.secciones[s]}
          </button>
        ))}
      </nav>
      <div className="mt-5">
        {seccion === 'adoptar' ? <Adoptar e={e} d={d} onCompartir={onCompartir} /> : null}
        {seccion === 'socios' ? <Socios e={e} d={d} /> : null}
        {seccion === 'donar' ? <Donar e={e} d={d} /> : null}
        {seccion === 'sumate' ? <Sumate e={e} d={d} /> : null}
      </div>
    </div>
  );
}

/* ---------------- Adoptar ---------------- */

function Adoptar({
  e,
  d,
  onCompartir,
}: {
  e: EstadoDemo;
  d: Dispatch<Accion>;
  onCompartir: (a: Animal) => void;
}) {
  const [filtro, setFiltro] = useState<Especie | 'todos'>('todos');
  const [abierto, setAbierto] = useState<string | null>(null);
  const [solicitar, setSolicitar] = useState(false);
  const animal = e.animales.find((a) => a.id === abierto);

  if (animal && solicitar) {
    return (
      <Solicitud animal={animal} d={d} onVolver={() => (setSolicitar(false), setAbierto(null))} />
    );
  }
  if (animal) {
    return (
      <Ficha
        a={animal}
        onQuiero={() => setSolicitar(true)}
        onCompartir={() => onCompartir(animal)}
        onVolver={() => setAbierto(null)}
      />
    );
  }

  const lista = e.animales.filter((a) => filtro === 'todos' || a.especie === filtro);
  return (
    <div>
      <div role="group" aria-label={U.filtros.etiqueta} className="flex gap-1.5">
        {(['todos', 'perro', 'gato'] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filtro === f}
            onClick={() => setFiltro(f)}
            className={cn(
              'min-h-10 rounded-full border px-3.5 text-[0.875rem]',
              filtro === f
                ? 'border-(--pr-tinta) font-semibold'
                : 'border-(--pr-linea) text-(--pr-tinta-2)',
            )}
          >
            {f === 'todos' ? U.filtros.todos : ESPECIES[f]}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {lista.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => setAbierto(a.id)}
              className="w-full overflow-hidden rounded-2xl bg-(--pr-papel) text-left"
            >
              <span className={cn('grid aspect-square place-items-center', `pr-tono-${a.tono}`)}>
                <Ilustracion
                  especie={a.especie}
                  semilla={a.id}
                  tamano={a.tamano}
                  className="w-3/5 text-(--pr-tinta)"
                />
              </span>
              <span className="block p-3">
                <span className="pr-titulo block text-[1.125rem] font-semibold">{a.nombre}</span>
                <span className="block text-[0.8125rem] text-(--pr-tinta-2)">
                  {U.ficha.edad(a.edadMeses)} · {TAMANOS[a.tamano]}
                </span>
                <span
                  className={cn(
                    'mt-1.5 inline-block rounded-full px-2 py-0.5 text-[0.75rem] font-semibold',
                    a.estado === 'adoptado'
                      ? 'bg-(--pr-ok-suave) text-(--pr-ok)'
                      : 'bg-(--pr-acento-suave) text-(--pr-acento)',
                  )}
                >
                  {ESTADOS[a.estado]}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Ficha({
  a,
  onQuiero,
  onCompartir,
  onVolver,
}: {
  a: Animal;
  onQuiero: () => void;
  onCompartir: () => void;
  onVolver: () => void;
}) {
  const puede = a.estado === 'disponible' || a.estado === 'transito';
  return (
    <article aria-labelledby={`ficha-${a.id}`}>
      <button type="button" onClick={onVolver} className="min-h-11 text-[0.9375rem] underline">
        {U.ficha.volver}
      </button>
      <div
        className={cn('mt-2 grid aspect-4/3 place-items-center rounded-2xl', `pr-tono-${a.tono}`)}
      >
        <Ilustracion
          especie={a.especie}
          semilla={a.id}
          tamano={a.tamano}
          className="w-2/5 text-(--pr-tinta)"
        />
      </div>
      <h3 id={`ficha-${a.id}`} className="pr-titulo mt-4 text-[1.75rem] font-semibold">
        {a.nombre}
      </h3>
      <p className="text-(--pr-tinta-2)">
        {U.ficha.edad(a.edadMeses)} · {TAMANOS[a.tamano]} · {ESTADOS[a.estado]}
      </p>
      <p className="mt-3 font-medium">{a.caracter}</p>
      <p className="mt-1 leading-relaxed text-(--pr-tinta-2)">{a.historia}</p>
      <ul className="mt-3 flex flex-wrap gap-2 text-[0.8125rem]">
        {a.castrado ? (
          <li className="rounded-full bg-(--pr-papel) px-2.5 py-1">{U.ficha.castrado}</li>
        ) : null}
        {a.vacunado ? (
          <li className="rounded-full bg-(--pr-papel) px-2.5 py-1">{U.ficha.vacunado}</li>
        ) : null}
      </ul>
      <div className="mt-5 grid gap-2.5">
        {puede ? (
          <button type="button" onClick={onQuiero} className="pr-boton">
            {U.ficha.quiero}
          </button>
        ) : null}
        <button type="button" onClick={onCompartir} className="pr-boton-2">
          {U.ficha.compartir}
        </button>
      </div>
    </article>
  );
}

function Solicitud({
  animal,
  d,
  onVolver,
}: {
  animal: Animal;
  d: Dispatch<Accion>;
  onVolver: () => void;
}) {
  const S = U.solicitud;
  const [nombre, setNombre] = useState('');
  const [tel, setTel] = useState('');
  const [vivienda, setVivienda] = useState<string>(S.viviendas[0]);
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    if (!nombre.trim()) return setError(S.faltaNombre);
    if (tel.replace(/\D/g, '').length < 8) return setError(S.faltaTelefono);
    if (!acepta) return setError(S.faltaConsentimiento);
    setError('');
    d({ tipo: 'solicitar', animal: animal.id, persona: nombre });
    setListo(true);
  };

  if (listo) {
    return (
      <div role="status" className="rounded-2xl bg-(--pr-papel) p-5">
        <p className="pr-titulo text-[1.5rem] font-semibold">{S.listo}</p>
        <p className="mt-2 leading-relaxed text-(--pr-tinta-2)">{S.queSigue}</p>
        <button type="button" onClick={onVolver} className="pr-boton-2 mt-5 w-full">
          {U.ficha.volver}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <h3 className="pr-titulo text-[1.375rem] font-semibold">{S.titulo(animal.nombre)}</h3>
      <label className="block">
        <span className="mb-1.5 block text-[0.9375rem] font-medium">{S.nombre}</span>
        <input
          className="pr-campo"
          value={nombre}
          onChange={(x) => setNombre(x.target.value)}
          autoComplete="name"
          maxLength={40}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[0.9375rem] font-medium">{S.telefono}</span>
        <input
          className="pr-campo"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={tel}
          onChange={(x) => setTel(x.target.value)}
          maxLength={20}
        />
      </label>
      <fieldset>
        <legend className="mb-1.5 text-[0.9375rem] font-medium">{S.vivienda}</legend>
        <div className="grid gap-2">
          {S.viviendas.map((v) => (
            <label
              key={v}
              className="flex min-h-12 items-center gap-3 rounded-xl bg-(--pr-papel) px-3.5"
            >
              <input
                type="radio"
                name="vivienda"
                checked={vivienda === v}
                onChange={() => setVivienda(v)}
              />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex items-start gap-3 text-[0.875rem] leading-snug">
        <input
          type="checkbox"
          className="mt-1 size-5"
          checked={acepta}
          onChange={(x) => setAcepta(x.target.checked)}
        />
        <span>{S.consentimiento}</span>
      </label>
      <p aria-live="polite" className="min-h-5 text-[0.875rem] font-medium text-(--pr-acento)">
        {error}
      </p>
      <div className="e-config-barra sticky z-10 -mx-4 bg-(--pr-fondo) px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button type="submit" className="pr-boton w-full">
          {S.enviar}
        </button>
      </div>
    </form>
  );
}

/* ---------------- Socios ---------------- */

function Socios({ e, d }: { e: EstadoDemo; d: Dispatch<Accion> }) {
  const S = U.socio;
  const [cuota, setCuota] = useState<string>(CUOTAS[0].id);
  const [nombre, setNombre] = useState('');
  const [pagando, setPagando] = useState(false);

  if (e.carnet) {
    const c = CUOTAS.find((x) => x.id === e.carnet!.cuota);
    return (
      <div
        role="status"
        aria-label={S.carnet}
        className="rounded-3xl bg-(--pr-tinta) p-6 text-(--pr-fondo)"
      >
        <p className="text-[0.8125rem] tracking-[0.12em] uppercase opacity-80">{S.carnet}</p>
        <p className="pr-titulo mt-6 text-[1.75rem] font-semibold">{e.carnet.nombre}</p>
        <p className="mt-1 opacity-80">
          {c?.nombre} · {S.numero(e.carnet.numero)}
        </p>
        <p className="mt-6 inline-block rounded-full bg-(--pr-ok-suave) px-3 py-1 text-[0.8125rem] font-semibold text-(--pr-ok)">
          {S.alDia}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        if (!nombre.trim() || pagando) return;
        setPagando(true);
        setTimeout(() => d({ tipo: 'asociarme', nombre, cuota }), 900);
      }}
      className="space-y-4"
    >
      <h3 className="pr-titulo text-[1.375rem] font-semibold">{S.titulo}</h3>
      <p className="text-(--pr-tinta-2)">{S.texto}</p>
      <fieldset className="grid gap-2">
        <legend className="sr-only">{S.titulo}</legend>
        {CUOTAS.map((c) => (
          <label
            key={c.id}
            className="flex min-h-14 items-center justify-between gap-3 rounded-xl bg-(--pr-papel) px-4"
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="cuota"
                checked={cuota === c.id}
                onChange={() => setCuota(c.id)}
              />
              <span className="font-medium">{c.nombre}</span>
            </span>
            <span className="tabular-nums">{pesos(c.monto)}</span>
          </label>
        ))}
      </fieldset>
      <p className="text-[0.8125rem] text-(--pr-tinta-2)">{S.montoEjemplo}</p>
      <label className="block">
        <span className="mb-1.5 block text-[0.9375rem] font-medium">{S.nombre}</span>
        <input
          className="pr-campo"
          value={nombre}
          onChange={(x) => setNombre(x.target.value)}
          autoComplete="name"
          maxLength={40}
        />
      </label>
      <button type="submit" aria-disabled={!nombre.trim()} className="pr-boton w-full">
        {pagando ? S.pagando : S.pagar}
      </button>
    </form>
  );
}

/* ---------------- Donar ---------------- */

function Donar({ e, d }: { e: EstadoDemo; d: Dispatch<Accion> }) {
  const D = U.donar;
  const [monto, setMonto] = useState<number>(CAMPANA.montos[1]);
  const [gracias, setGracias] = useState(false);
  const avance = Math.min(1, e.juntado / CAMPANA.meta);
  return (
    <div className="space-y-5">
      <section aria-labelledby="campana" className="rounded-2xl bg-(--pr-papel) p-5">
        <p className="text-[0.8125rem] tracking-[0.12em] text-(--pr-tinta-2) uppercase">
          {D.titulo}
        </p>
        <h3 id="campana" className="pr-titulo mt-1 text-[1.375rem] font-semibold">
          {CAMPANA.titulo}
        </h3>
        <p className="mt-1 text-(--pr-tinta-2)">{CAMPANA.texto}</p>
        <div
          className="pr-barra mt-4"
          role="progressbar"
          aria-label={CAMPANA.titulo}
          aria-valuemin={0}
          aria-valuemax={CAMPANA.meta}
          aria-valuenow={e.juntado}
          aria-valuetext={D.de(pesos(e.juntado), pesos(CAMPANA.meta))}
        >
          <span style={{ transform: `scaleX(${avance})` }} />
        </div>
        <p className="mt-2 text-[0.875rem] tabular-nums" aria-live="polite">
          {D.de(pesos(e.juntado), pesos(CAMPANA.meta))}
        </p>
      </section>
      <fieldset>
        <legend className="mb-2 font-medium">{D.elegir}</legend>
        <div className="grid grid-cols-3 gap-2">
          {CAMPANA.montos.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={monto === m}
              onClick={() => setMonto(m)}
              className={cn(
                'min-h-12 rounded-xl border tabular-nums',
                monto === m
                  ? 'border-(--pr-tinta) font-semibold'
                  : 'border-(--pr-linea) bg-(--pr-papel)',
              )}
            >
              {pesos(m)}
            </button>
          ))}
        </div>
      </fieldset>
      <button
        type="button"
        className="pr-boton w-full"
        onClick={() => {
          d({ tipo: 'donar', monto });
          setGracias(true);
        }}
      >
        {D.donar} {pesos(monto)}
      </button>
      {gracias ? (
        <p role="status" className="font-medium text-(--pr-ok)">
          {D.gracias}
        </p>
      ) : null}
      <div>
        <p className="font-medium">{D.especie}</p>
        <ul className="mt-2 flex flex-wrap gap-2 text-[0.875rem]">
          {ESPECIE_NECESARIA.map((x) => (
            <li key={x} className="rounded-full bg-(--pr-papel) px-3 py-1.5">
              {x}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Sumate ---------------- */

function Sumate({ e, d }: { e: EstadoDemo; d: Dispatch<Accion> }) {
  const S = U.sumate;
  return (
    <div>
      <h3 className="pr-titulo text-[1.375rem] font-semibold">{S.titulo}</h3>
      <p className="mt-1 text-(--pr-tinta-2)">{S.texto}</p>
      <ul className="mt-4 space-y-2.5">
        {ACTIVIDADES.map((a) => {
          const quedan = a.cupo - (e.anotados[a.id] ?? 0);
          const mio = e.mias.includes(a.id);
          return (
            <li
              key={a.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-(--pr-papel) p-4"
            >
              <span className="min-w-0">
                <span className="block font-semibold">{a.nombre}</span>
                <span className="block text-[0.8125rem] text-(--pr-tinta-2)">
                  {fechaActividad(a.dias, a.hora)} · {quedan > 0 ? S.lugares(quedan) : S.lleno}
                </span>
              </span>
              <button
                type="button"
                disabled={mio || quedan <= 0}
                aria-label={`${mio ? S.anotado : S.anotarme}: ${a.nombre}`}
                onClick={() => d({ tipo: 'anotarme', actividad: a.id })}
                className={cn(
                  'min-h-11 shrink-0 rounded-full px-4 text-[0.875rem] font-semibold',
                  mio
                    ? 'bg-(--pr-ok-suave) text-(--pr-ok)'
                    : quedan <= 0
                      ? 'text-(--pr-tinta-2)'
                      : 'bg-(--pr-acento) text-white',
                )}
              >
                {mio ? S.anotado : quedan <= 0 ? S.lleno : S.anotarme}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
