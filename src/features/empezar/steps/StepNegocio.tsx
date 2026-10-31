'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type BaseSyntheticEvent, type ChangeEvent, type Ref } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { Button, type ButtonStatus } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { datosFormShape, LIMITES, MENSAJES_LEAD } from '@/content/leads';
import { formatPhoneInput } from '@/lib/phone';
import type { EnvioResultado } from '../api';
import type { DatosFlujo } from '../state';
import { StepHeader } from './StepHeader';

const TXT = FLUJO.negocio;
const CONTACTO = FLUJO.contacto;

const ciudad = z.string().trim().max(LIMITES.ciudad, MENSAJES_LEAD.hastaCaracteres(LIMITES.ciudad));
const opcional = z.string().trim();

/**
 * `completo`: nombre, WhatsApp y ciudad (orden A). `soloNombre`: nombre y ciudad, sin WhatsApp
 * (orden B, antes de la vista previa). `contacto`: solo el WhatsApp (orden B, al tocar el CTA).
 */
export type VarianteNegocio = 'completo' | 'soloNombre' | 'contacto';

const ESQUEMAS = {
  completo: z.object({
    nombreNegocio: datosFormShape.nombreNegocio,
    whatsapp: datosFormShape.whatsapp,
    ciudad,
  }),
  soloNombre: z.object({ nombreNegocio: datosFormShape.nombreNegocio, whatsapp: opcional, ciudad }),
  contacto: z.object({ nombreNegocio: opcional, whatsapp: datosFormShape.whatsapp, ciudad }),
} as const;
export type ValoresNegocio = z.output<(typeof ESQUEMAS)['completo']>;
type Campo = keyof ValoresNegocio;

/** Orden visual: el foco va al primer campo con error. */
const ORDEN: Campo[] = ['nombreNegocio', 'whatsapp', 'ciudad'];

interface StepNegocioProps {
  inicial: Pick<DatosFlujo, Campo>;
  /** "Otro": no hay vista previa, cambian la promesa y el botón. */
  aMedida: boolean;
  /** Qué campos se piden (ver VarianteNegocio). Por defecto, el formulario completo. */
  variante?: VarianteNegocio;
  headingRef: Ref<HTMLHeadingElement>;
  /** Enfoca el primer campo (solo cuando la persona llegó acá avanzando, no al recargar). */
  enfocarPrimero: boolean;
  onCambio: (datos: Partial<DatosFlujo>) => void;
  /** Guarda el lead parcial. Si sale bien (o falla la red), el wizard pasa a la pantalla 3. */
  onEnviar: (valores: ValoresNegocio, honeypot: string) => Promise<EnvioResultado>;
}

