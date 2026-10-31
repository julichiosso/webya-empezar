import type { Ref } from 'react';

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  /** Al cambiar de paso el foco va al título: los lectores de pantalla lo anuncian y el teclado sigue desde ahí. */
  headingRef?: Ref<HTMLHeadingElement>;
}

export function StepHeader({ title, subtitle, headingRef }: StepHeaderProps) {
  return (
    <header className="mb-4 sm:mb-6">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-heading font-semibold text-balance outline-none focus-visible:outline-none sm:text-title"
      >
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-body text-muted sm:mt-2 sm:text-lead">{subtitle}</p>}
    </header>
  );
}
