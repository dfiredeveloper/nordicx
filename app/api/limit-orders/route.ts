import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')

        if (!address) {
            return NextResponse.json({ 
                success: false, 
                error: 'Address parameter is required' 
            }, { status: 400 })
        }

        // Mock data for demonstration - replace with real blockchain calls
        const mockOrders: LimitOrder[] = [
            {
                id: '1',
                symbol: 'ETH',
                name: 'Ethereum',
                type: 'buy',
                amount: 1.5,
                price: 3100,
                total: 4650,
                status: 'pending',
                createdAt: '2 hours ago',
                logo: '/static/ether.webp'
            },
            {
                id: '2',
                symbol: 'PEPE',
                name: 'Pepe',
                type: 'sell',
                amount: 500000,
                price: 0.000009,
                total: 4.5,
                status: 'filled',
                createdAt: '1 day ago',
                logo: '/static/3717.png'
            },
            {
                id: '3',
                symbol: 'SOL',
                name: 'Solana',
                type: 'buy',
                amount: 10,
                price: 90,
                total: 900,
                status: 'cancelled',
                createdAt: '3 days ago',
                logo: '/static/solana.webp'
            }
        ]

        return NextResponse.json({
            success: true,
            orders: mockOrders
        })

    } catch (error) {
        console.error('Error fetching limit orders:', error)
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch limit orders' 
        }, { status: 500 })
    }
} 