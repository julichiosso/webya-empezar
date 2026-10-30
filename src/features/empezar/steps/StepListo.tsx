'use client';

import * as m from 'motion/react-m';
import type { Ref } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { ButtonLink, Button } from '@/components/ui/Button';
import { PASO_LISTO } from '@/content/empezar/pasos';
import { getModulo, type ModuloId } from '@/content/modulos';
import { track } from '@/lib/analytics';

interface StepListoProps {
  nombre: string;
  rubro: string;
  /** Módulos que activó la persona (no los sugeridos en bruto: lo que quedó elegido). */
  modulos: readonly ModuloId[];
  whatsappLink: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  onReiniciar: () => void;
}

const lista = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.35 } },
};
// Cada módulo "encaja" desde abajo: translateY + scale + opacity.
const pieza = {
  oculto: { opacity: 0, y: 20, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 24 },
  },
};

export function StepListo({
  nombre,
  rubro,
  modulos: ids,
  whatsappLink,
  headingRef,
  onReiniciar,
}: StepListoProps) {
  const modulos = ids.map((id) => getModulo(id));
  const primerNombre = nombre.split(' ')[0] ?? nombre;

  return (
    <div>
      <div className="relative mb-6 flex size-14 items-center justify-center">
        {/* Un único anillo que se expande y se desvanece: celebración sobria. */}
        <m.span
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="absolute inset-0 rounded-full border border-accent"
        />
        <m.span
          aria-hidden="true"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 20 }}
          className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-fg"
        >
          <Icon name="check" size={28} draw active />
        </m.span>
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-title font-semibold text-balance outline-none focus-visible:outline-none"
      >
        {PASO_LISTO.titulo}
      </h2>
      <p className="mt-2 text-lead text-muted">
        {PASO_LISTO.gracias.antes}
        {primerNombre}
        {PASO_LISTO.gracias.trasNombre}
        <strong className="font-semibold text-fg">{rubro}</strong>
        {PASO_LISTO.gracias.trasRubro}
      </p>

      <m.ul
        variants={lista}
        initial="oculto"
        animate="visible"
        aria-label={PASO_LISTO.ariaPiezas}
        className="mt-6 flex flex-col gap-3"
      >
        {modulos.map((mod) => (
          <m.li
            key={mod.id}
            variants={pieza}
            className="flex items-start gap-4 rounded-card border border-line bg-surface p-4 shadow-raised"
          >
            <span className="mt-0.5 text-accent">
              <Icon name={mod.id} size={28} draw active />
            </span>
            <span>
              <span className="block font-semibold">{mod.nombre}</span>
              <span className="mt-1 block text-small text-muted">{mod.descripcion}</span>
            </span>
          </m.li>
        ))}
      </m.ul>

      {/* Aviso honesto: hoy la entrega es manual, la hacemos nosotros (ver content/empezar/pasos). */}
      <p className="mt-6 rounded-control border border-line bg-surface p-4 text-small text-muted">
        {PASO_LISTO.avisoEntrega}
      </p>

      <div className="mt-8">
        {whatsappLink ? (
          <ButtonLink
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            onClick={() => track('whatsapp_click', { origen: 'confirmacion' })}
          >
            <Icon name="chat" size={20} />
            {PASO_LISTO.whatsapp}
          </ButtonLink>
        ) : (
          // Sin número configurado (NEXT_PUBLIC_WHATSAPP_NUMBER) no hay a dónde abrir el chat.
          <Button fullWidth disabled>
            {PASO_LISTO.whatsapp}
          </Button>
        )}
        <p className="tabular mt-4 text-center text-small text-muted">{PASO_LISTO.contacto}</p>
        <p className="mt-2 text-center text-small text-subtle">{PASO_LISTO.todoPlazo}</p>
        {!whatsappLink && process.env.NODE_ENV !== 'production' && (
          <p className="mt-2 text-center text-small text-subtle">{PASO_LISTO.todoWhatsapp}</p>
        )}
      </div>

      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={onReiniciar}>
          {PASO_LISTO.reiniciar}
        </Button>
      </div>
    </div>
  );
}
