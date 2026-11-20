/**
 * Next llama a register() una vez al levantar el servidor. Valida la configuración de los contactos y,
 * si algo falta, lo deja bien visible en el log de Vercel. NO tumba el sitio: las páginas son estáticas
 * y tienen que verse igual. Solo la API de contactos responde error, y el formulario ofrece WhatsApp.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getEnv } = await import('./server/env');
    try {
      getEnv();
    } catch (e) {
      console.error(
        '[config] Los contactos no van a funcionar hasta corregir esto:',
        e instanceof Error ? e.message : e,
      );
    }
  }
}
