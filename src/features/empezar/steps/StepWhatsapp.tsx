'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type BaseSyntheticEvent, type ChangeEvent, type Ref } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, ButtonLink, type ButtonStatus } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { datosFormShape } from '@/content/leads';
import { formatPhoneInput } from '@/lib/phone';
import type { EnvioResultado } from '../api';
import { StepHeader } from './StepHeader';

const TXT = FLUJO.whatsapp;

const esquema = z.object({ whatsapp: datosFormShape.whatsapp });
type Valores = z.input<typeof esquema>;

interface StepWhatsappProps {
  inicial: string;
  headingRef: Ref<HTMLHeadingElement>;
  /** Enfoca el campo (solo cuando la persona llegó acá avanzando, no al recargar). */
  enfocarPrimero: boolean;
  /** Link de WhatsApp de respaldo si el guardado falla. */
  whatsappFallback: string | null;
  /** Guarda el lead parcial. Si sale bien, el wizard pasa solo al paso siguiente. */
  onEnviar: (whatsapp: string, honeypot: string) => Promise<EnvioResultado>;
}

/** El honeypot se lee del formulario enviado (no hace falta un ref). */
const honeypotDe = (evento?: BaseSyntheticEvent) => {
  const form = evento?.target as HTMLFormElement | undefined;
  return (form?.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';
};

/**
 * Paso 4: solo el WhatsApp. Al enviarlo se guarda el lead parcial con todo lo elegido hasta acá,
 * aunque la persona no siga: es lo único que hace falta para escribirle.
 */
export function StepWhatsapp({
  inicial,
  headingRef,
  enfocarPrimero,
  whatsappFallback,
  onEnviar,
}: StepWhatsappProps) {
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, touchedFields },
  } = useForm<Valores>({
    resolver: zodResolver(esquema),
    defaultValues: { whatsapp: inicial },
    mode: 'onTouched',
  });
  const [status, setStatus] = useState<ButtonStatus>('idle');
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  const reg = register('whatsapp');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    // Reformatea solo si se escribe al final, para no mover el cursor al editar en el medio.
    if (el.selectionStart === el.value.length) el.value = formatPhoneInput(el.value);
    void reg.onChange(e);
  };

  const onInvalido = () => setFocus('whatsapp');

  const enviar = handleSubmit(async ({ whatsapp }, evento) => {
    setErrorGlobal(null);
    setStatus('loading');
    const resultado = await onEnviar(whatsapp, honeypotDe(evento));
    if (resultado.ok) return setStatus('success');
    setStatus('idle');
    setErrorGlobal(TXT.erroresEnvio[resultado.causa]);
    const deCampo = resultado.campos?.whatsapp;
    if (deCampo) {
      setError('whatsapp', { message: deCampo });
      setFocus('whatsapp');
    }
  }, onInvalido);

  return (
    <form noValidate onSubmit={enviar} className="lg:max-w-xl">
      <StepHeader title={TXT.titulo} subtitle={TXT.bajada} headingRef={headingRef} />

      <Input
        label={TXT.campo.etiqueta}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        enterKeyHint="send"
        placeholder={TXT.campo.placeholder}
        hint={TXT.campo.ayuda}
        maxLength={20}
        autoFocus={enfocarPrimero}
        error={errors.whatsapp?.message}
        valid={!!touchedFields.whatsapp && !errors.whatsapp}
        {...reg}
        onChange={onChange}
      />

      {/* Honeypot: invisible y fuera del orden de tabulación. Si se completa, es un bot. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {TXT.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6 rounded-control border border-line bg-surface p-4">
        <h3 className="text-small font-semibold">{TXT.queSigue.titulo}</h3>
        <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-small text-muted">
          {TXT.queSigue.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <p className="mt-2 text-small text-subtle">{TXT.todoPlazo}</p>
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
                {TXT.whatsappRespaldo}
              </ButtonLink>
            )}
          </div>
        )}
      </div>

      <Button type="submit" fullWidth status={status} className="mt-6">
        {status === 'loading' ? TXT.enviando : TXT.enviar}
      </Button>

      <p className="mt-4 text-small text-subtle">
        {TXT.privacidad} <span className="text-muted">{TXT.todoPrivacidad}</span>
      </p>
    </form>
  );
}
