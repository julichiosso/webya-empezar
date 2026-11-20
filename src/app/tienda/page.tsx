import { Catalogo } from '@/components/marketing/editorial/Catalogo';
import { LANDINGS } from '@/content/landings';
import { LandingServicio, metadataLanding } from '../_landing/LandingServicio';

const L = LANDINGS.tienda;
export const metadata = metadataLanding(L);

export default function PaginaTienda() {
  return (
    <LandingServicio landing={L}>
      <Catalogo />
    </LandingServicio>
  );
}
