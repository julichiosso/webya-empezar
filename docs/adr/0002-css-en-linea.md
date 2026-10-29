# ADR 0002 — CSS en línea (`experimental.inlineCss`)

- **Fecha:** 2026-10-29
- **Estado:** aceptada (condición del usuario: se saca si el JS inicial supera 150 KB o si el LCP no mejora)

## Contexto

En el baseline (`docs/auditoria-baseline.md`), el LCP de `/empezar` con CPU ×4 + Slow 4G era de 1763 ms. De
ese tiempo, unos 574 ms eran la hoja de estilos bloqueante: el HTML llega en 10 ms, pero el navegador espera
el `.css` antes de pintar. Tailwind genera un CSS chico y la mayoría de las visitas son primeras visitas, que
vienen de Instagram.

## Decisión

`experimental.inlineCss: true` en `next.config.ts`. El CSS viaja dentro del HTML en un `<style>`.

## Medición (mismo método que el baseline)

Chrome DevTools, celular 390×844 @3x, CPU ×4, Slow 4G, caché vacía, build de producción con webpack
(ADR 0001):

| | LCP | CSS bloqueante | JS inicial `/empezar` | HTML gzip |
|---|---|---|---|---|
| Baseline (Turbopack, `f02db48`) | 1763 ms | 1 hoja, ~574 ms | 144,0 KB | — |
| Webpack sin CSS en línea | 1620 ms | 1 hoja, ~559 ms | 141,8 KB | — |
| **Webpack con CSS en línea** | **812 ms** | **ninguna** | **142,2 KB** | 37,8 KB |

- El elemento LCP es el mismo en los tres casos: el subtítulo del hero.
- En la primera visita, con la entrada del logo, el LCP fue de 992 ms. Esa medición no fue con caché vacía, así
  que no es comparable 1 a 1.
- CLS: 0,00 en todos los casos.

## Consecuencias

- Las visitas que vuelven bajan el CSS de nuevo con cada HTML: aceptable, porque el CSS es chico y la mayoría
  son primeras visitas.
- Se vigila en cada ola. Si el CSS crece mucho (por ejemplo, por estilos de páginas internas), se revisa.
- Es experimental en Next 16.4. Si se rompe en una actualización, se saca: la página funciona igual sin él.
