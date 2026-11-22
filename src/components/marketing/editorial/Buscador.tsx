'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { BUSCADOR as B, LARGO_BUSQUEDA } from '@/content/buscador';
import { track } from '@/lib/analytics';
import { limpiarConsulta } from '@/lib/busqueda';
import type * as Indice from './buscador-indice';

type IndiceBuscador = typeof Indice;
import { enlaceContacto } from './contacto';
import { Cerrar, WhatsApp } from './Iconos';

interface Opcion {
  id: string;
  titulo: string;
  texto: string;
  href: string;
  externo?: boolean;
  rubro?: string;
  /** La respuesta del buscador que escucha: se muestra distinta, arriba de todo. */
  escucha?: boolean;
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
 * escrito a WhatsApp, por si no está en la página. Compacto: sin rótulo visible (lo dice el título de la
 * sección) ni ejemplos abajo (los rubros ya están a la vista).
 */
export function Buscador({
  compacto = false,
  etiqueta = B.etiqueta,
}: {
  compacto?: boolean;
  /** El rótulo del campo (en el menú del celular: "¿Qué necesitás?"). */
  etiqueta?: string;
}) {
  const router = useRouter();
  const id = useId();
  const caja = useRef<HTMLInputElement>(null);
  const [texto, setTexto] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const [enFoco, setEnFoco] = useState(false);
  const [ejemplo, setEjemplo] = useState(0);
  const [letras, setLetras] = useState(0);
  const [indice, setIndice] = useState<IndiceBuscador | null>(null);
  const pedido = useRef(false);

  /** El índice se pide la primera vez que se acerca o toca el campo (y llega antes de terminar de escribir). */
  const cargarIndice = () => {
    if (pedido.current) return;
    pedido.current = true;
    import('./buscador-indice')
      .then((m) => setIndice(m))
      .catch(() => {
        pedido.current = false;
      });
  };

  // Con el campo vacío y sin foco, el campo "escribe solo" ejemplos de cómo pedir lo que se necesita: letra por
  // letra, una pausa para leer y lo borra. Con menos movimiento pedido, el ejemplo queda escrito y quieto.
  useEffect(() => {
    if (texto || enFoco) return;
    const frase = B.ejemplosRotan[ejemplo] ?? '';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = setTimeout(() => setLetras(frase.length), 0);
      return () => clearTimeout(t);
    }
    let n = 0;
    let borrando = false;
    let t: ReturnType<typeof setTimeout>;
    const paso = () => {
      if (document.hidden) {
        t = setTimeout(paso, 500);
        return;
      }
      if (!borrando) {
        n += 1;
        setLetras(n);
        if (n >= frase.length) {
          borrando = true;
          t = setTimeout(paso, 1900);
          return;
        }
        t = setTimeout(paso, 55 + Math.random() * 45);
        return;
      }
      n -= 2;
      setLetras(Math.max(0, n));
      if (n <= 0) {
        t = setTimeout(() => setEjemplo((i) => (i + 1) % B.ejemplosRotan.length), 350);
        return;
      }
      t = setTimeout(paso, 22);
    };
    t = setTimeout(paso, 600);
    return () => clearTimeout(t);
  }, [texto, enFoco, ejemplo]);

  const consulta = texto.trim();
  const opciones = useMemo<Opcion[]>(() => {
    if (consulta.length < 1) return [];
    const problema = indice ? indice.detectarProblema(consulta, indice.PROBLEMAS) : null;
    const destino = problema
      ? indice!.DESTINOS_BUSQUEDA.find((d) => d.id === problema.destino)
      : undefined;
    const demo = problema?.demo
      ? indice!.DESTINOS_BUSQUEDA.find((d) => d.id === problema.demo)
      : undefined;
    const escuchados: Opcion[] = destino
      ? [
          {
            id: `escucha-${problema!.id}`,
            titulo: problema!.escucha,
            texto: B.solucion(destino.titulo),
            href: destino.href,
            escucha: true,
          },
          ...(demo ? [demo] : []),
        ]
      : [];
    const usados = new Set(escuchados.map((o) => o.id).concat(destino ? [destino.id] : []));
    const encontrados = [
      ...escuchados,
      ...(indice ? indice.buscar(indice.DESTINOS_BUSQUEDA, consulta, 4) : []).filter(
        (d) => !usados.has(d.id),
      ),
    ].slice(0, 4);
    const rubro = indice ? indice.detectarRubro(consulta, indice.RUBRO_POR_PALABRA) : null;
    const armable = indice
      ? ((destino && (destino.armar || indice.ARMABLES.includes(destino.id))
          ? destino
          : encontrados.find(
              (d) => 'palabras' in d && (d.armar || indice.ARMABLES.includes(d.id)),
            )) as (typeof indice.DESTINOS_BUSQUEDA)[number] | undefined)
      : undefined;
    return [
      ...encontrados,
      ...(armable
        ? [
            {
              id: `armar-${armable.id}`,
              titulo: B.armar(armable.titulo),
              texto: B.armarTexto,
              href: armable.armar ?? indice!.hrefArmar(armable.id, rubro),
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
  }, [consulta, indice]);
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
        <label
          htmlFor={`${id}-caja`}
          className={compacto ? 'sr-only' : 'e-rotulo mb-2.5 block text-ed-muted'}
        >
          {etiqueta}
        </label>
        <div className="e-buscador relative flex min-h-16 items-center gap-3 rounded-2xl bg-ed-surface px-4">
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
              cargarIndice();
              setTexto(limpiarConsulta(e.target.value, LARGO_BUSQUEDA));
              setActivo(0);
              setAbierto(true);
            }}
            onPointerEnter={cargarIndice}
            onFocus={() => {
              cargarIndice();
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
            className="min-w-0 flex-1 scroll-mt-24 bg-transparent py-3 text-[1.125rem] placeholder:text-ed-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {!texto && !enFoco ? (
            // El ejemplo que rota: decorativo (el campo ya tiene su etiqueta), no recibe toques.
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-4 left-12 flex items-center overflow-hidden text-[1.125rem] whitespace-nowrap text-ed-muted"
            >
              {(B.ejemplosRotan[ejemplo] ?? '').slice(0, letras)}
              <span className="e-cursor" />
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
          className="e-sugerencias absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-[1.25rem] p-1.5"
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
              className="e-sugerencia-op flex min-h-14 cursor-pointer items-center gap-3 rounded-[0.875rem] px-3.5 py-2.5"
            >
              {o.externo ? <WhatsApp className="shrink-0" /> : null}
              <span className="min-w-0">
                {o.escucha ? (
                  <span className="block text-[0.75rem] font-semibold tracking-[0.06em] text-ed-muted uppercase">
                    {B.escucha}
                  </span>
                ) : null}
                <span
                  className={
                    o.escucha
                      ? 'block text-[1.0625rem] leading-snug font-semibold'
                      : 'block truncate text-[0.9375rem] font-medium'
                  }
                >
                  {o.titulo}
                </span>
                <span
                  className={`e-sugerencia-ayuda block text-[0.875rem] text-ed-muted ${o.escucha ? 'mt-0.5' : 'truncate'}`}
                >
                  {o.texto}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {!texto && !compacto ? (
        // En el celular no: el campo ya escribe ejemplos solo y la pantalla es chica.
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 max-sm:hidden">
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
              className="min-h-11 rounded-full bg-ed-surface px-4 text-[0.9375rem] text-ed-fg/80 transition-colors hover:text-ed-fg max-sm:[&:nth-of-type(n+4)]:hidden"
            >
              {ej}
            </button>
          ))}
        </p>
      ) : null}
    </div>
  );
}
