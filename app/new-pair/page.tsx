import Footer from '@/components/common/footer';
import Feed from '@/components/new-pair/feed';
import UtilityBar from '@/components/new-pair/utilityBar';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "New pair - GMGN.AI Fast Trade, Fast Copy Trade, Fast AFK Automation.",
  description: "GMGN.AI Fast Trade, Fast Copy Trade, Fast AFK Automation",
};

export default function Page() {
  return (
    <div className='h-[90vh] overflow-hidden'>
      <UtilityBar />
      <Feed />
      <Footer />
    </div>
  )
}
