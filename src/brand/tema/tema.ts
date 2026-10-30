/**
 * Tema claro/oscuro de WebYa. Oscuro por defecto (es la cara de la marca); el claro es una elección
 * explícita que se recuerda en localStorage. No sigue al sistema a propósito (docs/plan-sprint.md §3).
 *
 * Los tokens se redefinen solos con `<html data-theme="light">` (src/brand/tokens/tokens.css).
 */

export const TEMAS = ['dark', 'light'] as const;
export type Tema = (typeof TEMAS)[number];

export const TEMA_POR_DEFECTO: Tema = 'dark';

/** Clave en localStorage (mismo prefijo que la entrada del logo, `webya:splash`). */
export const CLAVE_TEMA = 'webya:tema';

/**
 * Única ruta con tema elegible. La demo y /marca son siempre oscuras (la cara de la marca): el
 * script vive en el layout raíz, así que filtra por ruta.
 */
export const RUTA_CON_TEMA = '/empezar';

/**
 * Script inline, sin destello: aplica el tema guardado ANTES de pintar, solo en /empezar. Va lo más
 * arriba posible del documento (en <head>). Si localStorage no está disponible (modo privado,
 * cookies bloqueadas) no pasa nada: queda el oscuro.
 */
export const SCRIPT_TEMA = `try{if(location.pathname.indexOf('${RUTA_CON_TEMA}')===0){var t=localStorage.getItem('${CLAVE_TEMA}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}}catch(e){}`;

export function esTema(valor: unknown): valor is Tema {
  return valor === 'dark' || valor === 'light';
}

/** Tema que se ve ahora (lee el atributo de <html>; sin atributo es el oscuro). */
export function leerTema(): Tema {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/** Aplica un tema y lo recuerda (si se puede). */
export function aplicarTema(tema: Tema): void {
  document.documentElement.setAttribute('data-theme', tema);
  try {
    localStorage.setItem(CLAVE_TEMA, tema);
  } catch {
    // Sin almacenamiento: el tema vale para esta página y listo.
  }
}

/**
 * Avisa cuando cambia el tema: por un interruptor de esta página (atributo de <html>) o desde otra
 * pestaña (evento `storage`). Así dos interruptores (nav y footer) quedan siempre de acuerdo.
 */
export function suscribirTema(alCambiar: () => void): () => void {
  const html = document.documentElement;
  const observador = new MutationObserver(alCambiar);
  observador.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  const enOtraPestania = (e: StorageEvent) => {
    if (e.key === CLAVE_TEMA && esTema(e.newValue)) html.setAttribute('data-theme', e.newValue);
  };
  window.addEventListener('storage', enOtraPestania);
  return () => {
    observador.disconnect();
    window.removeEventListener('storage', enOtraPestania);
  };
}
