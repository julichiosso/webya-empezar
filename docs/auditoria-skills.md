# Auditoría de skills, plugins y MCP — WebYa /empezar

Fecha: 2026-10-29 · Proyecto: `C:\Users\Usuario\projects\webya-empezar` (Next 16.4, React 19.3, Tailwind 4.3, Vitest 5, Playwright 1.64, pnpm)

**Modo:** solo lectura. No se instaló nada ni se tocó ninguna configuración. No se leyeron `.env*`, `~/.claude/.credentials.json` ni `mcp-needs-auth-cache.json` (solo consta que existen). De `~/.claude.json` y de los `.mcp.json` se leyeron únicamente los **nombres** de los servidores.

Las descargas para revisar candidatos quedaron en `C:\Users\Usuario\AppData\Local\Temp\claude\c--Users-Usuario-projects-webya-empezar\17e1b0b7-1dfd-4b9f-b59a-06ebda0fa7dc\scratchpad\dl` (son datos no confiables, no se ejecutó nada de ahí; se pueden borrar).

---

## Parte 1 — Inventario verificado

### 1.1 Skills del proyecto (`.claude/skills/`)

No hay `.claude/agents/`, ni `.claude/settings*.json`, ni `.mcp.json`, ni `CLAUDE.md` en el proyecto (sí `AGENTS.md`, el que genera `next dev`).

| Skill | Líneas | Último commit | Qué cubre | Datos desactualizados detectados |
|---|---|---|---|---|
| `webya-add-rubro` | 56 | 2026-10-28 | Alta de un rubro: config, ícono, tests, verificación | **Sí.** (1) Manda a buscar íconos en `src/components/icons/rubros/`, que **no existe**: hoy viven en `src/components/icons/paths.ts` (`RUBRO_ICONS`). (2) Dice "cuando exista el registro de íconos (etapa de UI), otro test genérico verifica…": ya existe (`src/components/icons/icons.test.ts` valida `RUBRO_ICONS`). Lo mismo arrastra el comentario en `src/config/rubros/types.ts:19`. |
| `webya-brand` | 87 | 2026-10-29 | Concepto "Encastre", paleta Brasa/crema/negro, voz rioplatense, logo, ilustración, movimiento | No se detectó nada. Las rutas citadas (`src/app/globals.css`, `src/config/marca/colores.ts`, `marca.test.ts`) existen. |
| `webya-demo-builder` | 74 | 2026-10-29 | Demos de rubro (cliente/dueño, sincronización, QR, WhatsApp, CTA) | No. Rutas (`src/config/demos/`, `src/features/demo/`, `src/lib/analytics.ts`) existen. |
| `webya-design-system` | 125 | 2026-10-29 | Tokens, tipografía, grilla de 8px, estados, presupuesto de animación, prohibiciones | No se detectó nada. |
| `webya-pedidos-module` | 79 | 2026-10-29 | Dominio de pedidos: estados, dinero en centavos, repositorio multi-tenant | Menor: habla de la "etapa g en adelante" en futuro; la etapa (g) ya está commiteada (`adee916`). |
| `webya-qa-checklist` | 77 | 2026-10-28 | Cierre de etapa: lint/typecheck/tests, a11y, Lighthouse, JS < 150 KB, seguridad de leads | Posible: el dato "Hoy: ~144 KB iniciales" es una foto del 28/10; después hubo dos commits de UI (entrada con logo animado, secciones de confianza). Conviene re-medirlo con `e2e/rendimiento.spec.ts` y actualizar el número. |

Todas son de un solo archivo (`SKILL.md`), sin scripts.

### 1.2 Nivel usuario (`C:\Users\Usuario\.claude\`)

