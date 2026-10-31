import type { CSSProperties, Ref } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { isIconName } from '@/brand/ilustracion/iconos/paths';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { RUBRO_OTRO_ID, RUBROS } from '@/content/rubros';
import { StepHeader } from './steps/StepHeader';

const TXT = FLUJO.rubro;

interface PantallaRubroProps {
  /** El rubro ya elegido (al volver con "Atrás"): su tarjeta queda marcada. */
  elegido?: string | null;
  /** Sin handler (HTML del servidor), el toque lo toma WizardLazy por el `data-rubro`. */
  onElegir?: (id: string) => void;
  headingRef?: Ref<HTMLHeadingElement>;
  /** Las tarjetas entran escalonadas una sola vez (solo en el HTML del servidor). */
  animar?: boolean;
}

/**
 * Pantalla 1: "¿Qué negocio tenés?" con una tarjeta por rubro (los de content/rubros, con su
 * ícono). Un toque avanza. Sin estado ni hooks: se renderiza en el servidor, arriba del pliegue,
 * antes de que se descargue el wizard.
 */
export function PantallaRubro({ elegido, onElegir, headingRef, animar }: PantallaRubroProps) {
  return (
    <div>
      <StepHeader title={TXT.titulo} subtitle={TXT.bajada} headingRef={headingRef} />
      <ul aria-label={TXT.leyenda} className="grid grid-cols-2 gap-2 sm:gap-3">
        {RUBROS.map((r, i) => {
          const otro = r.id === RUBRO_OTRO_ID;
          const marcado = elegido === r.id;
          return (
            <li
              key={r.id}
              className={`${otro ? 'col-span-2' : ''} ${animar ? 'hero-piece' : ''}`}
              style={animar ? ({ '--i': i } as CSSProperties) : undefined}
            >
              <button
                type="button"
                data-rubro={r.id}
                aria-pressed={marcado}
                onClick={onElegir ? () => onElegir(r.id) : undefined}
                className="group flex h-full min-h-14 w-full items-center gap-2.5 rounded-card border border-line bg-surface p-2.5 text-left hover:border-line-strong aria-pressed:border-accent aria-pressed:bg-accent-soft data-[cargando]:border-accent data-[cargando]:bg-accent-soft sm:gap-3 sm:p-3"
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-control border border-dashed sm:size-10 border-line-strong text-fg group-aria-pressed:border-solid group-aria-pressed:border-accent"
                >
                  <Icon name={isIconName(r.icono) ? r.icono : 'mas'} size={20} />
                </span>
                <span className="min-w-0">
                  {/* En celular, el nombre corto (si lo hay): la tarjeta es angosta. */}
                  <span className="block text-small leading-tight font-semibold sm:hidden">
                    {r.nombreCorto ?? r.nombre}
                  </span>
                  <span className="hidden font-semibold sm:block">{r.nombre}</span>
                  <span className="mt-0.5 hidden text-small text-muted sm:line-clamp-2 lg:bajo:hidden">
                    {r.descripcionCorta}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
