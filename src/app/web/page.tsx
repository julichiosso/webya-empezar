import { LANDINGS } from '@/content/landings';
import { LandingServicio, metadataLanding } from '../_landing/LandingServicio';

const L = LANDINGS.web;
export const metadata = metadataLanding(L);

export default function PaginaWeb() {
  return <LandingServicio landing={L} />;
}
