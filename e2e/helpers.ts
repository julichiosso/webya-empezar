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
  modulos: string[];
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

/**
 * El wizard se descarga al primer gesto o al entrar en pantalla (ver WizardLazy). En un celular
 * queda bajo el primer viewport: se baja hasta él, como haría una persona, y se espera a que cargue.
 */
export async function abrirWizard(page: Page) {
  // En la página (no con scrollIntoViewIfNeeded): el esqueleto se reemplaza por el wizard real mientras se baja.
  await page.evaluate(() => document.querySelector('#wizard')?.scrollIntoView());
  await expect(wizard(page).getByRole('heading').first()).toBeVisible();
}

/** Un usuario toca la etiqueta (el input nativo es sr-only): Playwright espera a que deje de moverse. */
export const tocar = (page: Page, texto: RegExp) =>
  wizard(page).locator('label', { hasText: texto }).click();

/** Paso 1 del flujo nuevo. */
export const TITULO_PASO_1 = '¿Qué necesitás?';
export const TITULO_RUBRO = '¿A qué se dedica tu negocio?';
/** Módulos: también es donde entra quien viene de la demo. */
export const TITULO_PASO_2 = '¿Qué querés activar?';
/** Formulario completo de un solo envío (solo quien viene de la demo). */
export const TITULO_PASO_3 = 'Contanos de tu negocio';
export const TITULO_WHATSAPP = '¿A qué WhatsApp te escribimos?';
export const TITULO_COMPLETAR = 'Contanos un poco más';
export const TITULO_FINAL = 'Tu negocio está listo para armarse';
export const TITULO_FINAL_PARCIAL = 'Ya tenemos tu WhatsApp';

/** Módulos que sugiere el rubro peluquería (ya vienen marcados en el paso de módulos). */
export const MODULOS_PELUQUERIA = ['turnos', 'catalogo', 'pagos', 'clientes', 'notificaciones'];

const siguiente = (page: Page) => wizard(page).getByRole('button', { name: 'Siguiente' }).click();

/**
 * Paso 1: marca una necesidad y sigue hasta el rubro. Por defecto "Cobrar": solo sugiere Pagos,
 * que peluquería y comercio ya sugieren, así no cambia qué módulos quedan marcados.
 */
export async function pasarNecesidad(page: Page, necesidad = /^Cobrar/) {
  await expect(wizard(page).getByRole('heading', { name: TITULO_PASO_1 })).toBeVisible();
  await tocar(page, necesidad);
  await siguiente(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_RUBRO })).toBeVisible();
}

export type Destino = 'necesidad' | 'rubro' | 'modulos' | 'whatsapp' | 'completar';

/**
 * Lleva el wizard hasta el paso pedido con "Cobrar", peluquería y los objetivos "Recibir turnos
 * online" y "Mostrar mis trabajos". Los módulos de peluquería ya vienen sugeridos y marcados.
 */
export async function irAlPaso(page: Page, destino: Destino, query = '') {
  await page.goto(`/empezar${query}`);
  await abrirWizard(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_PASO_1 })).toBeVisible();
  if (destino === 'necesidad') return;
  await pasarNecesidad(page);
  if (destino === 'rubro') return;
  await tocar(page, /peluquería/i);
  await siguiente(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_PASO_2 })).toBeVisible();
  if (destino === 'modulos') return;
  await tocar(page, /recibir turnos online/i);
  await tocar(page, /mostrar mis trabajos/i);
  await siguiente(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_WHATSAPP })).toBeVisible();
  if (destino === 'whatsapp') return;
  await guardarWhatsapp(page);
}

/** Paso 4: deja el WhatsApp (se guarda el lead parcial) y llega a "completar". */
export async function guardarWhatsapp(page: Page) {
  await wizard(page).getByLabel('Tu WhatsApp').fill('1123456789');
  await wizard(page).getByRole('button', { name: 'Guardar y seguir' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_COMPLETAR })).toBeVisible();
}

/** Paso 5: completa los datos (solo el nombre del negocio es obligatorio) y envía. */
export async function completarNegocio(page: Page, negocio: string) {
  const w = wizard(page);
  await w.getByLabel('Nombre de tu negocio').fill(negocio);
  await w.getByLabel(/Tu nombre/).fill('Ana Pérez');
  await w.getByLabel(/Tu mail/).fill('ana@luna.com');
  await w.getByLabel(/algo más/i).fill('Quiero turnos online');
  await w.getByRole('button', { name: 'Enviar mis datos' }).click();
}
