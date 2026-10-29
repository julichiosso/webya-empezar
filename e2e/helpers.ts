import { expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { E2E_LEADS_FILE } from '../playwright.config';

export interface LeadGuardado {
  id: string;
  nombre: string;
  email: string | null;
  whatsapp: string;
  nombre_negocio: string;
  rubro: string;
  rubro_otro: string | null;
  objetivos: string[];
  mensaje: string | null;
  origen: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  estado: string;
  ip_hash: string;
  user_agent: string | null;
}

export async function leerLeads(): Promise<LeadGuardado[]> {
  try {
    return JSON.parse(
      await readFile(resolve(process.cwd(), E2E_LEADS_FILE), 'utf8'),
    ) as LeadGuardado[];
  } catch {
    return [];
  }
}

/** Nombre de negocio único por test, para encontrar "su" lead aunque corran en paralelo. */
export function negocioUnico(project: string) {
  return `Peluquería ${project} ${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export const wizard = (page: Page) => page.locator('#wizard');

export async function irAlPaso(page: Page, paso: 1 | 2 | 3, query = '') {
  await page.goto(`/empezar${query}`);
  await expect(wizard(page).getByRole('heading', { name: '¿Qué rubro sos?' })).toBeVisible();
  if (paso === 1) return;
  await wizard(page)
    .locator('label', { hasText: /peluquería/i })
    .click();
  await wizard(page).getByRole('button', { name: 'Continuar' }).click();
  await expect(wizard(page).getByRole('heading', { name: '¿Qué querés lograr?' })).toBeVisible();
  if (paso === 2) return;
  await wizard(page)
    .locator('label', { hasText: /recibir turnos/i })
    .click();
  await wizard(page)
    .locator('label', { hasText: /mostrar mis trabajos/i })
    .click();
  await wizard(page).getByRole('button', { name: 'Continuar' }).click();
  await expect(wizard(page).getByRole('heading', { name: 'Contanos de tu negocio' })).toBeVisible();
}

export async function completarDatos(page: Page, negocio: string) {
  const w = wizard(page);
  await w.getByLabel('Nombre de tu negocio').fill(negocio);
  await w.getByLabel('Tu nombre').fill('Ana Pérez');
  await w.getByLabel('Tu WhatsApp').fill('1123456789');
  await w.getByLabel(/Email/).fill('ana@luna.com');
  await w.getByLabel(/algo más/i).fill('Quiero turnos online');
}
