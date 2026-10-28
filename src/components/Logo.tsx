import Image from 'next/image';

/** Logo de WebYa. El SVG original es negro: en modo oscuro se invierte por CSS (.logo). */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/webya-logo.svg"
      alt="WebYa"
      width={1217}
      height={281}
      priority
      className={`logo h-7 w-auto ${className ?? ''}`.trim()}
    />
  );
}
