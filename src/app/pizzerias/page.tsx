import { Pedidos } from '@/components/marketing/editorial/Pedidos';
import { LANDINGS } from '@/content/landings';
import { LandingServicio, metadataLanding } from '../_landing/LandingServicio';

const L = LANDINGS.pizzerias;
export const metadata = metadataLanding(L);

export default function PaginaPizzerias() {
  return (
    <LandingServicio landing={L}>
      <Pedidos numero={1} />
    </LandingServicio>
  );
}