- **`settings.json`**: solo tiene `model`, `effortLevel`, `modelSettings` y `theme`. **No** declara `enabledPlugins` ni `mcpServers`.
- **`skills/`**: no hay skills propias del usuario. Hay una carpeta `skills/synced/<id>/` sincronizada desde claude.ai con las **anthropic-skills**: `built-in-browser`, `chrome-browser`, `computer-use`, `deep-research`, `docs`, `docx`, `import-memory`, `morning`, `pdf`, `pptx`, `skill-creator`, `xlsx`.
- **`plugins/`**:
  - No existe `installed_plugins.json` (no hay plugins instalados por CLI desde marketplaces).
  - `known_marketplaces.json` → un marketplace: **`claude-plugins-official`** (GitHub `anthropics/claude-plugins-official`), clonado en `plugins/marketplaces/claude-plugins-official` (sin commits en la rama local `master`, así que el SHA se tomó de la API de GitHub). Trae `frontend-design`, `security-guidance`, `claude-security`, `pr-review-toolkit`, `code-review`, `typescript-lsp`, `skill-creator`, `playwright` y `context7` (estos dos como plugins externos), entre otros. **Ninguno está habilitado.**
  - `plugins/synced/<id>/`: plugin **`design` v1.2.0** (autor Anthropic, del "Anthropic Directory" de claude.ai), con las skills `accessibility-review`, `design-critique`, `design-handoff`, `design-system`, `research-synthesis`, `user-research` y `ux-copy`. Su `.mcp.json` declara conectores: `slack`, `figma`, `linear`, `asana`, `atlassian`, `notion`, `intercom`, `google calendar`, `gmail` (varios figuran como "requieren autenticación" en esta sesión; no se usan en el proyecto).
  - `plugins/store/`: `cc-plugin-agents-md_builtin` (el soporte integrado de `AGENTS.md`).
  - `blocklist.json`: entradas de prueba del sistema (`code-review@claude-plugins-official` con motivo "just-a-test", y otra de un marketplace de prueba). No afecta al proyecto.

### 1.3 Servidores MCP (solo nombres)

| Origen | Servidores |
|---|---|
| `~/.claude.json` → `mcpServers` (nivel usuario) | `chrome-devtools`, `context7`, `playwright` |
| `~/.claude.json` → proyectos | Solo otro proyecto (`JOYERIA-PETRUCCI`) tiene `playwright`; **webya-empezar no tiene MCP propios** |
| `.mcp.json` del proyecto | No existe |
| Plugin `design` | `slack`, `figma`, `linear`, `asana`, `atlassian`, `notion`, `intercom`, `google calendar`, `gmail` |
| Inyectados por el entorno en esta sesión | `claude-vscode` (diagnósticos del IDE), `claude.ai Claude Docs`; `claude.ai Google Drive` figura pero sin autorizar |

### 1.4 Skills integradas de Claude Code que ya cubren necesidades

`code-review`, `security-review`, `simplify`, `run`, `init`, `update-config`, `fewer-permission-prompts`, más `dataviz` y las `artifact-*`. Esto importa porque **revisión de código y seguridad ya están cubiertas** sin instalar nada.

### 1.5 Cobertura actual por necesidad

| Necesidad | Lo que ya hay |
|---|---|
| Calidad de diseño frontend | `webya-design-system`, `webya-brand`, `design:design-system`, `design:design-critique`, `design:design-handoff` |
| UI/UX y accesibilidad | `design:accessibility-review` (WCAG 2.1 AA), `@axe-core/playwright` + `e2e/a11y.spec.ts`, `e2e/teclado.spec.ts`, sección C de `webya-qa-checklist` |
| Copy, conversión y SEO | `webya-brand` (voz), `design:ux-copy` (microcopy); SEO técnico ya testeado en `e2e/seo.spec.ts` (metadata, canonical, robots, OG/Twitter, `robots.txt`/`sitemap.xml`, JSON-LD del FAQ, jerarquía de encabezados) + Lighthouse SEO ≥ 95. **Falta:** método de copy persuasivo y de conversión. |
| Testing en navegador | MCP `playwright` + suite `@playwright/test` (16 specs) |
| Rendimiento | MCP `chrome-devtools` (trazas, `performance_analyze_insight`, `lighthouse_audit`), `e2e/rendimiento.spec.ts`, sección D de `webya-qa-checklist`. **Falta:** guía de patrones de React/Next para no romper el presupuesto de JS. |
| Seguridad y code review | Integradas `security-review` y `code-review`; seguridad de leads en `webya-qa-checklist` |
| Documentación | MCP `context7`, docs de Next en `node_modules/next/dist/docs/` (según `AGENTS.md`), `anthropic-skills:skill-creator`, `anthropic-skills:docs` |

