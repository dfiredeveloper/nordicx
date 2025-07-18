import Image from 'next/image'
import React, { useEffect, useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { formatNumber } from '@/lib/utils'

interface TokenHolding {
    symbol: string
    name: string
    balance: number
    price: number
    value: number
    unrealizedPnl: number
    totalProfit: number
    boughtAmount: number
    boughtAvg: number
    soldAmount: number
    soldAvg: number
    holdingDuration: string
    lastActive: string
    logo?: string
}

export default function HoldingBody() {
    const { address, isConnected } = useAccount()
    const [holdings, setHoldings] = useState<TokenHolding[]>([])
    const [loading, setLoading] = useState(false)

    const fetchHoldings = useCallback(async () => {
        if (!address) return
        setLoading(true)
        try {
            // Fetch user's token holdings from blockchain
            const response = await fetch(`/api/holdings?address=${address}`)
            const data = await response.json()
            if (data.success) {
                setHoldings(data.holdings)
            } else {
                setHoldings([])
            }
        } catch (error) {
            console.error('Error fetching holdings:', error)
            setHoldings([])
        } finally {
            setLoading(false)
        }
    }, [address])

    useEffect(() => {
        if (isConnected && address) {
            fetchHoldings()
        } else {
            setHoldings([])
        }
    }, [isConnected, address, fetchHoldings])

    if (!isConnected) {
        return (
            <tbody className="w-full absolute h-[250px] bg-accent-2 flex items-center justify-center">
                <tr>
                    <td colSpan={100} className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <Image src={"/nodata.svg"} width={70} height={70} alt='no data' />
                            <p className='text-accent-aux-1'>Connect Wallet to View Holdings</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        )
    }

    if (loading) {
        return (
            <tbody className="w-full absolute h-[250px] bg-accent-2 flex items-center justify-center">
                <tr>
                    <td colSpan={100} className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-4"></div>
                            <p className='text-accent-aux-1'>Loading Holdings...</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        )
    }

    if (holdings.length === 0) {
        return (
            <tbody className="w-full absolute h-[250px] bg-accent-2 flex items-center justify-center">
                <tr>
                    <td colSpan={100} className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <Image src={"/nodata.svg"} width={70} height={70} alt='no data' />
                            <p className='text-accent-aux-1'>No Holdings Found</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        )
    }

    return (
        <>
            {holdings.map((holding, index) => (
                <tr key={index} className="hover:bg-accent-3 transition-colors">
                    <td className="py-3 px-2 sticky left-0 z-[1] bg-accent-2">
                        <div className="flex items-center gap-2">
                            <div className="rounded-full border w-fit relative">
                                <Image 
                                    src={holding.logo || "/static/3717.png"} 
                                    className='w-[30px] h-[30px]' 
                                    width={30} 
                                    height={30} 
                                    alt={holding.name} 
                                    unoptimized 
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <h1 className="uppercase text-[14px] font-[400]">{holding.name}</h1>
                                    <span className="text-xs text-accent-1">{holding.symbol}</span>
                                </div>
                                <div className="text-xs text-accent-aux-1">{holding.lastActive}</div>
            </div>
        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className={`text-sm ${holding.unrealizedPnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {holding.unrealizedPnl >= 0 ? '+' : ''}{formatNumber(holding.unrealizedPnl)}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className={`text-sm ${holding.totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {holding.totalProfit >= 0 ? '+' : ''}{formatNumber(holding.totalProfit)}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-1">
                            ${formatNumber(holding.value)}
                        </div>
                        <div className="text-xs text-accent-aux-1">
                            {formatNumber(holding.balance)} {holding.symbol}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-aux-1">
                            {holding.holdingDuration}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-1">
                            ${formatNumber(holding.boughtAmount)}
                        </div>
                        <div className="text-xs text-accent-aux-1">
                            Avg: ${formatNumber(holding.boughtAvg)}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-1">
                            ${formatNumber(holding.soldAmount)}
                        </div>
                        <div className="text-xs text-accent-aux-1">
                            Avg: ${formatNumber(holding.soldAvg)}
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}
