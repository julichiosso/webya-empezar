# Auditoría de las demos (Demo Studio, fase 1) — 2026-11-22

Base: rama `demo-studio` desde `main` (`bf15a62`, rediseño estilo Apple). Capturas con el build de producción
(`next build` + `next start`, el mismo que corre la suite E2E) en 1440×900 y 390×844.

## Lo que hay

| Demo | Código | Qué hace hoy | Personalizable |
|---|---|---|---|
| `/demos/pedidos` | `features/demo/pedidos` (~1.700 líneas) + `domain/pedidos`, `domain/retiro` con tests | Cliente: carta, carrito, franja de retiro, confirmación. Dueño: franjas con tope, pausa, comanda | Nada: "TU PIZZERÍA" fija |
| `/demos/turnos` | `features/demo/turnos` (~2.600) + `domain/reservas` con tests (algoritmo del sistema real) | Reserva con seña simulada (Mercado Pago), apartado, calendario .ics; panel con "En la silla", agenda, cobro, "+10 min" | Nada |
| `/demos/web` | `features/demo/web` (~400) | Misma plantilla con 5 rubros, celular/compu | Solo rubro. La "T" gigante es el logo de relleno |
| `/demos/tienda` | `features/demo/tienda` (~900) | Nombre, color, logo, productos con foto local, precio | **Sí: es el embrión del estudio** (reducer puro con tests) |
| `/demos/protectora` | `features/demo/protectora` (~1.400) | Vista pública / administración, adopción, socios, compartir ficha como imagen | Nada. Una sola silueta de perro y una de gato |
| Campo | — | Solo la página `/campo` | **No hay demo** |
| Cafeterías | — | — | **No hay preset** |

Común: `EscenarioDemo` (guía + teléfono + panel), `BarraDemo` (barra de arriba), `EnUso` (caso real).

## Problemas confirmados (por gravedad)

1. **"Qué más hace" se abre solo** la primera vez (`BarraDemo`, `sessionStorage`). En el celular tapa toda la
   demo: lo primero que ve la persona es un texto, no el sistema. → Se abre solo a pedido.
2. **Barra superior con cinco acciones chicas** (Qué más hace, reiniciar, Escribinos, Demos, Quiero este
   sistema). En el celular son íconos sin texto. → Encabezado móvil: Volver, nombre y un solo menú; abajo, un
   botón fijo "Quiero este sistema".
3. **Letra chica**: 108 usos de `text-[0.6x–0.7x rem]`/`text-xs` en las demos (pasos de la guía ~12–13 px,
   etiquetas 11 px). Ilegible para personas mayores. → Mínimo 16 px en la interfaz de Webya; "Texto grande".
4. **No se puede personalizar** (salvo tienda): no hay forma de que la demo sea "su" sistema.
5. **Sin guardar, compartir ni enviarnos lo que armó.** "Quiero este sistema" lleva al configurador genérico,
   sin lo que la persona hizo en la demo.
6. **Placeholders**: la "T" en la web; la misma silueta repetida en protectora (dos especies, un dibujo cada una).
7. **Protectora en escritorio**: una columna angosta en el medio de la pantalla.
8. **Panel de pedidos** blanco sobre negro y cortado abajo (scroll interno que no se anuncia).

## Lo reportado que NO es un error del código

- **Imágenes rotas en "Conocé cómo ya lo usa…"**: con el build de producción cargan bien. Se veían rotas en
  el servidor local porque el optimizador de imágenes de `next dev` quedó sin módulos tras reinstalar
  dependencias (`Cannot find module './image-optimizer'`, 500). Igual se suma un respaldo: si la imagen
  falla, el bloque se muestra sin ella (nunca el ícono roto).

## Decisiones de fase 1

- **Reutilizar, no tirar**: la lógica de dominio (`domain/pedidos`, `domain/reservas`, `domain/retiro`) y
  los estados con tests quedan. El motor nuevo envuelve los estados con historial, marca, guardado y
  compartir.
- **Dependencias**: ver DECISIONS.md. Se evita sumar librerías cuando la plataforma alcanza (contraste con la
  fórmula WCAG, compresión con `CompressionStream`, hoja inferior con `<dialog>`, estado con `useReducer`).
- **Herramientas**: Playwright (ya instalado en el repo) para capturas y E2E; MCP de Playwright y Chrome
  DevTools ya conectados en este entorno. No se instala nada con acceso de escritura a producción ni a datos
  de clientes. No hay acceso a los repos de los clientes: las funciones "del sistema real" salen de lo ya
  documentado en `src/content/demos/hub.ts` y DEMO_SPEC_TURNOS.

## Pendiente de Julián

- Funciones reales del rubro **Campo** (no se inventan: la demo las marca "a medida").
- Qué módulos están **construidos** y cuáles son **a medida** en cada sistema (se parte de `hub.ts`).
- Capturas reales por proyecto y foto de Julián.
