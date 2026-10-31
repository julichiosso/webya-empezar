import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dejarTraspasoDemo } from '@/domain/traspaso/demo-wizard';
import { registerSink } from '@/lib/analytics';
import { Wizard } from './Wizard';
import { STORAGE_KEY } from './state';

const ID = '3f1c2b4a-1111-4222-8333-444455556666';
const TOKEN = 'a'.repeat(43);

const fetchMock = vi.fn();

/** POST parcial → { id, token }; PATCH → ok. */
function api(init?: RequestInit) {
  if (init?.method === 'PATCH') return new Response(JSON.stringify({ ok: true }), { status: 200 });
  return new Response(JSON.stringify({ ok: true, id: ID, token: TOKEN }), { status: 201 });
}

let eventos: [string, unknown][] = [];
let quitarSink: () => void;

beforeEach(() => {
  window.sessionStorage.clear();
  fetchMock.mockReset();
  fetchMock.mockImplementation((_url: string, init?: RequestInit) => Promise.resolve(api(init)));
  vi.stubGlobal('fetch', fetchMock);
  eventos = [];
  quitarSink = registerSink((e, p) => void eventos.push([e, p]));
});

afterEach(() => {
  quitarSink();
  vi.unstubAllGlobals();
});

const user = () => userEvent.setup();
type U = ReturnType<typeof user>;

const cuerpo = (n: number) =>
  JSON.parse((fetchMock.mock.calls[n] as [string, RequestInit])[1].body as string) as Record<
    string,
    unknown
  >;
const nombres = () => eventos.map(([e]) => e);

/** Pantalla 1: un toque en el rubro avanza solo. */
async function elegirRubro(u: U, nombre: RegExp = /peluquería/i) {
  await u.click(await screen.findByRole('button', { name: nombre }));
}

async function completarNegocio(u: U, { negocio = 'Luna Peluquería', ciudad = '' } = {}) {
  await screen.findByRole('heading', { name: /contanos de tu negocio/i });
  await u.type(screen.getByLabelText(/nombre de tu negocio/i), negocio);
  await u.type(screen.getByLabelText(/tu whatsapp/i), '1123456789');
  if (ciudad) await u.type(screen.getByLabelText(/ciudad/i), ciudad);
}

async function llegarAlResultado(u: U, rubro?: RegExp) {
  render(<Wizard />);
  await elegirRubro(u, rubro);
  await completarNegocio(u);
  await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
  await screen.findByRole('heading', { name: /así te queda luna peluquería/i }, { timeout: 4000 });
}

