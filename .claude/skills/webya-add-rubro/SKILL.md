---
name: webya-add-rubro
description: Procedimiento exacto para agregar un rubro nuevo a WebYa /empezar (un solo archivo de config, ícono SVG, tests y verificación). Usala cuando haya que sumar o editar un rubro como peluquería, gastronomía, etc.
---

# Agregar un rubro nuevo

**Regla de oro:** agregar un rubro = crear **un archivo** en `src/content/rubros/` (más su línea de registro en `index.ts`, paso 3). No se toca ningún componente, schema ni test genérico. Si algo te obliga a tocar un componente, es un bug de arquitectura: arreglalo en el componente, no hagas excepciones.

## Pasos

1. **Crear** `src/content/rubros/<id>.ts` (id en `snake_case` minúsculas, sin tildes, estable: se guarda en la base).

   ```ts
   import type { Rubro } from './types';

   export const rubro: Rubro = {
     id: 'veterinaria',
     nombre: 'Veterinaria',
     icono: 'paw', // ver paso 2
     descripcionCorta: 'Turnos, historial y tienda para tus pacientes.',
     objetivos: [
       { id: 'recibir_turnos', etiqueta: 'Recibir turnos online' },
       { id: 'vender_online', etiqueta: 'Vender productos online' },
       { id: 'que_me_contacten', etiqueta: 'Que me contacten fácil' },
     ],
     modulosSugeridos: ['turnos', 'catalogo', 'formularios', 'clientes', 'notificaciones'],
     ejemploResultado:
       'Una web con reserva de turnos, tienda de alimentos y un formulario de consultas.',
   };
   ```

   - `objetivos[].id` en `snake_case`; la etiqueta en voseo rioplatense, empezando con verbo cuando sea posible.
   - `modulosSugeridos` solo puede usar ids de `MODULOS` (`turnos`, `catalogo`, `carta_qr`, `formularios`, `pedidos`, `pagos`, `clientes`, `notificaciones`). Si hace falta un módulo nuevo, se agrega **una vez** en `src/content/modulos.ts` con nombre, beneficio y estado (y su ícono en `src/brand/ilustracion/iconos/paths.ts`). Los `modulosSugeridos` son los que llegan **pre-marcados** en el paso 2; la persona puede apagarlos o sumar otros, y lo que decida a mano nunca se pisa al cambiar de rubro. El id `catalogo` se muestra como "Tienda y catálogo".
   - `ejemploResultado`: máximo ~160 caracteres, describe qué se arma, sin prometer plazos ni precios.

   - **`plantilla`** (obligatoria salvo en `otro`): el sitio de ejemplo que se ve en "Así te queda" (`PreviewNegocio`). Va en el mismo archivo, debajo de `ejemploResultado`:

     ```ts
     plantilla: {
       deEjemplo: true, // todos los textos son de ejemplo: la vista previa lo dice en pantalla
       ilustracion: 'veterinaria', // id de la escena de IlustracionRubro (hoy, el id del rubro)
       portada: {
         tituloDeEjemplo: 'Tu veterinaria', // se reemplaza por el nombre que escribe la persona
         bajada: 'Consultas, vacunas y baño para tu mascota.',
         accion: { texto: 'Pedir turno', modulo: 'turnos' }, // botón en el acento si el módulo está
         accionSinModulo: 'Escribinos',
         detalle: { modulo: 'notificaciones', texto: 'Te recordamos la vacuna' }, // opcional
       },
       secciones: [
         { tipo: 'lista', titulo: 'Servicios', items: [{ nombre: 'Consulta', detalle: 'Con turno' }, …] },
         { tipo: 'agenda', titulo: 'Turnos', modulo: 'turnos', dias: ['Lun', 'Mar', 'Mié'], franjas: ['Mañana', 'Tarde'] },
         { tipo: 'lista', titulo: 'Tienda', modulo: 'catalogo', moduloItems: 'catalogo', items: […] },
         { tipo: 'horarios', titulo: 'Horarios', filas: [{ dias: 'Lunes a sábado', horario: 'Mañana y tarde' }] },
         { tipo: 'contacto', titulo: 'Contacto', whatsapp: 'Escribinos por WhatsApp', ubicacion: 'Cómo llegar' },
       ],
     },
     ```

     - Tipos de sección: `lista` (servicios, carta, productos; `moduloItems` le pone a cada ítem su botón para sumarlo), `agenda`, `formulario` (dos campos y un botón), `horarios` y `contacto`. Entre 3 y 5 secciones. Un solo componente las dibuja para todos los rubros: **no se toca ningún componente**.
     - `modulo` en una sección (o en un `detalle`) = la parte que ese módulo hace funcionar. Si la persona lo apaga, queda el hueco punteado "Acá encaja…" del mismo tamaño. Solo podés usar módulos de `modulosSugeridos` (así, por defecto, no queda ningún hueco).
     - Textos de ejemplo, en voseo, **sin cifras** (horarios en palabras: "Mañana y tarde"; días en letras: "Mar"), sin precios, sin promesas, sin "el mejor". Los límites están en `LIMITES_PLANTILLA` (`types.ts`).
     - La paleta no se elige acá: la vista previa usa las curadas de `src/content/paletas.ts`.

2. **Ícono.** Elegí uno ya existente de `RUBRO_ICONS` en `src/brand/ilustracion/iconos/paths.ts` si sirve (lo valida `icons.test.ts`). Si no, creá un SVG nuevo con la grilla del sistema (24×24, trazo 1.5, `currentColor`, redondeado) siguiendo `webya-design-system`, y registralo en el mapa de íconos. El campo `icono` es la clave de ese mapa.

3. **Registrar:** agregá el `import` y la entrada en `src/content/rubros/index.ts`. (El orden del array define el orden en la grilla; “Otro” siempre va último.)

4. **Tests:** no escribas tests nuevos por rubro. Los tests genéricos de `src/content/rubros/rubros.test.ts` validan solos que cada rubro: tenga ids únicos y en snake_case, módulos válidos, al menos 2 objetivos, textos dentro de los límites y sin promesas de precios o plazos. `plantillas.test.ts` valida la plantilla (marcada de ejemplo, cantidades, límites, solo módulos sugeridos, sin cifras ni promesas) y `src/components/patterns/PreviewNegocio.test.tsx` la dibuja en celular y escritorio. Si el rubro es nuevo, sumalo a la lista de `RUBROS_CON_VISTA_PREVIA` que espera `plantillas.test.ts`. Otro test genérico verifica que `icono` exista en el registro de íconos. Corré:

   ```bash
   pnpm exec vitest run src/content src/components/patterns tests/copy
   ```

5. **Verificar a mano:** `pnpm dev`, abrir `/empezar` en viewport 375px, elegir el rubro nuevo y comprobar: ícono alineado, la vista previa de "Así te queda" (celular a 320 y 375 px, navegador en la columna de escritorio) sin textos cortados, y link de WhatsApp con el nombre del rubro. La escena de `IlustracionRubro` la dibuja el agente `ilustracion` (mientras no esté, sale el ícono).

6. **Cerrar:** `pnpm lint && pnpm typecheck && pnpm test` y revisar `webya-qa-checklist` (solo los ítems de contenido y a11y).

## Errores comunes

- Id con tildes o espacios → rompe la persistencia. Usá `snake_case` ASCII.
- Módulo inexistente → falla el typecheck (el tipo `ModuloId` es cerrado).
- Texto en español neutro (“Reserva”, “Haz”) → usá voseo (“Reservá”, “Hacé”).
- Prometer precios, plazos o resultados no definidos → poné `TODO:` en su lugar.
