import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SlotImagen, type FuenteImagen } from '@/components/patterns/SlotImagen';

const FUENTE: FuenteImagen = {
  base: '/plano/hero',
  anchos: [640, 1280, 1920],
  ancho: 1920,
  alto: 1080,
};
const ALT = 'Mostrador de una panadería';

describe('SlotImagen con foto', () => {
  it('<picture> con AVIF primero y WebP después, con srcset y sizes', () => {
    const { container } = render(<SlotImagen fuente={FUENTE} alt={ALT} escena="hero" />);
    const sources = container.querySelectorAll('picture > source');
    expect([...sources].map((s) => s.getAttribute('type'))).toEqual(['image/avif', 'image/webp']);
    expect(sources[0]).toHaveAttribute(
      'srcset',
      '/plano/hero-640.avif 640w, /plano/hero-1280.avif 1280w, /plano/hero-1920.avif 1920w',
    );
    expect(sources[1]?.getAttribute('srcset')).toContain('/plano/hero-1280.webp 1280w');
    for (const s of sources) expect(s).toHaveAttribute('sizes', '100vw');
    expect(screen.getByRole('img', { name: ALT })).toHaveAttribute('src', '/plano/hero-1280.webp');
  });

  it('fuera del primer pliegue carga diferido', () => {
    render(<SlotImagen fuente={FUENTE} alt={ALT} escena="hero" />);
    const img = screen.getByRole('img', { name: ALT });
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('en el primer pliegue carga ya y con prioridad alta', () => {
    render(<SlotImagen fuente={FUENTE} alt={ALT} escena="hero" primerPliegue sizes="50vw" />);
    const img = screen.getByRole('img', { name: ALT });
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).toHaveAttribute('sizes', '50vw');
  });

  it('reserva el espacio: width/height y aspect-ratio (CLS 0)', () => {
    const { container } = render(<SlotImagen fuente={FUENTE} alt={ALT} escena="hero" />);
    const img = screen.getByRole('img', { name: ALT });
    expect(img).toHaveAttribute('width', '1920');
    expect(img).toHaveAttribute('height', '1080');
    expect((container.firstElementChild as HTMLElement).style.aspectRatio).toBe('1920 / 1080');
  });

  it('duotono por capas de mezcla (sin filter) y velo para el texto', () => {
    const { container } = render(
      <SlotImagen fuente={FUENTE} alt={ALT} escena="hero">
        <p>Encima</p>
      </SlotImagen>,
    );
    expect(screen.getByRole('img', { name: ALT })).toHaveClass('mix-blend-luminosity');
    expect(container.querySelector('[data-duotono]')).toHaveClass(
      'bg-seccion-brasa',
      'mix-blend-multiply',
    );
    expect(container.querySelector('[data-velo]')).toHaveClass('bg-velo-imagen');
    expect(screen.getByText('Encima').parentElement).toHaveClass('text-velo-imagen-fg');
    expect(container.innerHTML).not.toMatch(/filter/);
  });

  it('sin duotono, la foto queda en color bajo el velo', () => {
    const { container } = render(
      <SlotImagen fuente={FUENTE} alt={ALT} escena="hero" duotono={false} />,
    );
    expect(container.querySelector('[data-duotono]')).toBeNull();
    expect(screen.getByRole('img', { name: ALT })).not.toHaveClass('mix-blend-luminosity');
  });
});

describe('SlotImagen sin foto (fuente null)', () => {
  it.each(['hero', 'como-funciona', 'cierre'] as const)(
    'muestra el plano de la escena %s, terminado y sin TODO',
    (escena) => {
      const { container } = render(<SlotImagen fuente={null} alt={ALT} escena={escena} />);
      expect(container.querySelector('picture')).toBeNull();
      expect(container.firstElementChild).toHaveAttribute('data-slot-imagen', 'plano');
      expect(container.querySelector(`[data-escena-plano="${escena}"]`)).not.toBeNull();
      expect(container.textContent).not.toMatch(/TODO/i);
      expect(container.innerHTML).not.toMatch(/TODO/i);
    },
  );

  it('reserva la proporción del fallback', () => {
    const { container } = render(
      <SlotImagen fuente={null} alt="" escena="cierre" proporcion={[4, 3]} />,
    );
    expect((container.firstElementChild as HTMLElement).style.aspectRatio).toBe('4 / 3');
  });
});
