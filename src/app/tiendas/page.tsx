import { SplitTienda } from '@/components/marketing/editorial/SplitTienda';
import { LANDINGS } from '@/content/landings';
import { LandingServicio, metadataLanding } from '../_landing/LandingServicio';

const L = LANDINGS.tiendas;
export const metadata = metadataLanding(L);

export default function PaginaTiendas() {
  return (
    <LandingServicio landing={L}>
      <SplitTienda numero={1} />
    </LandingServicio>
  );
}
