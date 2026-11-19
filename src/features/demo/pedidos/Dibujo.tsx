import { cn } from '@/components/ui/clases';
import type { Producto } from '@/content/demos/pedidos/carta';

/**
 * Dibujo de reemplazo de cada producto (la demo no usa fotos): una pizza vista desde arriba con su
 * ingrediente, una botella o un postre. Decorativo: el nombre está al lado.
 */
export function Dibujo({ producto, className }: { producto: Producto; className?: string }) {
  const v = producto.dibujo;
  if (producto.seccion === 'bebidas')
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true" className={cn(`m-bebida-${v}`, className)}>
        <path
          d="M42 14h16v12c8 5 12 13 12 22v36a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V48c0-9 4-17 12-22z"
          fill="var(--m-vidrio)"
        />
        <path d="M30 52h40v32a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6z" fill="var(--m-liquido)" />
        <rect x="41" y="8" width="18" height="8" rx="2" fill="var(--m-salsa)" />
        <rect x="30" y="58" width="40" height="12" fill="var(--m-crema)" opacity="0.85" />
      </svg>
    );
  if (producto.seccion === 'postres')
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true" className={cn(`m-postre-${v}`, className)}>
        <ellipse cx="50" cy="74" rx="40" ry="12" fill="var(--m-plato)" />
        <path d="M28 70V48c0-3 2-6 6-6h32c4 0 6 3 6 6v22z" fill="var(--m-postre)" />
        <path
          d="M28 52c8 4 14-4 22 0s14-4 22 0v-4c0-3-2-6-6-6H34c-4 0-6 3-6 6z"
          fill="var(--m-crema)"
          opacity="0.7"
        />
        <circle cx="50" cy="36" r="5" fill="var(--m-salsa)" />
      </svg>
    );
  // Pizza: masa, salsa, queso y el ingrediente de la variante, repartido en dos anillos.
  const tops = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + v;
    const r = i % 2 === 0 ? 22 : 12;
    return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r };
  });
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn(`m-pizza-${v}`, className)}>
      <circle cx="50" cy="50" r="46" fill="var(--m-masa)" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--m-masa-borde)" strokeWidth="2" />
      <circle cx="50" cy="50" r="38" fill="var(--m-salsa)" />
      <path
        d="M24 46c4-12 18-18 30-14 10-6 22 2 22 12 6 8 2 20-8 22-4 10-18 12-26 6-12 2-22-8-18-18z"
        fill="var(--m-queso)"
      />
      {tops.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.y} r={i % 3 === 0 ? 5 : 4} fill="var(--m-top)" />
      ))}
      <path
        d="M50 12v76M12 50h76M23 23l54 54M77 23 23 77"
        stroke="var(--m-masa-borde)"
        strokeWidth="0.8"
        opacity="0.5"
      />
    </svg>
  );
}
