# RELEASE_CHECKLIST — publicar webya.dev

Lo que hace Julián (producción: el agente no lo toca). En orden.

## 1. Contactos (5 minutos)

1. **Base de datos**: Vercel → proyecto `webya-empezar` → **Storage** → **Create Database** → **Neon** (plan
   gratis) → **Connect** al proyecto (Production y Preview). Vercel carga `DATABASE_URL` solo. Las tablas se
   crean solas con el primer contacto.
2. **Telegram** (tu bandeja de entrada):
   1. En Telegram, abrí **@BotFather** → `/newbot` → elegí nombre → copiá el **token**.
   2. Escribile cualquier cosa a tu bot nuevo.
   3. Abrí `https://api.telegram.org/bot<TOKEN>/getUpdates` en el navegador y copiá el número de `"chat":{"id":…}`.
   4. Vercel → Settings → Environment Variables: `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`.
3. (Opcional) `IP_HASH_SALT`: ya no es obligatoria (se deriva de `DATABASE_URL`).
4. `NEXT_PUBLIC_WHATSAPP_NUMBER=5493406419495` (si no está cargada, el sitio usa el mismo número por defecto).
5. **Redeploy** (Deployments → ⋯ → Redeploy) para que tome las variables.

**Probar**: en el sitio publicado, dejá tu número en "Te escribimos nosotros". Tiene que llegarte el Telegram al
instante, y en Neon (Tables → vista `contactos`) aparece la fila.

## 2. Dominio

En Cloudflare (DNS de `webya.dev`), en modo **DNS only** (nube gris):

- `A  @    76.76.21.21`
- `CNAME  www  cname.vercel-dns.com`

En Vercel → Settings → Domains: agregar `webya.dev` y `www.webya.dev`. Verificar con
`curl -sI https://webya.dev` que responde Vercel (no nginx).

## 3. Después de publicar

- [ ] PageSpeed Insights (móvil) de `/`, `/turnero` y `/armar`: objetivo ≥ 95 en las cuatro categorías.
- [ ] Probar en un iPhone real (Safari): el teclado en `/armar` y en "Te escribimos nosotros", la barra de abajo.
- [ ] Probar en un Android de gama media (Chrome): scroll fluido en la home y en `/zona`.
- [ ] Google Search Console: alta de `webya.dev` y envío de `https://webya.dev/sitemap.xml`.
- [ ] Mirar el embudo a la semana: en Neon, `select * from embudo_diario;`.

## 4. Lo que falta de Julián (contenido)

Ver la lista del reporte final en `PROGRESS.md` (capturas por proyecto, foto, logos autorizados, % de descuento).
