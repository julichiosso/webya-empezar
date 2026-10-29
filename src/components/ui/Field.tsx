import { useId, type InputHTMLAttributes, type Ref, type TextareaHTMLAttributes } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { MICROCOPY } from '@/content/microcopy';

interface FieldProps {
  label: string;
  hint?: string;
  /** Mensaje de error ya redactado para la persona (amable y específico). */
  error?: string;
  /** Muestra "Opcional" junto a la etiqueta. */
  optional?: boolean;
  /** Campo ya tocado y válido: muestra el check de éxito. */
  valid?: boolean;
}

const control =
  'w-full rounded-control border bg-surface px-4 text-body text-fg placeholder:text-subtle ' +
  'border-line hover:border-line-strong focus:border-accent aria-[invalid=true]:border-danger ' +
  'disabled:opacity-45';

function Shell({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between gap-4 text-small font-medium"
      >
        <span>{label}</span>
        {optional && <span className="font-normal text-subtle">{MICROCOPY.opcional}</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-small text-subtle">
          {hint}
        </p>
      )}
      {/* La región vive siempre en el DOM para que los lectores de pantalla anuncien los cambios. */}
      <div id={`${id}-error`} aria-live="polite">
        {error && <p className="mt-2 text-small text-danger">{error}</p>}
      </div>
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  return (
    [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  );
}

type InputProps = FieldProps &
  InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> };

export function Input({
  label,
  hint,
  error,
  optional,
  valid,
  className,
  id,
  ref,
  ...rest
}: InputProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Shell id={fieldId} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative">
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, hint, error)}
          className={`h-14 ${control} ${valid ? 'pr-12' : ''} ${className ?? ''}`.trim()}
          {...rest}
        />
        {valid && !error && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-accent">
            <Icon name="check" size={20} draw active title={MICROCOPY.valido} />
          </span>
        )}
      </div>
    </Shell>
  );
}

type TextareaProps = FieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> };

export function Textarea({
  label,
  hint,
  error,
  optional,
  className,
  id,
  ref,
  ...rest
}: TextareaProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Shell id={fieldId} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, hint, error)}
        className={`min-h-28 resize-y py-4 ${control} ${className ?? ''}`.trim()}
        {...rest}
      />
    </Shell>
  );
}