describe('Wizard — pantalla 1 (rubro)', () => {
  it('muestra los 7 rubros y un toque avanza al formulario', async () => {
    const u = user();
    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: '¿Qué negocio tenés?' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(7);
    await elegirRubro(u, /gastronomía/i);
    expect(
      await screen.findByRole('heading', { name: /contanos de tu negocio/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Completalo y en segundos ves cómo te quedaría.')).toBeInTheDocument();
    expect(nombres()).toContain('rubro_elegido');
  });

  it('arranca desde el rubro que se tocó antes de que llegara el wizard', async () => {
    render(<Wizard rubroInicial="comercio" />);
    expect(
      await screen.findByRole('heading', { name: /contanos de tu negocio/i }),
    ).toBeInTheDocument();
  });

  it('"Atrás" vuelve a los rubros con el elegido marcado', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubro(u, /comercio/i);
    await u.click(await screen.findByRole('button', { name: 'Atrás' }));
    expect(
      await screen.findByRole('button', { name: /comercio/i, pressed: true }),
    ).toBeInTheDocument();
  });
});

describe('Wizard — "Otro" (a medida)', () => {
  it('pide el pedido libre, lo exige y termina en "Lo armamos a medida" sin vista previa', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubro(u, /^otro/i);
    await screen.findByRole('heading', { name: /contanos qué necesitás/i });
    await u.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(await screen.findByText(/aunque sea en pocas palabras/i)).toBeInTheDocument();
    await u.type(screen.getByLabelText(/qué necesita tu negocio/i), 'Turnos para mi lavadero');
    await u.click(screen.getByRole('button', { name: 'Siguiente' }));
    await completarNegocio(u, { negocio: 'Lavadero Sol' });
    await u.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(
      await screen.findByRole('heading', { name: 'Lo armamos a medida' }, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(cuerpo(0)).toMatchObject({
      parcial: true,
      rubro: 'otro',
      necesidadLibre: 'Turnos para mi lavadero',
      modulos: [],
    });
    expect(screen.queryByTestId('negocio-preview')).toBeNull();
  });
});

describe('Wizard — pantalla 2 (negocio): guarda el lead parcial', () => {
  it('valida nombre y WhatsApp, y enfoca el primero con error', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubro(u);
    await screen.findByRole('heading', { name: /contanos de tu negocio/i });
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    await waitFor(() => expect(screen.getByLabelText(/nombre de tu negocio/i)).toHaveFocus());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('manda nombre, WhatsApp, ciudad, rubro y módulos; Enter envía', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubro(u);
    await completarNegocio(u, { ciudad: 'San Jorge' });
    await u.keyboard('{Enter}');
    await screen.findByRole('heading', { name: /así te queda/i }, { timeout: 4000 });
    expect(cuerpo(0)).toMatchObject({
      parcial: true,
      nombreNegocio: 'Luna Peluquería',
      ciudad: 'San Jorge',
      rubro: 'peluqueria_estetica',
      whatsapp: expect.stringContaining('11'),
    });
    expect((cuerpo(0).modulos as string[]).length).toBeGreaterThan(0);
    expect(nombres()).toEqual(expect.arrayContaining(['form_enviado', 'preview_visto']));
  });

  it('si la red falla: vista previa igual, aviso visible y "Reintentar" guarda el lead', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('sin red'));
    const u = user();
    render(<Wizard />);
    await elegirRubro(u);
    await completarNegocio(u);
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    expect(
      await screen.findByText(/todavía no pudimos guardar tus datos/i, {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /dejar más datos/i })).toBeNull();
    // A mano: vuelve a mandar EXACTAMENTE el mismo pedido.
    await u.click(screen.getByRole('button', { name: 'Reintentar ahora' }));
    expect(await screen.findByText('Listo, ya guardamos tus datos.')).toBeInTheDocument();
    expect(cuerpo(1)).toEqual(cuerpo(0));
    expect(screen.getByRole('button', { name: /dejar más datos/i })).toBeInTheDocument();
    expect(nombres()).toContain('form_enviado');
  });

  it('si el servidor falla, se reintenta solo por detrás (sin que la persona haga nada)', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 500 }));
    const u = user();
    render(<Wizard />);
    await elegirRubro(u);
    await completarNegocio(u);
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    await screen.findByText(/todavía no pudimos guardar tus datos/i, {}, { timeout: 4000 });
    expect(
      await screen.findByText('Listo, ya guardamos tus datos.', {}, { timeout: 6000 }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  }, 15_000);

  it('un error de validación del servidor se queda en el formulario', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: { fields: { whatsapp: 'Revisá el número.' } } }), {
        status: 400,
      }),
    );
    const u = user();
    render(<Wizard />);
    await elegirRubro(u);
    await completarNegocio(u);
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    expect(await screen.findByText('Revisá el número.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contanos de tu negocio/i })).toBeInTheDocument();
  });
});

