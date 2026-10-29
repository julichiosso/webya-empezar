'use client';

import * as m from 'motion/react-m';
import type { Ref } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { ButtonLink, Button } from '@/components/ui/Button';
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
        Tu negocio está listo para armarse
      </h2>
      <p className="mt-2 text-lead text-muted">
        Gracias, {primerNombre}. Para <strong className="font-semibold text-fg">{rubro}</strong>,
        estas son las piezas que activaste:
      </p>

      <m.ul
        variants={lista}
        initial="oculto"
        animate="visible"
        aria-label="Las piezas de tu negocio"
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

      {/* Aviso honesto: hoy la entrega es manual, la hacemos nosotros.
          TODO: definir plazos de entrega y precios; no se prometen hasta tenerlos. */}
      <p className="mt-6 rounded-control border border-line bg-surface p-4 text-small text-muted">
        Lo armamos nosotros: no tenés que configurar nada. Cuando lo tengamos listo, lo ponemos
        online juntos.
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
            Hablar por WhatsApp
          </ButtonLink>
        ) : (
          // Sin número configurado (NEXT_PUBLIC_WHATSAPP_NUMBER) no hay a dónde abrir el chat.
          <Button fullWidth disabled>
            Hablar por WhatsApp
          </Button>
        )}
        <p className="tabular mt-4 text-center text-small text-muted">
          Te escribimos en menos de 24 hs para ponerlo online.
        </p>
        {!whatsappLink && process.env.NODE_ENV !== 'production' && (
          <p className="mt-2 text-center text-small text-subtle">
            TODO: configurar NEXT_PUBLIC_WHATSAPP_NUMBER en .env.local.
          </p>
        )}
      </div>

      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={onReiniciar}>
          Cargar otro negocio
        </Button>
      </div>
    </div>
  );
}
