'use client';

import * as m from 'motion/react-m';
import type { KeyboardEvent, Ref } from 'react';
import type { IconName } from '@/components/icons/paths';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { SelectCard } from '@/components/ui/SelectCard';
import { getRubro, RUBRO_OTRO_ID, RUBROS } from '@/config/rubros';
import { StepHeader } from './StepHeader';

interface StepRubroProps {
  rubro: string | null;
  rubroOtro: string;
  error: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  onElegir: (id: string) => void;
  onRubroOtro: (texto: string) => void;
  onContinuar: () => void;
}

export function StepRubro({
  rubro,
  rubroOtro,
  error,
  headingRef,
  onElegir,
  onRubroOtro,
  onContinuar,
}: StepRubroProps) {
  const elegido = getRubro(rubro);

  // Enter avanza también estando sobre una tarjeta (los radios no envían el form por sí solos).
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
      <StepHeader
        title="¿Qué rubro sos?"
        subtitle="Elegí el que más se parezca a tu negocio."
        headingRef={headingRef}
      />

      <fieldset>
        <legend className="sr-only">Rubro de tu negocio</legend>
        <div className="grid grid-cols-2 gap-3">
          {RUBROS.map((r) => (
            <SelectCard
              key={r.id}
              name="rubro"
              value={r.id}
              checked={rubro === r.id}
              onSelect={onElegir}
              label={r.nombre}
              icon={r.icono as IconName}
            />
          ))}
        </div>
      </fieldset>

      {/* Descripción del rubro elegido: espacio reservado para que no salte el layout. */}
      <p aria-live="polite" className="mt-4 min-h-11 text-small text-muted">
        {elegido?.descripcionCorta}
      </p>

      {rubro === RUBRO_OTRO_ID && (
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2"
        >
          <Input
            label="¿A qué se dedica tu negocio?"
            name="rubroOtro"
            value={rubroOtro}
            onChange={(e) => onRubroOtro(e.target.value)}
            maxLength={80}
            autoComplete="off"
            autoFocus
            placeholder="Ej: floristería, veterinaria…"
          />
        </m.div>
      )}

      <div aria-live="polite" className="mt-2">
        {error && <p className="text-small text-danger">{error}</p>}
      </div>

      <Button type="submit" fullWidth className="mt-6">
        Continuar
      </Button>
    </form>
  );
}
