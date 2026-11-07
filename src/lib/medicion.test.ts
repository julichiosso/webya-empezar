import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { track } from './analytics';
import { iniciarMedicion } from './medicion';

async function cuerposEnviados(beacon: ReturnType<typeof vi.fn>) {
  return Promise.all(
    beacon.mock.calls.map(async ([, blob]) => JSON.parse(await (blob as Blob).text())),
  );
}

describe('medición', () => {
  let beacon: ReturnType<typeof vi.fn>;
  let quitar: () => void;

  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.pushState({}, '', '/empezar?utm_source=instagram#secreto');
    beacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true });
    quitar = iniciarMedicion();
  });

  afterEach(() => quitar());

  it('manda la página vista con la ruta y el UTM, sin query ni hash', async () => {
    const [vista] = await cuerposEnviados(beacon);
    expect(vista).toMatchObject({
      nombre: 'pagina_vista',
      ruta: '/empezar',
      props: { ruta: '/empezar', utm_source: 'instagram' },
    });
    expect(JSON.stringify(vista)).not.toContain('secreto');
  });

  it('todos los eventos de una pestaña llevan la misma sesión', async () => {
    track('rubro_elegido', { rubro: 'comercio' });
    const [a, b] = await cuerposEnviados(beacon);
    expect(b).toMatchObject({ nombre: 'rubro_elegido', props: { rubro: 'comercio' } });
    expect(a.sesion).toMatch(/^[a-z0-9]{8,32}$/);
    expect(b.sesion).toBe(a.sesion);
  });
});
