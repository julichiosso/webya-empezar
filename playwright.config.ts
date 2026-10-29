import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

/** Archivo de leads propio de E2E: no mezcla datos de desarrollo y se puede inspeccionar. */
export const E2E_LEADS_FILE = '.data/e2e-leads.json';

/**
 * Viewports de referencia. Se emulan con Chromium (tamaño, DPR, touch y user agent del dispositivo)
 * para no depender de instalar WebKit; el motor real de iOS se prueba a mano (ver webya-qa-checklist).
 */
const dispositivos = {
  'iphone-se': devices['iPhone SE'],
  'iphone-15': devices['iPhone 15'],
  'pixel-7': devices['Pixel 7'],
  tablet: devices['iPad Mini'],
  desktop: devices['Desktop Chrome'],
};

/**
 * Escritorios grandes: solo corren lo que depende del layout (capturas, layout, accesibilidad y
 * consola). El resto de los specs (flujos, teclado, SEO, rendimiento) ya cubre el viewport 'desktop'.
 */
const escritoriosGrandes = {
  'desktop-1440': { width: 1440, height: 900 },
  'desktop-1920': { width: 1920, height: 1080 },
};

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled', caret: 'hide' } },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    ...Object.entries(dispositivos).map(([name, device]) => ({
      name,
      use: { ...device, browserName: 'chromium' as const },
    })),
    ...Object.entries(escritoriosGrandes).map(([name, viewport]) => ({
      name,
      testMatch: /(visual|layout|a11y|consola).spec.ts/,
      use: { ...devices['Desktop Chrome'], viewport, browserName: 'chromium' as const },
    })),
  ],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}/empezar`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      LEAD_REPOSITORY: 'file',
      // En producción es obligatoria (env.ts falla al arrancar sin ella). Valor solo para E2E.
      IP_HASH_SALT: 'sal-solo-para-e2e-no-es-un-secreto',
      LEADS_FILE_PATH: E2E_LEADS_FILE,
      // Muchos tests envían desde la misma IP: el límite real se prueba en los tests de la API.
      RATE_LIMIT_MAX: '100',
      RATE_LIMIT_BURST_PER_MINUTE: '5000',
      // Las NEXT_PUBLIC_* se inlinean en el build: se fijan acá para que E2E y capturas no dependan
      // del .env local de quien corre los tests. Sin número, el botón de WhatsApp quedaría deshabilitado.
      NEXT_PUBLIC_WHATSAPP_NUMBER: '5491100000000',
      NEXT_PUBLIC_SITE_URL: 'https://webya.ar',
      NEXT_PUBLIC_CONTACT_EMAIL: 'contacto@example.com',
      NEXT_PUBLIC_INSTAGRAM_URL: 'https://instagram.com/webya.dev',
    },
  },
});
