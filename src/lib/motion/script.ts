/**
 * Motor de movimiento de todo el sitio: un solo `<script>` en línea (~1 KB), sin React ni librerías.
 *
 * - `[data-reveal]`, `[data-words]`, `[data-draw]`: reciben `.in` una vez al entrar en pantalla (CSS anima
 *   opacity/transform o el trazo).
 * - `[data-count]`: cuenta de 0 al número que ya trae el HTML (sin JS se ve el número final).
 * - `[data-loop]`: `.on` mientras está en pantalla; fuera de pantalla las animaciones en bucle se pausan.
 * - `[data-steps]` + `[data-step="n"]`: el paso que cruza el centro de la pantalla queda en `data-paso`.
 * - `[data-magnet]`: imán sutil solo con mouse (hover + pointer fino), por variables CSS.
 *
 * `.mo` en <html> solo se pone si hay IntersectionObserver y no hay prefers-reduced-motion: sin eso,
 * nada se oculta y todo se ve quieto. Un MutationObserver toma lo que llega en navegaciones del cliente.
 */
export const SCRIPT_MOVIMIENTO = `(function(){
var d=document,h=d.documentElement,w=window;
if(!('IntersectionObserver' in w))return;
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
var fino=w.matchMedia('(hover: hover) and (pointer: fine)').matches&&!quieto;
function iman(el){
var r=null,raf=0;
el.addEventListener('pointerenter',function(){r=el.getBoundingClientRect();});
el.addEventListener('pointermove',function(ev){if(!r)return;var x=(ev.clientX-r.left-r.width/2)*0.18,y=(ev.clientY-r.top-r.height/2)*0.28;cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){el.style.setProperty('--mx',Math.max(-8,Math.min(8,x)).toFixed(1)+'px');el.style.setProperty('--my',Math.max(-6,Math.min(6,y)).toFixed(1)+'px');});});
el.addEventListener('pointerleave',function(){r=null;cancelAnimationFrame(raf);el.style.setProperty('--mx','0px');el.style.setProperty('--my','0px');});
}
function cada(raiz,sel,fn){if(raiz.matches&&raiz.matches(sel))fn(raiz);raiz.querySelectorAll(sel).forEach(fn);}
function ver(raiz){
cada(raiz,'[data-reveal],[data-words],[data-draw],[data-count]',function(el){if(!el.__wy){el.__wy=1;una.observe(el);}});
cada(raiz,'[data-loop]',function(el){if(!el.__wyl){el.__wyl=1;bucle.observe(el);}});
cada(raiz,'[data-step]',function(el){if(!el.__wys){el.__wys=1;pasos.observe(el);}});
if(fino)cada(raiz,'[data-magnet]',function(el){if(!el.__wym){el.__wym=1;iman(el);}});
}
function iniciar(){
ver(d);
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)ver(n);});});}).observe(d.body,{childList:true,subtree:true});
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();`;
