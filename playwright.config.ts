import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

// Configuración base. Los proyectos de viewports y el servidor E2E se completan en la etapa de tests.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'mobile', use: { ...devices['Pixel 7'] } }],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}/empezar`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { LEAD_REPOSITORY: 'file' },
  },
});
