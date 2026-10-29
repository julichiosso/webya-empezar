import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { E2E_LEADS_FILE } from '../playwright.config';

/** Arranca cada corrida con el archivo de leads vacío. */
export default async function globalSetup() {
  await rm(resolve(process.cwd(), E2E_LEADS_FILE), { force: true });
}
