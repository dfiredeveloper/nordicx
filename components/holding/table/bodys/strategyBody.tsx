import Image from 'next/image'
import React, { useEffect, useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { formatNumber } from '@/lib/utils'

interface TradingStrategy {
    id: string
    name: string
    type: 'dca' | 'grid' | 'momentum' | 'arbitrage'
    symbol: string
    status: 'active' | 'paused' | 'completed'
    totalProfit: number
    totalTrades: number
    successRate: number
    createdAt: string
    logo?: string
}

export default function StrategyBody() {
    const { address, isConnected } = useAccount()
    const [strategies, setStrategies] = useState<TradingStrategy[]>([])
    const [loading, setLoading] = useState(false)

    const fetchStrategies = useCallback(async () => {
        if (!address) return
        setLoading(true)
        try {
            const response = await fetch(`/api/strategies?address=${address}`)
            const data = await response.json()
            if (data.success) {
                setStrategies(data.strategies)
            } else {
                setStrategies([])
            }
        } catch (error) {
            console.error('Error fetching strategies:', error)
            setStrategies([])
        } finally {
            setLoading(false)
        }
    }, [address])

    useEffect(() => {
        if (isConnected && address) {
            fetchStrategies()
        } else {
            setStrategies([])
        }
    }, [isConnected, address, fetchStrategies])

    if (!isConnected) {
        return (
            <tbody className="w-full absolute h-[250px] bg-accent-2 flex items-center justify-center">
                <tr>
                    <td colSpan={100} className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <Image src={"/nodata.svg"} width={70} height={70} alt='no data' />
                            <p className='text-accent-aux-1'>Connect Wallet to View Strategies</p>
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
                            <p className='text-accent-aux-1'>Loading Strategies...</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        )
    }

    if (strategies.length === 0) {
        return (
            <tbody className="w-full absolute h-[250px] bg-accent-2 flex items-center justify-center">
                <tr>
                    <td colSpan={100} className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <Image src={"/nodata.svg"} width={70} height={70} alt='no data' />
                            <p className='text-accent-aux-1'>No Strategies Found</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        )
    }

    return strategies.map((strategy) => (
                <tr key={strategy.id} className="hover:bg-accent-3 transition-colors">
                    <td className="py-3 px-2 sticky left-0 z-[1] bg-accent-2">
                        <div className="flex items-center gap-2">
                            <div className="rounded-full border w-fit relative">
                                <Image 
                                    src={strategy.logo || "/static/3717.png"} 
                                    className='w-[30px] h-[30px]' 
                                    width={30} 
                                    height={30} 
                                    alt={strategy.name} 
                                    unoptimized 
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <h1 className="text-[14px] font-[400]">{strategy.name}</h1>
                                    <span className="text-xs text-accent-1">{strategy.symbol}</span>
                                </div>
                                <div className="text-xs text-accent-aux-1 uppercase">
                                    {strategy.type}
                                </div>
            </div>
        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className={`text-sm px-2 py-1 rounded-full w-fit ${
                            strategy.status === 'active' ? 'bg-green-500/20 text-green-500' :
                            strategy.status === 'paused' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-gray-500/20 text-gray-500'
                        }`}>
                            {strategy.status}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className={`text-sm ${strategy.totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {strategy.totalProfit >= 0 ? '+' : ''}{formatNumber(strategy.totalProfit)}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-1">
                            {strategy.totalTrades}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-1">
                            {strategy.successRate}%
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-aux-1">
                            {strategy.createdAt}
                        </div>
                    </td>
                </tr>
            ))
}