---

## Parte 2 — Candidatos evaluados

Reglas de descarte aplicadas: (a) corre comandos o red sin justificación clara, (b) pide permisos amplios, (c) dependencias dudosas, (d) duplica algo instalado.

### 2.1 Revisados a fondo

**1. `frontend-design` (Anthropic)**
- Fuente: https://github.com/anthropics/skills/tree/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design. Es **byte a byte igual** a `anthropics/claude-plugins-official@30202c767cfaf325212b3921ab484f83adaec850` (`plugins/frontend-design`) y a la copia local del marketplace.
- Licencia: Apache 2.0 (`LICENSE.txt`).
- Qué hace: guía de dirección visual con criterio propio. Plan de tokens, revisión contra el brief, evitar los "tics" de diseño generado por IA, autocrítica con capturas y una sección de escritura en la interfaz.
- Permisos y scripts: ninguno. Es solo Markdown; no pide herramientas ni red.
- Solapamiento: parcial con `design:design-critique` (crítica) y `design:ux-copy` (su sección de escritura). Lo que aporta de nuevo es la lente de "no parecer plantilla". **Ojo:** su lista de tics menciona "fondo crema + acento terracota" y "negro + un acento vivo", que se parecen a la paleta Brasa/crema/negro. La propia skill dice que el brief manda: acá el brief es `webya-design-system`/`webya-brand` y hay que dejarlo explícito en el agente.
- Decisión: **instalar**, solo para `marca-sistema` (y opcional para `ui-componentes` en pantallas nuevas).

**2. `webapp-testing` (Anthropic)**
- Fuente: https://github.com/anthropics/skills/tree/b9e19e6f44773509fbdd7001d77ff41a49a486c1/skills/webapp-testing. Licencia Apache 2.0.
- Qué hace: escribir scripts de **Playwright en Python** y levantar servidores con `scripts/with_server.py`.
- Permisos y scripts: `with_server.py` lanza procesos con `subprocess.Popen(cmd, shell=True)`, o sea comandos de shell arbitrarios. Los ejemplos escriben en `/tmp` y `/mnt/user-data/outputs` (rutas de otro entorno). Requiere Python + `playwright` de pip.
- Solapamiento: total con el MCP `playwright` y con la suite `@playwright/test` del proyecto, que está en TypeScript.
- Decisión: **descartar** (duplicado; ejecuta shell; mete otra pila, Python).

**3. `web-design-guidelines` (Vercel)**
- Fuente: https://github.com/vercel-labs/agent-skills/tree/ba46938889d4e58635362fb8f618e1178ac3ec46/skills/web-design-guidelines. El repo no tiene archivo LICENSE.
- Qué hace: en cada uso **baja las reglas en vivo** desde `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` y las aplica.
- Permisos y scripts: WebFetch en cada uso contra una rama `main` **sin fijar**. El contenido que se ejecuta como instrucción puede cambiar sin revisión: es una superficie de prompt injection.
- Solapamiento: con `design:accessibility-review` y `design:design-critique`.
- Decisión: **descartar** (red sin fijar y duplicado).

**4. `vercel-react-best-practices` (Vercel)**
- Fuente: https://github.com/vercel-labs/agent-skills/tree/dc8367e6f91c022d83361f03c3313fa05e848ee5/skills/react-best-practices (último commit de esa carpeta; idéntica en el HEAD `1a2c79d`).
- Licencia: MIT **declarada en el frontmatter**; el repo no tiene archivo LICENSE.
- Qué hace: 70 reglas de rendimiento para React y Next priorizadas por impacto (cascadas async, tamaño del bundle, RSC y serialización, re-renders, hidratación, SVG), cada una con un ejemplo incorrecto y uno correcto.
- Permisos y scripts: ninguno, todo Markdown. Leí el `SKILL.md` completo y revisé las 72 reglas buscando comandos, instalaciones y URLs: no hay nada ejecutable, solo enlaces de referencia (react.dev, nextjs.org, vercel.com).
- Riesgo: algunas reglas sugieren dependencias (`swr`, `lru-cache`, `better-all`). La instrucción del agente tiene que decir que **no autorizan agregar dependencias** sin aprobación.
- Solapamiento: no hay nada instalado que lo cubra. Complementa el presupuesto de 150 KB de `webya-qa-checklist`.
- Decisión: **instalar** (para `ui-componentes`, `paginas` y `qa-rendimiento`).

