/**
 * Motor de movimiento de todo el sitio: un solo `<script>` en línea (~1 KB), sin React ni librerías.
 *
 * - `[data-reveal]`, `[data-words]`, `[data-draw]`: reciben `.in` una vez al entrar en pantalla (CSS anima
 *   opacity/transform o el trazo).
 * - `[data-count]`: cuenta de 0 al número que ya trae el HTML (sin JS se ve el número final).
 * - `[data-loop]`: `.on` mientras está en pantalla; fuera de pantalla las animaciones en bucle se pausan.
 * - `[data-steps]` + `[data-step="n"]`: el paso que cruza el centro de la pantalla queda en `data-paso`.
 *
 * `.listo` en <html> cuando el documento terminó de llegar: saca la pantalla de carga inicial.
 *
 * `.mo` en <html> solo se pone si hay IntersectionObserver y no hay prefers-reduced-motion: sin eso,
 * nada se oculta y todo se ve quieto. Un MutationObserver toma lo que llega en navegaciones del cliente.
 */
export const SCRIPT_MOVIMIENTO = `(function(){
var d=document,h=d.documentElement,w=window;
if(!('IntersectionObserver' in w)){if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',function(){h.classList.add('listo');});else h.classList.add('listo');return;}
var quieto=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!quieto)h.classList.add('mo');
function contar(el){
if(quieto)return;
var fin=parseInt(el.getAttribute('data-count'),10);if(!(fin>0))return;
var t0=performance.now(),dur=900;
function paso(t){var p=Math.min(1,(t-t0)/dur);el.textContent=String(Math.round(fin*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(paso);}
el.textContent='0';requestAnimationFrame(paso);
}
var una=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;el.classList.add('in');una.unobserve(el);if(el.hasAttribute('data-count'))contar(el);});},{rootMargin:'0px 0px -8% 0px',threshold:0.1});
var bucle=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('on',e.isIntersecting);});});
var pasos=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var c=e.target.closest('[data-steps]');if(c)c.setAttribute('data-paso',e.target.getAttribute('data-step'));});},{rootMargin:'-42% 0px -42% 0px'});
function cada(raiz,sel,fn){if(raiz.matches&&raiz.matches(sel))fn(raiz);raiz.querySelectorAll(sel).forEach(fn);}
function ver(raiz){
cada(raiz,'[data-reveal],[data-words],[data-draw],[data-count]',function(el){if(!el.__wy){el.__wy=1;una.observe(el);}});
cada(raiz,'[data-loop]',function(el){if(!el.__wyl){el.__wyl=1;bucle.observe(el);}});
cada(raiz,'[data-step]',function(el){if(!el.__wys){el.__wys=1;pasos.observe(el);}});
}
function iniciar(){
ver(d);
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)ver(n);});});}).observe(d.body,{childList:true,subtree:true});
}
function listo(){h.classList.add('listo');}
if(d.readyState==='loading'){d.addEventListener('DOMContentLoaded',iniciar);d.addEventListener('DOMContentLoaded',listo);}else{iniciar();listo();}
})();`;

/** Sin JS nadie saca la pantalla de carga inicial: con esto no se muestra (va en <noscript>). */
export const ESTILO_SIN_JS = '.carga-inicial{display:none}';
