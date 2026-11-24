'use client';

import { useEffect, useRef, useState } from 'react';

type Cielo = 'dia' | 'noche';

/**
 * La luna (de noche) o el sol (de día), arriba a la derecha del hero. Es un interruptor: tocarlo cambia
 * el cielo y la calle entera se ilumina (o anochece). En la compu, con solo pasar el mouse por la luna ya
 * amanece; al irse vuelve, salvo que se haya hecho clic. Escribe `data-cielo` en el hero (ProgresoCalle
 * lo respeta hasta el próximo momento del lema) y `data-cambiando` mientras dura el fundido.
 */
export function Astro({
  idHero,
  textos,
}: {
  idHero: string;
  textos: { dia: string; noche: string; pista: string };
}) {
  const [noche, setNoche] = useState(false);
  const fijo = useRef(false);
  const previa = useRef(false);
  const espera = useRef(0);

  useEffect(() => {
    const hero = document.getElementById(idHero);
    if (!hero) return;
    const leer = () => setNoche(hero.hasAttribute('data-oscuro'));
    leer();
    const suelto = () => {
      fijo.current = false;
      previa.current = false;
    };
    const obs = new MutationObserver(leer);
    obs.observe(hero, { attributes: true, attributeFilter: ['data-oscuro'] });
    window.addEventListener('webya:cielo-suelto', suelto);
    return () => {
      obs.disconnect();
      window.removeEventListener('webya:cielo-suelto', suelto);
      window.clearTimeout(espera.current);
    };
  }, [idHero]);

  const poner = (cielo: Cielo | null) => {
    const hero = document.getElementById(idHero);
    if (!hero) return;
    hero.setAttribute('data-cambiando', '');
    window.clearTimeout(espera.current);
    espera.current = window.setTimeout(() => hero.removeAttribute('data-cambiando'), 900);
    if (cielo) hero.dataset.cielo = cielo;
    else delete hero.dataset.cielo;
    window.dispatchEvent(new Event('webya:cielo'));
  };

  return (
    <button
      type="button"
      className="hc-astro"
      data-noche={noche || undefined}
      aria-label={noche ? textos.dia : textos.noche}
      onClick={() => {
        if (previa.current) {
          // Ya amaneció con el mouse: el clic lo deja así.
          previa.current = false;
          fijo.current = true;
          return;
        }
        fijo.current = true;
        poner(noche ? 'dia' : 'noche');
      }}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse' || fijo.current || !noche) return;
        previa.current = true;
        poner('dia');
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse' || !previa.current) return;
        previa.current = false;
        poner(null);
      }}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <defs>
          <mask id="hc-astro-sombra">
            <rect width="48" height="48" fill="white" />
            <circle className="hc-astro-sombra" cx="31" cy="17" r="11" fill="black" />
          </mask>
        </defs>
        <g className="hc-astro-rayos">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M24 5.5v4.5" transform={`rotate(${i * 45} 24 24)`} />
          ))}
        </g>
        <circle className="hc-astro-disco" cx="24" cy="24" r="11" mask="url(#hc-astro-sombra)" />
      </svg>
      <span className="hc-astro-pista" aria-hidden="true">
        {noche ? textos.pista : null}
      </span>
    </button>
  );
}
