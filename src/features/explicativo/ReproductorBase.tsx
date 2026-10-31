'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { REPRODUCTOR } from '@/content/explicativo/reproductor';
import { track } from '@/lib/analytics';
import { duracionEstimadaMs, elegirVoz, PAUSA_ENTRE_ESCENAS_MS } from './narracion';

/** Una escena del guion: lo que dice la voz (y el subtítulo) y su capítulo. */
export interface EscenaGuion<Id extends string = string> {
  id: Id;
  capitulo: string;
  narracion: string;
}

export interface ReproductorBaseProps<Id extends string> {
  /**
   * `modal`: <dialog> a pantalla completa en celular (botón "Mirá cómo funciona" de la demo).
   * `embebido`: dentro del slot de video de /empezar; se pausa solo si sale de la pantalla.
   */
  modo: 'modal' | 'embebido';
  guion: readonly EscenaGuion<Id>[];
  /** Título del diálogo (modal) o nombre accesible de la región (embebido). */
  titulo: string;
  /** Dibuja la escena `id`. Se remonta en cada (re)arranque: su animación corre una vez. */
  Escena: (props: { id: Id }) => ReactNode;
  /** Botones de la última escena. `cerrar` cierra el diálogo (en el embebido no hace nada). */
  Cta: (props: { cerrar: () => void }) => ReactNode;
  origen: string;
  onCerrar?: () => void;
}

/** ¿Este navegador puede hablar? (Web Speech API). */
const nada = () => {};

