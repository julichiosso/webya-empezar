# Skills de terceros (fijadas por commit)

Auditadas el 2026-10-29 (ver docs/auditoria-skills.md). Solo Markdown/JSON, nada ejecutable. Las `webya-*`
tienen precedencia siempre: estas aportan método, la marca y la voz las fija `webya-brand`.

| Skill | Origen | Commit | Licencia |
|---|---|---|---|
| frontend-design | github.com/anthropics/skills (skills/frontend-design) | 41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f | Apache 2.0 |
| vercel-react-best-practices | github.com/vercel-labs/agent-skills (skills/react-best-practices) | dc8367e6f91c022d83361f03c3313fa05e848ee5 | MIT |
| copywriting | github.com/coreyhaines31/marketingskills (skills/copywriting) | 15b38b5388dfdd17f4ab424e986ccd32c24d5b22 | MIT |
| cro | github.com/coreyhaines31/marketingskills (skills/cro) | e88ace76a791b7da6de58f7ee7dbcb38b6bbc136 | MIT |

Reglas de uso:
- `frontend-design` y `vercel-react-best-practices`: solo los agentes `ui-componentes` y `paginas`.
- `vercel-react-best-practices` sugiere librerías (swr, lru-cache…): no se suma ninguna sin aprobación.
- `copywriting` y `cro` recomiendan testimonios, sellos y métricas: en WebYa no existen; manda `webya-brand`.
- Para actualizar: bajar de nuevo desde el commit nuevo, releer todo y actualizar esta tabla.

## Sumadas el 2026-11-06

Revisadas: solo Markdown, sin scripts; búsqueda de comandos, pedidos de secretos e instrucciones ocultas sin
hallazgos, y cabeceras leídas (no línea por línea). Sin la carpeta `evals`.

| Skill | Origen | Commit | Licencia |
|---|---|---|---|
| seo-audit, schema, signup, analytics, pricing, onboarding | github.com/coreyhaines31/marketingskills | 96798cf38736ecdba015a1d2b0521b0c8f8f41dd | MIT |
| web-design-guidelines | github.com/vercel-labs/agent-skills + reglas de vercel-labs/web-interface-guidelines (fijadas en references/) | 1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62 + 434b7f91364665f2f733b310ec54809bf8f37937 | MIT |

Las mismas reglas de arriba: `webya-*` manda; nada de testimonios, sellos ni precios inventados.
`analytics` y `pricing` sugieren herramientas y planes: no se suma ninguno sin aprobación del dueño.
