# Contrato entre agentes (etapa a del sprint "Plano")

Lo comparten `marca-sistema` (dueño de `src/brand/**`) y `ui-componentes` (dueño de
`src/components/ui/**` y `src/components/patterns/**`). No se cambia sin avisar al integrador.

## Tokens de sección (los define marca-sistema en las 3 capas y `pnpm tokens`)

Clases de Tailwind que usan los componentes:

| Fondo | Fondo | Texto | Texto secundario | Línea |
| --- | --- | --- | --- | --- |
| tinta (negro cálido) | `bg-seccion-tinta` | `text-seccion-tinta-fg` | `text-seccion-tinta-muted` | `border-seccion-tinta-linea` |
| crema (papel) | `bg-seccion-crema` | `text-seccion-crema-fg` | `text-seccion-crema-muted` | `border-seccion-crema-linea` |
| Brasa oscura | `bg-seccion-brasa` | `text-seccion-brasa-fg` | `text-seccion-brasa-muted` | `border-seccion-brasa-linea` |
| imagen (velo sobre foto) | `bg-velo-imagen` | `text-velo-imagen-fg` | `text-velo-imagen-muted` | — |

Todas AA (texto normal ≥ 4,5:1) en tema oscuro y claro; marca-sistema publica la tabla en BRAND.md.

## Componentes de brand que usan los patterns

- `src/brand/ilustracion/plano/FondoPlano.tsx`: `FondoPlano({ variante?: 'grilla' | 'cotas', className? })`.
- `src/brand/ilustracion/plano/IlustracionPlano.tsx`:
  `IlustracionPlano({ escena: 'hero' | 'como-funciona' | 'cierre', className? })`.

Hoy son provisorios; marca-sistema los termina sin cambiar las props.