describe('Wizard — pantalla 3 (resultado), completar y gracias', () => {
  it('el CTA abre WhatsApp con rubro, nombre y módulos', async () => {
    const u = user();
    await llegarAlResultado(u);
    const cta = screen.queryAllByRole('link', { name: /quiero esto para mi negocio/i })[0];
    // Sin número configurado (test) el CTA muestra su TODO; con número, el link lleva el mensaje.
    if (cta) {
      const texto = decodeURIComponent(cta.getAttribute('href') ?? '');
      expect(texto).toContain('Luna Peluquería');
      expect(texto).toContain('Peluquería');
    } else {
      expect(screen.getAllByText(/NEXT_PUBLIC_WHATSAPP_NUMBER/).length).toBeGreaterThan(0);
    }
  });

  it('completar: PATCH con el token, solo el nombre del negocio obligatorio, y gracias', async () => {
    const u = user();
    await llegarAlResultado(u);
    await u.click(screen.getByRole('button', { name: /dejar más datos/i }));
    await screen.findByRole('heading', { name: /contanos un poco más/i });
    expect(screen.getByLabelText(/nombre de tu negocio/i)).toHaveValue('Luna Peluquería');
    await u.click(screen.getByRole('button', { name: 'Enviar mis datos' }));
    expect(
      await screen.findByRole(
        'heading',
        { name: /listo, ya nos llegaron tus datos/i },
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(url).toBe(`/api/leads/${ID}`);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toMatchObject({
      token: TOKEN,
      nombreNegocio: 'Luna Peluquería',
    });
  });

  it('"Ahora no" vuelve a la vista previa', async () => {
    const u = user();
    await llegarAlResultado(u);
    await u.click(screen.getByRole('button', { name: /dejar más datos/i }));
    await u.click(await screen.findByRole('button', { name: 'Ahora no' }));
    expect(await screen.findByRole('heading', { name: /así te queda/i })).toBeInTheDocument();
  });

  it('Gastronomía ofrece la demo completa con el nombre cargado', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubro(u, /gastronomía/i);
    await completarNegocio(u, { negocio: 'Lo de Tito' });
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    const demo = await screen.findByRole(
      'link',
      { name: /probá la demo completa/i },
      {
        timeout: 4000,
      },
    );
    expect(demo).toHaveAttribute('href', '/demo/gastronomia?local=Lo+de+Tito&paleta=brasa');
  });
});

describe('Wizard — desde la demo', () => {
  it('entra en la pantalla 2 con el nombre del local y lleva la paleta a la demo', async () => {
    dejarTraspasoDemo(
      {
        origen: 'demo_gastronomia',
        rubro: 'gastronomia',
        modulos: ['carta_qr', 'pedidos'],
        nombreNegocio: 'Lo de Tito',
        demo: { paleta: 'pileta', cocina: 'parrilla' },
      },
      window.sessionStorage,
    );
    const u = user();
    render(<Wizard />);
    expect(await screen.findByLabelText(/nombre de tu negocio/i)).toHaveValue('Lo de Tito');
    await u.type(screen.getByLabelText(/tu whatsapp/i), '1123456789');
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    const demo = await screen.findByRole(
      'link',
      { name: /probá la demo completa/i },
      {
        timeout: 4000,
      },
    );
    expect(demo).toHaveAttribute('href', '/demo/gastronomia?local=Lo+de+Tito&paleta=pileta');
    expect(cuerpo(0)).toMatchObject({
      origen: 'demo_gastronomia',
      demo: { paleta: 'pileta', cocina: 'parrilla' },
      modulos: ['carta_qr', 'pedidos'],
    });
  });
});

describe('Wizard — persistencia en sessionStorage', () => {
  it('después de guardar el lead, una recarga vuelve a la vista previa', async () => {
    const u = user();
    const { unmount } = render(<Wizard />);
    await elegirRubro(u);
    await completarNegocio(u);
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    await screen.findByRole('heading', { name: /así te queda/i }, { timeout: 4000 });
    unmount();
    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: /así te queda/i })).toBeInTheDocument();
  });

  it('ignora un estado guardado corrupto o de una versión vieja', async () => {
    window.sessionStorage.setItem(STORAGE_KEY, '{roto');
    window.sessionStorage.setItem('webya:empezar:v2', JSON.stringify({ paso: 5 }));
    render(<Wizard />);
    expect(await screen.findByRole('heading', { name: '¿Qué negocio tenés?' })).toBeInTheDocument();
  });

  it('un paso imposible se corrige (vista previa sin lead → formulario)', async () => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ paso: 'resultado', rubro: 'comercio' }),
    );
    render(<Wizard />);
    expect(
      await screen.findByRole('heading', { name: /contanos de tu negocio/i }),
    ).toBeInTheDocument();
  });
});

