"use client";
import Drawer from '@/components/common/drawer';
import Trade from '@/components/trading/mainSection/trade';
import MobileTradingHeader from '@/components/trading/mobileTrading';
import RightBar, { BuyTab, DegenAudit, PoolInfo, SellTab } from '@/components/trading/rightBar';
import TradingHeader from '@/components/trading/trading';
import { notFound } from 'next/navigation';
import { useState } from 'react';

// List of valid chains
// const validChains = ["sol", "eth", "base", "bsc", "tron", "blast"];

export default function Page() {
  // const { chain, address } = params;
  const [isOpen, setIsOpen] = useState({
    buy: false,
    sell: false,
    info: false
  })

  // Check if the chain is valid
  // if (!validChains.includes(chain)) {
  //   notFound(); // This will render the 404 page
  // }

  return (
    <div className="">
      {/* warning issue */}
      <div className="">
        <div className="text-risk flex justify-center items-center h-[40px] gap-1 bg-riskWarn">
          <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="#FFD039" viewBox="0 0 14 14"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.212 2.093a1.4 1.4 0 00-2.423 0L.517 11.198A1.4 1.4 0 001.73 13.3h10.544a1.4 1.4 0 001.211-2.101L8.212 2.093zM7.001 9.255a.7.7 0 01-.7-.7V5.6a.7.7 0 111.4 0v2.955a.7.7 0 01-.7.7zm.7 1.167a.7.7 0 11-1.4 0 .7.7 0 011.4 0z"></path></svg>
          <p className='text-[12px] font-[500]'>This token has low liquidity. Trade carefully!</p>
        </div>
      </div>

      <div className="md:block hidden">
        <TradingHeader />
        <div className="flex items-start">
          <Trade />
          <RightBar />
        </div>
      </div>

      <div className="md:hidden block">
        <MobileTradingHeader />
        <Trade />
      </div>

      <div className="flex w-full fixed bottom-[0px] z-[40] dark:bg-[#17181b]">
        <div className="flex w-full justify-around dark:bg-[#17181b] h-[56px]">
          <div
            onClick={() => setIsOpen((prev) => ({ ...prev, buy: true }))}
            className="flex flex-col justify-center items-center gap-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9AA0AA" viewBox="0 0 16 16"><path d="M8.353 15.677l5.528-8.483a.736.736 0 00-.197-1.006.696.696 0 00-.393-.122H8.945V.726C8.945.324 8.628 0 8.236 0a.705.705 0 00-.59.323L2.12 8.806a.736.736 0 00.197 1.006c.116.08.253.122.393.122h4.346v5.34c0 .401.317.726.709.726a.704.704 0 00.59-.323z"></path>
            </svg>
            <p className="text-[rgb(154,160,170)] text-[10px]">Buy</p>
          </div>

          <Drawer isOpen={isOpen.buy} onClose={() =>setIsOpen((prev) => ({ ...prev, buy: false }))}>
            <BuyTab />
          </Drawer>

          <div onClick={() => setIsOpen((prev) => ({ ...prev, sell: true }))} className="flex flex-col justify-center items-center gap-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9AA0AA" viewBox="0 0 16 16"><g clip-path="url(#clip0_8080_562)"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.131 7.134a1.6 1.6 0 000 2.263l5.657 5.657a1.6 1.6 0 002.263 0l6.058-6.058c.3-.3.468-.707.468-1.131V2.208a1.6 1.6 0 00-1.6-1.6H8.32a1.6 1.6 0 00-1.131.469L1.131 7.134zm10.069-.73a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2z"></path></g><defs><clipPath id="clip0_8080_562"><rect width="16" height="16"></rect></clipPath></defs></svg>
            <p className="text-[rgb(154,160,170)] text-[10px]">Sell</p>
          </div>
          <Drawer isOpen={isOpen.sell} onClose={() => setIsOpen((prev) => ({ ...prev, sell: false }))}>
            <SellTab />
          </Drawer>

          {/* info */}
          <div onClick={() => setIsOpen((prev) => ({ ...prev, info: true }))}  className="flex flex-col justify-center items-center gap-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9AA0AA" viewBox="0 0 16 16"><g clip-path="url(#clip0_8080_565)"><path d="M8 0C3.577 0 0 3.577 0 8s3.577 8 8 8 8-3.577 8-8-3.577-8-8-8zm0 12.571a1.146 1.146 0 01-1.143-1.142c0-.629.514-1.143 1.143-1.143s1.143.514 1.143 1.143c0 .628-.514 1.142-1.143 1.142zM9.143 8c0 .629-.514 1.143-1.143 1.143A1.146 1.146 0 016.857 8V4.571c0-.628.514-1.142 1.143-1.142s1.143.514 1.143 1.142V8z"></path></g><defs><clipPath id="clip0_8080_565"><rect width="16" height="16"></rect></clipPath></defs></svg>
            <p className="text-[rgb(154,160,170)] text-[10px]">Info</p>
          </div>
    
          <Drawer isOpen={isOpen.info} onClose={() => setIsOpen((prev) => ({ ...prev, info: false }))}>
            <>
              <PoolInfo />
              <DegenAudit />
            </>
          </Drawer>
        </div>
      </div>
    </div>
  );
}