**5. `copywriting` (coreyhaines31/marketingskills)**
- Fuente: https://github.com/coreyhaines31/marketingskills/tree/15b38b5388dfdd17f4ab424e986ccd32c24d5b22/skills/copywriting (repo con unas 57 k estrellas). Licencia MIT.
- Qué hace: método de copy de conversión. Primero diagnostica la situación (en blanco, voz existente o retoque puntual), después aplica el filtro de tres preguntas, la lista de tics de IA, la regla de "afirmaciones demostrables o `[NEED: …]`" y la estructura de landing.
- Permisos y scripts: ninguno, todo Markdown. Lee `.agents/product-marketing.md` si existe; en este proyecto no existe y no molesta.
- Encaje: su regla de no inventar claims coincide con `webya-brand` ("sin precios, testimonios ni métricas inventados", `TODO:` visible). Contras: está en inglés y con ejemplos de SaaS ("Start Free Trial"), así que voz y tono los fija `webya-brand`.
- Solapamiento: `design:ux-copy` cubre microcopy; esta skill cubre el copy persuasivo de la página. Se complementan.
- Decisión: **instalar** (para `copy-conversion`).

**6. `cro` (coreyhaines31/marketingskills)**
- Fuente: https://github.com/coreyhaines31/marketingskills/tree/e88ace76a791b7da6de58f7ee7dbcb38b6bbc136/skills/cro. Licencia MIT.
- Qué hace: auditoría de conversión de la página por orden de impacto (propuesta de valor, titular, CTA, jerarquía, confianza, objeciones, fricción). `references/form.md` cubre formularios multipaso, validación, errores, campos y medición, que es justo lo del wizard de leads.
- Permisos y scripts: ninguno. Incluye un enlace a GitHub (playbook de revops) que el agente podría querer abrir; no hace falta.
- Riesgo: recomienda logos de clientes, testimonios y sellos de seguridad, y medir el foco de cada campo. En WebYa eso choca con "sin testimonios ni sellos inventados" y con "no mandar lo que escribe la persona". `webya-brand` y `webya-demo-builder` tienen precedencia.
- Decisión: **instalar** (para `copy-conversion`), con esa precedencia explícita en el agente.

**7. `seo-audit` (coreyhaines31/marketingskills)**
- Fuente: https://github.com/coreyhaines31/marketingskills/tree/435cde424b1d3eb0251ee9efaf0c47e12a9ab4c2/skills/seo-audit. Licencia MIT.
- Qué hace: auditoría SEO general (rastreo, indexación, on-page, E-E-A-T, internacional, SEO local), pensada para un sitio vivo con Search Console.
- Permisos y scripts: ninguno, aunque menciona herramientas pagas (Ahrefs, Screaming Frog).
- Solapamiento: lo técnico ya está automatizado en `e2e/seo.spec.ts` y en Lighthouse SEO ≥ 95. El sitio es una landing con wizard, sin blog ni locales múltiples.
- Decisión: **descartar por ahora**. Revisar si se suman páginas por rubro indexables, donde `references/local-seo*.md` sí sumaría.

**8. `seo` (addyosmani/web-quality-skills)**
- Fuente: https://github.com/addyosmani/web-quality-skills/tree/c6b06ad1285cd6b129b58455b2eec96ab6b67fa7/skills/seo. Licencia MIT.
- Qué hace: SEO técnico basado en evidencia, usando el `lighthouse_audit` del MCP chrome-devtools.
- Permisos y scripts: ninguno. Enlaza a skills hermanas que no se instalarían (los enlaces quedarían rotos).
- Solapamiento: alto con `e2e/seo.spec.ts`, Lighthouse y `webya-qa-checklist`; los ejemplos son HTML genérico, no la Metadata API de Next.
- Decisión: **descartar** (duplicado).