function haySintesis(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Motor y controles del video explicativo hecho con motion graphics: narra cada escena con la voz en
 * español del dispositivo, muestra subtítulos siempre y avanza solo. Si no hay voz en español o se
 * apaga, avanza con tiempos estimados. Se pausa si la pestaña queda oculta (y, embebido, si sale de
 * la pantalla). Las escenas y el guion los pone quien lo usa (Reproductor, PresentacionFlujo).
 */
export function ReproductorBase<Id extends string>({
  modo,
  guion,
  titulo,
  Escena,
  Cta,
  origen,
  onCerrar,
}: ReproductorBaseProps<Id>) {
  const modal = modo === 'modal';
  const dialogo = useRef<HTMLDialogElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const [indice, setIndice] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  const [voz, setVoz] = useState(haySintesis);
  const [terminado, setTerminado] = useState(false);
  /** Sube cada vez que (re)arranca una escena: reinicia animaciones y la barra de progreso. */
  const [ciclo, setCiclo] = useState(0);
  const [sinVozEnEspanol, setSinVozEnEspanol] = useState(false);

  const total = guion.length;
  const escena = guion[indice] ?? guion[0]!;
  const duracion = duracionEstimadaMs(escena.narracion);

  // Modal: abrir al montar; al cerrarse (Escape, botón o código) avisar al dueño del estado.
  // Embebido: el foco pasa al botón de pausa (el de play del poster ya no existe).
  useEffect(() => {
    track('explicativo_abierto', { origen });
    if (!modal) {
      control.current?.focus({ preventScroll: true });
      return () => {
        if (haySintesis()) window.speechSynthesis.cancel();
      };
    }
    const d = dialogo.current;
    if (!d) return;
    if (!d.open) d.showModal();
    const alCerrar = () => onCerrar?.();
    d.addEventListener('close', alCerrar);
    return () => {
      d.removeEventListener('close', alCerrar);
      if (haySintesis()) window.speechSynthesis.cancel();
      if (d.open) d.close();
    };
  }, [modal, origen, onCerrar]);

  // Pestaña oculta → pausa (si no, la voz seguiría hablando sola).
  useEffect(() => {
    const alCambiar = () => document.visibilityState === 'hidden' && setReproduciendo(false);
    document.addEventListener('visibilitychange', alCambiar);
    return () => document.removeEventListener('visibilitychange', alCambiar);
  }, []);

  // Embebido: si el slot sale de la pantalla, se pausa (y queda en pausa hasta que lo retomen).
  useEffect(() => {
    const el = region.current;
    if (modal || !el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e && !e.isIntersecting) setReproduciendo(false);
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [modal]);

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
      if (indice < total - 1) {
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
  }, [indice, reproduciendo, voz, ciclo, duracion, escena, origen, total]);

  const irA = (i: number) => {
    setIndice(Math.max(0, Math.min(total - 1, i)));
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
  const esUltima = indice === total - 1;

  const alTeclear = (e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === 'ArrowRight') irA(indice + 1);
    if (e.key === 'ArrowLeft') irA(indice - 1);
  };

  // Lienzo: la escena se remonta en cada (re)arranque, así su animación corre una vez.
  const lienzo = <Escena key={`${escena.id}-${ciclo}`} id={escena.id} />;

  // Subtítulos: siempre visibles. Sin voz, se anuncian (con voz, se oirían dos veces).
  const subtitulo = (clase: string) => (
    <p aria-live={voz ? 'off' : 'polite'} className={clase} data-testid="subtitulo">
      {escena.narracion}
    </p>
  );

  const aviso = sinVozEnEspanol && voz && (
    <p className="text-center text-small text-muted">{REPRODUCTOR.sinVozEnEspanol}</p>
  );

  // Capítulos: también son la barra de progreso (embebido en escritorio, con su nombre: el índice).
  const capitulos = (
    <ol
      className={modal ? 'flex gap-1' : 'flex gap-1 lg:flex-col lg:gap-0'}
      aria-label={REPRODUCTOR.ariaCapitulos}
    >
      {guion.map((e, i) => (
        <li key={e.id} className="flex-1">
          <button
            type="button"
            onClick={() => irA(i)}
            aria-label={REPRODUCTOR.ariaCapitulo(i + 1, e.capitulo)}
            aria-current={i === indice ? 'step' : undefined}
            className={
              modal
                ? 'flex h-12 w-full items-center'
                : 'flex h-12 w-full flex-col justify-center gap-2 text-left'
            }
          >
            {!modal && (
              <span
                className={`hidden text-small font-semibold lg:block ${
                  i === indice ? 'text-fg' : 'text-muted'
                }`}
              >
                {e.capitulo}
              </span>
            )}
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
  );

  const controles = (
    <div className="flex items-center justify-between gap-2">
      <p className={`tabular text-small text-muted ${modal ? '' : 'lg:invisible'}`}>
        {indice + 1}/{total} · {escena.capitulo}
      </p>
      <div className="flex items-center gap-1">
        <BotonControl
          etiqueta={REPRODUCTOR.anterior}
          onClick={() => irA(indice - 1)}
          disabled={indice === 0}
        >
          <Icon name="arrowLeft" size={20} />
        </BotonControl>
        <BotonControl
          ref={control}
          etiqueta={
            terminado
              ? REPRODUCTOR.verDeNuevo
              : reproduciendo
                ? REPRODUCTOR.pausar
                : REPRODUCTOR.reproducir
          }
          onClick={alternarReproduccion}
          principal
        >
          <Icon name={reproduciendo ? 'pausa' : 'play'} size={22} />
        </BotonControl>
        <BotonControl
          etiqueta={REPRODUCTOR.siguiente}
          onClick={() => irA(indice + 1)}
          disabled={indice === total - 1}
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
            {REPRODUCTOR.voz}
          </button>
        )}
      </div>
    </div>
  );

  if (!modal) {
    // Embebido: llena el slot (que ya tiene su alto reservado). Escritorio: lienzo a la izquierda,
    // y a la derecha el subtítulo, el índice de capítulos y los controles.
    return (
      <div
        ref={region}
        role="region"
        aria-label={titulo}
        data-presentacion=""
        onKeyDown={alTeclear}
        className="flex h-full flex-col lg:flex-row"
      >
        <div className="relative min-h-0 flex-1 px-2 pt-4 lg:p-6">{lienzo}</div>
        <div className="flex flex-col gap-2 px-4 pb-4 lg:w-80 lg:shrink-0 lg:justify-between lg:gap-4 lg:border-l lg:border-line lg:p-6">
          {subtitulo(
            'h-24 text-center text-body font-medium text-balance lg:h-auto lg:text-left lg:text-lead',
          )}
          {esUltima && (
            <div className="flex justify-center lg:justify-start">
              <Cta cerrar={nada} />
            </div>
          )}
          {aviso}
          <div className="flex flex-col gap-2">
            {capitulos}
            {controles}
          </div>
        </div>
      </div>
    );
  }

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="explicativo-titulo"
      onKeyDown={alTeclear}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-bg/90 lg:m-auto lg:h-auto lg:max-w-5xl lg:rounded-panel lg:border lg:border-line-strong"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 px-4 pt-4 lg:px-6">
          <h2 id="explicativo-titulo" className="text-heading font-semibold">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label={REPRODUCTOR.ariaCerrar}
            className="-mr-2 flex size-12 items-center justify-center rounded-full hover:bg-surface-2"
          >
            <Icon name="cerrar" size={22} />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 px-2 lg:h-[50vh] lg:max-h-[34rem] lg:flex-none lg:px-6">
          {lienzo}
        </div>

        <div className="flex flex-col gap-4 px-4 pb-4 lg:px-6 lg:pb-6">
          {subtitulo('min-h-16 text-center text-lead font-medium text-balance')}
          {esUltima && (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Cta cerrar={cerrar} />
            </div>
          )}
          {aviso}
          {capitulos}
          {controles}
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
  ref,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  disabled?: boolean;
  principal?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <button
      ref={ref}
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
