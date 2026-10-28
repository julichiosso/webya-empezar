---
name: webya-add-rubro
description: Procedimiento exacto para agregar un rubro nuevo a WebYa /empezar (un solo archivo de config, ícono SVG, tests y verificación). Usala cuando haya que sumar o editar un rubro como peluquería, gastronomía, etc.
---

# Agregar un rubro nuevo

**Regla de oro:** agregar un rubro = crear **un archivo** en `src/config/rubros/`. No se toca ningún componente, schema ni test genérico. Si algo te obliga a tocar un componente, es un bug de arquitectura: arreglalo en el componente, no hagas excepciones.

## Pasos

1. **Crear** `src/config/rubros/<id>.ts` (id en `snake_case` minúsculas, sin tildes, estable: se guarda en la base).

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
   - `modulosSugeridos` solo puede usar ids de `MODULOS` (`turnos`, `catalogo`, `carta_qr`, `formularios`, `pagos`, `clientes`, `notificaciones`). Si hace falta un módulo nuevo, se agrega **una vez** en `src/config/modulos.ts` con nombre y explicación no técnica.
   - `ejemploResultado`: máximo ~160 caracteres, describe qué se arma, sin prometer plazos ni precios.

2. **Ícono.** Elegí uno ya existente de `src/components/icons/rubros/` si sirve. Si no, creá un SVG nuevo con la grilla del sistema (24×24, trazo 1.5, `currentColor`, redondeado) siguiendo `webya-design-system`, y registralo en el mapa de íconos. El campo `icono` es la clave de ese mapa.

3. **Registrar:** agregá el `import` y la entrada en `src/config/rubros/index.ts`. (El orden del array define el orden en la grilla; “Otro” siempre va último.)

4. **Tests:** no escribas tests nuevos por rubro. Los tests genéricos de `src/config/rubros/rubros.test.ts` validan solos que cada rubro: tenga ids únicos, módulos válidos, al menos 2 objetivos, ícono existente y textos dentro de los límites. Corré:

   ```bash
   pnpm test src/config
   ```

5. **Verificar a mano:** `pnpm dev`, abrir `/empezar` en viewport 375px, elegir el rubro nuevo y comprobar: ícono alineado, objetivos sugeridos correctos (paso 2), resumen del paso 4 coherente y link de WhatsApp con el nombre del rubro.

6. **Cerrar:** `pnpm lint && pnpm typecheck && pnpm test` y revisar `webya-qa-checklist` (solo los ítems de contenido y a11y).

## Errores comunes

- Id con tildes o espacios → rompe la persistencia. Usá `snake_case` ASCII.
- Módulo inexistente → falla el typecheck (el tipo `ModuloId` es cerrado).
- Texto en español neutro (“Reserva”, “Haz”) → usá voseo (“Reservá”, “Hacé”).
- Prometer precios, plazos o resultados no definidos → poné `TODO:` en su lugar.
