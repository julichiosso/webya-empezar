'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/paths';

interface SelectCardProps {
  /** Radio nativo: aporta rol, grupo, flechas de teclado y estado accesible sin ARIA extra. */
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  label: string;
  icon: IconName;
}

export function SelectCard({ name, value, checked, onSelect, label, icon }: SelectCardProps) {
  return (
    <label className="group relative block h-full cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="peer sr-only"
      />
      <m.span
        // "Pop" breve al elegir (3 fotogramas: los resortes de motion solo admiten 2). Solo transform.
        animate={checked ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 0.34, times: [0, 0.4, 1], ease: 'easeOut' }}
        className="flex h-full min-h-32 flex-col justify-between gap-4 rounded-card border border-line bg-surface p-4 shadow-raised transition-[transform] duration-100 group-hover:border-line-strong group-active:scale-[0.98] peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      >
        <span className={`flex ${checked ? 'text-accent' : 'text-fg'}`}>
          <Icon name={icon} size={32} draw active={checked} />
        </span>
        <span className="text-body leading-tight font-semibold text-balance">{label}</span>
      </m.span>
      <AnimatePresence initial={false}>
        {checked && (
          <m.span
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 22 }}
            className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-accent text-accent-fg"
          >
            <Icon name="check" size={16} draw active />
          </m.span>
        )}
      </AnimatePresence>
    </label>
  );
}
