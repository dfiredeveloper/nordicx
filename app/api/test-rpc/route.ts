import { NextResponse } from 'next/server';
import { SUPPORTED_CHAINS } from '@/lib/trading/constants';

export async function GET() {
  const results: any = {};
  
  for (const [chainName, chain] of Object.entries(SUPPORTED_CHAINS)) {
    try {
      console.log(`Testing ${chainName}: ${chain.rpcUrl}`);
      
      // Test RPC connection using direct HTTP request
      const response = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        }),
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          results[chainName] = {
            status: '✅ Connected',
            blockNumber: data.result,
            rpcUrl: chain.rpcUrl,
            method: 'eth_blockNumber'
          };
        } else {
          results[chainName] = {
            status: '❌ Invalid Response',
            error: data.error || 'No result in response',
            rpcUrl: chain.rpcUrl
          };
        }
      } else {
        results[chainName] = {
          status: '❌ HTTP Error',
          error: `HTTP ${response.status}: ${response.statusText}`,
          rpcUrl: chain.rpcUrl
        };
      }
    } catch (error: any) {
      results[chainName] = {
        status: '❌ Failed',
        error: error.message || 'Unknown error',
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