/** El honeypot se lee del formulario enviado (no hace falta un ref). */
const honeypotDe = (evento?: BaseSyntheticEvent) => {
  const form = evento?.target as HTMLFormElement | undefined;
  return (form?.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';
};

/**
 * Pantalla 2: lo mínimo para armar la vista previa y escribirle (nombre del negocio, WhatsApp y,
 * si quiere, la ciudad). Al enviarlo se guarda el lead parcial, aunque la persona no siga.
 */
export function StepNegocio({
  inicial,
  aMedida,
  variante = 'completo',
  headingRef,
  enfocarPrimero,
  onCambio,
  onEnviar,
}: StepNegocioProps) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setFocus,
    formState: { errors, touchedFields },
  } = useForm<z.input<(typeof ESQUEMAS)['completo']>, unknown, ValoresNegocio>({
    resolver: zodResolver(ESQUEMAS[variante]),
    defaultValues: inicial,
    mode: 'onTouched',
    shouldFocusError: false,
  });
  const [status, setStatus] = useState<ButtonStatus>('idle');
  const contacto = variante === 'contacto';
  const soloNombre = variante === 'soloNombre';
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  // Persistir lo que se va escribiendo para sobrevivir a una recarga.
  useEffect(() => {
    // watch() de RHF no es memoizable por el React Compiler; acá solo se usa como suscripción.
    // eslint-disable-next-line react-hooks/incompatible-library
    const sub = watch((v) => onCambio(v as Partial<DatosFlujo>));
    return () => sub.unsubscribe();
  }, [watch, onCambio]);

  const tel = register('whatsapp');
  const onTelefono = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    // Reformatea solo si se escribe al final, para no mover el cursor al editar en el medio.
    if (el.selectionStart === el.value.length) el.value = formatPhoneInput(el.value);
    void tel.onChange(e);
  };

  const ok = (k: Campo) => !!touchedFields[k] && !errors[k];
  const onInvalido = (errs: FieldErrors<ValoresNegocio>) => {
    const primero = ORDEN.find((c) => errs[c]);
    if (primero) setFocus(primero);
  };

  const enviar = handleSubmit(async (valores, evento) => {
    setErrorGlobal(null);
    setStatus('loading');
    const resultado = await onEnviar(valores, honeypotDe(evento));
    if (resultado.ok) return setStatus('success');
    setStatus('idle');
    setErrorGlobal(TXT.erroresEnvio[resultado.causa]);
    const campos = resultado.campos ?? {};
    const conError = ORDEN.filter((c) => campos[c]);
    for (const c of conError) setError(c, { message: campos[c] });
    if (conError[0]) setFocus(conError[0]);
  }, onInvalido);

  return (
    <form noValidate onSubmit={enviar} className="lg:max-w-xl">
      <StepHeader title={contacto ? CONTACTO.titulo : TXT.titulo} headingRef={headingRef} />
      {/* La promesa de la pantalla, bien visible arriba del formulario. */}
      <p className="-mt-3 mb-6 rounded-control border border-accent bg-accent-soft px-4 py-3 text-lead font-medium">
        {contacto
          ? CONTACTO.promesa
          : aMedida
            ? TXT.promesaAMedida
            : soloNombre
              ? TXT.promesaSoloNombre
              : TXT.promesa}
      </p>

      <div className="flex flex-col gap-5">
        {!contacto && (
          <Input
            label={TXT.campos.nombreNegocio.etiqueta}
            placeholder={TXT.campos.nombreNegocio.placeholder}
            autoComplete="organization"
            enterKeyHint="next"
            maxLength={LIMITES.nombreNegocio}
            autoFocus={enfocarPrimero && !contacto}
            error={errors.nombreNegocio?.message}
            valid={ok('nombreNegocio')}
            {...register('nombreNegocio')}
          />
        )}
        {!soloNombre && (
          <Input
            label={TXT.campos.whatsapp.etiqueta}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            enterKeyHint="next"
            placeholder={TXT.campos.whatsapp.placeholder}
            hint={TXT.campos.whatsapp.ayuda}
            maxLength={20}
            autoFocus={enfocarPrimero && contacto}
            error={errors.whatsapp?.message}
            valid={ok('whatsapp')}
            {...tel}
            onChange={onTelefono}
          />
        )}
        {!contacto && (
          <Input
            label={TXT.campos.ciudad.etiqueta}
            placeholder={TXT.campos.ciudad.placeholder}
            optional
            autoComplete="address-level2"
            enterKeyHint="send"
            maxLength={LIMITES.ciudad}
            error={errors.ciudad?.message}
            {...register('ciudad')}
          />
        )}
      </div>

      {/* Honeypot: invisible y fuera del orden de tabulación. Si se completa, es un bot. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {TXT.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div role="alert" className="mt-5 empty:hidden">
        {errorGlobal && (
          <p className="rounded-control border border-danger/40 bg-danger/10 p-4 text-small text-fg">
            {errorGlobal}
          </p>
        )}
      </div>

      <Button type="submit" fullWidth status={status} className="mt-6">
        {status === 'loading'
          ? TXT.enviando
          : contacto
            ? CONTACTO.enviar
            : aMedida
              ? TXT.enviarAMedida
              : TXT.enviar}
      </Button>

      <p className="mt-4 text-small text-subtle">
        {TXT.privacidad} <span className="text-muted">{TXT.todoPrivacidad}</span>
      </p>
    </form>
  );
}