**9. `core-web-vitals` (addyosmani/web-quality-skills)**
- Fuente: https://github.com/addyosmani/web-quality-skills/tree/c6b06ad1285cd6b129b58455b2eec96ab6b67fa7/skills/core-web-vitals. Licencia MIT.
- Qué hace: diagnóstico de LCP, INP y CLS con trazas del MCP chrome-devtools y CrUX.
- Permisos y scripts: ninguno.
- Problemas: enlaza `../performance/references/*.md`, que quedaría roto sin la skill `performance`. Su ejemplo de Next usa `getServerSideProps` (Pages Router), no el App Router de Next 16.
- Solapamiento: la sección D de `webya-qa-checklist` ya fija el procedimiento (traza para Performance y no `lighthouse_audit`, que es lo mismo que recomienda esta skill), y `e2e/rendimiento.spec.ts` lo verifica.
- Decisión: **descartar** (duplicado y desactualizado para Next 16).

**10. `accessibility` + `web-quality-audit` (addyosmani)**
- Fuente: el mismo repo en `c6b06ad` (MIT).
- Qué hacen: guía WCAG 2.2, y un script `scripts/analyze.sh` que con grep busca problemas en archivos `.html` y requiere `jq`.
- Permisos y scripts: el script es de solo lectura pero ejecuta bash y no sirve para JSX ni TSX. `accessibility` sugiere `npm install @axe-core/cli -g` (instalación global).
- Solapamiento: con `design:accessibility-review` y con `@axe-core/playwright` + `e2e/a11y.spec.ts`.
- Decisión: **descartar** (duplicado; instalación global y script sin uso en este stack). Lo único que agrega es WCAG 2.2 (foco no tapado, tamaño de objetivo, arrastre): conviene sumarlo a mano como 3 ítems en `webya-qa-checklist`.

**11. Plugin `security-guidance` (claude-plugins-official)**
- Fuente: https://github.com/anthropics/claude-plugins-official/tree/41f619d61b999adec1a1c8deb97d1a5b6ac35bb6/plugins/security-guidance (v2.0.17).
- Qué hace: hooks en `SessionStart`, `UserPromptSubmit`, `PostToolUse` (Edit/Write y `git commit`/`git push`) y Stop, que mandan el diff a un LLM para revisarlo.
- Permisos y scripts: unos 1 MB de Python. En `SessionStart` **crea un venv e instala el Agent SDK con pip** en `~/.claude/security/`. Hace llamadas de red a la API en cada turno y en cada commit, y despierta al agente en segundo plano.
- Solapamiento: las integradas `security-review` y `code-review`.
- Decisión: **descartar** (red e instalaciones automáticas en cada sesión; hooks globales; duplicado).

**12. Plugin `claude-security` (claude-plugins-official)**
- Fuente: https://github.com/anthropics/claude-plugins-official/tree/ca08d5e47d6402db586d37780c559a0c4c7ded9a/plugins/claude-security (v0.12.0).
- Qué hace: escaneo profundo de vulnerabilidades con 8 subagentes, scripts Python, un workflow JS de 60 KB y hooks de métricas.
- Solapamiento: con `security-review`. Es una herramienta pesada para un repo chico.
- Decisión: **descartar** por ahora. Si algún día hace falta un escaneo completo, conviene evaluarla como corrida puntual y no dejarla instalada.

### 2.2 Descartados por descripción (sin lectura completa, porque no aplican)

