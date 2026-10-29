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
