import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConfigVideo } from '@/config/video';
import { VIDEO_PRESENTACION } from '@/content/explicativo/presentacion';
import { SlotVideo } from './SlotVideo';

// La animación en código es un chunk aparte: el mock registra CUÁNDO se pide (el getter corre en
// cada import(), aunque el módulo ya esté en caché).
const carga = vi.hoisted(() => ({ importado: false }));
vi.mock('./PresentacionFlujo', () => {
  function AnimacionFalsa() {
    return <div data-testid="animacion" />;
  }
  return {
    get PresentacionFlujo() {
      carga.importado = true;
      return AnimacionFalsa;
    },
  };
});

const SIN_MP4: ConfigVideo = {
  mp4: null,
  poster: null,
  subtitulos: '/video/presentacion.es-AR.vtt',
};
const CON_MP4: ConfigVideo = { ...SIN_MP4, mp4: '/video/presentacion.mp4' };

const play = () => screen.getByRole('button', { name: /mirá cómo funciona/i });

function renderSlot(config: ConfigVideo) {
  return render(
    <SlotVideo
      arte={<svg data-testid="poster" />}
      indice={<ol aria-label="indice" />}
      duracion="1 min"
      config={config}
    />,
  );
}

describe('SlotVideo (video de presentación de /empezar)', () => {
  beforeEach(() => {
    // Cada test arranca sin la animación descargada.
    carga.importado = false;
    // jsdom no reproduce medios: lo mínimo para que play() y pause() no fallen.
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('muestra el poster con un play accesible y no descarga nada pesado', () => {
    renderSlot(SIN_MP4);
    expect(screen.getByTestId('poster')).toBeInTheDocument();
    expect(play()).toHaveTextContent(`${VIDEO_PRESENTACION.play}1 min`);
    expect(play()).toHaveAttribute('type', 'button');
    expect(carga.importado).toBe(false);
    expect(document.querySelector('video')).toBeNull();
  });

  it('con MP4 configurado, al tocar play muestra un <video> con subtítulos es-AR y sin autoplay', () => {
    const { container } = renderSlot(CON_MP4);
    fireEvent.click(play());
    const video = container.querySelector('video')!;
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('src', CON_MP4.mp4);
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).toHaveAttribute('playsinline');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video.muted).toBe(false);
    const track = video.querySelector('track')!;
    expect(track).toHaveAttribute('kind', 'subtitles');
    expect(track).toHaveAttribute('srclang', 'es-AR');
    expect(track).toHaveAttribute('src', CON_MP4.subtitulos);
    expect(track).toHaveAttribute('default');
    // Arranca porque lo pidió el toque; la animación ni se descargó.
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(carga.importado).toBe(false);
  });

  it('si el MP4 falla al cargar, se ve la animación en código', async () => {
    const { container } = renderSlot(CON_MP4);
    fireEvent.click(play());
    fireEvent.error(container.querySelector('video')!);
    expect(await screen.findByTestId('animacion')).toBeInTheDocument();
    expect(container.querySelector('video')).toBeNull();
  });

  it('sin MP4, play descarga y muestra la animación en código (mientras, "Cargando…")', async () => {
    renderSlot(SIN_MP4);
    const boton = play();
    fireEvent.click(boton);
    expect(boton).toHaveAttribute('aria-busy', 'true');
    expect(boton).toHaveTextContent(VIDEO_PRESENTACION.cargando);
    expect(await screen.findByTestId('animacion')).toBeInTheDocument();
    expect(carga.importado).toBe(true);
    expect(screen.queryByTestId('poster')).toBeNull();
  });

  it('el video se pausa si sale de la pantalla', () => {
    let alCambiar: IntersectionObserverCallback = () => {};
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          alCambiar = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
    renderSlot(CON_MP4);
    fireEvent.click(play());
    act(() => alCambiar([{ isIntersecting: false } as IntersectionObserverEntry], {} as never));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
