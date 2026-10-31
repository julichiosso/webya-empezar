'use client';

import type { ReactNode, Ref } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { Button, ButtonLink } from '@/components/ui/Button';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { StepHeader } from './StepHeader';

const TXT = FLUJO.resultado;

interface StepResultadoProps {
  nombreNegocio: string;
  /** "Otro": sin vista previa, la pantalla honesta de "Lo armamos a medida". */
  aMedida: boolean;
  /** La vista previa (en celular va acá; en escritorio vive en la columna derecha). */
  preview: ReactNode;
  whatsappLink: string | null;
  /** Link a la demo completa con nombre y paleta cargados (solo rubros con demo). */
  demoUrl: string | null;
  /** Hay lead guardado: se puede completar. Si no (falló el guardado), solo WhatsApp. */
  puedeCompletar: boolean;
  headingRef: Ref<HTMLHeadingElement>;
  onCta: () => void;
  onDemo: () => void;
  onCompletar: () => void;
}

/**
 * Pantalla 3: "Así te queda" con la vista previa y un CTA único (WhatsApp con lo que armó). El
 * secundario es dejar más datos. Si eligió "Otro", no hay vista previa: "Lo armamos a medida".
 */
export function StepResultado({
  nombreNegocio,
  aMedida,
  preview,
  whatsappLink,
  demoUrl,
  puedeCompletar,
  headingRef,
  onCta,
  onDemo,
  onCompletar,
}: StepResultadoProps) {
  const nombre = nombreNegocio.trim();
  const titulo = aMedida
    ? TXT.aMedida.titulo
    : nombre
      ? TXT.titulo(nombre)
      : TXT.tituloSinNombre;

  return (
    <div className="lg:max-w-xl">
      <StepHeader
        title={titulo}
        subtitle={aMedida ? TXT.aMedida.texto : TXT.bajada}
        headingRef={headingRef}
      />

      {!aMedida && <div className="mb-6 lg:hidden">{preview}</div>}

      {!puedeCompletar && (
        <p role="status" className="mb-4 rounded-control border border-line bg-surface p-4 text-small">
          {TXT.sinGuardar}
        </p>
      )}

      {whatsappLink ? (
        <ButtonLink
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          onClick={onCta}
        >
          <Icon name="chat" size={20} />
          {aMedida ? TXT.aMedida.cta : TXT.cta}
        </ButtonLink>
      ) : (
        <p data-todo className="text-small text-subtle">
          {TXT.todoWhatsapp}
        </p>
      )}
      <p className="mt-3 text-small text-muted">{TXT.queSigue}</p>
      <p data-todo className="mt-1 text-small text-subtle">
        {TXT.todoPlazo}
      </p>

      {demoUrl && (
        <a
          href={demoUrl}
          onClick={onDemo}
          className="mt-6 flex min-h-tap items-center justify-between gap-4 rounded-card border border-line-strong bg-surface p-4 hover:border-accent"
        >
          <span>
            <span className="block font-semibold">{TXT.demo.titulo}</span>
            <span className="block text-small text-muted">{TXT.demo.bajada}</span>
          </span>
          <Icon name="arrowRight" size={20} />
        </a>
      )}

      {puedeCompletar && (
        <Button variant="ghost" fullWidth className="mt-4" onClick={onCompletar}>
          {TXT.completar}
        </Button>
      )}
    </div>
  );
}
