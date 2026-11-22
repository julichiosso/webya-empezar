'use client';

import { useEffect, useRef, useState } from 'react';

import type { ContactoRapido as Formulario } from './ContactoRapido';

type Contacto = typeof Formulario;

/**
 * "Te escribimos nosotros" al final de la página: el formulario se pide cuando falta poco para verlo
 * (queda fuera del JS inicial). El lugar está reservado con su alto, así no mueve nada al llegar.
 */
export function ContactoDiferido() {
  const caja = useRef<HTMLDivElement>(null);
  const [ContactoRapido, setContacto] = useState<Contacto | null>(null);
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          io.disconnect();
          void import('./ContactoRapido').then((m) => setContacto(() => m.ContactoRapido));
        }
      },
      { rootMargin: '800px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={caja} className="min-h-[33rem] sm:min-h-[25rem]">
      {ContactoRapido ? <ContactoRapido /> : null}
    </div>
  );
}
