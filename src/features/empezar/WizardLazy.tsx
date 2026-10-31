'use client';

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { CLAVE_TRASPASO_DEMO } from '@/domain/traspaso/demo-wizard';

interface WizardProps {
  /** Rubro tocado antes de que terminara de descargarse el wizard: arranca desde ahí. */
  rubroInicial: string | null;
}

/** El wizard arrastra motion + react-hook-form + zod: se descarga recién cuando hace falta. */
const cargarWizard = () => import('./Wizard').then((m) => m.Wizard as ComponentType<WizardProps>);

/** Misma clave que features/empezar/state.ts (no se importa: arrastraría el catálogo al JS inicial). */
const CLAVE_ESTADO = 'webya:empezar:v3';

/** Primer gesto de la persona: ahí se empieza a descargar (lo más probable es que toque un rubro). */
const GESTOS = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;

/**
 * La pantalla 1 (`children`) llega en el HTML del servidor: se ve y se puede tocar sin esperar JS.
 * El wizard se descarga al primer gesto, al pasar el mouse o el foco por las tarjetas, o enseguida
 * si hay un flujo a medias (recarga) o un traspaso de la demo. Si la persona toca un rubro antes
 * de que llegue, la tarjeta se marca al instante y el wizard arranca desde ese rubro.
 */
export function WizardLazy({ children }: { children: ReactNode }) {
  const [Wizard, setWizard] = useState<ComponentType<WizardProps> | null>(null);
  const [rubroInicial, setRubroInicial] = useState<string | null>(null);
  const contenedor = useRef<HTMLDivElement>(null);
  /** Tarjeta con el foco al llegar el wizard: el HTML se reemplaza y el foco no se puede perder. */
  const enfocada = useRef<string | null>(null);

  useEffect(() => {
    const el = contenedor.current;
    let vivo = true;
    let pedido = false;
    const cargar = () => {
      if (pedido) return;
      pedido = true;
      void cargarWizard().then((w) => {
        if (!vivo) return;
        const activo = document.activeElement as HTMLElement | null;
        enfocada.current = el?.contains(activo) ? (activo?.dataset.rubro ?? null) : null;
        setWizard(() => w);
      });
    };
    const onClick = (e: MouseEvent) => {
      const boton = (e.target as Element).closest<HTMLElement>('[data-rubro]');
      if (!boton?.dataset.rubro) return;
      // Feedback inmediato (< 100 ms) mientras termina de llegar el wizard.
      boton.dataset.cargando = '';
      setRubroInicial(boton.dataset.rubro);
      cargar();
    };

    let flujoAMedias = false;
    try {
      const s = window.sessionStorage;
      flujoAMedias = s.getItem(CLAVE_ESTADO) !== null || s.getItem(CLAVE_TRASPASO_DEMO) !== null;
    } catch {
      // sin sessionStorage: se carga al primer gesto
    }
    if (flujoAMedias) {
      const t = setTimeout(cargar, 0);
      return () => {
        vivo = false;
        clearTimeout(t);
      };
    }

    el?.addEventListener('click', onClick);
    el?.addEventListener('pointerover', cargar, { once: true });
    el?.addEventListener('focusin', cargar, { once: true });
    for (const g of GESTOS) window.addEventListener(g, cargar, { once: true, passive: true });
    return () => {
      vivo = false;
      el?.removeEventListener('click', onClick);
      el?.removeEventListener('pointerover', cargar);
      el?.removeEventListener('focusin', cargar);
      for (const g of GESTOS) window.removeEventListener(g, cargar);
    };
  }, []);

  // Ya montado el wizard (mismo HTML en la pantalla 1), el foco vuelve a la misma tarjeta.
  useEffect(() => {
    const id = enfocada.current;
    if (!Wizard || !id || rubroInicial) return;
    document.querySelector<HTMLElement>(`#wizard [data-rubro="${CSS.escape(id)}"]`)?.focus();
  }, [Wizard, rubroInicial]);

  return Wizard ? <Wizard rubroInicial={rubroInicial} /> : <div ref={contenedor}>{children}</div>;
}