| Candidato | Motivo |
|---|---|
| `anthropics/skills` → `brand-guidelines` | Es la marca de **Anthropic**; WebYa tiene `webya-brand`. |
| `anthropics/skills` → `theme-factory` | Temas prearmados; chocan con los tokens de `webya-design-system`. |
| `anthropics/skills` → `web-artifacts-builder` | Arma artefactos de claude.ai con scripts npm; no es el stack del sitio. |
| `anthropics/skills` → `canvas-design`, `algorithmic-art` | Generan PNG/PDF o arte generativo; las ilustraciones de WebYa son SVG con la grilla del sistema. |
| `anthropics/skills` → `skill-creator` | Ya instalada (`anthropic-skills:skill-creator`). |
| `claude-plugins-official` → `pr-review-toolkit` (`30202c7`) | Son subagentes, no skills; duplica la integrada `code-review` y el proyecto define sus propios subagentes. |
| `claude-plugins-official` → `code-review`, `code-simplifier` | Duplican las integradas `code-review` y `simplify`. |
| `claude-plugins-official` → `typescript-lsp` (`aecd4c8`) | Requiere instalar `typescript-language-server` globalmente; `tsc --noEmit` y el MCP `claude-vscode` (`getDiagnostics`) ya dan diagnósticos. |
| `claude-plugins-official` → `claude-md-management` (`aecd4c8`) | Trabaja sobre `CLAUDE.md`; el proyecto usa `AGENTS.md` (gestionado por `next dev`). |
| `claude-plugins-official` → `playwright`, `context7` (externos) | Ya configurados como MCP de usuario. |

---

## Tabla final

| Skill | Fuente (URL + commit) | Qué hace | Permisos / scripts | Decisión | Por qué |
|---|---|---|---|---|---|
| frontend-design | github.com/anthropics/skills/tree/**41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f**/skills/frontend-design (= claude-plugins-official@30202c7) | Dirección visual con criterio, anti-plantilla, autocrítica | Ninguno (Markdown). Apache 2.0 | **Instalar** | Oficial, sin riesgo; agrega una lente de crítica de "no parecer generado" que no tiene nadie. El brief WebYa manda sobre sus "tics". |
| vercel-react-best-practices | github.com/vercel-labs/agent-skills/tree/**dc8367e6f91c022d83361f03c3313fa05e848ee5**/skills/react-best-practices | 70 reglas de rendimiento React/Next (bundle, RSC, re-renders, hidratación) | Ninguno (Markdown). MIT solo en frontmatter | **Instalar** | Cubre un hueco real (presupuesto de JS de 150 KB con ~144 KB usados). Condición: no agregar dependencias que sugiera sin aprobación. |
| copywriting | github.com/coreyhaines31/marketingskills/tree/**15b38b5388dfdd17f4ab424e986ccd32c24d5b22**/skills/copywriting | Método de copy de conversión, anti-tics de IA, claims demostrables | Ninguno (Markdown). MIT | **Instalar** | No hay nada que cubra el copy persuasivo; su regla de no inventar coincide con `webya-brand`. La voz la fija `webya-brand`. |
| cro | github.com/coreyhaines31/marketingskills/tree/**e88ace76a791b7da6de58f7ee7dbcb38b6bbc136**/skills/cro | Auditoría de conversión de página + formularios multipaso | Ninguno (Markdown). MIT | **Instalar** | `form.md` aplica directo al wizard de leads. Precedencia explícita: sin testimonios ni sellos inventados y sin rastrear lo que se escribe. |
| webapp-testing | github.com/anthropics/skills/tree/**b9e19e6f44773509fbdd7001d77ff41a49a486c1**/skills/webapp-testing | Playwright en Python + levantar servidores | `subprocess` con `shell=True`, pip | Descartar | Duplica el MCP playwright y la suite TS; ejecuta shell. |
| web-design-guidelines | github.com/vercel-labs/agent-skills/tree/**ba46938889d4e58635362fb8f618e1178ac3ec46**/skills/web-design-guidelines | Revisión de UI contra reglas bajadas en vivo | WebFetch a `main` sin fijar en cada uso | Descartar | Red sin fijar (prompt injection); duplica `design:*`. |
| seo-audit | github.com/coreyhaines31/marketingskills/tree/**435cde424b1d3eb0251ee9efaf0c47e12a9ab4c2**/skills/seo-audit | Auditoría SEO general y local | Ninguno | Descartar (por ahora) | `e2e/seo.spec.ts` + Lighthouse ya lo cubren; revisar si se suman páginas por rubro. |
| seo | github.com/addyosmani/web-quality-skills/tree/**c6b06ad1285cd6b129b58455b2eec96ab6b67fa7**/skills/seo | SEO técnico con Lighthouse | Ninguno | Descartar | Duplicado; ejemplos genéricos, no de Next. |
| core-web-vitals | github.com/addyosmani/web-quality-skills/tree/**c6b06ad1285cd6b129b58455b2eec96ab6b67fa7**/skills/core-web-vitals | Diagnóstico de LCP, INP y CLS | Ninguno | Descartar | Duplica `webya-qa-checklist` D + MCP chrome-devtools; ejemplo de Pages Router; enlaces rotos. |
| accessibility / web-quality-audit | github.com/addyosmani/web-quality-skills/tree/**c6b06ad1285cd6b129b58455b2eec96ab6b67fa7**/skills | WCAG 2.2 + script grep sobre `.html` | `analyze.sh` (bash + jq); sugiere `npm -g` | Descartar | Duplica `design:accessibility-review` + axe; el script no sirve para TSX. |
| security-guidance (plugin) | github.com/anthropics/claude-plugins-official/tree/**41f619d61b999adec1a1c8deb97d1a5b6ac35bb6**/plugins/security-guidance | Hooks que mandan diffs a un LLM | Instala el Agent SDK con pip en cada sesión, red en cada turno y commit, unos 1 MB de Python | Descartar | Red e instalaciones automáticas, hooks globales; duplica `security-review`. |
| claude-security (plugin) | github.com/anthropics/claude-plugins-official/tree/**ca08d5e47d6402db586d37780c559a0c4c7ded9a**/plugins/claude-security | Escaneo profundo con 8 subagentes | Scripts Python y JS, hooks | Descartar | Pesado para el tamaño del repo; duplica `security-review`. |

