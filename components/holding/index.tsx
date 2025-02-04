"use client";
import React, { useState } from 'react'
import UtilityBar from './utilityBar'
import HoldingTable from './table/holdingTable';
import LimitTable from './table/limitTable';
import StrategyTable from './table/strategyTable';

export default function Holding() {
    const [switchTabs, setTabSwitch] = useState("holding")
    return (
        <>
            <UtilityBar  switchTabs={switchTabs} setTabSwitch={setTabSwitch}/>
            {
                switchTabs == "holding" && <HoldingTable />
            }
              {
                switchTabs == "limit" && <LimitTable />
            }
              {
                switchTabs == "strategy" && <StrategyTable />
            }
        </>
    )
}
