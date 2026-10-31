import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Con el número de WhatsApp de WebYa configurado (en el resto de los tests no lo está).
vi.mock('@/lib/site-config', () => ({
  siteConfig: { url: 'https://webya.ar', whatsappNumber: '5491100000000', contactEmail: '' },
}));

const { Wizard } = await import('./Wizard');

const fetchMock = vi.fn();
beforeEach(() => {
  window.sessionStorage.clear();
  fetchMock.mockResolvedValue(
    new Response(JSON.stringify({ ok: true, id: 'abc-1', token: 'a'.repeat(43) }), {
      status: 201,
    }),
  );
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('Wizard — CTA con el número configurado', () => {
  it('el CTA es un link a WhatsApp y en celular va también en la barra fija', async () => {
    const u = userEvent.setup();
    render(<Wizard />);
    await u.click(await screen.findByRole('button', { name: /peluquería/i }));
    await u.type(await screen.findByLabelText(/nombre de tu negocio/i), 'Luna');
    await u.type(screen.getByLabelText(/tu whatsapp/i), '1123456789');
    await u.click(screen.getByRole('button', { name: /ver cómo me queda/i }));
    await screen.findByRole('heading', { name: /así te queda luna/i }, { timeout: 4000 });
    const barra = screen.getByTestId('barra-cta');
    const link = barra.querySelector('a');
    expect(link?.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5491100000000\?text=/);
    expect(decodeURIComponent(link?.getAttribute('href') ?? '')).toContain('Luna');
  });
});
