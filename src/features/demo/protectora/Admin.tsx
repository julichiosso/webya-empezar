'use client';

import { useState, type Dispatch, type FormEvent } from 'react';
import { cn } from '@/components/ui/clases';
import {
  CUENTAS,
  CUOTAS,
  ESPECIES,
  ESTADOS_SOLICITUD,
  TAMANOS,
  UI_PROTECTORA,
  type Especie,
  type Tamano,
} from '@/content/demos/protectora';
import { ORDEN_SOLICITUD, type Accion, type EstadoDemo } from './estado';
import { pesos } from './formato';
import { Ilustracion } from './Ilustracion';

const A = UI_PROTECTORA.admin;
type Seccion = 'solicitudes' | 'cargar' | 'socios' | 'cuentas';
const SECCIONES: readonly Seccion[] = ['solicitudes', 'cargar', 'socios', 'cuentas'];

/** Lo que ve el equipo (con usuario y contraseña en el sistema real): solicitudes, carga, socios y cuentas. */
export function Admin({ e, d }: { e: EstadoDemo; d: Dispatch<Accion> }) {
  const [seccion, setSeccion] = useState<Seccion>('solicitudes');
  return (
    <div>
      {e.aviso ? (
        <button
          type="button"
          role="status"
          onClick={() => {
            d({ tipo: 'verAviso' });
            setSeccion('solicitudes');
          }}
          className="pr-push mb-4 flex w-full items-center gap-3 rounded-2xl border border-[var(--pr-linea)] bg-[var(--pr-papel)] p-3 text-left"
        >
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--pr-acento)] text-white"
          >
            <Ilustracion especie="perro" className="size-6" ojos="var(--pr-acento)" />
          </span>
          <span className="min-w-0 flex-1 text-[0.8125rem] leading-snug">
            <span className="flex justify-between text-[var(--pr-tinta-2)]">
              <span>{A.push.app}</span>
              <span>{A.push.cuando}</span>
            </span>
            <span className="block font-semibold">{A.push.titulo}</span>
            <span className="block truncate">
              {A.pushTexto(
                e.aviso.persona,
                e.animales.find((x) => x.id === e.aviso!.animal)?.nombre ?? '',
              )}
            </span>
          </span>
        </button>
      ) : null}

      <nav
        aria-label={UI_PROTECTORA.vistas.admin}
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1"
      >
        {SECCIONES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={seccion === s}
            onClick={() => setSeccion(s)}
            className={cn(
              'min-h-11 shrink-0 rounded-full px-4 text-[0.9375rem] font-medium',
              seccion === s
                ? 'bg-[var(--pr-tinta)] text-[var(--pr-fondo)]'
                : 'bg-[var(--pr-papel)] text-[var(--pr-tinta-2)]',
            )}
          >
            {A[s]}
          </button>
        ))}
      </nav>
      <div className="mt-5">
        {seccion === 'solicitudes' ? <Solicitudes e={e} d={d} /> : null}
        {seccion === 'cargar' ? <Cargar d={d} /> : null}
        {seccion === 'socios' ? <Socios e={e} d={d} /> : null}
        {seccion === 'cuentas' ? <Cuentas /> : null}
      </div>
    </div>
  );
}

