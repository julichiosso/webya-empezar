// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CanalesNotificationService,
  canalTelegram,
  ConsoleNotificationService,
  crearNotificaciones,
} from './notifications';

const lead = {
  id: 'id-1',
  whatsapp: '+5491123456789',
  necesidades: [],
  necesidad_libre: null,
  rubro: 'peluqueria_estetica',
  rubro_otro: null,
  modulos: ['catalogo'],
  nombre_negocio: 'Barbería Norte',
  ciudad: 'Rosario',
};

const sinCanales = {
  TELEGRAM_BOT_TOKEN: undefined,
  TELEGRAM_CHAT_ID: undefined,
  RESEND_API_KEY: undefined,
  NOTIFY_TO_EMAIL: undefined,
  NOTIFY_FROM_EMAIL: 'WebYa <a@b.com>',
};

afterEach(() => vi.unstubAllGlobals());

describe('avisos de leads', () => {
  it('sin credenciales queda la consola; con una pareja completa, los canales', () => {
    expect(crearNotificaciones(sinCanales)).toBeInstanceOf(ConsoleNotificationService);
    expect(crearNotificaciones({ ...sinCanales, TELEGRAM_BOT_TOKEN: 'x' })).toBeInstanceOf(
      ConsoleNotificationService,
    );
    expect(
      crearNotificaciones({ ...sinCanales, TELEGRAM_BOT_TOKEN: 'x', TELEGRAM_CHAT_ID: '1' }),
    ).toBeInstanceOf(CanalesNotificationService);
  });

  it('el aviso trae rubro, módulos y el link para escribirle con el saludo armado', async () => {
    const enviar = vi.fn().mockResolvedValue(undefined);
    await new CanalesNotificationService([{ enviar }]).nuevoLeadParcial(lead);
    const [asunto, texto] = enviar.mock.calls[0] as [string, string];
    expect(asunto).toContain('Barbería Norte');
    expect(texto).toContain('Peluquería y estética');
    expect(texto).toContain('Tienda y catálogo');
    expect(texto).toContain('https://wa.me/5491123456789?text=');
    expect(decodeURIComponent(texto)).toContain('Barbería Norte');
  });

  it('que falle un canal no frena al otro; si fallan todos, lanza', async () => {
    const bien = vi.fn().mockResolvedValue(undefined);
    const mal = vi.fn().mockRejectedValue(new Error('caído'));
    await expect(
      new CanalesNotificationService([{ enviar: mal }, { enviar: bien }]).nuevoLeadParcial(lead),
    ).resolves.toBeUndefined();
    expect(bien).toHaveBeenCalledOnce();
    await expect(
      new CanalesNotificationService([{ enviar: mal }]).nuevoLeadParcial(lead),
    ).rejects.toThrow('Fallaron');
  });

  it('Telegram: una respuesta de error de la API cuenta como falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 401 })));
    await expect(canalTelegram('t', '1').enviar('a', 'b')).rejects.toThrow('401');
  });

  it('la consola no deja ni el teléfono ni el nombre en el log', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await new ConsoleNotificationService().nuevoLeadParcial(lead);
    const log = warn.mock.calls.flat().join(' ');
    expect(log).not.toContain('5491123456789');
    expect(log).not.toContain('Barbería');
    warn.mockRestore();
  });
});
