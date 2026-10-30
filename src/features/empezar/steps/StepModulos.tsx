'use client';

import * as m from 'motion/react-m';
import type { KeyboardEvent, Ref } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ModuloOption } from '@/components/ui/ModuloOption';
import { PASO_MODULOS } from '@/content/empezar/pasos';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { MICROCOPY } from '@/content/microcopy';
import { getModulo, MODULO_IDS, type ModuloId } from '@/content/modulos';
import { getRubro } from '@/content/rubros';
import { esSugerido, sugeridosPorNecesidad } from '../modulos';
import { StepHeader } from './StepHeader';

interface StepModulosProps {
  rubro: string | null;
  /** Necesidades marcadas en el paso 1: también sugieren módulos. */
  necesidades: readonly string[];
  /** Módulos activos (sugeridos + decisiones manuales + lo que vino del hero o la demo). */
  modulos: readonly ModuloId[];
  objetivos: string[];
  /** El envío completo (desde la demo) pide al menos un módulo; el lead parcial, no. */
  exigeModulo: boolean;
  error: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  onToggleModulo: (id: ModuloId) => void;
  onToggleObjetivo: (id: string) => void;
  onContinuar: () => void;
  /** Aviso opcional arriba de los módulos (p. ej. "Trajimos lo que armaste en la demo…"). */
  aviso?: string;
}

const TXT = FLUJO.modulos;

// Cascada de los elementos: solo opacity + translateY.
const lista = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
};
const item = {
  oculto: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const } },
};

/** El estado honesto en palabras, con su aclaración pendiente (TODO visible) si la tiene. */
function textoEstado(id: ModuloId) {
  const mod = getModulo(id);
  const etiqueta = TXT.estados[mod.estado].etiqueta;
  return mod.notaEstado ? `${etiqueta} · ${mod.notaEstado}` : etiqueta;
}

export function StepModulos({
  rubro,
  necesidades,
  modulos,
  objetivos,
  exigeModulo,
  error,
  headingRef,
  onToggleModulo,
  onToggleObjetivo,
  onContinuar,
  aviso,
}: StepModulosProps) {
  const opciones = getRubro(rubro)?.objetivos ?? [];
  const porNecesidad = sugeridosPorNecesidad(necesidades);
  const sinModulos = modulos.length === 0;
  const bloqueado = exigeModulo && sinModulos;
  const soloAMedida = !exigeModulo && sinModulos && porNecesidad.size === 0;

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    // Enter dentro de un checkbox avanza (los checkbox no envían el form por sí solos).
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
      if (!bloqueado) onContinuar();
    }
  };

  const insignia = (id: ModuloId) =>
    esSugerido(rubro, id)
      ? MICROCOPY.sugeridoParaTuRubro
      : porNecesidad.has(id)
        ? TXT.sugeridoPorNecesidad
        : undefined;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!bloqueado) onContinuar();
      }}
      onKeyDown={onKeyDown}
    >
      <StepHeader title={TXT.titulo} subtitle={TXT.bajada} headingRef={headingRef} />

      {aviso && (
        <p className="-mt-2 mb-6 rounded-control border border-line bg-surface p-4 text-small text-muted">
          {aviso}
        </p>
      )}

      <fieldset>
        <legend className="sr-only">{TXT.leyenda}</legend>
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
                  insignia={insignia(id)}
                  estado={mod.estado}
                  textoEstado={textoEstado(id)}
                  onToggle={onToggleModulo}
                />
              </m.li>
            );
          })}
        </m.ul>
      </fieldset>

      <p aria-live="polite" className="tabular mt-4 min-h-6 text-small text-muted">
        {!sinModulos
          ? TXT.activaste(modulos.length)
          : exigeModulo
            ? PASO_MODULOS.sinModulos
            : soloAMedida
              ? TXT.soloAMedida
              : TXT.sinModulos}
      </p>

      {opciones.length > 0 && (
        <fieldset className="mt-8">
          <legend className="text-heading font-semibold">
            {TXT.objetivos.leyenda}{' '}
            <span className="font-normal text-muted">{TXT.objetivos.opcional}</span>
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

      <Button type="submit" fullWidth className="mt-6" disabled={bloqueado}>
        {TXT.siguiente}
      </Button>
    </form>
  );
}
