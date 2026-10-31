'use client';

import type { CSSProperties, ReactNode, Ref } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { variablesDePaleta } from '@/brand/tokens/colores';
import type { Dispositivo } from '@/components/patterns/MarcoDispositivo';
import { Button } from '@/components/ui/Button';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import type { ModuloId } from '@/content/modulos';
import { PALETAS_CURADAS, type PaletaCuradaId } from '@/content/paletas';
import { StepHeader } from './StepHeader';

const TXT = FLUJO.resultado;

/** Lo que se puede cambiar en la vista previa (no existe en "Otro": ahí no hay vista previa). */
export interface ControlesPreview {
  dispositivo: Dispositivo;
  onDispositivo: (d: Dispositivo) => void;
  paleta: PaletaCuradaId;
  onPaleta: (id: PaletaCuradaId) => void;
  modulos: readonly { id: ModuloId; nombre: string; activo: boolean }[];
  onModulo: (id: ModuloId) => void;
}

interface StepResultadoProps {
  nombreNegocio: string;
  /** "Otro": sin vista previa, la pantalla honesta de "Lo armamos a medida". */
  aMedida: boolean;
  /** La vista previa (en celular va acá; en escritorio vive en la columna derecha). */
  preview: ReactNode;
  controles: ControlesPreview | null;
  /** El CTA principal ya armado (link a WhatsApp o, en el orden B, el paso al contacto). */
  cta: ReactNode;
  /** Link a la demo completa con nombre y paleta cargados (solo rubros con demo). */
  demoUrl: string | null;
  /** Hay lead guardado: se puede completar. */
  puedeCompletar: boolean;
  /** Falló el guardado (red o servidor): aviso visible con reintento (también se reintenta solo). */
  sinGuardar: boolean;
  reintentando: boolean;
  /** Un reintento salió bien: se le confirma. */
  guardadoTarde: boolean;
  onReintentar: () => void;
  headingRef: Ref<HTMLHeadingElement>;
  onDemo: () => void;
  onCompletar: () => void;
}

const opcion =
  'flex min-h-tap items-center justify-center gap-2 rounded-control border px-4 text-small font-medium aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-fg';

/**
 * Pantalla 3: "Así te queda" con la vista previa, cómo verla (celular o computadora), los colores
 * y las piezas del rubro, y un CTA único (WhatsApp con lo que armó). En celular el CTA también va
 * en una barra fija abajo (ver BarraCta). El secundario es dejar más datos. Si eligió "Otro", no
 * hay vista previa: "Lo armamos a medida".
 */
export function StepResultado({
  nombreNegocio,
  aMedida,
  preview,
  controles,
  cta,
  demoUrl,
  puedeCompletar,
  sinGuardar,
  reintentando,
  guardadoTarde,
  onReintentar,
  headingRef,
  onDemo,
  onCompletar,
}: StepResultadoProps) {
  const nombre = nombreNegocio.trim();
  const titulo = aMedida
    ? TXT.aMedida.titulo
    : nombre
      ? TXT.titulo(nombre)
      : TXT.tituloSinNombre;
  const activos = controles?.modulos.filter((m) => m.activo).length ?? 0;

  return (
    // En celular, lugar para la barra fija del CTA: no tapa lo último de la pantalla.
    <div className="max-lg:pb-24 lg:max-w-xl">
      <StepHeader
        title={titulo}
        subtitle={aMedida ? TXT.aMedida.texto : TXT.bajada}
        headingRef={headingRef}
      />

      {/* Nunca silencioso: si no se guardó, se ve y se puede reintentar; si se guardó tarde, se dice. */}
      <div role="status" className="empty:hidden">
        {sinGuardar && (
          <div className="mb-4 rounded-control border border-danger/40 bg-danger/10 p-4 text-small">
            <p className="text-fg">{TXT.sinGuardar}</p>
            <Button
              variant="secondary"
              className="mt-3"
              status={reintentando ? 'loading' : 'idle'}
              onClick={onReintentar}
            >
              {reintentando ? TXT.reintentando : TXT.reintentar}
            </Button>
          </div>
        )}
        {!sinGuardar && guardadoTarde && (
          <p className="mb-4 rounded-control border border-line bg-surface p-4 text-small">
            {TXT.guardadoTarde}
          </p>
        )}
      </div>

      {/* El CTA a la vista (en celular lo lleva la barra fija). */}
      <div className="max-lg:hidden">
        {cta}
        <p className="mt-3 text-small text-muted">{TXT.queSigue}</p>
        <p data-todo className="mt-1 text-small text-subtle">
          {TXT.todoPlazo}
        </p>
      </div>

      {controles && (
        <div className="flex flex-col gap-5 lg:mt-8">
          <div role="group" aria-label={TXT.verEn.leyenda} className="grid grid-cols-2 gap-2">
            {(['celular', 'escritorio'] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={controles.dispositivo === d}
                onClick={() => controles.onDispositivo(d)}
                className={`${opcion} border-line text-muted hover:border-line-strong`}
              >
                {TXT.verEn[d]}
              </button>
            ))}
          </div>

          <div className="lg:hidden">{preview}</div>

          <fieldset>
            <legend className="mb-2 text-small font-semibold">{TXT.colores.leyenda}</legend>
            <div className="flex flex-wrap gap-2">
              {PALETAS_CURADAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={controles.paleta === p.id}
                  aria-label={TXT.colores.opcion(p.nombre)}
                  title={p.nombre}
                  onClick={() => controles.onPaleta(p.id)}
                  // La muestra toma el acento de su paleta por variables CSS (sin colores en línea).
                  style={variablesDePaleta(p) as CSSProperties}
                  className="flex size-tap items-center justify-center rounded-full border border-line hover:border-line-strong aria-pressed:border-2 aria-pressed:border-fg"
                >
                  <span aria-hidden="true" className="size-7 rounded-full bg-accent" />
                </button>
              ))}
            </div>
          </fieldset>

          {controles.modulos.length > 0 && (
            <fieldset>
              <legend className="text-small font-semibold">{TXT.modulos.leyenda}</legend>
              <p className="mb-2 text-small text-muted">{TXT.modulos.ayuda}</p>
              <div className="flex flex-wrap gap-2">
                {controles.modulos.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={m.activo}
                    onClick={() => controles.onModulo(m.id)}
                    className={`${opcion} rounded-full border-dashed border-line-strong text-muted aria-pressed:border-solid`}
                  >
                    <Icon name={m.id} size={16} />
                    {m.nombre}
                  </button>
                ))}
              </div>
              <p aria-live="polite" className="sr-only">
                {TXT.modulos.estado(activos)}
              </p>
            </fieldset>
          )}
        </div>
      )}

      {/* En celular, qué pasa al tocar el CTA (el botón va en la barra fija). */}
      <div className="mt-6 lg:hidden">
        <p className="text-small text-muted">{TXT.queSigue}</p>
        <p data-todo className="mt-1 text-small text-subtle">
          {TXT.todoPlazo}
        </p>
      </div>

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
