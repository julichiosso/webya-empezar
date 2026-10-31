'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { buttonClasses } from '@/components/ui/boton-clases';
import { VIDEO_PRESENTACION_CONFIG, type ConfigVideo } from '@/config/video';
import { VIDEO_PRESENTACION as T } from '@/content/explicativo/presentacion';
import { track } from '@/lib/analytics';

/** La animación en código (escenas + reproductor): un chunk aparte que baja recién al tocar play. */
const cargarPresentacion = () => import('./PresentacionFlujo').then((m) => m.PresentacionFlujo);

type Estado = 'poster' | 'cargando' | 'error' | 'animacion' | 'video';

interface SlotVideoProps {
  /** El poster (SVG propio, armado en el servidor: no pesa en el JS). */
  arte: ReactNode;
  /** Índice de capítulos que acompaña al poster (también del servidor). */
  indice: ReactNode;
  /** "1 min": duración estimada del guion. */
  duracion: string;
  /** Inyectable para tests; en la página sale de src/config/video.ts. */
  config?: ConfigVideo;
}

/**
 * Slot de video de /empezar. Muestra el poster y, al tocar play:
 * - con MP4 configurado: un <video controls preload="none" playsInline> con subtítulos es-AR, que
 *   arranca por el toque (nunca autoplay); si el archivo falla, pasa a la animación en código;
 * - sin MP4: la animación en código de las cuatro pantallas del flujo (PresentacionFlujo).
 * El marco tiene el alto reservado desde el HTML: poster, video y animación ocupan lo mismo (CLS 0).
 * Lo que no se ve se pausa (fuera de pantalla o con la pestaña oculta).
 */
export function SlotVideo({
  arte,
  indice,
  duracion,
  config = VIDEO_PRESENTACION_CONFIG,
}: SlotVideoProps) {
  const [estado, setEstado] = useState<Estado>('poster');
  const [Presentacion, setPresentacion] = useState<ComponentType | null>(null);
  const video = useRef<HTMLVideoElement>(null);

  const mostrarAnimacion = useCallback(() => {
    setEstado('cargando');
    cargarPresentacion().then(
      (C) => {
        setPresentacion(() => C);
        setEstado('animacion');
      },
      () => setEstado('error'),
    );
  }, []);

  const reproducir = () => {
    if (estado === 'cargando') return;
    if (config.mp4) setEstado('video');
    else mostrarAnimacion();
  };

  // Sin MP4, la animación empieza a bajar apenas la persona se acerca al botón.
  const precargar = () => {
    if (!config.mp4) void cargarPresentacion().catch(() => {});
  };

  // El video arranca porque lo pidió el toque (con sonido, pero nunca solo). Se pausa si sale de la
  // pantalla o se oculta la pestaña.
  useEffect(() => {
    const v = video.current;
    if (estado !== 'video' || !v) return;
    track('explicativo_abierto', { origen: 'empezar_mp4' });
    v.focus({ preventScroll: true });
    try {
      void v.play()?.catch(() => {});
    } catch {
      // Navegadores (o entornos) sin reproducción programática: quedan los controles nativos.
    }
    const pausar = () => v.pause();
    const alOcultar = () => document.visibilityState === 'hidden' && pausar();
    document.addEventListener('visibilitychange', alOcultar);
    let obs: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      obs = new IntersectionObserver(([e]) => e && !e.isIntersecting && pausar(), {
        threshold: 0.25,
      });
      obs.observe(v);
    }
    return () => {
      document.removeEventListener('visibilitychange', alOcultar);
      obs?.disconnect();
    };
  }, [estado]);

  let contenido: ReactNode;
  if (estado === 'video' && config.mp4) {
    contenido = (
      <video
        ref={video}
        src={config.mp4}
        poster={config.poster ?? undefined}
        controls
        preload="none"
        playsInline
        aria-label={T.reproductor}
        // Archivo que no está, formato que el navegador no lee, red caída: se ve la animación.
        onError={mostrarAnimacion}
        className="size-full bg-bg object-contain"
      >
        <track
          kind="subtitles"
          srcLang="es-AR"
          label={T.subtitulos}
          src={config.subtitulos}
          default
        />
      </video>
    );
  } else if (estado === 'animacion' && Presentacion) {
    contenido = <Presentacion />;
  } else {
    const cargando = estado === 'cargando';
    contenido = (
      <div className="flex h-full flex-col lg:flex-row">
        <div className="relative min-h-0 flex-1 px-2 pt-4 lg:p-6">{arte}</div>
        <div className="flex flex-col gap-4 px-4 pb-4 lg:w-80 lg:shrink-0 lg:justify-between lg:border-l lg:border-line lg:p-6">
          {indice}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={reproducir}
              onPointerEnter={precargar}
              onFocus={precargar}
              aria-busy={cargando || undefined}
              aria-describedby={estado === 'error' ? 'video-error' : undefined}
              className={buttonClasses('primario', true)}
            >
              <Icon name="play" size={20} />
              {cargando ? T.cargando : T.play}
              <span className="tabular text-small font-normal">{duracion}</span>
            </button>
            <p id="video-error" aria-live="polite" className="text-small text-danger empty:hidden">
              {estado === 'error' ? T.errorCarga : ''}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot-video={estado}
      className="relative h-[34rem] overflow-hidden rounded-panel border border-line bg-surface shadow-raised lg:aspect-video lg:h-auto lg:max-w-5xl"
    >
      {contenido}
    </div>
  );
}
