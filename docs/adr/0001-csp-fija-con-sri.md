# ADR 0001 — CSP fija con integridad (SRI), sin nonce

- **Fecha:** 2026-10-29
- **Estado:** aceptada

## Contexto

No había Content Security Policy. Next ofrece dos caminos:

1. **Nonce por request** (`proxy`): es la CSP más estricta, pero obliga a renderizar cada página en el momento.
   `/empezar` y `/demo/gastronomia` dejarían de ser HTML estático: más TTFB y más costo en Vercel.
2. **CSP fija + Subresource Integrity (SRI)**: las páginas siguen estáticas y cada chunk JS lleva un hash
   (`integrity`) que el navegador verifica antes de ejecutarlo.

## Decisión

Usamos la **CSP fija con SRI**, definida en `next.config.ts`:

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self' blob:;
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

- En desarrollo se suman `'unsafe-eval'` (HMR) y `ws:`; en producción no aparecen.
- `'unsafe-inline'` en `script-src` es necesario por dos razones:
  - Next inyecta en el HTML los datos de hidratación como scripts en línea, que SRI no cubre.
  - Hay dos scripts propios mínimos: la entrada del logo y el tema claro u oscuro.
- Lo que la CSP sí garantiza: nada se carga ni se conecta a otro origen, no hay `<object>`, la página no se puede
  embeber (clickjacking), y `<base>` y los formularios no pueden apuntar afuera.

### SRI exige compilar con webpack

En Next 16.4, `experimental.sri` es un plugin de webpack. Con Turbopack (el default de `next build`) se ignora en
silencio: los chunks salían sin `integrity`.

- Por eso `pnpm build` es `next build --webpack`. `pnpm dev` sigue con Turbopack, que es más rápido para
  desarrollar.
- Medido el 2026-10-29: el JS inicial de `/empezar` bajó de 144,0 KB (Turbopack) a **141,8 KB** gzip (webpack),
  y el de `/demo/gastronomia` de 192,2 KB a 183,6 KB.
- **Primer deploy después del cambio:** hay que hacerlo **sin caché de build**. En Vercel: "Redeploy", destildar
  "Use existing Build Cache". Si `.next/` tiene restos de un build de Turbopack, webpack falla en `WasmHash.update`.
  Pasó en local y se resolvió borrando `.next`; los builds siguientes con caché de webpack andan bien.
- **El SRI es parcial (medido):** Next pone `integrity` al runtime de webpack, polyfills, `main-app` y los
  chunks compartidos del framework, pero **no** a los chunks propios de cada página (`app/**/page-*.js` y sus
  divisiones), aunque sus hashes están en `subresource-integrity-manifest.json`. En `/empezar`, 5 de 7 scripts
  llevan `integrity`; en `/demo/gastronomia`, 5 de 9.
  - El riesgo que queda es bajo: la CSP solo permite scripts del mismo origen, y HTML y chunks salen del mismo
    deploy de Vercel.
  - Se revisa cuando Next complete el soporte.
- Cuando Turbopack soporte SRI se puede volver al default. `e2e/seguridad.spec.ts` falla si algún chunk se
  sirve sin `integrity`.

## Consecuencias

- Toda dependencia externa nueva (analítica, mapas, fuentes de un CDN) obliga a revisar la CSP y este ADR.
- `e2e/seguridad.spec.ts` verifica:
  - los headers de seguridad;
  - que todo script externo tenga `integrity`;
  - que la CSP no bloquee nada al usar `/empezar` y la demo.
- Si alguna vez hace falta quitar `'unsafe-inline'`, hay que pasar a nonces y aceptar el render dinámico.
