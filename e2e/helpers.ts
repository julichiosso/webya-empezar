import { expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { E2E_LEADS_FILE } from '../playwright.config';

export interface LeadGuardado {
  id: string;
  nombre: string | null;
  email: string | null;
  whatsapp: string;
  nombre_negocio: string;
  ciudad?: string | null;
  necesidad_libre?: string | null;
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

/** Títulos de las pantallas del flujo (content/empezar/wizard-flujo.ts). */
export const TITULO_RUBRO = '¿Qué negocio tenés?';
export const TITULO_A_MEDIDA = 'Contanos qué necesitás';
export const TITULO_NEGOCIO = 'Contanos de tu negocio';
export const TITULO_RESULTADO = /^Así te queda/;
export const TITULO_RESULTADO_A_MEDIDA = 'Lo armamos a medida';
export const TITULO_COMPLETAR = 'Contanos un poco más';
export const TITULO_GRACIAS = 'Listo, ya nos llegaron tus datos';

/** Módulos que sugiere el rubro peluquería (los que van en el lead y en la vista previa). */
export const MODULOS_PELUQUERIA = ['turnos', 'catalogo', 'pagos', 'clientes', 'notificaciones'];

/**
 * La pantalla 1 llega en el HTML del servidor (arriba del pliegue): se espera a que se vea. El
 * wizard se descarga al primer gesto; tocar una tarjeta antes también funciona (ver WizardLazy).
 */
export async function abrirWizard(page: Page) {
  await expect(wizard(page).getByRole('heading').first()).toBeVisible();
}

/** Pantalla 1: un toque en el rubro avanza solo. */
export async function elegirRubro(page: Page, id = 'peluqueria_estetica') {
  await wizard(page).locator(`[data-rubro="${id}"]`).click();
}

/** Pantalla 2: completa el formulario mínimo y lo envía (guarda el lead parcial). */
export async function enviarNegocio(
  page: Page,
  { negocio = 'Luna Peluquería', ciudad = '', boton = /ver cómo me queda/i } = {},
) {
  const w = wizard(page);
  await expect(w.getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  await w.getByLabel('Nombre de tu negocio').fill(negocio);
  await w.getByLabel('Tu WhatsApp').fill('1123456789');
  if (ciudad) await w.getByLabel(/Ciudad/).fill(ciudad);
  await w.getByRole('button', { name: boton }).click();
}

export type Destino = 'rubro' | 'negocio' | 'resultado' | 'completar';

/** Lleva el flujo hasta la pantalla pedida con peluquería y el negocio dado. */
export async function irAlPaso(page: Page, destino: Destino, query = '', negocio?: string) {
  await page.goto(`/empezar${query}`);
  await abrirWizard(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_RUBRO })).toBeVisible();
  if (destino === 'rubro') return;
  await elegirRubro(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  if (destino === 'negocio') return;
  await enviarNegocio(page, negocio ? { negocio } : {});
  await expect(wizard(page).getByRole('heading', { name: TITULO_RESULTADO })).toBeVisible();
  if (destino === 'resultado') return;
  await wizard(page).getByRole('button', { name: /dejar más datos/i }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_COMPLETAR })).toBeVisible();
}

/** Completar: suma los datos opcionales y envía (el nombre del negocio ya viene cargado). */
export async function completarDatos(page: Page) {
  const w = wizard(page);
  await w.getByLabel(/Tu nombre/).fill('Ana Pérez');
  await w.getByLabel(/Tu mail/).fill('ana@luna.com');
  await w.getByLabel(/algo más/i).fill('Quiero turnos online');
  await w.getByRole('button', { name: 'Enviar mis datos' }).click();
}
