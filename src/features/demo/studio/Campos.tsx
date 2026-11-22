'use client';

import { useId, useRef, useState } from 'react';
import { cn } from '@/components/ui/clases';
import { COLORES_MARCA, ESTUDIO, FUENTES_MARCA } from '@/content/demos/studio';
import { liberarImagen, prepararImagen } from '@/lib/imagen-local';
import { colorAjustado } from './marca';

/**
 * Campos grandes y claros del estudio, pensados para el celular y para personas mayores: etiqueta siempre
 * visible, letra de 17 px o más, áreas de toque de 56 px y mensajes que dicen qué hacer.
 */

const ETIQUETA = 'block text-[1.0625rem] font-semibold';
const AYUDA = 'mt-1 block text-[1rem] text-ed-muted';

export function CampoTexto({
  etiqueta,
  ayuda,
  valor,
  onCambio,
  max = 40,
  autoComplete = 'organization',
}: {
  etiqueta: string;
  ayuda?: string;
  valor: string;
  onCambio: (v: string) => void;
  max?: number;
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={ETIQUETA}>
        {etiqueta}
      </label>
      <input
        id={id}
        type="text"
        value={valor}
        maxLength={max}
        autoComplete={autoComplete}
        enterKeyHint="done"
        onChange={(e) => onCambio(e.target.value)}
        aria-describedby={ayuda ? `${id}-ayuda` : undefined}
        className="mt-2 min-h-14 w-full rounded-2xl border border-ed-line-strong bg-ed-bg px-4 text-[1.125rem] outline-none focus:border-ed-fg"
      />
      {ayuda ? (
        <span id={`${id}-ayuda`} className={AYUDA}>
          {ayuda}
        </span>
      ) : null}
    </div>
  );
}

export function SelectorColor({
  valor,
  onCambio,
}: {
  valor: string;
  onCambio: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className={ETIQUETA}>{ESTUDIO.campos.color}</legend>
      <div className="mt-3 grid grid-cols-5 gap-2.5">
        {COLORES_MARCA.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={valor === c.id}
            aria-label={ESTUDIO.campos.colorAria(c.nombre)}
            onClick={() => onCambio(c.id)}
            className={cn(
              'grid aspect-square min-h-14 place-items-center rounded-2xl border-2 transition-transform active:scale-95',
              valor === c.id ? 'border-ed-fg' : 'border-transparent',
            )}
          >
            <span
              aria-hidden="true"
              className="block size-[78%] rounded-xl"
              style={{ background: c.hex }}
            />
          </button>
        ))}
      </div>
      {colorAjustado(valor) ? (
        <p className={AYUDA} role="status">
          {ESTUDIO.campos.colorAjustado}
        </p>
      ) : null}
    </fieldset>
  );
}

export function SelectorFuente({
  valor,
  onCambio,
}: {
  valor: string;
  onCambio: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className={ETIQUETA}>{ESTUDIO.campos.fuente}</legend>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FUENTES_MARCA.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={valor === f.id}
            onClick={() => onCambio(f.id)}
            className="min-h-14 rounded-2xl border-2 border-ed-line px-4 text-left text-[1.25rem] aria-pressed:border-ed-fg"
            style={{ fontFamily: f.pila }}
          >
            {f.nombre}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Subir logo o foto: abre la galería o la cámara del celular. La imagen se achica en el navegador y
 * nunca sale del dispositivo (lo dice en pantalla). Reemplazar o quitar libera la URL anterior.
 */
export function SubirFoto({
  etiqueta = ESTUDIO.foto.subir,
  url,
  onCambio,
  redonda = false,
}: {
  etiqueta?: string;
  url?: string;
  onCambio: (url?: string) => void;
  redonda?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState<'' | 'procesando' | keyof typeof ESTUDIO.foto.errores>('');
  const elegir = async (archivo?: File) => {
    if (!archivo) return;
    setEstado('procesando');
    const r = await prepararImagen(archivo, 800);
    if ('error' in r) {
      setEstado(r.error);
      return;
    }
    liberarImagen(url);
    onCambio(r.url);
    setEstado('');
  };
  return (
    <div>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            'grid size-20 shrink-0 place-items-center overflow-hidden border border-ed-line bg-ed-surface',
            redonda ? 'rounded-full' : 'rounded-2xl',
          )}
        >
          {url ? (
            // Imagen local (blob:), ya achicada: next/image no aplica.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="size-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-8 text-ed-muted">
              <path
                d="M4 17l4.5-5 3.5 4 2.5-3L20 17M4 5h16v14H4z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="min-h-14 rounded-full bg-ed-fg px-5 text-[1.0625rem] font-semibold text-ed-bg"
          >
            {url ? ESTUDIO.foto.cambiar : etiqueta}
          </button>
          {url ? (
            <button
              type="button"
              onClick={() => {
                liberarImagen(url);
                onCambio(undefined);
              }}
              className="min-h-14 rounded-full border border-ed-line-strong px-5 text-[1.0625rem]"
            >
              {ESTUDIO.foto.quitar}
            </button>
          ) : null}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          void elegir(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <p className={AYUDA} role="status">
        {estado === 'procesando'
          ? ESTUDIO.foto.procesando
          : estado
            ? ESTUDIO.foto.errores[estado]
            : `${ESTUDIO.foto.ayuda} ${ESTUDIO.privacidad}`}
      </p>
    </div>
  );
}
