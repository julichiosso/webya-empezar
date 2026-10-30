import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { gzipSync } from 'node:zlib';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InterruptorTema } from './InterruptorTema';
import { CLAVE_TEMA, SCRIPT_TEMA } from './tema';

const html = document.documentElement;
const correrScript = () => new Function(SCRIPT_TEMA)();

afterEach(() => {
  html.removeAttribute('data-theme');
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('script inline del tema (sin destello)', () => {
  it('aplica el tema guardado', () => {
    localStorage.setItem(CLAVE_TEMA, 'light');
    correrScript();
    expect(html).toHaveAttribute('data-theme', 'light');
  });

  it('sin nada guardado (o con basura) queda el oscuro por defecto', () => {
    correrScript();
    expect(html).not.toHaveAttribute('data-theme');
    localStorage.setItem(CLAVE_TEMA, '<script>');
    correrScript();
    expect(html).not.toHaveAttribute('data-theme');
  });

  it('si localStorage falla, no rompe la página', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(correrScript).not.toThrow();
  });

  it('es mínimo: menos de 0,2 KB gzip', () => {
    expect(gzipSync(SCRIPT_TEMA, { level: 9 }).length).toBeLessThan(200);
  });
});

describe('InterruptorTema', () => {
  it('es un botón de dos estados con nombre fijo (texto por props)', () => {
    render(<InterruptorTema etiqueta="Tema claro" />);
    const boton = screen.getByRole('button', { name: 'Tema claro' });
    expect(boton).toHaveAttribute('aria-pressed', 'false');
  });

  it('al tocarlo pasa a claro, lo recuerda y vuelve a oscuro', async () => {
    const user = userEvent.setup();
    render(<InterruptorTema etiqueta="Tema claro" />);
    const boton = screen.getByRole('button', { name: 'Tema claro' });
    await user.click(boton);
    expect(html).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem(CLAVE_TEMA)).toBe('light');
    expect(boton).toHaveAttribute('aria-pressed', 'true');
    await user.click(boton);
    expect(html).toHaveAttribute('data-theme', 'dark');
    expect(boton).toHaveAttribute('aria-pressed', 'false');
  });

  it('dos interruptores (nav y footer) quedan sincronizados', async () => {
    const user = userEvent.setup();
    render(
      <>
        <InterruptorTema etiqueta="Tema claro" />
        <InterruptorTema etiqueta="Tema claro" soloIcono />
      </>,
    );
    const [uno, otro] = screen.getAllByRole('button', { name: 'Tema claro' });
    await user.click(uno!);
    await act(async () => {}); // el MutationObserver avisa en una microtarea
    expect(otro).toHaveAttribute('aria-pressed', 'true');
  });

  it('se puede usar con teclado (Enter y Espacio)', async () => {
    const user = userEvent.setup();
    render(<InterruptorTema etiqueta="Tema claro" />);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(html).toHaveAttribute('data-theme', 'light');
    await user.keyboard(' ');
    expect(html).toHaveAttribute('data-theme', 'dark');
  });
});
