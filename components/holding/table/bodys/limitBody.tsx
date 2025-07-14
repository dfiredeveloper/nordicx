import Image from 'next/image'
import React, { useEffect, useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { formatNumber } from '@/lib/utils'

interface LimitOrder {
    id: string
    symbol: string
    name: string
    type: 'buy' | 'sell'
    amount: number
    price: number
    total: number
    status: 'pending' | 'filled' | 'cancelled'
    createdAt: string
    logo?: string
}

export default function LimitBody() {
    const { address, isConnected } = useAccount()
    const [orders, setOrders] = useState<LimitOrder[]>([])
    const [loading, setLoading] = useState(false)

    const fetchLimitOrders = useCallback(async () => {
        if (!address) return
        setLoading(true)
        try {
            const response = await fetch(`/api/limit-orders?address=${address}`)
            const data = await response.json()
            if (data.success) {
                setOrders(data.orders)
            } else {
                setOrders([])
            }
        } catch (error) {
            console.error('Error fetching limit orders:', error)
            setOrders([])
        } finally {
            setLoading(false)
        }
    }, [address])

    useEffect(() => {
        if (isConnected && address) {
            fetchLimitOrders()
        } else {
            setOrders([])
        }
    }, [isConnected, address, fetchLimitOrders])

    if (!isConnected) {
        return (
            <tbody className="w-full absolute h-[250px] bg-accent-2 flex items-center justify-center">
                <tr>
                    <td colSpan={100} className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <Image src={"/nodata.svg"} width={70} height={70} alt='no data' />
                            <p className='text-accent-aux-1'>Connect Wallet to View Limit Orders</p>
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
                            <p className='text-accent-aux-1'>Loading Limit Orders...</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        )
    }

    if (orders.length === 0) {
  return (
            <tbody className="w-full absolute h-[250px] bg-accent-2 flex items-center justify-center">
                <tr>
                    <td colSpan={100} className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
            <Image src={"/nodata.svg"} width={70} height={70} alt='no data' />
                            <p className='text-accent-aux-1'>No Limit Orders Found</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        )
    }

    return (
        <tbody className="divide-y">
            {orders.map((order) => (
                <tr key={order.id} className="hover:bg-accent-3 transition-colors">
                    <td className="py-3 px-2 sticky left-0 z-[1] bg-accent-2">
                        <div className="flex items-center gap-2">
                            <div className="rounded-full border w-fit relative">
                                <Image 
                                    src={order.logo || "/static/3717.png"} 
                                    className='w-[30px] h-[30px]' 
                                    width={30} 
                                    height={30} 
                                    alt={order.name} 
                                    unoptimized 
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <h1 className="uppercase text-[14px] font-[400]">{order.name}</h1>
                                    <span className="text-xs text-accent-1">{order.symbol}</span>
                                </div>
                                <div className={`text-xs ${order.type === 'buy' ? 'text-accent-green' : 'text-accent-red'}`}>
                                    {order.type.toUpperCase()}
                                </div>
        </div>
      </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-1">
                            {formatNumber(order.amount)} {order.symbol}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-1">
                            ${formatNumber(order.price)}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-1">
                            ${formatNumber(order.total)}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className={`text-sm px-2 py-1 rounded-full w-fit ${
                            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            order.status === 'filled' ? 'bg-green-500/20 text-green-500' :
                            'bg-red-500/20 text-red-500'
                        }`}>
                            {order.status}
                        </div>
                    </td>
                    
                    <td className="py-3 px-2">
                        <div className="text-sm text-accent-aux-1">
                            {order.createdAt}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
  )
}
