'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState, type Ref } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import type { z } from 'zod';
import { Button, type ButtonStatus } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { completarLeadSchema, LIMITES, type DatosForm } from '@/content/leads';
import type { CompletarResultado } from '../api';
import { StepHeader } from './StepHeader';

const TXT = FLUJO.completar;
const { campos: CAMPOS } = TXT;

const esquema = completarLeadSchema.omit({ token: true, website: true });
type Valores = z.input<typeof esquema>;
type Campo = keyof Valores;

/** Orden visual de los campos: el foco va al primero con error. */
const ORDEN: Campo[] = ['nombreNegocio', 'nombre', 'email', 'mensaje'];

interface StepCompletarProps {
  inicial: DatosForm;
  headingRef: Ref<HTMLHeadingElement>;
  enfocarPrimero: boolean;
  onCambio: (datos: Partial<DatosForm>) => void;
  /** Completa el lead parcial. Si sale bien, el wizard pasa solo a la confirmación. */
  onEnviar: (datos: Valores, honeypot: string) => Promise<CompletarResultado>;
  /** "Ahora no": deja el lead como parcial y va a la confirmación. */
  onOmitir: () => void;
}

/**
 * Paso 5: completar el lead parcial. Solo el nombre del negocio es obligatorio; el resto suma
 * contexto para la charla. El WhatsApp ya llegó: si esto falla o se omite, igual le escribimos.
 */
export function StepCompletar({
  inicial,
  headingRef,
  enfocarPrimero,
  onCambio,
  onEnviar,
  onOmitir,
}: StepCompletarProps) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setFocus,
    formState: { errors, touchedFields },
  } = useForm<Valores>({
    resolver: zodResolver(esquema),
    defaultValues: {
      nombreNegocio: inicial.nombreNegocio,
      nombre: inicial.nombre,
      email: inicial.email,
      mensaje: inicial.mensaje,
    },
    mode: 'onTouched',
    shouldFocusError: false,
  });
  const [status, setStatus] = useState<ButtonStatus>('idle');
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  // Persistir lo que se va escribiendo para sobrevivir a una recarga.
  useEffect(() => {
    // watch() de RHF no es memoizable por el React Compiler; acá solo se usa como suscripción.
    // eslint-disable-next-line react-hooks/incompatible-library
    const sub = watch((v) => onCambio(v as Partial<DatosForm>));
    return () => sub.unsubscribe();
  }, [watch, onCambio]);

  const ok = (k: Campo) => !!touchedFields[k] && !errors[k];

  const onInvalido = (errs: FieldErrors<Valores>) => {
    const primero = ORDEN.find((c) => errs[c]);
    if (primero) setFocus(primero);
  };

  const enviar = handleSubmit(async (datos) => {
    setErrorGlobal(null);
    setStatus('loading');
    const resultado = await onEnviar(datos, honeypot.current?.value ?? '');
    if (resultado.ok) return setStatus('success');
    setStatus('idle');
    if (resultado.causa === 'vencido') return setErrorGlobal(FLUJO.errores.completarVencido);
    setErrorGlobal(TXT.erroresEnvio[resultado.causa]);
    for (const [campo, mensaje] of Object.entries(
      resultado.causa === 'validacion' ? (resultado.campos ?? {}) : {},
    )) {
      if ((ORDEN as string[]).includes(campo)) setError(campo as Campo, { message: mensaje });
    }
  }, onInvalido);

  return (
    <form noValidate onSubmit={enviar} className="lg:max-w-xl">
      <StepHeader title={TXT.titulo} subtitle={TXT.bajada} headingRef={headingRef} />

      <p className="-mt-2 mb-6 rounded-control border border-line bg-surface p-4 text-small text-muted">
        {TXT.yaGuardado}
      </p>

      <div className="flex flex-col gap-5">
        <Input
          label={CAMPOS.nombreNegocio.etiqueta}
          autoComplete="organization"
          autoCapitalize="words"
          autoFocus={enfocarPrimero}
          enterKeyHint="next"
          maxLength={LIMITES.nombreNegocio}
          error={errors.nombreNegocio?.message}
          valid={ok('nombreNegocio')}
          {...register('nombreNegocio')}
        />
        <Input
          label={CAMPOS.nombre.etiqueta}
          hint={CAMPOS.nombre.ayuda}
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          optional
          maxLength={LIMITES.nombre}
          error={errors.nombre?.message}
          {...register('nombre')}
        />
        <Input
          label={CAMPOS.email.etiqueta}
          hint={CAMPOS.email.ayuda}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="next"
          optional
          maxLength={LIMITES.email}
          error={errors.email?.message}
          {...register('email')}
        />
        <Textarea
          label={CAMPOS.mensaje.etiqueta}
          optional
          rows={3}
          maxLength={LIMITES.mensaje}
          autoComplete="off"
          error={errors.mensaje?.message}
          {...register('mensaje')}
        />

        {/* Honeypot: invisible y fuera del orden de tabulación. Si se completa, es un bot. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            {FLUJO.whatsapp.honeypot}
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>

      <div role="alert" className="mt-5 empty:hidden">
        {errorGlobal && (
          <p className="rounded-control border border-danger/40 bg-danger/10 p-4 text-small text-fg">
            {errorGlobal}
          </p>
        )}
      </div>

      <Button type="submit" fullWidth status={status} className="mt-6">
        {status === 'loading' ? TXT.enviando : TXT.enviar}
      </Button>
      <Button variant="ghost" fullWidth className="mt-2" onClick={onOmitir}>
        {TXT.omitir}
      </Button>
    </form>
  );
}
