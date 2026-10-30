'use client';

import * as m from 'motion/react-m';
import type { KeyboardEvent, Ref } from 'react';
import { Button } from '@/components/ui/Button';
import { CampoArea } from '@/components/ui/Campo';
import { Eleccion, GrupoEleccion } from '@/components/ui/Eleccion';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { LIMITES } from '@/content/leads';
import { NECESIDAD_OTRA_ID, NECESIDADES } from '@/content/necesidades';
import { StepHeader } from './StepHeader';

interface StepNecesidadProps {
  necesidades: readonly string[];
  necesidadLibre: string;
  error: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  onToggle: (id: string) => void;
  onLibre: (texto: string) => void;
  onContinuar: () => void;
}

const { necesidad: TXT, otra: OTRA } = FLUJO;

/**
 * Paso 1: "¿Qué necesitás?". Chips de selección múltiple; "Otra cosa" abre el texto libre
 * (hasta 500 caracteres) para lo que no está en la lista y se arma a medida.
 */
export function StepNecesidad({
  necesidades,
  necesidadLibre,
  error,
  headingRef,
  onToggle,
  onLibre,
  onContinuar,
}: StepNecesidadProps) {
  const otra = necesidades.includes(NECESIDAD_OTRA_ID);
  const alLimite = necesidadLibre.length >= LIMITES.necesidadLibre;

  // Enter sobre un chip avanza (los checkbox no envían el form por sí solos). En el texto libre, no.
  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
      onContinuar();
    }
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onContinuar();
      }}
      onKeyDown={onKeyDown}
    >
      <StepHeader title={TXT.titulo} subtitle={TXT.bajada} headingRef={headingRef} />

      <GrupoEleccion
        tipo="multiple"
        leyenda={TXT.leyenda}
        leyendaOculta
        ayuda={TXT.ayuda}
        error={error ?? undefined}
        claseLista="flex flex-wrap gap-3"
      >
        {NECESIDADES.map((n) => (
          <Eleccion
            key={n.id}
            tipo="multiple"
            forma="chip"
            value={n.id}
            checked={necesidades.includes(n.id)}
            onCambio={onToggle}
            etiqueta={n.etiqueta}
            descripcion={n.descripcion}
          />
        ))}
      </GrupoEleccion>

      <p aria-live="polite" className="sr-only">
        {necesidades.length > 0 ? TXT.marcadas(necesidades.length) : ''}
      </p>

      {otra && (
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          <CampoArea
            etiqueta={OTRA.etiqueta}
            ayuda={OTRA.ayuda}
            placeholder={OTRA.placeholder}
            name="necesidadLibre"
            value={necesidadLibre}
            onChange={(e) => onLibre(e.target.value)}
            maximo={LIMITES.necesidadLibre}
            etiquetaContador={(usados, max) => OTRA.contadorAccesible(max - usados)}
            rows={4}
            autoComplete="off"
            autoFocus
          />
          <p aria-live="polite" className="mt-2 text-small text-muted">
            {alLimite ? OTRA.alLimite : OTRA.queSigue}
          </p>
        </m.div>
      )}

      <Button type="submit" fullWidth className="mt-6">
        {TXT.siguiente}
      </Button>
    </form>
  );
}