function Solicitudes({ e, d }: { e: EstadoDemo; d: Dispatch<Accion> }) {
  if (e.solicitudes.length === 0) return <p className="text-[var(--pr-tinta-2)]">{A.vacio}</p>;
  return (
    <ul className="space-y-2.5">
      {e.solicitudes.map((s) => {
        const animal = e.animales.find((x) => x.id === s.animal);
        const i = ORDEN_SOLICITUD.indexOf(s.estado);
        const siguiente = ORDEN_SOLICITUD[i + 1];
        return (
          <li key={s.id} className="rounded-2xl bg-[var(--pr-papel)] p-4">
            <p className="flex items-center justify-between gap-3">
              <span className="font-semibold">
                {s.persona} · {animal?.nombre}
              </span>
              <span className="rounded-full bg-[var(--pr-acento-suave)] px-2.5 py-0.5 text-[0.75rem] font-semibold text-[var(--pr-acento)]">
                {ESTADOS_SOLICITUD[s.estado]}
              </span>
            </p>
            {siguiente ? (
              <button
                type="button"
                onClick={() => d({ tipo: 'avanzar', id: s.id })}
                className="pr-boton-2 mt-3 w-full"
              >
                {A.avanzar} {ESTADOS_SOLICITUD[siguiente].toLowerCase()}
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function Cargar({ d }: { d: Dispatch<Accion> }) {
  const N = A.nuevo;
  const [foto, setFoto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState<Especie>('perro');
  const [tamano, setTamano] = useState<Tamano>('mediano');
  const [caracter, setCaracter] = useState('');
  const [error, setError] = useState('');
  const [publicado, setPublicado] = useState('');

  const publicar = (ev: FormEvent) => {
    ev.preventDefault();
    if (!foto || !nombre.trim()) return setError(N.faltan);
    d({ tipo: 'publicar', nombre, especie, tamano, caracter });
    setPublicado(nombre.trim());
    setError('');
    setFoto(false);
    setNombre('');
    setCaracter('');
  };

  return (
    <form onSubmit={publicar} noValidate className="space-y-4">
      <h3 className="pr-titulo text-[1.375rem] font-semibold">{N.titulo}</h3>
      <button
        type="button"
        onClick={() => setFoto(true)}
        className={cn(
          'grid aspect-[4/3] w-full place-items-center rounded-2xl border border-dashed border-[var(--pr-linea)]',
          foto ? 'pr-tono-cielo border-solid' : 'bg-[var(--pr-papel)]',
        )}
      >
        {foto ? (
          <span className="grid justify-items-center gap-2">
            <Ilustracion especie={especie} className="w-24 text-[var(--pr-tinta)]" />
            <span className="text-[0.875rem] font-medium">{N.fotoLista}</span>
          </span>
        ) : (
          <span className="font-semibold">{N.foto}</span>
        )}
      </button>
      <label className="block">
        <span className="mb-1.5 block text-[0.9375rem] font-medium">{N.nombre}</span>
        <input
          className="pr-campo"
          value={nombre}
          onChange={(x) => setNombre(x.target.value)}
          maxLength={24}
        />
      </label>
      <fieldset>
        <legend className="mb-1.5 text-[0.9375rem] font-medium">{N.especie}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['perro', 'gato'] as const).map((s) => (
            <label
              key={s}
              className="flex min-h-12 items-center gap-3 rounded-xl bg-[var(--pr-papel)] px-3.5"
            >
              <input
                type="radio"
                name="especie"
                checked={especie === s}
                onChange={() => setEspecie(s)}
              />
              <span>{ESPECIES[s]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="mb-1.5 block text-[0.9375rem] font-medium">{N.tamano}</span>
        <select
          className="pr-campo"
          value={tamano}
          onChange={(x) => setTamano(x.target.value as Tamano)}
        >
          {(Object.keys(TAMANOS) as Tamano[]).map((t) => (
            <option key={t} value={t}>
              {TAMANOS[t]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[0.9375rem] font-medium">{N.caracter}</span>
        <input
          className="pr-campo"
          value={caracter}
          placeholder={N.caracterEjemplo}
          onChange={(x) => setCaracter(x.target.value)}
          maxLength={60}
        />
      </label>
      <p aria-live="polite" className="min-h-5 text-[0.875rem] font-medium">
        {error ? <span className="text-[var(--pr-acento)]">{error}</span> : null}
        {publicado ? <span className="text-[var(--pr-ok)]">{N.publicado(publicado)}</span> : null}
      </p>
      <button type="submit" className="pr-boton w-full">
        {N.publicar}
      </button>
    </form>
  );
}

function Socios({ e, d }: { e: EstadoDemo; d: Dispatch<Accion> }) {
  return (
    <ul className="space-y-2.5">
      {e.socios.map((s) => {
        const cuota = CUOTAS.find((c) => c.id === s.cuota);
        const recordado = e.recordados.includes(s.id);
        // Sin número: WhatsApp abre para elegir el contacto. La demo nunca le escribe a nadie.
        const href = `https://wa.me/?text=${encodeURIComponent(A.recordatorio(s.nombre.split(' ')[0]!))}`;
        return (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--pr-papel)] p-4"
          >
            <span className="min-w-0">
              <span className="block font-semibold">{s.nombre}</span>
              <span className="block text-[0.8125rem] text-[var(--pr-tinta-2)]">
                {cuota?.nombre} ·{' '}
                <span
                  className={
                    s.debe ? 'font-semibold text-[var(--pr-acento)]' : 'text-[var(--pr-ok)]'
                  }
                >
                  {s.debe ? A.debe(s.debe) : A.alDia}
                </span>
              </span>
            </span>
            {s.debe ? (
              <a
                href={href}
                target="_blank"
                rel="noopener"
                onClick={() => d({ tipo: 'recordar', socio: s.id })}
                className="min-h-11 shrink-0 rounded-full border border-[var(--pr-linea)] px-3.5 py-2.5 text-[0.8125rem] font-semibold"
              >
                {recordado ? A.recordado : A.recordar}
              </a>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function Cuentas() {
  const total = (xs: readonly { monto: number }[]) => xs.reduce((t, x) => t + x.monto, 0);
  const ingresos = total(CUENTAS.ingresos);
  const gastos = total(CUENTAS.gastos);
  const bloque = (titulo: string, xs: readonly { nombre: string; monto: number }[]) => (
    <div className="rounded-2xl bg-[var(--pr-papel)] p-4">
      <h4 className="font-semibold">{titulo}</h4>
      <dl className="mt-2 space-y-1.5 text-[0.9375rem]">
        {xs.map((x) => (
          <div key={x.nombre} className="flex justify-between gap-3">
            <dt className="text-[var(--pr-tinta-2)]">{x.nombre}</dt>
            <dd className="tabular-nums">{pesos(x.monto)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
  return (
    <div className="space-y-3">
      {bloque(A.ingresos, CUENTAS.ingresos)}
      {bloque(A.gastos, CUENTAS.gastos)}
      <p className="flex justify-between rounded-2xl bg-[var(--pr-tinta)] p-4 font-semibold text-[var(--pr-fondo)]">
        <span>{A.saldo}</span>
        <span className="tabular-nums">{pesos(ingresos - gastos)}</span>
      </p>
      <p className="text-[0.8125rem] text-[var(--pr-tinta-2)]">{A.cuentasNota}</p>
    </div>
  );
}
