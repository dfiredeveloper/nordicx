import { NextRequest, NextResponse } from 'next/server';
import PriceFeedService from '@/lib/trading/priceFeedService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenAddress = searchParams.get('token');
    const chainId = parseInt(searchParams.get('chainId') || '1');
    const multiple = searchParams.get('multiple') === 'true';
    
    if (!tokenAddress) {
      return NextResponse.json({
        success: false,
        error: 'Token address is required'
      }, { status: 400 });
    }

    console.log('🔍 Price API request:', { tokenAddress, chainId, multiple });

    if (multiple) {
      // Handle multiple token addresses
      const tokenAddresses = tokenAddress.split(',');
      const result = await PriceFeedService.getMultipleTokenPrices(tokenAddresses, chainId);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          data: result.prices,
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 500 });
      }
    } else {
      // Handle single token address
      const result = await PriceFeedService.getBestPrice(tokenAddress, chainId);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          data: {
            tokenAddress,
            chainId,
            price: result.price,
            source: result.source,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 500 });
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Price API error:', error);
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenAddress, chainId = 1, days = 7 } = body;
    
    if (!tokenAddress) {
      return NextResponse.json({
        success: false,
        error: 'Token address is required'
      }, { status: 400 });
    }

    console.log('🔍 Price History API request:', { tokenAddress, chainId, days });

    const result = await PriceFeedService.getPriceHistory(tokenAddress, chainId, days);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          tokenAddress,
          chainId,
          days,
          prices: result.prices,
          marketCaps: result.marketCaps,
          volumes: result.volumes,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Price History API error:', error);
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
