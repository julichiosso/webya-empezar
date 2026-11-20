import { registerSink, track } from './analytics';

const CLAVE_SESION = 'webya:sesion';

/** Azar por pestaña: junta los pasos de una visita sin cookies y sin identificar a nadie. */
function sesionDeLaPestana(): string {
  try {
    const guardada = window.sessionStorage.getItem(CLAVE_SESION);
    if (guardada) return guardada;
    const nueva = crypto.randomUUID().replaceAll('-', '').slice(0, 24);
    window.sessionStorage.setItem(CLAVE_SESION, nueva);
    return nueva;
  } catch {
    return crypto.randomUUID().replaceAll('-', '').slice(0, 24);
  }
}

/**
 * Conecta la analítica con nuestra API de eventos (POST /api/eventos) y registra la página vista. Se
 * llama una vez, al cargar. Con `sendBeacon` el evento llega aunque la persona esté cerrando la
 * pestaña. Solo manda la ruta: el borrador de /ver viaja en el hash y nunca sale del navegador.
 */
export function iniciarMedicion(): () => void {
  const sesion = sesionDeLaPestana();
  const quitar = registerSink((nombre, props) => {
    const cuerpo = new Blob(
      [JSON.stringify({ nombre, sesion, ruta: window.location.pathname, props })],
      { type: 'application/json' },
    );
    navigator.sendBeacon?.('/api/eventos', cuerpo);
  });
  const q = new URLSearchParams(window.location.search);
  const utm = (['utm_source', 'utm_medium', 'utm_campaign'] as const).flatMap((k) => {
    const v = q.get(k)?.slice(0, 80);
    return v ? [[k, v]] : [];
  });
  track('pagina_vista', { ruta: window.location.pathname, ...Object.fromEntries(utm) });

  // Cualquier link a WhatsApp: se registra dónde estaba (la sección), nunca el mensaje.
  const alTocar = (e: MouseEvent) => {
    const a = e.target instanceof Element ? e.target.closest('a[href*="wa.me"]') : null;
    if (!a) return;
    const zona = a.closest('section[aria-labelledby], nav[aria-label], footer, aside');
    const donde =
      zona?.getAttribute('aria-labelledby') ??
      zona?.getAttribute('aria-label') ??
      zona?.tagName.toLowerCase() ??
      'pagina';
    track('whatsapp_click', { donde: donde.slice(0, 40) });
  };
  document.addEventListener('click', alTocar, { capture: true });
  return () => {
    quitar();
    document.removeEventListener('click', alTocar, { capture: true });
  };
}
