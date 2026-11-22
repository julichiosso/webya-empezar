# Demo Studio — especificación del motor

Cada demo es una **configuración + presets + módulos** sobre un motor común. "Armalo vos. Mirá cómo queda.
Lo hacemos realidad."

## Piezas

| Pieza | Dónde | Qué hace |
|---|---|---|
| Historial | `domain/studio/historial.ts` | Deshacer, rehacer, empezar de nuevo (que también se deshace) y cargar, sobre cualquier reducer puro. Tope de 60 pasos. |
| Contrato con la barra | `domain/studio/controles.ts` | `ControlesEstudio`: historial, link para compartir y resumen de lo armado. |
| Datos con semilla | `domain/studio/semilla.ts` | Generador reproducible, nombres argentinos ficticios combinados, pesos `es-AR`. |
| Compartir | `lib/compartir.ts` | Configuración → `#demo=…` comprimido con `CompressionStream` (deflate) y base64url; sin librerías; nunca imágenes. |
| Fotos locales | `lib/imagen-local.ts` | Achica a 1280 px (logos a 800) con canvas, WebP; nunca salen del dispositivo; `liberarImagen` revoca la URL. |
| Contraste | `lib/color.ts` | `tintaSobre` (texto blanco o negro sobre el color elegido) y `ajustarContraste` (oscurece el color hasta 4,5:1). |
| Estado del estudio | `features/demo/studio/useEstudio.ts` | Historial + carga (primero el link, después lo guardado) + guardado automático en `localStorage` (con `try/catch`) + link. |
| Marca | `features/demo/studio/marca.ts` | Variables CSS `--marca`, `--marca-tinta`, `--marca-texto`, `--marca-fuente`. Copy y paletas en `content/demos/studio.ts`. |
| Campos | `features/demo/studio/Campos.tsx` | Nombre, color (con aviso si se ajustó), estilo de letra y subir foto: etiquetas visibles, 17 px o más, toques de 56 px. |
| Asistente | `features/demo/studio/Asistente.tsx` | Una pregunta por pantalla, "Paso N de M", barra de avance, Atrás/Siguiente fijos abajo, "Ver la demo así" para saltar. |
| Simulador | `features/demo/studio/useSimulador.ts` + `ControlSimulador.tsx` | "Simular un día de trabajo": eventos con ritmo, pausa, seguir, terminar y "Más rápido". |
| Barra | `components/marketing/editorial/BarraDemo.tsx` | Volver, nombre y un solo Menú; en la compu Deshacer/Rehacer, Texto grande y "Quiero este sistema"; en el celular, "Quiero este sistema" fijo abajo. |
| Hoja | `components/marketing/editorial/HojaDemo.tsx` | `<dialog>` nativo: abajo en el celular, a la derecha en la compu. Menú y "Enviarnos lo que armé". |

## "Enviarnos lo que armé"

Resumen de lo armado + **WhatsApp con el mensaje y el link ya escritos** (botón de 56 px), copiar el mensaje,
mail y "Prefiero armarlo paso a paso" (configurador). El link abre exactamente esa configuración.

## Reglas de uso (personas mayores, celular primero)

- Letra de 16 px como mínimo en la interfaz de Webya (17–18 en el celular); "Texto grande" sube todo un escalón
  (`html[data-texto-grande]`) y se recuerda.
- Toques de 48 px como mínimo y 56 px en las acciones principales. Nada que dependa de hover, arrastre o gestos.
- Una tarea por pantalla en el celular; la acción principal siempre abajo.
- Deshacer siempre disponible; "Empezar de nuevo" también se deshace.

## Medición

`demo_asistente` (paso y acción), `demo_simulacion`, `demo_accion` (deshacer, rehacer, reiniciar, compartir,
texto grande) y `demo_enviada` (canal). Nunca lo que la persona escribe.
