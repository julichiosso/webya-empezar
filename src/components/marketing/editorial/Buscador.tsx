'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/components/ui/clases';
import {
  ARMABLES,
  BUSCADOR as B,
  DESTINOS_BUSQUEDA,
  LARGO_BUSQUEDA,
  RUBRO_POR_PALABRA,
} from '@/content/buscador';
import { RUTAS } from '@/content/home';
import { track } from '@/lib/analytics';
import { buscar, detectarRubro, limpiarConsulta } from '@/lib/busqueda';
import { enlaceContacto } from './contacto';
import { Cerrar, WhatsApp } from './Iconos';

interface Opcion {
  id: string;
  titulo: string;
  texto: string;
  href: string;
  externo?: boolean;
  rubro?: string;
}

function Lupa() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

/**
 * Buscador del hero: la persona escribe lo que necesita con sus palabras y aparecen sugerencias a medida
 * que escribe (combobox accesible: flechas, Enter, Escape). Todo se busca en el navegador; lo escrito se
 * limpia y se recorta, nunca se interpreta como HTML ni se envía. La última opción siempre lleva lo
 * escrito a WhatsApp, por si no está en la página.
 */
export function Buscador() {
  const router = useRouter();
  const id = useId();
  const caja = useRef<HTMLInputElement>(null);
  const [texto, setTexto] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const [enFoco, setEnFoco] = useState(false);
  const [ejemplo, setEjemplo] = useState(0);

  // Con el campo vacío y sin foco, rotan ejemplos de cómo escribir. Quieto si se pidió menos movimiento.
  useEffect(() => {
    if (texto || enFoco) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      if (!document.hidden) setEjemplo((i) => (i + 1) % B.ejemplosRotan.length);
    }, 3200);
    return () => clearInterval(t);
  }, [texto, enFoco]);

  const consulta = texto.trim();
  const opciones = useMemo<Opcion[]>(() => {
    if (consulta.length < 2) return [];
    const encontrados = buscar(DESTINOS_BUSQUEDA, consulta, 4);
    const rubro = detectarRubro(consulta, RUBRO_POR_PALABRA);
    const armable = encontrados.find((d) => ARMABLES.includes(d.id));
    return [
      ...encontrados,
      ...(armable
        ? [
            {
              id: `armar-${armable.id}`,
              titulo: B.armar(armable.titulo),
              texto: B.armarTexto,
              href: rubro ? RUTAS.armarCaso(armable.id, rubro) : RUTAS.armarTipo(armable.id),
              rubro: rubro ?? '',
            },
          ]
        : []),
      {
        id: 'escribinos',
        titulo: B.escribinos(consulta),
        texto: encontrados.length ? B.escribinosTexto : B.sinResultados,
        href: enlaceContacto(B.mensaje(consulta)).href,
        externo: true,
      },
    ];
  }, [consulta]);
  const mostrar = abierto && opciones.length > 0;

  const ir = (o: Opcion | undefined) => {
    if (!o) return;
    setAbierto(false);
    track('buscador_elegido', { destino: o.id, rubro: o.rubro ?? '' });
    if (o.externo) window.open(o.href, '_blank', 'noopener');
    else router.push(o.href);
  };

  const teclas = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setAbierto(true);
      if (!opciones.length) return;
      setActivo((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + opciones.length) % opciones.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      ir(opciones[activo]);
    } else if (e.key === 'Escape') {
      setAbierto(false);
    }
  };

  return (
    <div className="relative">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor={`${id}-caja`} className="e-rotulo mb-2.5 block text-ed-muted">
          {B.etiqueta}
        </label>
        <div className="e-buscador relative flex min-h-14 items-center gap-3 rounded-2xl bg-ed-surface px-4">
          <Lupa />
          <input
            ref={caja}
            id={`${id}-caja`}
            type="search"
            role="combobox"
            aria-expanded={mostrar}
            aria-controls={`${id}-lista`}
            aria-autocomplete="list"
            aria-activedescendant={mostrar ? `${id}-op-${activo}` : undefined}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            maxLength={LARGO_BUSQUEDA}
            value={texto}
            placeholder={enFoco ? B.placeholder : ''}
            onChange={(e) => {
              setTexto(limpiarConsulta(e.target.value, LARGO_BUSQUEDA));
              setActivo(0);
              setAbierto(true);
            }}
            onFocus={() => {
              setEnFoco(true);
              setAbierto(true);
              // En el celular, el buscador sube para dejar lugar a las sugerencias.
              if (window.innerWidth < 1024)
                caja.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }}
            onBlur={() => {
              setEnFoco(false);
              setTimeout(() => setAbierto(false), 120);
            }}
            onKeyDown={teclas}
            className="min-w-0 flex-1 scroll-mt-24 bg-transparent py-3 text-base placeholder:text-ed-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {!texto && !enFoco ? (
            // El ejemplo que rota: decorativo (el campo ya tiene su etiqueta), no recibe toques.
            <span
              key={ejemplo}
              aria-hidden="true"
              className="e-buscador-ejemplo pointer-events-none absolute inset-y-0 right-4 left-12 flex items-center truncate text-base text-ed-muted"
            >
              {B.ejemplosRotan[ejemplo]}
            </span>
          ) : null}
          {texto ? (
            <button
              type="button"
              aria-label={B.limpiar}
              onClick={() => {
                setTexto('');
                caja.current?.focus();
              }}
              className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ed-muted hover:text-ed-fg"
            >
              <Cerrar />
            </button>
          ) : null}
        </div>
      </form>

      {mostrar ? (
        <ul
          id={`${id}-lista`}
          role="listbox"
          aria-label={B.sugerencias}
          className="e-sugerencias absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-ed-line-strong bg-ed-bg p-1.5"
        >
          {opciones.map((o, i) => (
            <li
              key={o.id}
              id={`${id}-op-${i}`}
              role="option"
              aria-selected={i === activo}
              onMouseEnter={() => setActivo(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => ir(o)}
              className={cn(
                'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5',
                i === activo ? 'bg-ed-surface' : '',
              )}
            >
              {o.externo ? <WhatsApp className="shrink-0 text-ed-muted" /> : null}
              <span className="min-w-0">
                <span className="block truncate text-[0.9375rem] font-medium">{o.titulo}</span>
                <span className="block truncate text-[0.8125rem] text-ed-muted">{o.texto}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {!texto ? (
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="e-chico text-ed-muted">{B.ejemplosEtiqueta}</span>
          {B.ejemplos.map((ej) => (
            <button
              key={ej}
              type="button"
              onClick={() => {
                setTexto(ej);
                setActivo(0);
                setAbierto(true);
                caja.current?.focus();
              }}
              className="min-h-9 rounded-full bg-ed-surface px-3 text-[0.8125rem] text-ed-muted transition-colors hover:text-ed-fg"
            >
              {ej}
            </button>
          ))}
        </p>
      ) : null}
    </div>
  );
}
