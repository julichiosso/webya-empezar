'use client';

import type { Ref } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { Button, ButtonLink } from '@/components/ui/Button';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { StepHeader } from './StepHeader';

const TXT = FLUJO.listo;

interface StepGraciasProps {
  nombreNegocio: string;
  whatsappLink: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  onWhatsapp: () => void;
  onReiniciar: () => void;
}

/** Después de completar los datos: gracias, qué sigue y la salida por WhatsApp. */
export function StepGracias({
  nombreNegocio,
  whatsappLink,
  headingRef,
  onWhatsapp,
  onReiniciar,
}: StepGraciasProps) {
  const nombre = nombreNegocio.trim();
  return (
    <div className="lg:max-w-xl">
      <span
        aria-hidden="true"
        className="hero-piece mb-6 flex size-14 items-center justify-center rounded-full border border-accent bg-accent-soft text-fg"
      >
        <Icon name="check" size={28} />
      </span>
      <StepHeader
        title={TXT.titulo}
        subtitle={nombre ? TXT.texto(nombre) : TXT.textoSinNombre}
        headingRef={headingRef}
      />
      <p data-todo className="-mt-3 mb-6 text-small text-subtle">
        {TXT.todoPlazo}
      </p>
      {whatsappLink && (
        <ButtonLink
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          fullWidth
          onClick={onWhatsapp}
        >
          <Icon name="chat" size={20} />
          {TXT.whatsapp}
        </ButtonLink>
      )}
      <Button variant="ghost" fullWidth className="mt-2" onClick={onReiniciar}>
        {TXT.reiniciar}
      </Button>
    </div>
  );
}
