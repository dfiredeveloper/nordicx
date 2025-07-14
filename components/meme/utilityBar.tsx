'use client';
import React, { useCallback, useState, useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchParams } from 'next/navigation';
import { updateUrlParams } from '@/lib/utils';

export default function UtilityBar({ switchTabs }) {
    const paramSearch = useSearchParams();
    const timeframe = paramSearch?.get("timeframe") || "24h"
    const [activeTimeFrame, setTimeFrame] = useState(timeframe)
    const [filters, setFilters] = useState({
        filter1: '',
        filter2: '',
        filter3: '',
        filter4: '',
        filter5: ''
    })
    const [filterHoneypot, setFilterHoneypot] = useState(false)
    const [filterRisks, setFilterRisks] = useState(false)
    const [filterWashTraded, setFilterWashTraded] = useState(false)
    
    const getChain = useCallback(() => paramSearch?.get("chain") || "eth", [paramSearch]);

    // Update active timeframe when URL changes
    useEffect(() => {
        const urlTimeframe = paramSearch?.get("timeframe") || "24h"
        setTimeFrame(urlTimeframe)
    }, [paramSearch])

    const handleTimeFrameChange = (timeframe) => {
        setTimeFrame(timeframe)
        // Update URL params with timeframe
        updateUrlParams({ timeframe })
    }

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }))
    }

    const handleApplyFilters = () => {
        // Update URL params with filters
        const filterParams: Record<string, string> = {}
        Object.entries(filters).forEach(([key, value]) => {
            if (value.trim()) {
                filterParams[key] = value
            }
        })
        if (filterHoneypot) filterParams.honeypot = 'true'
        if (filterRisks) filterParams.risks = 'true'
        if (filterWashTraded) filterParams.washTraded = 'true'
        
        updateUrlParams(filterParams)
    }

    const handleResetFilters = () => {
        setFilters({
            filter1: '',
            filter2: '',
            filter3: '',
            filter4: '',
            filter5: ''
        })
        setFilterHoneypot(false)
        setFilterRisks(false)
        setFilterWashTraded(false)
        // Clear filter params from URL
        updateUrlParams({ 
            filter1: '', 
            filter2: '', 
            filter3: '', 
            filter4: '', 
            filter5: '',
            honeypot: '',
            risks: '',
            washTraded: ''
        })
    }

    return (
        <div className='md:px-[1.3rem] px-[.5rem] py-[1rem] flex gap-2 flex-col md:flex-row justify-between items-center'>
            <div className="md:hidden flex  gap-2 items-center divide-x rounded-xl overflow-hidden w-full ">
                <div className="grid md:hidden items-center divide-x rounded-xl overflow-hidden grid-cols-3 w-full">
                    <button onClick={() => handleTimeFrameChange("1h")} className={`flex items-center border-t border-b border-l justify-center text-[13px] ${activeTimeFrame == "1h" ? "dark:text-white bg-accent-1" : "text-accent-aux-1"}`}>{"1h"}</button>
                    <button onClick={() => handleTimeFrameChange("24h")} className={`flex items-center border-t border-b justify-center text-[13px] ${activeTimeFrame == "24h" ? "dark:text-white bg-accent-1" : "text-accent-aux-1"}`}>{"24h"}</button>
                    <button onClick={() => handleTimeFrameChange("7d")} className={`flex items-center border-t border-b border-r justify-center text-[13px] ${activeTimeFrame == "7d" ? "dark:text-white bg-accent-1" : "text-accent-aux-1"}`}>{"7d"}</button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="md:flex hidden items-center gap-2">
                    <button
                        onClick={() => switchTabs("1")}
                        className={`font-[700] text-[15px] whitespace-nowrap ${switchTabs === "1" ? "dark:text-[#f5f5f5] text-[#111111]" : 'dark:text-[#f5f5f5]/40 text-[#111111]/40'}`}
                    >
                        Meme
                    </button>
                    <button
                        onClick={() => switchTabs("2")}
                        className={`font-[700] text-[15px] whitespace-nowrap flex items-center gap-1 ${switchTabs === "2" ? "dark:text-[#f5f5f5] text-[#111111]" : 'dark:text-[#f5f5f5]/40 text-[#111111]/40'}`}
                    >
                        Moonshoot
                    </button>
                </div>

                <div className="w-full flex md:flex-nowrap flex-wrap gap-3">
                    {/* request interval */}
                    <div className="md:grid hidden items-center divide-x rounded-xl overflow-hidden grid-cols-3">
                        <button onClick={() => handleTimeFrameChange("1h")} className={`h-[28px] w-[28px] min-w-[48px] flex items-center border-t border-b border-l justify-center text-[13px] ${activeTimeFrame == "1h" ? "dark:text-white bg-accent-1" : "text-accent-aux-1"}`}>{"1h"}</button>
                        <button onClick={() => handleTimeFrameChange("24h")} className={`h-[28px] w-[28px] min-w-[48px] flex items-center border-t border-b justify-center text-[13px] ${activeTimeFrame == "24h" ? "dark:text-white bg-accent-1" : "text-accent-aux-1"}`}>{"24h"}</button>
                        <button onClick={() => handleTimeFrameChange("7d")} className={`h-[28px] w-[28px] min-w-[48px] flex items-center border-t border-b border-r justify-center text-[13px] ${activeTimeFrame == "7d" ? "dark:text-white bg-accent-1" : "text-accent-aux-1"}`}>{"7d"}</button>
                        </div>
                </div>
            </div>

            <div className="flex whitespace-nowrap gap-3 md:justify-normal justify-between items-center md:w-auto w-full md:space-y-0 space-y-2">
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex items-center gap-1 text-accent-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className='min-w-[14px]' width="14px" height="14px" fill="currentColor" viewBox="0 0 16 16"><g clipPath="url(#clip0_10037_38)"><path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"></path><path d="M2.997 8c0 .425.345.76.76.76h8.486a.75.75 0 00.75-.76.752.752 0 00-.76-.76H3.757a.758.758 0 00-.76.76z"></path></g><defs><clipPath id="clip0_10037_38"><rect width="16" height="16"></rect></clipPath></defs></svg>
                                <p className='text-[12px] leading-[1] text-left'>Filter Token</p>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px] space-y-1 p-2 dark:bg-[#26282c]">
                            <DropdownMenuLabel className="font-[400] text-[12px] text-[rgb(110,114,125)]">
                                Filter Token
                            </DropdownMenuLabel>
                            <div className="flex flex-col space-y-2">
                                <div className="">
                                    <input
                                        type="text"
                                        name="filter-1"
                                        value={filters.filter1}
                                        onChange={(e) => handleFilterChange('filter1', e.target.value)}
                                        className="outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]"
                                        placeholder="Token name"
                                    />
                                </div>
                                <div className="">
                                    <input
                                        type="text"
                                        name="filter-2"
                                        value={filters.filter2}
                                        onChange={(e) => handleFilterChange('filter2', e.target.value)}
                                        className="outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]"
                                        placeholder="Symbol"
                                    />
                                </div>
                                <div className="">
                                    <input
                                        type="text"
                                        name="filter-3"
                                        value={filters.filter3}
                                        onChange={(e) => handleFilterChange('filter3', e.target.value)}
                                        className="outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]"
                                        placeholder="Contract address"
                                    />
                                </div>
                                <div className="">
                                    <input
                                        type="number"
                                        name="filter-4"
                                        value={filters.filter4}
                                        onChange={(e) => handleFilterChange('filter4', e.target.value)}
                                        className="outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]"
                                        placeholder="Min market cap"
                                    />
                                </div>
                                <div className="">
                                    <input
                                        type="number"
                                        name="filter-5"
                                        value={filters.filter5}
                                        onChange={(e) => handleFilterChange('filter5', e.target.value)}
                                        className="outline-none border capitalize font-normal dark:bg-transparent text-[14px] px-1 py-1 rounded-md w-full focus:border-[#111111] hover:border-[#111111]"
                                        placeholder="Min volume 24h"
                                    />
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <div className="flex gap-2 justify-between">
                                <button onClick={handleResetFilters} className='bg-[#E2E8F0] dark:bg-[#393c43] font-[600] rounded-md text-[12px] py-1 w-full'>Reset</button>
                                <button onClick={handleApplyFilters} className='bg-[#111111] dark:bg-white font-[600] rounded-md text-white dark:text-black text-[12px] py-1 w-full'>Apply</button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {getChain() == "sol" ? <div className="flex items-center flex-wrap lg:flex-nowrap w-full gap-2">
                        <div className="flex items-center gap-1">
                            <Checkbox 
                                id='filter risks' 
                                checked={filterRisks}
                                onCheckedChange={(checked) => setFilterRisks(checked === true)}
                            />
                            <label htmlFor='filter risks' className='text-[12px] cursor-pointer leading-[1] text-left'>Filter Risks</label>
                        </div>
                        <div className="flex items-center gap-1">
                            <Checkbox 
                                id='filter wash traded' 
                                checked={filterWashTraded}
                                onCheckedChange={(checked) => setFilterWashTraded(checked === true)}
                            />
                            <label htmlFor='filter wash traded' className='text-[12px] cursor-pointer leading-[1] text-left capitalized'>Filter wash traded</label>
                    </div>
                    </div> :
                        <div className="flex items-center gap-1">
                            <Checkbox 
                                id='honeypot' 
                                checked={filterHoneypot}
                                onCheckedChange={(checked) => setFilterHoneypot(checked === true)}
                            />
                            <label htmlFor='honeypot' className='text-[12px] cursor-pointer leading-[1] text-left'>Filter Honeypot</label>
                        </div>}
                </div>
            </div>
        </div>
    )
}
