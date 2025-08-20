import { NextRequest, NextResponse } from 'next/server';
import TransactionService from '@/lib/trading/transactionService';
import RealTradingService from '@/lib/trading/realTradingService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      quote, 
      userAddress, 
      chainId, 
      slippage = 1,
      execute = false 
    } = body;
    
    if (!quote || !userAddress || !chainId) {
      return NextResponse.json({
        success: false,
        error: 'Quote, userAddress, and chainId are required'
      }, { status: 400 });
    }

    console.log('🚀 Execute API request:', { 
      userAddress, 
      chainId, 
      slippage, 
      execute,
      quoteProvider: quote.provider 
    });

    if (execute) {
      // Execute the actual swap
      console.log('🚀 Executing real swap transaction...');
      
      // First prepare the transaction
      const preparedTx = await TransactionService.prepareTransaction(
        quote,
        userAddress,
        chainId,
        slippage
      );

      if (!preparedTx.success) {
        return NextResponse.json({
          success: false,
          error: `Transaction preparation failed: ${preparedTx.error}`
        }, { status: 500 });
      }

      // Execute the transaction
      const execution = await TransactionService.executeTransaction(
        preparedTx.transaction,
        userAddress,
        chainId
      );

      if (execution.success) {
        return NextResponse.json({
          success: true,
          message: 'Swap execution successful',
          data: {
            transactionHash: execution.transactionHash,
            status: execution.status,
            quote: quote,
            chainId,
            slippage,
            timestamp: new Date().toISOString(),
            isRealExecution: true
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          error: `Transaction execution failed: ${execution.error}`
        }, { status: 500 });
      }
    } else {
      // Just prepare the transaction without executing
      console.log('📋 Preparing transaction data...');
      
      const preparedTx = await TransactionService.prepareTransaction(
        quote,
        userAddress,
        chainId,
        slippage
      );

      if (preparedTx.success) {
        return NextResponse.json({
          success: true,
          message: 'Transaction prepared successfully',
          data: {
            transaction: preparedTx.transaction,
            quote: quote,
            chainId,
            slippage,
            timestamp: new Date().toISOString(),
            isPrepared: true
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          error: `Transaction preparation failed: ${preparedTx.error}`
        }, { status: 500 });
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Execute API error:', error);
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txHash = searchParams.get('txHash');
    const chainId = parseInt(searchParams.get('chainId') || '1');
    
    if (!txHash) {
      return NextResponse.json({
        success: false,
        error: 'Transaction hash is required'
      }, { status: 400 });
    }

    console.log('🔍 Transaction Status request:', { txHash, chainId });

    const result = await TransactionService.getTransactionStatus(txHash, chainId);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          txHash,
          chainId,
          status: result.status,
          confirmations: result.confirmations,
          blockNumber: result.blockNumber,
          gasUsed: result.gasUsed,
          effectiveGasPrice: result.effectiveGasPrice,
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
    console.error('Transaction Status API error:', error);
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
