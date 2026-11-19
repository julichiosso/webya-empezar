# DECISIONS — Rediseño Webya

Decisiones tomadas en modo autónomo. Cada una: qué y por qué.

## Fase 1 — Auditoría y deploy

- **Next 16.4.3 → 16.4.6.** El build fallaba con `SecurityFatalError` y `pnpm audit` confirmó dos avisos moderados
  parcheados en 16.4.5. Es un parche dentro de la misma menor: riesgo bajo, y sin él no sale ningún deploy.
- **`vercel.json` con `framework: nextjs`.** Un preset "Other" sirve `public/` y la raíz da 404. Fijarlo en el repo
  saca esa variable de la configuración del panel.
- **No toqué el DNS de `webya.dev`.** El 404 de hoy lo devuelve un nginx detrás de Cloudflare, no Vercel. Cambiar el
  DNS es producción y es de Julián: los pasos exactos están en `AUDIT.md` §5.
