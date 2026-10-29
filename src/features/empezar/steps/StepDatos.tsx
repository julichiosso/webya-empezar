'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState, type ChangeEvent, type Ref } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { Button, ButtonLink, type ButtonStatus } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import { formatPhoneInput } from '@/lib/phone';
import { datosFormSchema, LIMITES, type DatosForm } from '@/domain/leads/lead';
import type { EnvioResultado } from '../api';
import { StepHeader } from './StepHeader';

interface StepDatosProps {
  inicial: DatosForm;
  headingRef: Ref<HTMLHeadingElement>;
  /** Enfoca el primer campo (solo cuando la persona llegó acá avanzando, no al recargar). */
  enfocarPrimero: boolean;
  /** Link de WhatsApp de respaldo si el envío falla. */
  whatsappFallback: string | null;
  onCambio: (datos: DatosForm) => void;
  onEnviar: (datos: DatosForm, honeypot: string) => Promise<EnvioResultado>;
  onEnviado: () => void;
}

/** Orden visual de los campos: el foco va al primero con error. */
const ORDEN_CAMPOS: (keyof DatosForm)[] = [
  'nombreNegocio',
  'nombre',
  'whatsapp',
  'email',
  'mensaje',
];

const MENSAJES_ERROR = {
  limite:
    'Enviaste varios formularios seguidos. Esperá unos minutos y probá de nuevo, o escribinos por WhatsApp.',
  servidor: 'No pudimos guardar tus datos. Probá de nuevo en un momento.',
  red: 'Parece que no hay conexión. Revisá tu internet y probá de nuevo.',
  validacion: 'Revisá los campos marcados y probá de nuevo.',
} as const;

export function StepDatos({
  inicial,
  headingRef,
  enfocarPrimero,
  whatsappFallback,
  onCambio,
  onEnviar,
  onEnviado,
}: StepDatosProps) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setFocus,
    formState: { errors, touchedFields },
  } = useForm<DatosForm>({
    resolver: zodResolver(datosFormSchema),
    defaultValues: inicial,
    // Valida al salir del campo; después revalida mientras corrige. Nunca mientras escribe por primera vez.
    mode: 'onTouched',
    // El foco al primer error se maneja a mano (ver onInvalido): RHF sigue el orden de registro,
    // no el orden visual de los campos.
    shouldFocusError: false,
  });
  const [status, setStatus] = useState<ButtonStatus>('idle');
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const valores = watch();

  // Persistir lo que se va escribiendo para sobrevivir a una recarga.
  useEffect(() => {
    // watch() de RHF no es memoizable por el React Compiler; acá solo se usa como suscripción.
    // eslint-disable-next-line react-hooks/incompatible-library
    const sub = watch((v) => onCambio(v as DatosForm));
    return () => sub.unsubscribe();
  }, [watch, onCambio]);

  const ok = (k: keyof DatosForm) => !!touchedFields[k] && !errors[k] && valores[k].trim() !== '';

  const whatsappReg = register('whatsapp');
  const onWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    // Reformatea solo si se escribe al final, para no mover el cursor al editar en el medio.
    if (el.selectionStart === el.value.length) el.value = formatPhoneInput(el.value);
    void whatsappReg.onChange(e);
  };

  const onInvalido = (errs: FieldErrors<DatosForm>) => {
    const primero = ORDEN_CAMPOS.find((campo) => errs[campo]);
    if (primero) setFocus(primero);
  };

  const enviar = handleSubmit(async (datos) => {
    setErrorGlobal(null);
    setStatus('loading');
    const resultado = await onEnviar(datos, honeypot.current?.value ?? '');
    if (resultado.ok) {
      setStatus('success');
      // Deja ver el check antes de pasar a la confirmación.
      setTimeout(onEnviado, 700);
      return;
    }
    setStatus('idle');
    setErrorGlobal(MENSAJES_ERROR[resultado.causa]);
    for (const [campo, mensaje] of Object.entries(resultado.campos ?? {})) {
      if (campo in datosFormSchema.shape) setError(campo as keyof DatosForm, { message: mensaje });
    }
  }, onInvalido);

  return (
    <form noValidate onSubmit={enviar} className="lg:max-w-xl">
      <StepHeader
        title="Contanos de tu negocio"
        subtitle="Con esto armamos tu negocio y te escribimos para ponerlo online."
        headingRef={headingRef}
      />

      <div className="flex flex-col gap-5">
        <Input
          label="Nombre de tu negocio"
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
          label="Tu nombre"
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          maxLength={LIMITES.nombre}
          error={errors.nombre?.message}
          valid={ok('nombre')}
          {...register('nombre')}
        />
        <Input
          label="Tu WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="next"
          placeholder="11 2345 6789"
          hint="Te escribimos por acá. No hace falta el 15 ni el +54."
          maxLength={20}
          error={errors.whatsapp?.message}
          valid={ok('whatsapp')}
          {...whatsappReg}
          onChange={onWhatsappChange}
        />
        <Input
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="next"
          optional
          maxLength={LIMITES.email}
          error={errors.email?.message}
          valid={ok('email')}
          {...register('email')}
        />
        <Textarea
          label="¿Algo más que quieras contarnos?"
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
            No completes este campo
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>

      <div role="alert" className="mt-5 empty:hidden">
        {errorGlobal && (
          <div className="rounded-control border border-danger/40 bg-danger/10 p-4 text-small">
            <p className="text-fg">{errorGlobal}</p>
            {whatsappFallback && (
              <ButtonLink
                href={whatsappFallback}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="mt-3"
              >
                Escribinos por WhatsApp
              </ButtonLink>
            )}
          </div>
        )}
      </div>

      <Button type="submit" fullWidth status={status} className="mt-6">
        {status === 'loading' ? 'Enviando…' : 'Enviar'}
      </Button>

      <p className="mt-4 text-small text-subtle">
        Usamos tus datos solo para contactarte por tu proyecto y no los compartimos con nadie.{' '}
        <span className="text-muted">TODO: enlazar la política de privacidad.</span>
      </p>
    </form>
  );
}
