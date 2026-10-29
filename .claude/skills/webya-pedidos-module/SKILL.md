---
name: webya-pedidos-module
description: Módulo Pedidos de WebYa — modelo de datos (carta, pedido, ítems, eventos), máquina de estados, reglas de dinero en centavos, validación contra la carta y repositorio multi-tenant. Usala antes de tocar src/domain/pedidos, la demo de Gastronomía, la migración de pedidos o cualquier cálculo de precios, propinas o totales.
---

# WebYa — Módulo Pedidos

Código en `src/domain/pedidos/` (sin React ni navegador). Lo usan **igual** la demo (`/demo/gastronomia`, en el cliente) y el backend real (etapa g en adelante). Si cambiás algo acá, cambia en los dos lados: esa es la idea.

| Archivo         | Qué tiene                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `types.ts`      | Carta (`Menu`, `Categoria`, `Producto`, `GrupoModificador`), `Pedido`, `ItemPedido`, `EventoPedido`, estados, modalidades y medios de pago |
| `dinero.ts`     | `Centavos`, `pesos()`, `sumar`, `multiplicar`, `porcentaje`, `formatearPesos`                                                              |
| `totales.ts`    | `PROPINAS`, `subtotalItem`, `calcularTotales`                                                                                              |
| `estados.ts`    | Máquina de estados, `ETIQUETA_ESTADO`, `PASOS_SEGUIMIENTO`                                                                                 |
| `schemas.ts`    | `entradaPedidoSchema` (Zod), `resolverLinea`, `armarPedido`                                                                                |
| `repository.ts` | `PedidoRepository` + implementación en memoria                                                                                             |

## 1. Dinero (reglas duras)

1. **Todo monto es `Centavos`: entero seguro.** Nunca floats, nunca strings con coma. `$ 23.900` es `2390000`.
2. Los precios de config se escriben con `pesos(23_900)` (legible) y se guardan en centavos.
3. Operar SOLO con `sumar`, `multiplicar` y `porcentaje`: tiran error si se cuela un no entero.
4. **Una sola regla de redondeo:** `porcentaje()` redondea al centavo, mitad hacia arriba, una vez. Propinas y futuros recargos pasan por ahí.
5. La propina se calcula sobre el **subtotal** (no sobre el envío). El envío se cobra **solo en delivery**.
6. Formatear recién al mostrar: `formatearPesos()` (`Intl.NumberFormat('es-AR')`, sin decimales si son pesos redondos).
7. En la base, columnas `bigint` en centavos (ver migración de pedidos).

## 2. Máquina de estados

```
recibido ──▶ en_preparacion ──▶ listo ──▶ entregado
    │               │
    └──────┬────────┘
           ▼
       cancelado            (entregado y cancelado son finales)
```

- Las transiciones válidas están **todas** en `TRANSICIONES`. Cualquier otra tira `TransicionInvalidaError`.
- `transicionar()` devuelve un pedido nuevo (no muta) y agrega el evento con fecha. `avanzar()` sigue el camino feliz (lo usa el botón del panel).
- Etiquetas por quién mira (`ETIQUETA_ESTADO`): cliente "Recibido / En preparación / Listo / Entregado"; dueño "Nuevo / Preparando / Listo / Entregado", con el texto del botón de acción.
- `estados.test.ts` recorre **todos** los pares de estados: si agregás un estado o una transición, actualizá la lista `VALIDAS` del test a propósito.

## 3. Validación: el cliente nunca pone precios

- El cliente manda `EntradaPedido`: ids de platos y opciones, cantidades, nota, modalidad, nombre, medio de pago y propina. **Sin montos.**
- `armarPedido(menu, entrada, contexto)` valida con Zod y resuelve cada línea contra la carta (`resolverLinea`): el plato existe, cada opción pertenece a ese plato, grupos `unico` con una sola opción, grupos obligatorios con una. Nombres y precios quedan **congelados** en el pedido.
- Mesa exige número de mesa; delivery exige dirección. Propinas permitidas: `PROPINAS` (0, 10, 15).
- El carrito de la demo usa el mismo `resolverLinea`: lo que ve el cliente es lo que cobraría el servidor.

## 4. Multi-tenant

- Todo pedido tiene `tenantId` y `localId`. Todas las operaciones del repositorio reciben el tenant: un pedido de otro tenant es, para vos, inexistente (`obtener` → `null`, `cambiarEstado` → `PedidoNoEncontradoError`).
- `numero` es **incremental por tenant** (1, 2, 3…), independiente entre tenants. En la base, contador por tenant actualizado de forma atómica.
- La demo usa `TENANT_DEMO = 'demo'`.
- Escritura real: **solo desde el servidor**, después de `armarPedido`. RLS activada, sin acceso para `anon`/`authenticated`.

## 5. Agregar un estado, modalidad o medio de pago

1. Sumarlo a la constante en `types.ts` (`ESTADOS_PEDIDO`, `MODALIDADES`, `MEDIOS_PAGO`).
2. Estados: transiciones en `TRANSICIONES`, etiquetas en `ETIQUETA_ESTADO`, lista `VALIDAS` del test.
3. Migración NUEVA que actualice los `check` de la base (nunca editar una migración aplicada).
4. `pnpm test`: los tests de estados, schemas, repositorio y config de la demo cubren el resto.

## 6. Qué NO hacer

- Calcular dinero con `*`, `/` o `+` sueltos, o con `toFixed`.
- Confiar en un precio, total o número de pedido que venga del navegador.
- Cambiar `estado` de un pedido a mano (`{ ...p, estado }`): siempre `transicionar`.
- Datos de ejemplo dentro de componentes: van en `src/config/demos/<rubro>/`.
