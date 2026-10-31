import { ESCENAS_FLUJO } from '@/content/explicativo/flujo';
import { VIDEO_PRESENTACION as T } from '@/content/explicativo/presentacion';
import { duracionTotalMs, etiquetaDuracion } from './narracion';
import { IndicePresentacion, PosterArte } from './PosterPresentacion';
import { SlotVideo } from './SlotVideo';

/** Ancla de la sección (la barra fija de celular se esconde mientras se ve: tiene su propio play). */
export const ID_VIDEO_PRESENTACION = 'como-funciona';

const DURACION = etiquetaDuracion(duracionTotalMs(ESCENAS_FLUJO.map((e) => e.narracion)));

/**
 * "Mirá cómo se arma tu negocio": la sección de video de /empezar, enseguida después del flujo.
 * Título, poster y play salen en el HTML del servidor; lo único que viaja en el JS inicial es el
 * botón (SlotVideo). El video o la animación bajan recién al tocar play.
 */
export function VideoPresentacion() {
  return (
    <section
      id={ID_VIDEO_PRESENTACION}
      aria-labelledby="video-title"
      className="scroll-mt-24 pt-12 lg:pt-16"
    >
      <h2 id="video-title" className="text-title font-semibold text-balance">
        {T.titulo}
      </h2>
      <p className="mt-4 max-w-md text-lead text-muted lg:max-w-2xl">{T.bajada}</p>
      <div className="mt-8">
        <SlotVideo arte={<PosterArte />} indice={<IndicePresentacion />} duracion={DURACION} />
      </div>
    </section>
  );
}
