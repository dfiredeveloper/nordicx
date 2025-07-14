import { NextRequest, NextResponse } from 'next/server'

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
        const mockStrategies: TradingStrategy[] = [
            {
                id: '1',
                name: 'ETH DCA Strategy',
                type: 'dca',
                symbol: 'ETH',
                status: 'active',
                totalProfit: 850,
                totalTrades: 24,
                successRate: 87,
                createdAt: '2 weeks ago',
                logo: '/static/ether.webp'
            },
            {
                id: '2',
                name: 'PEPE Grid Bot',
                type: 'grid',
                symbol: 'PEPE',
                status: 'paused',
                totalProfit: -15,
                totalTrades: 156,
                successRate: 92,
                createdAt: '1 month ago',
                logo: '/static/3717.png'
            },
            {
                id: '3',
                name: 'SOL Momentum',
                type: 'momentum',
                symbol: 'SOL',
                status: 'completed',
                totalProfit: 320,
                totalTrades: 8,
                successRate: 75,
                createdAt: '3 weeks ago',
                logo: '/static/solana.webp'
            }
        ]

        return NextResponse.json({
            success: true,
            strategies: mockStrategies
        })

    } catch (error) {
        console.error('Error fetching strategies:', error)
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch strategies' 
        }, { status: 500 })
    }
} 