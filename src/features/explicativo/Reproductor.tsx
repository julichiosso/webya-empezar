'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon } from '@/components/icons/Icon';
import { buttonClasses } from '@/components/ui/Button';
import { ESCENAS_EXPLICATIVO } from '@/config/explicativo';
import { track } from '@/lib/analytics';
import { Escena } from './escenas';
import { duracionEstimadaMs, elegirVoz, PAUSA_ENTRE_ESCENAS_MS } from './narracion';

export type OrigenExplicativo = 'empezar' | 'demo';

interface ReproductorProps {
  origen: OrigenExplicativo;
  onCerrar: () => void;
}

const TOTAL = ESCENAS_EXPLICATIVO.length;

/** ¿Este navegador puede hablar? (Web Speech API). */
function haySintesis(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * "Mirá cómo funciona": video explicativo hecho con motion graphics (escenas.tsx) y narrado con la
 * voz en español del dispositivo. Es un <dialog> modal nativo (Escape y fondo inerte de fábrica).
 * Subtítulos siempre visibles; si no hay voz en español o se apaga, avanza con tiempos estimados.
 * Se pausa solo si la pestaña queda oculta.
 */
export function Reproductor({ origen, onCerrar }: ReproductorProps) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [indice, setIndice] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  const [voz, setVoz] = useState(haySintesis);
  const [terminado, setTerminado] = useState(false);
  /** Sube cada vez que (re)arranca una escena: reinicia animaciones y la barra de progreso. */
  const [ciclo, setCiclo] = useState(0);
  const [sinVozEnEspanol, setSinVozEnEspanol] = useState(false);

  const escena = ESCENAS_EXPLICATIVO[indice] ?? ESCENAS_EXPLICATIVO[0];
  const duracion = duracionEstimadaMs(escena.narracion);

  // Abrir como modal al montar; al cerrarse (Escape, botón o código) avisar al dueño del estado.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (!d.open) d.showModal();
    track('explicativo_abierto', { origen });
    const alCerrar = () => onCerrar();
    d.addEventListener('close', alCerrar);
    return () => {
      d.removeEventListener('close', alCerrar);
      if (haySintesis()) window.speechSynthesis.cancel();
      if (d.open) d.close();
    };
  }, [origen, onCerrar]);

  // Pestaña oculta → pausa (si no, la voz seguiría hablando sola).
  useEffect(() => {
    const alCambiar = () => document.visibilityState === 'hidden' && setReproduciendo(false);
    document.addEventListener('visibilitychange', alCambiar);
    return () => document.removeEventListener('visibilitychange', alCambiar);
  }, []);

  // Motor: narra la escena actual (o espera su duración estimada) y pasa a la siguiente.
  useEffect(() => {
    if (!reproduciendo) return;
    track('explicativo_capitulo', { capitulo: escena.id });
    let vigente = true;
    let avanzo = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const siguiente = () => {
      if (!vigente || avanzo) return;
      avanzo = true;
      if (indice < TOTAL - 1) {
        setIndice(indice + 1);
        setCiclo((c) => c + 1);
      } else {
        setReproduciendo(false);
        setTerminado(true);
        track('explicativo_completo', { origen });
      }
    };
    const conPausa = () => timers.push(setTimeout(siguiente, PAUSA_ENTRE_ESCENAS_MS));

    const sintesis = voz && haySintesis() ? window.speechSynthesis : null;
    const voces = sintesis?.getVoices() ?? [];
    const vozElegida = elegirVoz(voces);
    // Las voces pueden cargar un instante después de abrir: cuando llegan, se reinicia la escena.
    const alCargarVoces = () => vigente && setCiclo((c) => c + 1);
    if (sintesis && voces.length === 0) {
      sintesis.addEventListener('voiceschanged', alCargarVoces, { once: true });
    }
    if (sintesis && vozElegida) {
      sintesis.cancel();
      const frase = new SpeechSynthesisUtterance(escena.narracion);
      frase.voice = vozElegida;
      frase.lang = vozElegida.lang;
      frase.rate = 1.03;
      frase.onend = conPausa;
      // Una pequeña espera entre cancel() y speak(): algunos navegadores descartan la frase si no.
      timers.push(setTimeout(() => vigente && sintesis.speak(frase), 80));
      // Seguro por si el evento de fin nunca llega (pasa en algunos Android).
      timers.push(setTimeout(siguiente, duracion * 2 + 2_000));
    } else {
      if (sintesis && voces.length > 0) queueMicrotask(() => setSinVozEnEspanol(true));
      timers.push(setTimeout(siguiente, duracion + PAUSA_ENTRE_ESCENAS_MS));
    }
    return () => {
      vigente = false;
      timers.forEach(clearTimeout);
      sintesis?.removeEventListener('voiceschanged', alCargarVoces);
      sintesis?.cancel();
    };
  }, [indice, reproduciendo, voz, ciclo, duracion, escena, origen]);

  const irA = (i: number) => {
    setIndice(Math.max(0, Math.min(TOTAL - 1, i)));
    setTerminado(false);
    setReproduciendo(true);
    setCiclo((c) => c + 1);
  };

  const alternarReproduccion = () => {
    if (terminado) return irA(0);
    if (!reproduciendo) setCiclo((c) => c + 1); // retoma la escena desde el principio
    setReproduciendo(!reproduciendo);
  };

  const cerrar = () => dialogo.current?.close();
  const esCta = escena.id === 'cta';

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="explicativo-titulo"
      onKeyDown={(e) => {
        if (e.target instanceof HTMLInputElement) return;
        if (e.key === 'ArrowRight') irA(indice + 1);
        if (e.key === 'ArrowLeft') irA(indice - 1);
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-bg/90 lg:m-auto lg:h-auto lg:max-w-5xl lg:rounded-panel lg:border lg:border-line-strong"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 px-4 pt-4 lg:px-6">
          <h2 id="explicativo-titulo" className="text-heading font-semibold">
            Cómo funciona WebYa
          </h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar el video"
            className="-mr-2 flex size-12 items-center justify-center rounded-full hover:bg-surface-2"
          >
            <Icon name="cerrar" size={22} />
          </button>
        </div>

        {/* Lienzo: la escena se remonta en cada (re)arranque, así su animación corre una vez. */}
        <div className="relative min-h-0 flex-1 px-2 lg:h-[50vh] lg:max-h-[34rem] lg:flex-none lg:px-6">
          <Escena key={`${escena.id}-${ciclo}`} id={escena.id} />
        </div>

        <div className="flex flex-col gap-4 px-4 pb-4 lg:px-6 lg:pb-6">
          {/* Subtítulos: siempre visibles. Sin voz, se anuncian (con voz, se oirían dos veces). */}
          <p
            aria-live={voz ? 'off' : 'polite'}
            className="min-h-16 text-center text-lead font-medium text-balance"
            data-testid="subtitulo"
          >
            {escena.narracion}
          </p>

          {esCta && (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              {origen === 'demo' ? (
                <button
                  type="button"
                  onClick={() => {
                    track('explicativo_cta', { destino: 'demo' });
                    cerrar();
                  }}
                  className={buttonClasses('secondary')}
                >
                  Probar la demo
                </button>
              ) : (
                <a
                  href="/demo/gastronomia"
                  onClick={() => track('explicativo_cta', { destino: 'demo' })}
                  className={buttonClasses('secondary')}
                >
                  Probar la demo
                </a>
              )}
              <a
                href="/empezar#wizard"
                onClick={() => {
                  track('explicativo_cta', { destino: 'wizard' });
                  // Desde /empezar: el link solo cambia el hash; se cierra el video para ver el wizard.
                  if (origen === 'empezar') cerrar();
                }}
                className={buttonClasses('primary')}
              >
                Quiero el mío
              </a>
            </div>
          )}

          {sinVozEnEspanol && voz && (
            <p className="text-center text-small text-muted">
              Tu dispositivo no tiene voz en español: seguilo con los subtítulos.
            </p>
          )}

          {/* Capítulos: también son la barra de progreso. */}
          <ol className="flex gap-1" aria-label="Capítulos">
            {ESCENAS_EXPLICATIVO.map((e, i) => (
              <li key={e.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => irA(i)}
                  aria-label={`Capítulo ${i + 1}: ${e.capitulo}`}
                  aria-current={i === indice ? 'step' : undefined}
                  className="flex h-12 w-full items-center"
                >
                  <span className="relative block h-1 w-full overflow-hidden rounded-full bg-line-strong">
                    {(i < indice || (terminado && i === indice)) && (
                      <span className="absolute inset-0 bg-fg" />
                    )}
                    {i === indice && !terminado && (
                      <span
                        key={ciclo}
                        data-pausa={!reproduciendo}
                        className="mg-progreso absolute inset-0 bg-accent"
                        style={{ '--dur': `${duracion}ms` } as CSSProperties}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="flex items-center justify-between gap-2">
            <p className="tabular text-small text-muted">
              {indice + 1}/{TOTAL} · {escena.capitulo}
            </p>
            <div className="flex items-center gap-1">
              <BotonControl
                etiqueta="Capítulo anterior"
                onClick={() => irA(indice - 1)}
                disabled={indice === 0}
              >
                <Icon name="arrowLeft" size={20} />
              </BotonControl>
              <BotonControl
                etiqueta={terminado ? 'Ver de nuevo' : reproduciendo ? 'Pausar' : 'Reproducir'}
                onClick={alternarReproduccion}
                principal
              >
                <Icon name={reproduciendo ? 'pausa' : 'play'} size={22} />
              </BotonControl>
              <BotonControl
                etiqueta="Capítulo siguiente"
                onClick={() => irA(indice + 1)}
                disabled={indice === TOTAL - 1}
              >
                <Icon name="arrowRight" size={20} />
              </BotonControl>
              {haySintesis() && (
                <button
                  type="button"
                  aria-pressed={voz}
                  onClick={() => {
                    setVoz(!voz);
                    setCiclo((c) => c + 1);
                  }}
                  className="flex min-h-tap items-center gap-2 rounded-full px-4 text-small font-semibold text-muted aria-pressed:text-fg"
                >
                  <Icon name={voz ? 'volumen' : 'silencio'} size={20} />
                  Voz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function BotonControl({
  etiqueta,
  onClick,
  disabled,
  principal = false,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  disabled?: boolean;
  principal?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      className={`flex size-12 items-center justify-center rounded-full active:scale-[0.96] disabled:opacity-40 ${
        principal ? 'bg-accent text-accent-fg' : 'text-fg hover:bg-surface-2'
      }`}
    >
      {children}
    </button>
  );
}
