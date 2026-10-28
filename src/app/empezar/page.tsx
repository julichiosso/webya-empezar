import { Logo } from '@/components/Logo';
import { ComoFunciona } from '@/components/sections/ComoFunciona';
import { Faq } from '@/components/sections/Faq';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { QueIncluye } from '@/components/sections/QueIncluye';
import { Wizard } from '@/features/empezar/Wizard';

export default function EmpezarPage() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-xl items-center px-4 pt-6">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-xl px-4 pb-24">
        <Hero />
        <Wizard />
        <ComoFunciona />
        <QueIncluye />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
