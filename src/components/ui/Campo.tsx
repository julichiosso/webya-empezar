'use client';

import {
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { MICROCOPY } from '@/content/microcopy';
import type { ContratoCampo } from './contratos';
import { cn } from './clases';
import { Spinner } from './Spinner';

interface ExtrasCampo extends ContratoCampo {
  /** Validando (p. ej. el número de WhatsApp): aria-busy y spinner donde va el check. */
  cargando?: boolean;
  /**
   * Texto del contador para lectores de pantalla (p. ej. "12 de 500 caracteres"), desde content.
   * Sin él, el contador se lee tal como se ve ("12/500").
   */
  etiquetaContador?: (usados: number, maximo: number) => string;
}

const CONTROL = cn(
  'w-full rounded-control border bg-control-fondo px-4 text-body text-control-texto placeholder:text-subtle',
  'disabled:cursor-not-allowed disabled:opacity-45',
);

/** Un solo color de borde por estado (dos utilidades de borde chocarían en el CSS generado). */
const bordeDe = (error?: string) =>
  error ? 'border-control-error' : 'border-control-borde hover:border-muted focus:border-foco';

function largoInicial(value: unknown, defaultValue: unknown) {
  const v = value ?? defaultValue;
  return v === undefined || v === null ? 0 : String(v).length;
}

/** Cuenta caracteres (solo si hay `maximo`). Si el campo es controlado, manda `value`. */
function useContador(value: unknown, defaultValue: unknown) {
  const [largo, setLargo] = useState(() => largoInicial(value, defaultValue));
  const actual = value !== undefined && value !== null ? String(value).length : largo;
  return [actual, setLargo] as const;
}

interface MarcoProps extends ExtrasCampo {
  id: string;
  largo: number;
  children: ReactNode;
}

function Marco({
  id,
  etiqueta,
  ayuda,
  error,
  opcional,
  maximo,
  largo,
  etiquetaContador,
  children,
}: MarcoProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between gap-4 text-small font-medium"
      >
        <span>{etiqueta}</span>
        {opcional && <span className="font-normal text-subtle">{MICROCOPY.opcional}</span>}
      </label>
      {children}
      {(ayuda || maximo !== undefined) && (
        <div className="mt-2 flex items-start justify-between gap-4 text-small">
          {ayuda ? (
            <p id={`${id}-ayuda`} className="text-control-ayuda">
              {ayuda}
            </p>
          ) : (
            <span />
          )}
          {maximo !== undefined && (
            <p id={`${id}-contador`} className="tabular shrink-0 text-subtle">
              <span aria-hidden={etiquetaContador ? true : undefined}>
                {largo}/{maximo}
              </span>
              {etiquetaContador && (
                <span className="sr-only">{etiquetaContador(largo, maximo)}</span>
              )}
            </p>
          )}
        </div>
      )}
      {/* La región vive siempre en el DOM para que los lectores de pantalla anuncien los cambios. */}
      <div id={`${id}-error`} aria-live="polite">
        {error && <p className="mt-2 text-small text-control-error">{error}</p>}
      </div>
    </div>
  );
}

function describedBy(id: string, { ayuda, error, maximo }: ContratoCampo, propio?: string) {
  return (
    cn(
      propio,
      ayuda && `${id}-ayuda`,
      maximo !== undefined && `${id}-contador`,
      error && `${id}-error`,
    ) || undefined
  );
}

function Estado({
  valido,
  error,
  cargando,
  arriba,
}: Pick<ExtrasCampo, 'valido' | 'error' | 'cargando'> & { arriba?: boolean }) {
  // En una línea va centrado; en el área de texto, a la altura de la primera línea.
  const lugar = arriba ? 'top-4 right-4' : 'inset-y-0 right-4';
  if (cargando) {
    return (
      <span className={cn('pointer-events-none absolute flex items-center text-muted', lugar)}>
        <Spinner tamanio={20} />
      </span>
    );
  }
  if (!valido || error) return null;
  return (
    <span className={cn('pointer-events-none absolute flex items-center text-accent', lugar)}>
      <Icon name="check" size={20} draw active title={MICROCOPY.valido} />
    </span>
  );
}

type CampoProps = ExtrasCampo &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'maxLength'> & { ref?: Ref<HTMLInputElement> };

/**
 * Campo de una línea. Estados: default, hover, focus (borde de foco + anillo global), active (tocar la
 * etiqueta enfoca el control), disabled, loading (`cargando`), error (aria-invalid + mensaje anunciado
 * y asociado con aria-describedby; nunca solo color) y success (`valido`: check). Siempre ≥ 16 px
 * (iOS no hace zoom) y 56 px de alto.
 */
export function Campo({
  etiqueta,
  ayuda,
  error,
  valido,
  opcional,
  maximo,
  cargando,
  etiquetaContador,
  id,
  className,
  ref,
  onChange,
  'aria-describedby': propio,
  ...rest
}: CampoProps) {
  const auto = useId();
  const campoId = id ?? auto;
  const [largo, setLargo] = useContador(rest.value, rest.defaultValue);
  const contrato = { etiqueta, ayuda, error, maximo };
  return (
    <Marco
      id={campoId}
      {...contrato}
      opcional={opcional}
      largo={largo}
      etiquetaContador={etiquetaContador}
    >
      <div className="relative">
        <input
          ref={ref}
          id={campoId}
          maxLength={maximo}
          aria-invalid={error ? true : undefined}
          aria-busy={cargando || undefined}
          aria-describedby={describedBy(campoId, contrato, propio)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (maximo !== undefined) setLargo(e.target.value.length);
            onChange?.(e);
          }}
          className={cn(
            'h-14',
            CONTROL,
            bordeDe(error),
            (cargando || (valido && !error)) && 'pr-12',
            className,
          )}
          {...rest}
        />
        <Estado valido={valido} error={error} cargando={cargando} />
      </div>
    </Marco>
  );
}

type CampoAreaProps = ExtrasCampo &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength'> & {
    ref?: Ref<HTMLTextAreaElement>;
  };

/** Campo de varias líneas (p. ej. "Otra cosa / a medida", hasta 500 caracteres con `maximo`). */
export function CampoArea({
  etiqueta,
  ayuda,
  error,
  valido,
  opcional,
  maximo,
  cargando,
  etiquetaContador,
  id,
  className,
  ref,
  onChange,
  'aria-describedby': propio,
  ...rest
}: CampoAreaProps) {
  const auto = useId();
  const campoId = id ?? auto;
  const [largo, setLargo] = useContador(rest.value, rest.defaultValue);
  const contrato = { etiqueta, ayuda, error, maximo };
  return (
    <Marco
      id={campoId}
      {...contrato}
      opcional={opcional}
      largo={largo}
      etiquetaContador={etiquetaContador}
    >
      <div className="relative">
        <textarea
          ref={ref}
          id={campoId}
          maxLength={maximo}
          aria-invalid={error ? true : undefined}
          aria-busy={cargando || undefined}
          aria-describedby={describedBy(campoId, contrato, propio)}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            if (maximo !== undefined) setLargo(e.target.value.length);
            onChange?.(e);
          }}
          className={cn(
            'min-h-28 resize-y py-4',
            CONTROL,
            bordeDe(error),
            (cargando || (valido && !error)) && 'pr-12',
            className,
          )}
          {...rest}
        />
        <Estado valido={valido} error={error} cargando={cargando} arriba />
      </div>
    </Marco>
  );
}
