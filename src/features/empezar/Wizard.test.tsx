import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HeroMockupConectado as HeroMockup } from './HeroMockupConectado';
import { registerSink } from '@/lib/analytics';
import { reiniciarModulos } from './modulos-store';
import { Wizard } from './Wizard';
import { STORAGE_KEY } from './state';

const fetchMock = vi.fn();

beforeEach(() => {
  window.sessionStorage.clear();
  act(() => reiniciarModulos());
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
  await u.click(screen.getByRole('button', { name: 'Siguiente' }));
}

async function llegarAlPaso3(u: ReturnType<typeof user>) {
  render(<Wizard />);
  await elegirRubroYContinuar(u);
  // Peluquería ya trae sus módulos sugeridos marcados: alcanza con seguir.
  await screen.findByRole('heading', { name: /qué querés activar/i });
  await u.click(screen.getByRole('checkbox', { name: /recibir turnos online/i }));
  await u.click(screen.getByRole('button', { name: 'Siguiente' }));
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
    await u.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByText('Elegí el rubro que más se parezca a tu negocio.')).toBeInTheDocument();
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
    await u.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(await screen.findByRole('heading', { name: /qué querés activar/i })).toBeInTheDocument();
  });
});

describe('Wizard — paso 1: vista previa en vivo', () => {
  it('muestra "Tu negocio" y se actualiza con el rubro y sus módulos', async () => {
    const u = user();
    render(<Wizard />);
    const preview = await screen.findByTestId('negocio-preview');
    expect(within(preview).getByText('Tu negocio')).toBeInTheDocument();

    await u.click(screen.getByRole('radio', { name: /comercio/i }));
    expect(within(preview).getByText('Comercio y tienda')).toBeInTheDocument();
    const tienda = within(preview).getByText('Tienda y catálogo').closest('li');
    const turnos = within(preview).getByText('Turnos y reservas').closest('li');
    expect(tienda).toHaveAttribute('data-on', 'true');
    expect(turnos).toHaveAttribute('data-on', 'false');
  });
});

describe('Wizard — paso 2 (módulos y objetivos)', () => {
  it('trae marcados los módulos sugeridos del rubro y lo aclara', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubroYContinuar(u);
    await screen.findByRole('heading', { name: /qué querés activar/i });

    expect(screen.getByRole('checkbox', { name: /turnos y reservas/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /tienda y catálogo/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /carta con qr/i })).not.toBeChecked();
    expect(screen.getAllByText('Sugerido para tu rubro').length).toBeGreaterThan(0);
  });

  it('los objetivos son del rubro elegido y opcionales: se puede seguir sin elegir ninguno', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubroYContinuar(u);

    expect(
      await screen.findByRole('checkbox', { name: /recibir turnos online/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /mostrar mi carta/i })).not.toBeInTheDocument();

    await u.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(
      await screen.findByRole('heading', { name: /contanos de tu negocio/i }),
    ).toBeInTheDocument();
  });

  it('"Siguiente" se habilita solo con al menos un módulo', async () => {
    const u = user();
    render(<Wizard />);
    await u.click(await screen.findByRole('radio', { name: /otro/i }));
    await u.type(screen.getByLabelText(/a qué se dedica/i), 'Floristería');
    await u.click(screen.getByRole('button', { name: 'Siguiente' }));
    await screen.findByRole('heading', { name: /qué querés activar/i });

    // "Otro" sugiere formularios, clientes y avisos: se apagan los tres.
    for (const nombre of [/formularios/i, /base de clientes/i, /avisos automáticos/i]) {
      await u.click(screen.getByRole('checkbox', { name: nombre }));
    }
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
    expect(screen.getByText(/activá al menos un módulo/i)).toBeInTheDocument();

    await u.click(screen.getByRole('checkbox', { name: /pagos online/i }));
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled();
  });

  it('"Atrás" vuelve al paso anterior conservando la selección', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubroYContinuar(u);
    await screen.findByRole('heading', { name: /qué querés activar/i });

    await u.click(screen.getByRole('button', { name: /atrás/i }));
    expect(await screen.findByRole('heading', { name: /qué vas a crear/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /peluquería/i })).toBeChecked();
  });
});