### Archivos exactos que se copiarían (alcance proyecto, `.claude/skills/`)

Origen: siempre `raw.githubusercontent.com/<repo>/<commit fijado>/…`. Se excluyen las carpetas `evals/` y los compilados duplicados.

**`.claude/skills/frontend-design/`** — total 19.564 B
| Archivo | Bytes |
|---|---|
| `SKILL.md` | 9.390 |
| `LICENSE.txt` (Apache 2.0) | 10.174 |

**`.claude/skills/vercel-react-best-practices/`** (carpeta con el nombre del frontmatter; en el repo se llama `react-best-practices`) — total 118.762 B
| Archivo | Bytes |
|---|---|
| `SKILL.md` | 7.251 |
| `metadata.json` | 921 |
| `rules/*.md` (70 reglas + `_sections.md` + `_template.md` = 72 archivos) | 110.590 |
| *Excluidos:* `AGENTS.md` (108.261, compilado que repite las reglas; el `SKILL.md` lo menciona y ese enlace queda roto) y `README.md` (3.360) | — |

**`.claude/skills/copywriting/`** — total 57.396 B
| Archivo | Bytes |
|---|---|
| `SKILL.md` | 15.553 |
| `references/ai-tells.md` | 20.804 |
| `references/copy-frameworks.md` | 14.409 |
| `references/natural-transitions.md` | 5.561 |
| `LICENSE` (MIT, copiado de la raíz del repo para cumplir la atribución) | 1.069 |
| *Excluido:* `evals/evals.json` (12.995) | — |

**`.claude/skills/cro/`** — total 26.365 B
| Archivo | Bytes |
|---|---|
| `SKILL.md` | 7.114 |
| `references/form.md` | 10.332 |
| `references/experiments.md` | 7.850 |
| `LICENSE` (MIT, raíz del repo) | 1.069 |
| *Excluido:* `evals/evals.json` (7.656) | — |

**Total a copiar: 222.087 B (unos 217 KB) en 4 carpetas.** Nada ejecutable.

Alternativa para `frontend-design`: como el marketplace `claude-plugins-official` ya está clonado, podría habilitarse como plugin (`/plugin install frontend-design@claude-plugins-official`) en vez de copiarse. Copiarla al proyecto la deja versionada y fijada al commit, que es lo que pide esta auditoría.

