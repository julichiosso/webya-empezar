import { LANDINGS } from '@/content/landings';
import { LandingServicio, metadataLanding } from '../_landing/LandingServicio';

const L = LANDINGS.pedidos;
export const metadata = metadataLanding(L);

export default function PaginaPedidos() {
  return <LandingServicio landing={L} />;
}