describe('Wizard — módulos: hero y cambio de rubro', () => {
  it('lo activado en el hero llega pre-seleccionado al paso de módulos', async () => {
    const u = user();
    render(
      <>
        <HeroMockup />
        <Wizard />
      </>,
    );
    await u.click(screen.getByRole('button', { name: /carta con qr/i }));
    expect(screen.getByRole('button', { name: /carta con qr/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    // Comercio no sugiere Carta con QR: tiene que estar marcada por lo que hizo en el hero.
    await elegirRubroYContinuar(u, /comercio/i);
    await screen.findByRole('heading', { name: /qué querés activar/i });
    expect(screen.getByRole('checkbox', { name: /carta con qr/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /tienda y catálogo/i })).toBeChecked();
  });

  it('el hero refleja lo que se cambia en el wizard (misma fuente de verdad)', async () => {
    const u = user();
    render(
      <>
        <HeroMockup />
        <Wizard />
      </>,
    );
    await u.click(await screen.findByRole('radio', { name: /peluquería/i }));
    // Peluquería sugiere turnos y tienda; el hero los muestra activos sin haberlos tocado.
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /turnos y reservas/i })).toHaveAttribute(
        'aria-pressed',
        'true',
      ),
    );
    expect(screen.getByRole('button', { name: /carta con qr/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('al cambiar de rubro no quedan módulos fantasma ni se pisa lo elegido a mano', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubroYContinuar(u); // peluquería: turnos, tienda, pagos, clientes, avisos
    await screen.findByRole('heading', { name: /qué querés activar/i });
    await u.click(screen.getByRole('checkbox', { name: /carta con qr/i })); // a mano: sí
    await u.click(screen.getByRole('checkbox', { name: /pagos online/i })); // a mano: no

    await u.click(screen.getByRole('button', { name: /atrás/i }));
    await u.click(await screen.findByRole('radio', { name: /comercio/i }));
    await u.click(screen.getByRole('button', { name: 'Siguiente' }));
    await screen.findByRole('heading', { name: /qué querés activar/i });

    // Lo manual se respeta: Carta con QR sigue activa y Pagos sigue apagado.
    expect(screen.getByRole('checkbox', { name: /carta con qr/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /pagos online/i })).not.toBeChecked();
    // Sin fantasmas: Turnos era de peluquería y comercio no lo sugiere.
    expect(screen.getByRole('checkbox', { name: /turnos y reservas/i })).not.toBeChecked();
    // Y los sugeridos de comercio sí aparecen.
    expect(screen.getByRole('checkbox', { name: /tienda y catálogo/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /base de clientes/i })).toBeChecked();
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
  it('envía el lead con UTM y módulos y llega a la confirmación', async () => {
    window.history.replaceState(null, '', '/empezar?utm_source=instagram&utm_medium=bio');
    const eventos: string[] = [];
    const quitar = registerSink((e) => void eventos.push(e));
    const u = user();
    await llegarAlPaso3(u);
    await completarDatos(u);
    await u.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(
      await screen.findByRole(
        'heading',
        { name: /tu negocio está listo para armarse/i },
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/leads');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).toMatchObject({
      nombreNegocio: 'Peluquería Luna',
      nombre: 'Ana Pérez',
      rubro: 'peluqueria_estetica',
      modulos: ['turnos', 'catalogo', 'pagos', 'clientes', 'notificaciones'],
      objetivos: ['recibir_turnos'],
      website: '',
      utm_source: 'instagram',
      utm_medium: 'bio',
    });

    const modulos = screen.getByRole('list', { name: /las piezas de tu negocio/i });
    expect(modulos).toHaveTextContent('Turnos y reservas');
    expect(screen.getByText('Te escribimos por WhatsApp para ponerlo online.')).toBeInTheDocument();
    // Aviso honesto: la entrega la hacemos nosotros, no hay plataforma de autoservicio.
    expect(screen.getByText(/lo armamos nosotros/i)).toBeInTheDocument();
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
    await u.click(await screen.findByRole('checkbox', { name: /recibir turnos online/i }));
    await u.click(screen.getByRole('checkbox', { name: /carta con qr/i }));
    await waitFor(() =>
      expect(window.sessionStorage.getItem(STORAGE_KEY)).toContain('recibir_turnos'),
    );
    unmount();

    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: /qué querés activar/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /recibir turnos online/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /carta con qr/i })).toBeChecked();
  });

  it('ignora un estado guardado corrupto', async () => {
    window.sessionStorage.setItem(STORAGE_KEY, '{no es json');
    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: /qué vas a crear/i })).toBeInTheDocument();
  });
});
