'use client';

import * as m from 'motion/react-m';
import type { KeyboardEvent, Ref } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ModuloOption } from '@/components/ui/ModuloOption';
import { PASO_MODULOS } from '@/content/empezar/pasos';
import { getModulo, MODULO_IDS, type ModuloId } from '@/content/modulos';
import { getRubro } from '@/content/rubros';
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
  /** Aviso opcional arriba de los módulos (p. ej. "Trajimos lo que armaste en la demo…"). */
  aviso?: string;
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
  aviso,
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
        title={PASO_MODULOS.titulo}
        subtitle={PASO_MODULOS.bajada}
        headingRef={headingRef}
      />

      {aviso && (
        <p className="-mt-2 mb-6 rounded-control border border-line bg-surface p-4 text-small text-muted">
          {aviso}
        </p>
      )}

      <fieldset>
        <legend className="sr-only">{PASO_MODULOS.leyendaModulos}</legend>
        <m.ul
          key={`modulos-${rubro}`}
          variants={lista}
          initial="oculto"
          animate="visible"
          className="flex flex-col gap-3 lg:grid lg:grid-cols-2"
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
        {sinModulos ? PASO_MODULOS.sinModulos : PASO_MODULOS.activaste(modulos.length)}
      </p>

      {opciones.length > 0 && (
        <fieldset className="mt-8">
          <legend className="text-heading font-semibold">
            {PASO_MODULOS.objetivos.leyenda}{' '}
            <span className="font-normal text-muted">{PASO_MODULOS.objetivos.opcional}</span>
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
        {PASO_MODULOS.siguiente}
      </Button>
    </form>
  );
}
