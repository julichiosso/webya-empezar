/**
 * Next llama a register() una vez al levantar el servidor y espera a que termine antes de
 * atender requests: si la configuración es inválida el proceso falla acá, no en el primer lead.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getEnv } = await import('./server/env');
    getEnv();
  }
}
