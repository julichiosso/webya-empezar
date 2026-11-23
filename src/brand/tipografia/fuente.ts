/**
 * Precarga explícita del archivo de Inter (variable con tamaño óptico, subset latin). Con `next build --webpack` (ADR 0001, por SRI)
 * Next 16 deja vacío el manifiesto de fuentes y no inyecta el preload: la fuente se descubría tarde,
 * llegaba después del primer pintado y el cambio de fuente movía el hero (CLS 0,03 con Slow 4G).
 * El nombre lo fija el contenido del archivo: si Google lo cambia, e2e/rendimiento.spec.ts falla.
 */
export const FUENTE_PRECARGADA = '/_next/static/media/32b04a225cda6443-s.p.woff2';
