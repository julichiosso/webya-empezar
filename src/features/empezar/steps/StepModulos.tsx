'use client';

import * as m from 'motion/react-m';
import type { KeyboardEvent, Ref } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ModuloOption } from '@/components/ui/ModuloOption';
import { getModulo, MODULO_IDS, type ModuloId } from '@/config/modulos';
import { getRubro } from '@/config/rubros';
import { esSugerido } from '../modulos';
import { StepHeader } from './StepHeader';

interface StepModulosProps {
  rubro: string | null;
  /** Módulos activos (sugeridos del rubro + decisiones manuales + lo que vino del hero). */
  modulos: readonly ModuloId[];
  objetivos: string[];
  error: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  onToggleModulo: (id: ModuloId) => void;
  onToggleObjetivo: (id: string) => void;
  onContinuar: () => void;
}

// Cascada de los elementos: solo opacity + translateY.
const lista = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
};
const item = {
  oculto: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const } },
};

export function StepModulos({
  rubro,
  modulos,
  objetivos,
  error,
  headingRef,
  onToggleModulo,
  onToggleObjetivo,
  onContinuar,
}: StepModulosProps) {
  const opciones = getRubro(rubro)?.objetivos ?? [];
  const sinModulos = modulos.length === 0;

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    // Enter dentro de un checkbox avanza (los checkbox no envían el form por sí solos).
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
      if (!sinModulos) onContinuar();
    }
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!sinModulos) onContinuar();
      }}
      onKeyDown={onKeyDown}
    >
      <StepHeader
        title="¿Qué querés activar?"
        subtitle="Activá solo lo que tu negocio necesita. Lo que sugerimos para tu rubro ya viene marcado."
        headingRef={headingRef}
      />

      <fieldset>
        <legend className="sr-only">Módulos para tu negocio</legend>
        <m.ul
          key={`modulos-${rubro}`}
          variants={lista}
          initial="oculto"
          animate="visible"
          className="flex flex-col gap-3"
        >
          {MODULO_IDS.map((id) => {
            const mod = getModulo(id);
            return (
              <m.li key={id} variants={item} className="list-none">
                <ModuloOption
                  id={id}
                  nombre={mod.nombre}
                  descripcion={mod.descripcion}
                  checked={modulos.includes(id)}
                  sugerido={esSugerido(rubro, id)}
                  onToggle={onToggleModulo}
                />
              </m.li>
            );
          })}
        </m.ul>
      </fieldset>

      <p aria-live="polite" className="tabular mt-4 min-h-6 text-small text-muted">
        {sinModulos
          ? 'Activá al menos un módulo para seguir.'
          : `Activaste ${modulos.length} ${modulos.length === 1 ? 'módulo' : 'módulos'}.`}
      </p>

      {opciones.length > 0 && (
        <fieldset className="mt-8">
          <legend className="text-heading font-semibold">
            ¿Para qué lo querés? <span className="font-normal text-muted">(opcional)</span>
          </legend>
          <m.ul
            key={`objetivos-${rubro}`}
            variants={lista}
            initial="oculto"
            animate="visible"
            className="mt-4 flex flex-wrap gap-3"
          >
            {opciones.map((o) => (
              <m.li key={o.id} variants={item} className="list-none">
                <Chip
                  value={o.id}
                  label={o.etiqueta}
                  checked={objetivos.includes(o.id)}
                  onToggle={onToggleObjetivo}
                />
              </m.li>
            ))}
          </m.ul>
        </fieldset>
      )}

      <div aria-live="polite">{error && <p className="text-small text-danger">{error}</p>}</div>

      <Button type="submit" fullWidth className="mt-6" disabled={sinModulos}>
        Siguiente
      </Button>
    </form>
  );
}
