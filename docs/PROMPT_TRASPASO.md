# PROMPT DE TRASPASO — WebYa /empezar

Rol: equipo senior (creative developer, diseño de producto, copy de conversión, frontend, backend, QA). Repo Next.js en c:\Users\Usuario\webya-empezar (WebYa, webya.dev), rama main. Español rioplatense, directo, voseo. Antes de tocar Next leé AGENTS.md y node_modules/next/dist/docs/ (esta versión cambia cosas). IGNORÁ pnpm-workspace.yaml (no es del proyecto, no se commitea). NUNCA pushees. Leé docs/HANDOFF.md (arriba: ESTADO ACTUAL).

Objetivo: /empezar es el link de la bio de Instagram: el dueño de un negocio elige su rubro y arma su sistema; prioridad gastronomía; debe verse como agencia profesional. Medibles: el visitante recorre la página y deja su WhatsApp.

Reglas duras: nada de datos inventados (WhatsApp, precios, fundador, módulos, clientes, cifras, testimonios), sin urgencia falsa ni dark patterns, sin Lenis/scroll-jacking, solo transform/opacity, reduced-motion respetado, un solo acento naranja, fondos planos crema/casi-negro, sin cards idénticas/íconos en círculos/gradientes/sombras, todo texto visible en src/content/*, capas app > features > marketing > patterns > ui > content > brand > domain > config > lib. Un solo CTA: "Crear mi sistema". "Creado con WebYa" NO va en "Ya crearon" hasta que la Fase 3 publique sitios con ese pie.

Estado por bloque: 0, 4 (aa3e0ca), 5 (4370d45, intro apagada por flag NEXT_PUBLIC_INTRO_LOGO=1) y 6 HECHOS. Bloque 7 PARCIAL: hecho ticker y evento paso_completado; falta vista previa real, quitar decoración interna (MarcoDispositivo, PreviewNegocio, SlotImagen, plano/*) y actualizar e2e. Fase 3 no empezada. Detalle en docs/HANDOFF.md.
Archivos clave: components/marketing/{RubrosFlotantes,YaCrearon,CapturaCliente,Telon,PorQueWebya,Faq,Hero,Nav}.tsx, content/{clientes,telon,por-que-webya,precios,faq}.ts, features/empezar/Marco.tsx, lib/eventos.ts.
Entorno: `next start` pide IP_HASH_SALT de 16+ caracteres; tests de Wizard con --testTimeout=20000; Playwright instalado (scrolleá antes de fullPage por content-visibility); no hay python: usá node con archivos .mjs escritos con Write; en este shell los heredocs con comillas anidadas fallan.
Pendientes del dueño: WhatsApp (NEXT_PUBLIC_WHATSAPP_NUMBER, también Vercel), precios, nombre y foto del fundador, módulos extra entregados.
Orden: terminar 7 → 3. Cerrá cada bloque con typecheck, lint, tests, build, capturas 375/1366 y un commit local.
