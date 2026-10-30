import type { ReactNode } from 'react';
import type { IlustracionId } from './ids';

/**
 * Ilustraciones propias de platos (skill webya-brand, sección 5): grilla 96×96, trazo 2, extremos
 * redondos y dos tonos planos: el trazo toma el color del texto (`currentColor`) y los rellenos,
 * el acento de la paleta (`fill-accent`). Sin texto, sin degradés. Siempre decorativas: el nombre
 * del plato ya está escrito al lado.
 */
const A = 'fill-accent';
const plato = <ellipse cx="48" cy="66" rx="38" ry="12" />;

export const PLATOS: Record<IlustracionId, ReactNode> = {
  carne: (
    <>
      {plato}
      <path className={A} d="M24 56c0-11 11-19 25-19s23 7 23 15-9 14-23 14-25-2-25-10Z" />
      <path d="M40 44l-6 14M52 42l-6 16M64 45l-5 12" />
    </>
  ),
  pollo: (
    <>
      {plato}
      <path className={A} d="M26 62c-7-13 4-30 20-30 13 0 21 11 17 23-3 9-13 13-23 13Z" />
      <path d="M60 38 74 24" />
      <circle cx="74" cy="19" r="4" />
      <circle cx="79" cy="25" r="4" />
    </>
  ),
  chorizo: (
    <>
      <path d="M12 58c0-6 4-10 10-10h52c6 0 10 4 10 10s-4 10-10 10H22c-6 0-10-4-10-10Z" />
      <rect className={A} x="18" y="42" width="60" height="13" rx="6.5" />
      <path d="M30 48h2M44 47h2M58 49h2" />
    </>
  ),
  empanada: (
    <>
      <path className={A} d="M14 64c4-18 18-29 34-29s30 11 34 29Z" />
      <path d="M24 49l-3-3M33 43l-2-4M43 39l-1-4M53 39l1-4M63 43l2-4M72 49l3-3" />
      <path d="M10 70h76" />
    </>
  ),
  queso: (
    <>
      <path d="M78 58h10" />
      <ellipse className={A} cx="48" cy="58" rx="30" ry="14" />
      <path d="M18 58c0-8 13-14 30-14s30 6 30 14" />
      <path d="M38 52h.01M50 49h.01M58 55h.01M44 58h.01" />
    </>
  ),
  papas: (
    <>
      <rect className={A} x="34" y="22" width="6" height="30" rx="2" />
      <rect className={A} x="45" y="16" width="6" height="36" rx="2" />
      <rect className={A} x="56" y="24" width="6" height="28" rx="2" />
      <path d="M28 50h40l-6 32H34Z" />
    </>
  ),
  ensalada: (
    <>
      <path className={A} d="M28 50c-2-11 6-18 15-16-1 9-6 15-15 16Z" />
      <path className={A} d="M52 48c2-11 11-16 19-12-3 9-9 13-19 12Z" />
      <circle cx="49" cy="41" r="7" />
      <path d="M14 50h68c0 17-15 30-34 30S14 67 14 50Z" />
    </>
  ),
  agua: (
    <>
      <path d="M41 14h14v9l7 9v48a5 5 0 0 1-5 5H39a5 5 0 0 1-5-5V32l7-9Z" />
      <rect className={A} x="34" y="48" width="28" height="16" />
      <path d="M41 18h14" />
    </>
  ),
  gaseosa: (
    <>
      <rect className={A} x="30" y="40" width="36" height="22" />
      <rect x="30" y="20" width="36" height="62" rx="7" />
      <path d="M36 26h24M56 20l6-10" />
    </>
  ),
  vino: (
    <>
      <path className={A} d="M35 30h26c-1 10-6 17-13 17s-12-7-13-17Z" />
      <path d="M33 16h30c0 19-6 31-15 31S33 35 33 16Z" />
      <path d="M48 47v26M36 77h24" />
    </>
  ),
  cerveza: (
    <>
      <rect className={A} x="28" y="38" width="32" height="40" rx="2" />
      <rect x="26" y="32" width="36" height="48" rx="4" />
      <path d="M62 42h8a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-8" />
      <path d="M26 32c0-6 6-8 9-5 2-4 9-4 11 0 3-3 9-2 10 3 3-1 6 1 6 2" />
    </>
  ),
  flan: (
    <>
      {plato}
      <path className={A} d="M32 64l4-26h24l4 26Z" />
      <path d="M36 38c4 5 20 5 24 0" />
    </>
  ),
  helado: (
    <>
      <circle className={A} cx="39" cy="44" r="10" />
      <circle className={A} cx="57" cy="44" r="10" />
      <circle cx="48" cy="30" r="10" />
      <path d="M34 52h28L48 86Z" />
      <path d="M40 60l14 10M56 60 44 72" />
    </>
  ),
  pizza: (
    <>
      <circle cx="48" cy="48" r="34" />
      <circle className={A} cx="48" cy="48" r="27" />
      <path d="M48 21v54M21 48h54M29 29l38 38M67 29 29 67" />
    </>
  ),
  faina: (
    <>
      <path className={A} d="M18 70 48 20l30 50Z" />
      <path d="M18 70c10 6 50 6 60 0" />
      <path d="M40 52h.01M54 46h.01M50 60h.01" />
    </>
  ),
  cafe: (
    <>
      <ellipse className={A} cx="46" cy="42" rx="22" ry="4" />
      <path d="M24 42h44v12a20 20 0 0 1-20 20h-4a20 20 0 0 1-20-20Z" />
      <path d="M68 46h4a8 8 0 0 1 0 16h-6M16 82h64" />
      <path d="M38 32c-3-4 3-6 0-10M48 32c-3-4 3-6 0-10M58 32c-3-4 3-6 0-10" />
    </>
  ),
  medialuna: (
    <>
      <path className={A} d="M14 64c4-20 18-32 34-32s30 12 34 32l-12-5-8 7-14-9-14 9-8-7Z" />
      <path d="M36 38l4 22M60 38l-4 22M48 33v24" />
    </>
  ),
  alfajor: (
    <>
      <path className={A} d="M20 48c0 6 12 10 28 10s28-4 28-10v6c0 6-12 10-28 10s-28-4-28-10Z" />
      <ellipse cx="48" cy="42" rx="28" ry="10" />
      <path d="M20 42v18c0 6 12 10 28 10s28-4 28-10V42" />
      <path d="M40 40h.01M52 38h.01M58 44h.01M36 45h.01" />
    </>
  ),
  torta: (
    <>
      <path
        className={A}
        d="M18 46c0-8 8-14 30-14s30 6 30 14c-4 6-8 0-12 6s-8-4-12 2-8-2-12 4-8-4-12 0-8 2-12-6Z"
      />
      <path d="M18 46v24h60V46M12 74h72" />
    </>
  ),
  tostado: (
    <>
      <path d="M18 62 48 22l30 40Z" />
      <path className={A} d="M14 66h68l-4 6H18Z" />
      <rect x="14" y="72" width="68" height="8" rx="2" />
    </>
  ),
  jugo: (
    <>
      <path className={A} d="M33 40h30l-3 38H36Z" />
      <path d="M30 24h36l-4 56a4 4 0 0 1-4 4H38a4 4 0 0 1-4-4Z" />
      <path d="M44 32 40 10" />
      <circle cx="66" cy="24" r="10" />
      <path d="M66 14v20M56 24h20" />
    </>
  ),
};
