# Lo que el prompt daba por hecho y no está (2026-11-22)

No se construyó acá: queda anotado para una tanda propia.

| Asumido por el prompt | Estado real | Qué se hizo en la home |
|---|---|---|
| Página `/cafeterias` (y pastelerías) | No existe | El menú no la lista; los rubros de café siguen yendo a la demo de pedidos |
| Regresión visual previa de todas las páginas | No había baselines de capturas | Se crea el baseline de la primera pantalla de la home (con y sin WebGL); las demás páginas quedan sin captura |
| Lighthouse ≥ 95 medido | Último dato local: 74 con 4× CPU, 89–93 con 2× (`PROGRESS.md`) | Se mide en el preview con PageSpeed Insights |
| Manifiesto de rutas del sitio | Las rutas viven en `content/home.ts` (`HEADER.menu`, `RUTAS`) | El menú se arma desde `HEADER.menu` (la misma lista que el pie), sin una lista nueva |
| Foto de Julián | No está (`NOSOTROS.foto = null`) | El sello usa la marca hasta que llegue |
| Logos autorizados de clientes | No hay permiso registrado | Nombres en tipografía |