describe('Wizard — abandono', () => {
  it('avisa una vez con la pantalla en la que estaba al ocultar la pestaña', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubro(u);
    await screen.findByRole('heading', { name: /contanos de tu negocio/i });
    const oculta = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      document.dispatchEvent(new Event('visibilitychange'));
    });
    oculta.mockRestore();
    expect(eventos.filter(([e]) => e === 'abandono_paso')).toEqual([
      ['abandono_paso', { paso: 'negocio' }],
    ]);
  });
});

describe('Wizard — pantalla 3: cómo se ve, colores y piezas', () => {
  it('cambia celular/computadora, la paleta y las piezas (y lo mide)', async () => {
    const u = user();
    await llegarAlResultado(u);
    const ver = screen.getByRole('group', { name: 'Ver en' });
    await u.click(within(ver).getByRole('button', { name: 'Computadora' }));
    expect(within(ver).getByRole('button', { name: 'Computadora' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await u.click(screen.getByRole('button', { name: 'Colores Pileta' }));
    expect(screen.getByRole('button', { name: 'Colores Pileta' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const turnos = screen.getByRole('button', { name: /turnos y reservas/i, pressed: true });
    await u.click(turnos);
    expect(turnos).toHaveAttribute('aria-pressed', 'false');
    expect(nombres()).toEqual(expect.arrayContaining(['preview_toggle', 'modulo_alternado']));
  });

  it('la demo de Gastronomía se abre con la paleta elegida', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubro(u, /gastronomía/i);
    await completarNegocio(u, { negocio: 'Lo de Tito' });
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    await screen.findByRole('heading', { name: /así te queda/i }, { timeout: 4000 });
    await u.click(screen.getByRole('button', { name: 'Colores Ciruela' }));
    expect(screen.getByRole('link', { name: /probá la demo completa/i })).toHaveAttribute(
      'href',
      '/demo/gastronomia?local=Lo+de+Tito&paleta=ciruela',
    );
  });

  it('en celular el CTA también va en la barra fija abajo', async () => {
    const u = user();
    await llegarAlResultado(u);
    expect(screen.getByTestId('barra-cta')).toBeInTheDocument();
  });
});

describe('Wizard — orden B (?orden=b)', () => {
  beforeEach(() => window.history.replaceState(null, '', '/empezar?orden=b'));
  afterEach(() => window.history.replaceState(null, '', '/'));

  it('pide solo el nombre, muestra la vista previa y el WhatsApp recién al tocar el CTA', async () => {
    const u = user();
    render(<Wizard />);
    await elegirRubro(u);
    await screen.findByRole('heading', { name: /contanos de tu negocio/i });
    expect(screen.queryByLabelText(/tu whatsapp/i)).toBeNull();
    await u.type(screen.getByLabelText(/nombre de tu negocio/i), 'Luna Peluquería');
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    await screen.findByRole(
      'heading',
      { name: /así te queda luna peluquería/i },
      { timeout: 4000 },
    );
    expect(fetchMock).not.toHaveBeenCalled();

    await u.click(screen.getAllByRole('button', { name: /quiero esto para mi negocio/i })[0]!);
    await screen.findByRole('heading', { name: /a qué whatsapp te escribimos/i });
    await u.type(screen.getByLabelText(/tu whatsapp/i), '1123456789');
    await u.click(screen.getByRole('button', { name: 'Guardar y seguir' }));
    await screen.findByRole('heading', { name: /así te queda/i }, { timeout: 4000 });
    expect(cuerpo(0)).toMatchObject({ parcial: true, nombreNegocio: 'Luna Peluquería' });
    expect(eventos).toContainEqual(['form_enviado', expect.objectContaining({ orden: 'b' })]);
    expect(eventos).toContainEqual(['cta_click', expect.objectContaining({ destino: 'contacto' })]);
  });
});
