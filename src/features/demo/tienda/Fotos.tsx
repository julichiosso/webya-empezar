import type { FotoId } from '@/content/demos/tienda/datos';

/** Dibujos de línea de cada foto de prueba (64 × 64, trazo de 2,5, currentColor). */
const DIBUJOS: Record<FotoId, React.ReactNode> = {
  remera: (
    <path d="M22 12 12 18l-6 12 9 4 3-6v26h28V28l3 6 9-4-6-12-10-6c-1 5-5 8-10 8s-9-3-10-8Z" />
  ),
  buzo: (
    <>
      <path d="M24 10c0 6 4 10 8 10s8-4 8-10l12 8 4 30h-8l-2-22v32H18V26l-2 22H8l4-30 12-8Z" />
      <path d="M26 44h12" />
    </>
  ),
  zapatilla: (
    <>
      <path d="M6 40c0-6 2-14 6-18l8 4 6 8 12 4c10 2 16 4 18 8v6H6Z" />
      <path d="M6 46h50M24 30l4 4M28 26l4 4" />
    </>
  ),
  anillo: (
    <>
      <circle cx="32" cy="38" r="16" />
      <circle cx="32" cy="38" r="11" />
      <path d="m26 22 6-10 6 10-6 4Z" />
    </>
  ),
  collar: (
    <>
      <path d="M14 10c0 16 8 28 18 32 10-4 18-16 18-32" />
      <path d="m32 42-5 6 5 8 5-8Z" />
    </>
  ),
  aros: (
    <>
      <circle cx="20" cy="36" r="10" />
      <circle cx="44" cy="36" r="10" />
      <path d="M20 26v-10M44 26v-10" />
    </>
  ),
  taza: (
    <>
      <path d="M12 22h32v18a12 12 0 0 1-12 12h-8a12 12 0 0 1-12-12Z" />
      <path d="M44 26h4a6 6 0 0 1 0 12h-4M24 10c-2 3 2 5 0 8M32 10c-2 3 2 5 0 8" />
    </>
  ),
  vela: (
    <>
      <path d="M18 28h28v26H18zM18 34h28" />
      <path d="M32 28v-6M32 22c-4-4-2-9 0-12 2 3 4 8 0 12Z" />
    </>
  ),
  regalo: (
    <>
      <path d="M10 26h44v10H10zM14 36h36v20H14zM32 26v30" />
      <path d="M32 26c-4-8-14-10-14-4 0 4 8 4 14 4 6 0 14 0 14-4 0-6-10-4-14 4Z" />
    </>
  ),
  frasco: (
    <>
      <path d="M20 10h24v8H20zM18 18h28l2 6v28a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V24Z" />
      <path d="M22 32h20v12H22z" />
    </>
  ),
  cafe: (
    <>
      <path d="M18 14h28l4 8-2 34H16l-2-34Z" />
      <path d="M14 22h36M27 34c4 2 6 6 4 12M33 34c-4 2-6 6-4 12" />
    </>
  ),
  botella: (
    <>
      <path d="M27 6h10v10l6 8v30a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V24l6-8Z" />
      <path d="M21 32h22v14H21z" />
    </>
  ),
};

/**
 * Foto de prueba: el dibujo sobre un fondo del color de la tienda (muy claro). Si la persona subió una
 * foto propia (queda en su navegador), se muestra esa.
 */
export function FotoProducto({
  foto,
  propia,
  className,
}: {
  foto: FotoId;
  propia?: string;
  className?: string;
}) {
  if (propia) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- foto local (blob:) que no pasa por el optimizador
      <img src={propia} alt="" className={`size-full object-cover ${className ?? ''}`} />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`grid size-full place-items-center bg-[color-mix(in_srgb,var(--marca)_9%,white)] text-(--marca) ${className ?? ''}`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        className="size-[46%]"
      >
        {DIBUJOS[foto]}
      </svg>
    </span>
  );
}
