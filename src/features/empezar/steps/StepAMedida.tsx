'use client';

import { useState, type Ref } from 'react';
import { Button } from '@/components/ui/Button';
import { CampoArea } from '@/components/ui/Campo';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { LIMITES } from '@/content/leads';
import { StepHeader } from './StepHeader';

const TXT = FLUJO.aMedida;

/** Caracteres restantes en los que se avisa a lectores de pantalla (no en cada tecla). */
const UMBRALES_AVISO = [50, 20, 10];

interface StepAMedidaProps {
  texto: string;
  error: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  enfocarPrimero: boolean;
  onCambio: (texto: string) => void;
  onContinuar: () => void;
}

/** "Otro": el pedido con sus palabras (hasta 500 caracteres). Después va al formulario. */
export function StepAMedida({
  texto,
  error,
  headingRef,
  enfocarPrimero,
  onCambio,
  onContinuar,
}: StepAMedidaProps) {
  const alLimite = texto.length >= LIMITES.necesidadLibre;
  const [avisoRestantes, setAvisoRestantes] = useState('');
  const escribir = (valor: string) => {
    const restantes = LIMITES.necesidadLibre - valor.length;
    if (UMBRALES_AVISO.includes(restantes)) setAvisoRestantes(TXT.contadorAccesible(restantes));
    else if (restantes > Math.max(...UMBRALES_AVISO)) setAvisoRestantes('');
    onCambio(valor);
  };

  return (
    <form
      noValidate
      className="lg:max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        onContinuar();
      }}
    >
      <StepHeader title={TXT.titulo} subtitle={TXT.bajada} headingRef={headingRef} />
      <CampoArea
        etiqueta={TXT.etiqueta}
        placeholder={TXT.placeholder}
        name="necesidadLibre"
        value={texto}
        onChange={(e) => escribir(e.target.value)}
        maximo={LIMITES.necesidadLibre}
        etiquetaContador={(usados, max) => TXT.contadorAccesible(max - usados)}
        error={error ?? undefined}
        rows={5}
        autoComplete="off"
        autoFocus={enfocarPrimero}
      />
      <p aria-live="polite" className="mt-2 min-h-6 text-small text-muted">
        {alLimite ? TXT.alLimite : ''}
      </p>
      <p aria-live="polite" className="sr-only">
        {alLimite ? '' : avisoRestantes}
      </p>
      <Button type="submit" fullWidth className="mt-4">
        {TXT.siguiente}
      </Button>
    </form>
  );
}
