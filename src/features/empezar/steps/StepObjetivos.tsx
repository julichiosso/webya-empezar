'use client';

import * as m from 'motion/react-m';
import type { KeyboardEvent, Ref } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { getRubro } from '@/config/rubros';
import { StepHeader } from './StepHeader';

interface StepObjetivosProps {
  rubro: string | null;
  objetivos: string[];
  error: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  onToggle: (id: string) => void;
  onContinuar: () => void;
}

// Cascada de los chips: solo opacity + translateY.
const lista = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
};
const item = {
  oculto: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const } },
};

export function StepObjetivos({
  rubro,
  objetivos,
  error,
  headingRef,
  onToggle,
  onContinuar,
}: StepObjetivosProps) {
  const opciones = getRubro(rubro)?.objetivos ?? [];

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
        title="¿Qué querés lograr?"
        subtitle="Marcá todo lo que te sirva. Lo armamos a partir de eso."
        headingRef={headingRef}
      />

      <fieldset>
        <legend className="sr-only">Objetivos para tu negocio</legend>
        <m.ul
          key={rubro}
          variants={lista}
          initial="oculto"
          animate="visible"
          className="flex flex-wrap gap-3"
        >
          {opciones.map((o) => (
            <m.li key={o.id} variants={item} className="list-none">
              <Chip
                value={o.id}
                label={o.etiqueta}
                checked={objetivos.includes(o.id)}
                onToggle={onToggle}
              />
            </m.li>
          ))}
        </m.ul>
      </fieldset>

      <p aria-live="polite" className="tabular mt-4 min-h-6 text-small text-muted">
        {objetivos.length > 0
          ? `Elegiste ${objetivos.length} ${objetivos.length === 1 ? 'cosa' : 'cosas'}.`
          : ''}
      </p>
      <div aria-live="polite">{error && <p className="text-small text-danger">{error}</p>}</div>

      <Button type="submit" fullWidth className="mt-6">
        Continuar
      </Button>
    </form>
  );
}
