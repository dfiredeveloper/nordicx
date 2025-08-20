import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_CHAINS } from '@/lib/trading/constants';
import RealTradingService from '@/lib/trading/realTradingService';

// Simple RPC connection test function
async function testRpcConnection(rpcUrl: string, chainName: string) {
  try {
    // Use fetch instead of ethers provider for more reliable connection
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    const blockNumber = parseInt(data.result, 16);
    console.log(`✅ Connected to ${chainName}: Block ${blockNumber}`);
    return { success: true, blockNumber };
  } catch (error: unknown) {
    console.error(`❌ RPC connection failed for ${chainName}:`, error);
    return { success: false, error };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Add detailed logging
    console.log('🔍 Real Swap API received request:');
    console.log('Body:', JSON.stringify(body, null, 2));
    
    const { 
      tokenIn,        // Frontend sends this
      tokenOut,       // Frontend sends this  
      amountIn,       // Frontend sends this
      slippage = 0.5,
      chainId = 1,
      userAddress,    // Optional for now
      execute = false // Whether to execute the swap or just get quote
    } = body;

    // Log individual parameters
    console.log('🔍 Parsed parameters:');
    console.log('- tokenIn:', tokenIn);
    console.log('- tokenOut:', tokenOut);
    console.log('- amountIn:', amountIn);
    console.log('- slippage:', slippage);
    console.log('- chainId:', chainId);
    console.log('- userAddress:', userAddress);
    console.log('- execute:', execute);

    // Validate required parameters
    if (!tokenIn || !tokenOut || !amountIn) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: tokenIn, tokenOut, and amountIn are required'
      }, { status: 400 });
    }

    // Get chain configuration
    const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);
    if (!chain) {
      return NextResponse.json({
        success: false,
        error: 'Unsupported chain'
      }, { status: 400 });
    }

    // Test RPC connection
    const rpcTest = await testRpcConnection(chain.rpcUrl, chain.name);
    if (!rpcTest.success) {
      console.log(`⚠️ Continuing with real trading despite RPC test failure`);
    }

    // Get real-time swap quote
    console.log('🔄 Getting real-time swap quote...');
    const realQuote = await RealTradingService.getBestQuote(
      tokenIn,
      tokenOut,
      amountIn,
      chainId,
      slippage
    );

    if (!realQuote.success) {
      console.log('⚠️ Real quote failed, falling back to simulation');
      // Fallback to simulation if real quote fails
      return NextResponse.json({
        success: true,
        message: 'Swap simulation successful (real quote unavailable)',
        data: {
          fromToken: tokenIn,
          toToken: tokenOut,
          amount: amountIn,
          estimatedOutput: (parseFloat(amountIn) * 0.98).toString(), // Mock 2% slippage
          gasEstimate: '150000',
          chainId,
          chainName: chain.name,
          slippage,
          timestamp: new Date().toISOString(),
          isSimulation: true
        }
      });
    }

    // If user wants to execute the swap
    if (execute && userAddress) {
      console.log('🚀 Executing real swap...');
      const swapExecution = await RealTradingService.executeSwap(
        realQuote,
        userAddress,
        chainId,
        slippage
      );

      if (swapExecution.success) {
        return NextResponse.json({
          success: true,
          message: 'Real swap execution successful',
          data: {
            ...realQuote,
            transactionData: swapExecution.transactionData,
            chainId,
            chainName: chain.name,
            slippage,
            timestamp: new Date().toISOString(),
            isRealExecution: true
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          error: `Swap execution failed: ${swapExecution.error}`
        }, { status: 500 });
      }
    }

    // Return real quote
    return NextResponse.json({
      success: true,
      message: 'Real swap quote successful',
      data: {
        ...realQuote,
        chainId,
        chainName: chain.name,
        slippage,
        timestamp: new Date().toISOString(),
        isRealQuote: true
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Real Swap API error:', error);
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}

// Test endpoint to verify RPC connections
export async function GET() {
  const results: Record<string, unknown> = {};
  
  for (const [chainName, chain] of Object.entries(SUPPORTED_CHAINS)) {
    const rpcTest = await testRpcConnection(chain.rpcUrl, chain.name);
    
    if (rpcTest.success) {
      results[chainName] = {
        status: '✅ Connected',
        blockNumber: rpcTest.blockNumber?.toString() || 'Unknown',
        rpcUrl: chain.rpcUrl
      };
    } else {
      results[chainName] = {
        status: '❌ Failed',
        error: rpcTest.error instanceof Error ? rpcTest.error.message : 'Unknown error',
        rpcUrl: chain.rpcUrl
      };
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results
  });
}
