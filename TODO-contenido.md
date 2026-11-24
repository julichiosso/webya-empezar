# Contenido pendiente

Datos reales que faltan. Mientras falten, **no se publican**: en el código el valor queda en `null` con un
comentario `[COMPLETAR: …]` al lado, y el componente no muestra esa parte.

Para completar uno: poné el valor en el archivo indicado, borrá el comentario `[COMPLETAR: …]` y borrá su fila
de esta tabla. Si la afirmación es nueva, sumala también a `TRUST_CLAIMS.md`.

Dos chequeos lo cuidan:

- `tests/copy/pendientes.test.ts`: cada `[COMPLETAR: …]` del código está en esta tabla y viceversa, y ningún
  texto de `src/content` lleva un `[COMPLETAR` adentro (se vería en el sitio).
- `scripts/chequear-pendientes.mjs`, al final de `pnpm build`: si algún HTML o JS publicado tiene un
  `[COMPLETAR`, el build falla.

| Pendiente | Archivo | Qué falta | Dónde se vería |
| --------- | ------- | --------- | -------------- |