---

## Asignación mínima de skills por subagente

Criterio: lo mínimo para el rol. Las skills `webya-*` son la fuente de verdad y **tienen precedencia** sobre cualquier skill externa. En las de terceros conviene repetirlo en el prompt del agente.

| Subagente | Skills | MCP / herramientas sugeridas | Nota |
|---|---|---|---|
| **marca-sistema** | `webya-brand`, `webya-design-system`, `design:design-system`, `frontend-design` *(nueva)* | — | `frontend-design` como lente de crítica; la paleta Brasa/crema/negro no se discute. |
| **ilustracion** | `webya-brand`, `webya-design-system`, `design:design-critique` | `playwright` (capturas para autocrítica) | SVG con la grilla 24×24 y trazo 1.5; el presupuesto de animación sale de `webya-design-system`. |
| **ui-componentes** | `webya-design-system`, `design:accessibility-review`, `vercel-react-best-practices` *(nueva)* | `context7`, `claude-vscode` (diagnósticos), `playwright` | Sumar `webya-demo-builder` y `webya-pedidos-module` solo si toca la demo. |
| **copy-conversion** | `webya-brand`, `design:ux-copy`, `copywriting` *(nueva)*, `cro` *(nueva)* | — | Voz rioplatense de `webya-brand`; nada inventado (`TODO:` visible); sin rastrear lo que escribe la persona. |
| **paginas** | `webya-design-system`, `webya-add-rubro`, `webya-demo-builder`, `vercel-react-best-practices` *(nueva)* | `context7`, docs de `node_modules/next/dist/docs/` | `webya-pedidos-module` solo para la demo de Gastronomía. |
| **qa-rendimiento** | `webya-qa-checklist`, `design:accessibility-review`, `vercel-react-best-practices` *(nueva)* | `chrome-devtools` (trazas y Lighthouse sin Performance), `playwright` | Los números reales salen de `e2e/rendimiento.spec.ts` y de trazas, con build de producción. |
| **seguridad-revisor** | `webya-qa-checklist` (sección seguridad de leads), `webya-pedidos-module` (multi-tenant, dinero), integradas `security-review` y `code-review` | — | Solo lectura; no necesita navegador ni red. |

Antes de armar los agentes, verificar en la doc actual de Claude Code cómo se precargan skills en un subagente (campo de frontmatter del agente) y si las skills de plugin (`design:*`) y las integradas se pueden referenciar igual que las del proyecto.

---

## Pendientes que salen de la auditoría (sin hacer, para aprobación)

1. Corregir `webya-add-rubro`: la ruta de íconos (`src/components/icons/paths.ts`, `RUBRO_ICONS`) y quitar el "cuando exista el registro de íconos" (ya existe `icons.test.ts`). Mismo comentario en `src/config/rubros/types.ts:19`.
2. Re-medir y actualizar en `webya-qa-checklist` el "~144 KB iniciales".
3. Sumar a `webya-qa-checklist` C tres criterios de WCAG 2.2: foco no tapado (2.4.11), tamaño de objetivo (2.5.8) y alternativa al arrastre (2.5.7).
4. Si se aprueban las instalaciones: descargar los archivos por el commit fijado (no por `main`), comparar tamaños contra esta tabla y commitear en una etapa propia.

## Alcance y límites de la revisión

- Leí completos los `SKILL.md` de los 12 candidatos de la sección 2.1, el único script de los aceptables (ninguno tiene) y los scripts de los descartados que tienen (`with_server.py`, `analyze.sh`, los `hooks.json` de los plugins de seguridad).
- De `vercel-react-best-practices` revisé las 72 reglas buscando comandos, instalaciones y URLs, sin leerlas línea por línea.
- De `copywriting` leí el índice de `ai-tells.md` y `copy-frameworks.md` y busqué en ellos herramientas y comandos (no hay). `cro/references/form.md` lo leí completo.
- Los SHA son el último commit que tocó cada carpeta según la API de GitHub al 2026-10-29.
