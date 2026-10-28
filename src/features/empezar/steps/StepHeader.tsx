import type { Ref } from 'react';

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  /** Al cambiar de paso el foco va al título: los lectores de pantalla lo anuncian y el teclado sigue desde ahí. */
  headingRef?: Ref<HTMLHeadingElement>;
}

export function StepHeader({ title, subtitle, headingRef }: StepHeaderProps) {
  return (
    <header className="mb-6">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-title font-semibold text-balance outline-none focus-visible:outline-none"
      >
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-lead text-muted">{subtitle}</p>}
    </header>
  );
}
