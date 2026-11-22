'use client';

import { ESTUDIO } from '@/content/demos/studio';

/** "Personalizar" en la barra de la demo: abre el asistente para armarla con tu negocio. */
export function BotonPersonalizar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ESTUDIO.personalizarAria}
      className="flex min-h-12 items-center gap-2 rounded-full bg-lima px-4 text-[1rem] font-semibold text-tinta"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />
      </svg>
      <span className="max-sm:sr-only">{ESTUDIO.personalizar}</span>
    </button>
  );
}
