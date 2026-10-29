import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerSink } from '@/lib/analytics';
import { Wizard } from './Wizard';
import { STORAGE_KEY } from './state';

const fetchMock = vi.fn();

beforeEach(() => {
  window.sessionStorage.clear();
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true, id: 'x' }), { status: 201 }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const user = () => userEvent.setup();

async function elegirRubroYContinuar(u: ReturnType<typeof user>, nombre = /peluquería/i) {
  await u.click(await screen.findByRole('radio', { name: nombre }));
  await u.click(screen.getByRole('button', { name: 'Continuar' }));
}

async function llegarAlPaso3(u: ReturnType<typeof user>) {
  render(<Wizard />);
  await elegirRubroYContinuar(u);
  await u.click(await screen.findByRole('checkbox', { name: /recibir turnos/i }));
  await u.click(screen.getByRole('button', { name: 'Continuar' }));
  await screen.findByRole('heading', { name: /contanos de tu negocio/i });
}

async function completarDatos(u: ReturnType<typeof user>) {
  await u.type(screen.getByLabelText(/nombre de tu negocio/i), 'Peluquería Luna');
  await u.type(screen.getByLabelText(/tu nombre/i), 'Ana Pérez');
  await u.type(screen.getByLabelText(/tu whatsapp/i), '1123456789');
}

describe('Wizard — paso 1 (rubro)', () => {
  it('muestra todos los rubros de la config como radios y no deja avanzar sin elegir', async () => {
    const u = user();
    render(<Wizard />);
    expect(await screen.findAllByRole('radio')).toHaveLength(7);
    await u.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByText(/elegí el rubro/i)).toBeInTheDocument();
    expect(screen.getByText('Paso 1 de 4')).toBeInTheDocument();
  });

  it('"Otro" muestra un campo de texto y exige completarlo', async () => {
    const u = user();
    render(<Wizard />);
    expect(screen.queryByLabelText(/a qué se dedica/i)).not.toBeInTheDocument();

    await elegirRubroYContinuar(u, /otro/i);
    expect(await screen.findByLabelText(/a qué se dedica/i)).toBeInTheDocument();
    expect(screen.getByText(/contanos a qué se dedica/i)).toBeInTheDocument();
    expect(screen.getByText('Paso 1 de 4')).toBeInTheDocument();

    await u.type(screen.getByLabelText(/a qué se dedica/i), 'Floristería');
    await u.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(await screen.findByRole('heading', { name: /qué querés lograr/i })).toBeInTheDocument();
  });
});

describe('Wizard — paso 2 (objetivos)', () => {
  it('ofrece los objetivos del rubro elegido y exige al menos uno', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubroYContinuar(u);

    expect(await screen.findByRole('checkbox', { name: /recibir turnos/i })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /carta/i })).not.toBeInTheDocument();

    await u.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByText(/al menos una cosa/i)).toBeInTheDocument();
  });

  it('"Atrás" vuelve al paso anterior conservando la selección', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubroYContinuar(u);
    await screen.findByRole('heading', { name: /qué querés lograr/i });

    await u.click(screen.getByRole('button', { name: /atrás/i }));
    expect(await screen.findByRole('heading', { name: /qué rubro sos/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /peluquería/i })).toBeChecked();
  });
});

describe('Wizard — paso 3 (datos)', () => {
  it('valida al salir del campo con mensajes específicos, no mientras se escribe', async () => {
    const u = user();
    await llegarAlPaso3(u);
    const whatsapp = screen.getByLabelText(/tu whatsapp/i);

    await u.type(whatsapp, '123');
    expect(screen.queryByText(/revisá el número/i)).not.toBeInTheDocument();

    await u.tab();
    expect(await screen.findByText(/revisá el número/i)).toBeInTheDocument();
    expect(whatsapp).toHaveAttribute('aria-invalid', 'true');
  });

  it('formatea el WhatsApp mientras se escribe', async () => {
    const u = user();
    await llegarAlPaso3(u);
    const whatsapp = screen.getByLabelText(/tu whatsapp/i);
    await u.type(whatsapp, '1123456789');
    expect(whatsapp).toHaveValue('11 2345 6789');
  });

  it('no envía con datos inválidos', async () => {
    const u = user();
    await llegarAlPaso3(u);
    await u.click(screen.getByRole('button', { name: 'Enviar' }));
    await waitFor(() =>
      expect(screen.getByLabelText(/nombre de tu negocio/i)).toHaveAttribute(
        'aria-invalid',
        'true',
      ),
    );
    expect(screen.getByLabelText(/tu whatsapp/i)).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('al enviar con errores, el foco va al primer campo con error en orden visual', async () => {
    const u = user();
    await llegarAlPaso3(u);
    await u.type(screen.getByLabelText(/nombre de tu negocio/i), 'Peluquería Luna');
    await u.click(screen.getByRole('button', { name: 'Enviar' }));
    await waitFor(() => expect(screen.getByLabelText(/tu nombre/i)).toHaveFocus());
  });
});

describe('Wizard — envío y confirmación', () => {
  it('envía el lead con UTM y llega a la confirmación con los módulos sugeridos', async () => {
    window.history.replaceState(null, '', '/empezar?utm_source=instagram&utm_medium=bio');
    const eventos: string[] = [];
    const quitar = registerSink((e) => void eventos.push(e));
    const u = user();
    await llegarAlPaso3(u);
    await completarDatos(u);
    await u.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(
      await screen.findByRole('heading', { name: /¡listo, ana!/i }, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/leads');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).toMatchObject({
      nombreNegocio: 'Peluquería Luna',
      nombre: 'Ana Pérez',
      rubro: 'peluqueria_estetica',
      objetivos: ['recibir_turnos'],
      website: '',
      utm_source: 'instagram',
      utm_medium: 'bio',
    });

    const modulos = screen.getByRole('list', { name: /lo que vamos a armar/i });
    expect(modulos).toHaveTextContent('Turnos y reservas');
    expect(screen.getByText(/menos de 24 hs/i)).toBeInTheDocument();
    expect(eventos).toEqual(
      expect.arrayContaining([
        'empezar_view',
        'rubro_seleccionado',
        'paso_completado',
        'lead_enviado',
      ]),
    );
    quitar();
  });

  it('si el servidor falla, avisa con un mensaje amable y se puede reintentar', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 500 }));
    const u = user();
    await llegarAlPaso3(u);
    await completarDatos(u);
    await u.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(await screen.findByText(/no pudimos guardar tus datos/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contanos de tu negocio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeEnabled();
  });
});

describe('Wizard — persistencia en sessionStorage', () => {
  it('conserva el estado al recargar', async () => {
    const u = user();
    const { unmount } = render(<Wizard />);
    await elegirRubroYContinuar(u);
    await u.click(await screen.findByRole('checkbox', { name: /recibir turnos/i }));
    await waitFor(() =>
      expect(window.sessionStorage.getItem(STORAGE_KEY)).toContain('recibir_turnos'),
    );
    unmount();

    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: /qué querés lograr/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /recibir turnos/i })).toBeChecked();
  });

  it('ignora un estado guardado corrupto', async () => {
    window.sessionStorage.setItem(STORAGE_KEY, '{no es json');
    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: /qué rubro sos/i })).toBeInTheDocument();
  });
});
