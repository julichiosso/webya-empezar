'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import type { IconName } from '@/brand/ilustracion/iconos/paths';
import { RUBROS_FLOTANTES, type RubroFlotante } from '@/content/rubros-flotantes';
import { EVENTO_RUBRO } from '@/lib/eventos';
import estilos from './RubrosFlotantes.module.css';

interface Props {
  rubros?: readonly RubroFlotante[];
  /** Palabras en escritorio. */
  cantidad?: number;
  /** Cuántas se ven en celular. */
  cantidadMovil?: number;
}

// Posiciones y movimiento determinísticos: mismo HTML en servidor y cliente.
const media = (q: string) =>
  typeof window.matchMedia === 'function' && window.matchMedia(q).matches;

/** Ícono de cada familia de rubros; "otro" rota entre íconos de uso general. */
const ICONO_RUBRO: Record<string, IconName> = {
  gastronomia: 'cubiertos',
  peluqueria_estetica: 'tijera',
  comercio: 'tienda',
  profesionales: 'portafolio',
  gimnasio_deportes: 'pesa',
  servicios_tecnicos: 'llave',
};
const ICONOS_OTROS: readonly IconName[] = ['agenda', 'ticket', 'bolsa', 'mesa', 'reloj', 'chat'];
const LADO_ICONO = [36, 52, 72] as const;

function iconoDe(r: RubroFlotante, indice: number): IconName {
  return ICONO_RUBRO[r.rubroWizard] ?? ICONOS_OTROS[indice % ICONOS_OTROS.length] ?? 'chat';
}

const num = (i: number, k: number) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

function ranura(i: number, cantidad: number) {
  const cols = 6;
  const filas = Math.ceil(cantidad / cols);
  const x = (((i % cols) + 0.1 + num(i, 1) * 0.7) / cols) * 100;
  const y = ((Math.floor(i / cols) + 0.1 + num(i, 2) * 0.7) / filas) * 100;
  const tam = num(i, 3) < 0.5 ? 1 : num(i, 3) < 0.85 ? 2 : 3;
  return {
    x: `${x.toFixed(1)}%`,
    y: `${y.toFixed(1)}%`,
    tam,
    dur: `${(18 + num(i, 4) * 22).toFixed(1)}s`,
    delay: `-${(num(i, 5) * 30).toFixed(1)}s`,
    ax: `${((num(i, 6) - 0.5) * 60).toFixed(0)}px`,
    ay: `${((num(i, 7) - 0.5) * 40).toFixed(0)}px`,
    d: ((num(i, 8) - 0.5) * 8 * tam).toFixed(1),
  };
}

/**
 * Capa de fondo con rubros que derivan despacio. Decorativa (aria-hidden, sin eventos). El
 * movimiento es CSS; el JS rota una palabra cada 6-12 s, enciende el rubro elegido en el wizard y
 * hace un parallax leve con el cursor (solo con mouse y sin reduced-motion).
 */
export function RubrosFlotantes({
  rubros = RUBROS_FLOTANTES,
  cantidad = 24,
  cantidadMovil = 9,
}: Props) {
  const total = Math.min(cantidad, rubros.length);
  const [indices, setIndices] = useState<number[]>(() =>
    Array.from({ length: total }, (_, i) => Math.floor((i * rubros.length) / total)),
  );
  const [saliendo, setSaliendo] = useState<number | null>(null);
  const [elegido, setElegido] = useState<string | null>(null);
  const capa = useRef<HTMLDivElement>(null);
  const indicesRef = useRef(indices);

  useEffect(() => {
    indicesRef.current = indices;
  }, [indices]);

  useEffect(() => {
    if (media('(prefers-reduced-motion: reduce)')) return;
    let timer: ReturnType<typeof setTimeout>;
    let swap: ReturnType<typeof setTimeout>;
    const paso = () => {
      if (!document.hidden) {
        const slot = Math.floor(Math.random() * total);
        const usados = new Set(indicesRef.current);
        const libres = rubros.map((_, i) => i).filter((i) => !usados.has(i));
        if (libres.length > 0) {
          setSaliendo(slot);
          swap = setTimeout(() => {
            const nuevo = libres[Math.floor(Math.random() * libres.length)] ?? 0;
            setIndices((prev) => prev.map((v, i) => (i === slot ? nuevo : v)));
            setSaliendo(null);
          }, 650);
        }
      }
      timer = setTimeout(paso, 6000 + Math.random() * 6000);
    };
    timer = setTimeout(paso, 6000);
    return () => {
      clearTimeout(timer);
      clearTimeout(swap);
    };
  }, [rubros, total]);

  useEffect(() => {
    const alElegir = (e: Event) => {
      const id = (e as CustomEvent<string | null>).detail ?? null;
      setElegido(id);
      if (!id) return;
      if (indicesRef.current.some((i) => rubros[i]?.rubroWizard === id)) return;
      const candidato = rubros.findIndex((r) => r.rubroWizard === id);
      if (candidato >= 0) setIndices((prev) => prev.map((v, i) => (i === 0 ? candidato : v)));
    };
    window.addEventListener(EVENTO_RUBRO, alElegir);
    return () => window.removeEventListener(EVENTO_RUBRO, alElegir);
  }, [rubros]);

  useEffect(() => {
    const el = capa.current;
    if (!el) return;
    const fino = media('(hover: hover) and (pointer: fine)');
    const quieto = media('(prefers-reduced-motion: reduce)');
    if (!fino || quieto) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const mover = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty('--px', `${px}px`);
        el.style.setProperty('--py', `${py}px`);
      });
    };
    window.addEventListener('pointermove', mover, { passive: true });
    return () => {
      window.removeEventListener('pointermove', mover);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={capa}
      aria-hidden="true"
      className={estilos.capa}
      data-elegido={elegido ? 'si' : 'no'}
    >
      {indices.map((idx, slot) => {
        const r = rubros[idx];
        if (!r) return null;
        const s = ranura(slot, total);
        return (
          <span
            key={slot}
            className={estilos.pos}
            data-i={slot >= cantidadMovil ? 'oculto' : undefined}
            style={{ '--x': s.x, '--y': s.y, '--d': s.d } as CSSProperties}
          >
            <span
              className={`${estilos.palabra} ${estilos[`t${s.tam}`]}`}
              data-activo={elegido && r.rubroWizard === elegido ? '' : undefined}
              data-saliendo={saliendo === slot ? '' : undefined}
              style={
                {
                  '--dur': s.dur,
                  '--delay': s.delay,
                  '--ax': s.ax,
                  '--ay': s.ay,
                } as CSSProperties
              }
            >
              <Icon name={iconoDe(r, idx)} size={LADO_ICONO[s.tam - 1] ?? 52} />
              <span className={estilos.etiqueta}>{r.nombre}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
