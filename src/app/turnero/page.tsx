import { Turnero } from '@/components/marketing/editorial/Turnero';
import { LANDINGS } from '@/content/landings';
import { LandingServicio, metadataLanding } from '../_landing/LandingServicio';

const L = LANDINGS.turnero;
export const metadata = metadataLanding(L);

export default function PaginaTurnero() {
  return (
    <LandingServicio landing={L}>
      <Turnero numero={1} />
    </LandingServicio>
  );
}
