import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ESCENAS_EXPLICATIVO } from '@/content/explicativo';
import { duracionEstimadaMs, PAUSA_ENTRE_ESCENAS_MS } from './narracion';
import { Reproductor } from './Reproductor';

// jsdom no implementa el modal nativo: lo mínimo para abrir y cerrar.
beforeAll(() => {
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & { __falso?: boolean };
  if (typeof proto.showModal !== 'function' || proto.__falso === undefined) {
    proto.showModal = function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    proto.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
    proto.__falso = true;
  }
});

const subtitulo = () => screen.getByTestId('subtitulo');
const [PRIMERA, SEGUNDA] = ESCENAS_EXPLICATIVO;

describe('Reproductor del video explicativo', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('se abre como diálogo con nombre, arranca en la primera escena con subtítulo', () => {
    render(<Reproductor origen="empezar" onCerrar={() => {}} />);
    expect(screen.getByRole('dialog', { name: 'Cómo funciona WebYa' })).toBeInTheDocument();
    expect(subtitulo()).toHaveTextContent(PRIMERA!.narracion);
    expect(screen.getByRole('button', { name: /^Capítulo 1:/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('sin voz en el dispositivo avanza solo, con la duración estimada, y anuncia los subtítulos', () => {
    render(<Reproductor origen="empezar" onCerrar={() => {}} />);
    // jsdom no tiene speechSynthesis: los subtítulos se anuncian (no hay voz que los repita).
    expect(subtitulo()).toHaveAttribute('aria-live', 'polite');
    act(() => {
      vi.advanceTimersByTime(duracionEstimadaMs(PRIMERA!.narracion) + PAUSA_ENTRE_ESCENAS_MS + 10);
    });
    expect(subtitulo()).toHaveTextContent(SEGUNDA!.narracion);
  });

  it('pausa, capítulos y teclado', () => {
    render(<Reproductor origen="empezar" onCerrar={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pausar' }));
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(subtitulo()).toHaveTextContent(PRIMERA!.narracion); // en pausa no avanza
    fireEvent.click(screen.getByRole('button', { name: 'Capítulo siguiente' }));
    expect(subtitulo()).toHaveTextContent(SEGUNDA!.narracion);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowLeft' });
    expect(subtitulo()).toHaveTextContent(PRIMERA!.narracion);
    fireEvent.click(screen.getByRole('button', { name: /^Capítulo 5:/ }));
    expect(subtitulo()).toHaveTextContent(ESCENAS_EXPLICATIVO[4]!.narracion);
  });

  it('la última escena ofrece la demo y el wizard; al terminar, "Ver de nuevo"', () => {
    render(<Reproductor origen="empezar" onCerrar={() => {}} />);
    const ultima = ESCENAS_EXPLICATIVO.length;
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Capítulo ${ultima}:`) }));
    expect(screen.getByRole('link', { name: 'Probar la demo' })).toHaveAttribute(
      'href',
      '/demo/gastronomia',
    );
    expect(screen.getByRole('link', { name: 'Quiero el mío' })).toHaveAttribute(
      'href',
      '/empezar#wizard',
    );
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Ver de nuevo' }));
    expect(subtitulo()).toHaveTextContent(PRIMERA!.narracion);
  });

  it('desde la demo, "Probar la demo" cierra el video (ya estás en la demo)', () => {
    const onCerrar = vi.fn();
    render(<Reproductor origen="demo" onCerrar={onCerrar} />);
    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(`^Capítulo ${ESCENAS_EXPLICATIVO.length}:`) }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Probar la demo' }));
    expect(onCerrar).toHaveBeenCalled();
  });

  it('el botón Cerrar cierra el diálogo', () => {
    const onCerrar = vi.fn();
    render(<Reproductor origen="empezar" onCerrar={onCerrar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar el video' }));
    expect(onCerrar).toHaveBeenCalled();
  });
});
