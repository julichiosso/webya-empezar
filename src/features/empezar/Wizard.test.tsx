import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HeroMockupConectado as HeroMockup } from './HeroMockupConectado';
import { dejarTraspasoDemo } from '@/domain/traspaso/demo-wizard';
import { registerSink } from '@/lib/analytics';
import { reiniciarModulos } from './modulos-store';
import { Wizard } from './Wizard';
import { STORAGE_KEY } from './state';

const ID = '3f1c2b4a-1111-4222-8333-444455556666';
const TOKEN = 'a'.repeat(43);

const fetchMock = vi.fn();

/** Respuestas de la API por método: POST parcial → { id, token }; POST completo → { id }; PATCH → ok. */
function api(init?: RequestInit) {
  const body = JSON.parse((init?.body as string) ?? '{}') as Record<string, unknown>;
  if (init?.method === 'PATCH') return new Response(JSON.stringify({ ok: true }), { status: 200 });
  return new Response(
    JSON.stringify(body.parcial ? { ok: true, id: ID, token: TOKEN } : { ok: true, id: ID }),
    { status: 201 },
  );
}

beforeEach(() => {
  window.sessionStorage.clear();
  act(() => reiniciarModulos());
  fetchMock.mockReset();
  fetchMock.mockImplementation((_url: string, init?: RequestInit) => Promise.resolve(api(init)));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const user = () => userEvent.setup();
type U = ReturnType<typeof user>;

const siguiente = (u: U) => u.click(screen.getByRole('button', { name: 'Siguiente' }));
const cuerpo = (n: number) =>
  JSON.parse((fetchMock.mock.calls[n] as [string, RequestInit])[1].body as string) as Record<
    string,
    unknown
  >;

/** Paso 1: marca una necesidad y sigue. */
async function elegirNecesidad(u: U, nombre = 'Recibir turnos') {
  await u.click(await screen.findByRole('checkbox', { name: nombre }));
  await siguiente(u);
  await screen.findByRole('heading', { name: /a qué se dedica tu negocio/i });
}

/** Paso 2: elige el rubro y sigue. */
async function elegirRubro(u: U, nombre = /peluquería/i) {
  await u.click(await screen.findByRole('radio', { name: nombre }));
  await siguiente(u);
}

async function llegarAModulos(u: U, rubro = /peluquería/i) {
  render(<Wizard />);
  await elegirNecesidad(u);
  await elegirRubro(u, rubro);
  await screen.findByRole('heading', { name: /qué querés activar/i });
}

async function llegarAWhatsapp(u: U) {
  await llegarAModulos(u);
  await u.click(screen.getByRole('checkbox', { name: /recibir turnos online/i }));
  await siguiente(u);
  await screen.findByRole('heading', { name: /a qué whatsapp te escribimos/i });
}

async function llegarACompletar(u: U) {
  await llegarAWhatsapp(u);
  await u.type(screen.getByLabelText(/tu whatsapp/i), '1123456789');
  await u.click(screen.getByRole('button', { name: 'Guardar y seguir' }));
  await screen.findByRole('heading', { name: /contanos un poco más/i }, { timeout: 4000 });
}

describe('Wizard — paso 1 (qué necesitás)', () => {
  it('muestra las necesidades como casillas y no deja avanzar sin marcar ninguna', async () => {
    const u = user();
    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: '¿Qué necesitás?' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(6);
    expect(screen.getByText('Paso 1 de 5')).toBeInTheDocument();
    await siguiente(u);
    expect(screen.getByText(/marcá al menos una opción/i)).toBeInTheDocument();
  });

  it('"Otra cosa" abre el texto libre (hasta 500) y lo exige', async () => {
    const u = user();
    render(<Wizard />);
    expect(screen.queryByLabelText(/contanos qué necesitás/i)).not.toBeInTheDocument();
    await u.click(await screen.findByRole('checkbox', { name: 'Otra cosa' }));
    const libre = await screen.findByLabelText(/contanos qué necesitás/i);
    expect(libre).toHaveAttribute('maxlength', '500');

    await siguiente(u);
    expect(screen.getByText(/aunque sea en pocas palabras/i)).toBeInTheDocument();
    await u.type(libre, 'Controlar el stock de mis dos locales');
    await siguiente(u);
    expect(
      await screen.findByRole('heading', { name: /a qué se dedica tu negocio/i }),
    ).toBeInTheDocument();
  });
});

describe('Wizard — paso 2 (rubro)', () => {
  it('muestra todos los rubros y no deja avanzar sin elegir; "Otro" exige describirlo', async () => {
    const u = user();
    render(<Wizard />);
    await elegirNecesidad(u);
    expect(screen.getAllByRole('radio')).toHaveLength(7);
    expect(screen.getByText('Paso 2 de 5')).toBeInTheDocument();
    await siguiente(u);
    expect(screen.getByText('Elegí el rubro que más se parezca a tu negocio.')).toBeInTheDocument();

    await u.click(screen.getByRole('radio', { name: /otro/i }));
    await siguiente(u);
    expect(screen.getByText(/contanos a qué se dedica/i)).toBeInTheDocument();
    await u.type(screen.getByLabelText(/a qué se dedica/i), 'Floristería');
    await siguiente(u);
    expect(await screen.findByRole('heading', { name: /qué querés activar/i })).toBeInTheDocument();
  });

  it('la vista previa muestra "Tu negocio" y se actualiza con el rubro y sus módulos', async () => {
    const u = user();
    render(<Wizard />);
    await elegirNecesidad(u, 'Vender online');
    const preview = await screen.findByTestId('negocio-preview');
    await u.click(screen.getByRole('radio', { name: /comercio/i }));
    expect(within(preview).getByText('Comercio y tienda')).toBeInTheDocument();
    const tienda = within(preview).getByText('Tienda y catálogo').closest('li');
    const turnos = within(preview).getByText('Turnos y reservas').closest('li');
    expect(tienda).toHaveAttribute('data-on', 'true');
    expect(turnos).toHaveAttribute('data-on', 'false');
  });

  it('"Atrás" vuelve al paso anterior conservando lo marcado', async () => {
    const u = user();
    render(<Wizard />);
    await elegirNecesidad(u);
    await u.click(screen.getByRole('button', { name: /atrás/i }));
    expect(await screen.findByRole('heading', { name: '¿Qué necesitás?' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Recibir turnos' })).toBeChecked();
  });
});

describe('Wizard — paso 3 (módulos)', () => {
  it('trae marcados los sugeridos del rubro y de las necesidades, con su estado', async () => {
    const u = user();
    render(<Wizard />);
    await elegirNecesidad(u, 'Mostrar la carta'); // sugiere carta con QR y pedidos
    await elegirRubro(u, /comercio/i);
    await screen.findByRole('heading', { name: /qué querés activar/i });

    expect(screen.getByRole('checkbox', { name: /tienda y catálogo/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /carta con qr/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /turnos y reservas/i })).not.toBeChecked();
    expect(screen.getAllByText('Sugerido para tu rubro').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Va con lo que necesitás').length).toBeGreaterThan(0);
    // El estado honesto de cada módulo, con su TODO visible si lo tiene.
    expect(screen.getByRole('checkbox', { name: /carta con qr/i })).toHaveAccessibleDescription(
      /con demo/i,
    );
    expect(screen.getAllByText(/TODO:/).length).toBeGreaterThan(0);
  });

  it('los módulos son opcionales: se puede seguir sin ninguno', async () => {
    const u = user();
    await llegarAModulos(u);
    for (const c of screen.getAllByRole('checkbox', { checked: true })) await u.click(c);
    expect(screen.getByText(/no activaste ninguno/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled();
    await siguiente(u);
    expect(
      await screen.findByRole('heading', { name: /a qué whatsapp te escribimos/i }),
    ).toBeInTheDocument();
  });

  it('lo activado en el hero llega pre-seleccionado y el hero refleja el wizard', async () => {
    const u = user();
    render(
      <>
        <HeroMockup />
        <Wizard />
      </>,
    );
    await u.click(screen.getByRole('button', { name: /carta con qr/i }));
    await elegirNecesidad(u, 'Vender online');
    await u.click(await screen.findByRole('radio', { name: /peluquería/i }));
    // Peluquería sugiere turnos: el hero lo muestra activo sin haberlo tocado.
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /turnos y reservas/i })).toHaveAttribute(
        'aria-pressed',
        'true',
      ),
    );
    await siguiente(u);
    await screen.findByRole('heading', { name: /qué querés activar/i });
    // Peluquería no sugiere Carta con QR: está marcada por lo que hizo en el hero.
    expect(screen.getByRole('checkbox', { name: /carta con qr/i })).toBeChecked();
  });

  it('al cambiar de rubro no quedan módulos fantasma ni se pisa lo elegido a mano', async () => {
    const u = user();
    await llegarAModulos(u); // peluquería: turnos, tienda, pagos, clientes, avisos
    await u.click(screen.getByRole('checkbox', { name: /carta con qr/i })); // a mano: sí
    await u.click(screen.getByRole('checkbox', { name: /pagos online/i })); // a mano: no

    await u.click(screen.getByRole('button', { name: /atrás/i }));
    await elegirRubro(u, /comercio/i);
    await screen.findByRole('heading', { name: /qué querés activar/i });

    expect(screen.getByRole('checkbox', { name: /carta con qr/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /pagos online/i })).not.toBeChecked();
    // "Recibir turnos" (paso 1) sigue sugiriendo turnos aunque comercio no lo haga.
    expect(screen.getByRole('checkbox', { name: /turnos y reservas/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /tienda y catálogo/i })).toBeChecked();
  });
});

describe('Wizard — paso 4 (solo WhatsApp): guarda el lead parcial', () => {
  it('valida al salir del campo y formatea mientras se escribe', async () => {
    const u = user();
    await llegarAWhatsapp(u);
    const whatsapp = screen.getByLabelText(/tu whatsapp/i);
    await u.type(whatsapp, '123');
    expect(screen.queryByText(/revisá el número/i)).not.toBeInTheDocument();
    await u.tab();
    expect(await screen.findByText(/revisá el número/i)).toBeInTheDocument();
    await u.clear(whatsapp);
    await u.type(whatsapp, '1123456789');
    expect(whatsapp).toHaveValue('11 2345 6789');
  });

  it('no envía sin WhatsApp', async () => {
    const u = user();
    await llegarAWhatsapp(u);
    await u.click(screen.getByRole('button', { name: 'Guardar y seguir' }));
    await waitFor(() =>
      expect(screen.getByLabelText(/tu whatsapp/i)).toHaveAttribute('aria-invalid', 'true'),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('manda el lead parcial con necesidades, rubro, módulos y UTM', async () => {
    window.history.replaceState(null, '', '/empezar?utm_source=instagram&utm_medium=bio');
    const u = user();
    await llegarACompletar(u);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((fetchMock.mock.calls[0] as [string])[0]).toBe('/api/leads');
    expect(cuerpo(0)).toMatchObject({
      parcial: true,
      whatsapp: '11 2345 6789',
      necesidades: ['turnos'],
      rubro: 'peluqueria_estetica',
      modulos: ['turnos', 'catalogo', 'pagos', 'clientes', 'notificaciones'],
      objetivos: ['recibir_turnos'],
      website: '',
      utm_source: 'instagram',
      utm_medium: 'bio',
    });
    // Sin "Otra cosa" no viaja el texto libre.
    expect(cuerpo(0)).not.toHaveProperty('necesidadLibre');
    // Ya guardado: no hay "Atrás" hacia el WhatsApp.
    expect(screen.getByText('Atrás').closest('button')).toHaveAttribute('aria-hidden', 'true');
  });

  it('si el servidor falla, avisa con un mensaje amable y se puede reintentar', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 500 }));
    const u = user();
    await llegarAWhatsapp(u);
    await u.type(screen.getByLabelText(/tu whatsapp/i), '1123456789');
    await u.click(screen.getByRole('button', { name: 'Guardar y seguir' }));
    expect(await screen.findByText(/no pudimos guardar tus datos/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar y seguir' })).toBeEnabled();
  });
});

describe('Wizard — paso 5 (completar) y confirmación', () => {
  it('completa con solo el nombre del negocio (PATCH con el token) y confirma', async () => {
    const eventos: string[] = [];
    const quitar = registerSink((e) => void eventos.push(e));
    const u = user();
    await llegarACompletar(u);

    await u.click(screen.getByRole('button', { name: 'Enviar mis datos' }));
    await waitFor(() =>
      expect(screen.getByLabelText(/nombre de tu negocio/i)).toHaveAttribute(
        'aria-invalid',
        'true',
      ),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await u.type(screen.getByLabelText(/nombre de tu negocio/i), 'Peluquería Luna');
    await u.click(screen.getByRole('button', { name: 'Enviar mis datos' }));
    expect(
      await screen.findByRole(
        'heading',
        { name: /tu negocio está listo para armarse/i },
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(url).toBe(`/api/leads/${ID}`);
    expect(init.method).toBe('PATCH');
    expect(cuerpo(1)).toMatchObject({ token: TOKEN, nombreNegocio: 'Peluquería Luna' });

    // Sin nombre de persona, el saludo arranca por el rubro.
    expect(screen.getByText(/estas son las piezas que activaste/i)).toHaveTextContent(
      /^Para Peluquería/,
    );
    expect(screen.getByRole('list', { name: /las piezas de tu negocio/i })).toHaveTextContent(
      'Turnos y reservas',
    );
    expect(screen.getByText(/lo armamos nosotros/i)).toBeInTheDocument();
    expect(eventos).toEqual(
      expect.arrayContaining([
        'empezar_view',
        'paso_completado',
        'lead_parcial',
        'lead_completado',
      ]),
    );
    quitar();
  });

  it('"Ahora no" deja el lead como parcial y confirma igual', async () => {
    const u = user();
    await llegarACompletar(u);
    await u.click(screen.getByRole('button', { name: /ahora no/i }));
    expect(
      await screen.findByRole('heading', { name: 'Ya tenemos tu WhatsApp' }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('si el enlace venció (404), avisa que el WhatsApp llegó igual', async () => {
    const u = user();
    await llegarACompletar(u);
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 404 }));
    await u.type(screen.getByLabelText(/nombre de tu negocio/i), 'Peluquería Luna');
    await u.click(screen.getByRole('button', { name: 'Enviar mis datos' }));
    expect(await screen.findByText(/tu whatsapp ya nos llegó/i)).toBeInTheDocument();
  });

  it('con "Otra cosa", la confirmación dice que leemos lo que contó', async () => {
    const u = user();
    render(<Wizard />);
    await u.click(await screen.findByRole('checkbox', { name: 'Otra cosa' }));
    await u.type(await screen.findByLabelText(/contanos qué necesitás/i), 'Stock de dos locales');
    await siguiente(u);
    await elegirRubro(u, /comercio/i);
    await screen.findByRole('heading', { name: /qué querés activar/i });
    await siguiente(u);
    await u.type(await screen.findByLabelText(/tu whatsapp/i), '1123456789');
    await u.click(screen.getByRole('button', { name: 'Guardar y seguir' }));
    expect(cuerpo(0)).toMatchObject({
      necesidades: ['otra'],
      necesidadLibre: 'Stock de dos locales',
    });
    await u.click(await screen.findByRole('button', { name: /ahora no/i }, { timeout: 4000 }));
    expect(await screen.findByText(/leemos lo que nos contaste/i)).toBeInTheDocument();
  });
});

describe('Wizard — desde la demo', () => {
  it('entra en módulos con lo de la demo y manda todo en un solo formulario', async () => {
    dejarTraspasoDemo(
      {
        origen: 'demo_gastronomia',
        rubro: 'gastronomia',
        modulos: ['carta_qr', 'pagos', 'notificaciones'],
        nombreNegocio: 'Lo de Tito',
        demo: { paleta: 'pileta', cocina: 'parrilla' },
      },
      window.sessionStorage,
    );
    const u = user();
    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: /qué querés activar/i })).toBeInTheDocument();
    expect(screen.getByText('Paso 3 de 4')).toBeInTheDocument();
    expect(screen.getByText(/trajimos lo que armaste en la demo/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /^carta con qr/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /^turnos y reservas/i })).not.toBeChecked();

    await siguiente(u);
    expect(
      await screen.findByRole('heading', { name: /contanos de tu negocio/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de tu negocio/i)).toHaveValue('Lo de Tito');
    await u.type(screen.getByLabelText(/tu nombre/i), 'Ana Pérez');
    await u.type(screen.getByLabelText(/tu whatsapp/i), '1123456789');
    await u.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(
      await screen.findByRole(
        'heading',
        { name: /tu negocio está listo para armarse/i },
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();
    expect(cuerpo(0)).toMatchObject({
      origen: 'demo_gastronomia',
      rubro: 'gastronomia',
      nombreNegocio: 'Lo de Tito',
      demo: { paleta: 'pileta', cocina: 'parrilla' },
    });
    expect(cuerpo(0)).not.toHaveProperty('parcial');
  });
});

describe('Wizard — persistencia en sessionStorage', () => {
  it('conserva el estado al recargar', async () => {
    const u = user();
    const { unmount } = render(<Wizard />);
    await elegirNecesidad(u);
    await elegirRubro(u);
    await u.click(await screen.findByRole('checkbox', { name: /recibir turnos online/i }));
    await u.click(screen.getByRole('checkbox', { name: /^carta con qr/i }));
    await waitFor(() =>
      expect(window.sessionStorage.getItem(STORAGE_KEY)).toContain('recibir_turnos'),
    );
    unmount();

    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: /qué querés activar/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /recibir turnos online/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /^carta con qr/i })).toBeChecked();
  });

  it('después de guardar el WhatsApp, una recarga vuelve a "completar"', async () => {
    const u = user();
    await llegarACompletar(u);
    await waitFor(() => expect(window.sessionStorage.getItem(STORAGE_KEY)).toContain(TOKEN));
    cleanup(); // como una recarga
    render(<Wizard />);
    expect(
      await screen.findByRole('heading', { name: /contanos un poco más/i }),
    ).toBeInTheDocument();
  });

  it('ignora un estado guardado corrupto', async () => {
    window.sessionStorage.setItem(STORAGE_KEY, '{no es json');
    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: '¿Qué necesitás?' })).toBeInTheDocument();
  });
});
