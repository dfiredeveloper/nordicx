import NewPage from '@/components/chain/newPair';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "New pair - GMGN.AI Fast Trade, Fast Copy Trade, Fast AFK Automation.",
  description: "GMGN.AI Fast Trade, Fast Copy Trade, Fast AFK Automation",
};

export default function Page() {
  return (
      <NewPage />
  )
}
