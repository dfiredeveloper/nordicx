import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol } = req.query;
  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Missing symbol' });
  }

  try {
    // Expanded mapping of symbols to CoinGecko IDs
    const symbolToId: Record<string, string> = {
      // Major cryptocurrencies
      btc: 'bitcoin',
      eth: 'ethereum',
      sol: 'solana',
      ada: 'cardano',
      dot: 'polkadot',
      link: 'chainlink',
      uni: 'uniswap',
      matic: 'matic-network',
      avax: 'avalanche-2',
      atom: 'cosmos',
      ltc: 'litecoin',
      bch: 'bitcoin-cash',
      xrp: 'ripple',
      etc: 'ethereum-classic',
      xlm: 'stellar',
      algo: 'algorand',
      vet: 'vechain',
      icp: 'internet-computer',
      fil: 'filecoin',
      trx: 'tron',
      
      // DeFi tokens
      aave: 'aave',
      comp: 'compound-governance-token',
      sushi: 'sushi',
      crv: 'curve-dao-token',
      yfi: 'yearn-finance',
      snx: 'havven',
      bal: 'balancer',
      ren: 'republic-protocol',
      zrx: '0x',
      knc: 'kyber-network-crystal',
      band: 'band-protocol',
      oxt: 'orchid-protocol',
      enj: 'enjincoin',
      mana: 'decentraland',
      sand: 'the-sandbox',
      axs: 'axie-infinity',
      chz: 'chiliz',
      hot: 'holochain',
      bat: 'basic-attention-token',
      zil: 'zilliqa',
      one: 'harmony',
      iota: 'iota',
      neo: 'neo',
      qtum: 'qtum',
      waves: 'waves',
      nano: 'nano',
      xmr: 'monero',
      dash: 'dash',
      zec: 'zcash',
      
      // Meme coins and popular tokens
      pepe: 'pepe',
      shib: 'shiba-inu',
      doge: 'dogecoin',
      floki: 'floki',
      bonk: 'bonk',
      wif: 'dogwifhat',
      book: 'book-of-meme',
      myro: 'myro',
      popcat: 'popcat',
      cat: 'cat-in-a-dogs-world',
      turbo: 'turbo',
      dog: 'dog',
      moon: 'moon',
      safe: 'safe',
      baby: 'baby',
      rocket: 'rocket',
      star: 'star',
      fire: 'fire',
      burn: 'burn',
      
      // Layer 2 and scaling solutions
      arb: 'arbitrum',
      op: 'optimism',
      base: 'base',
      poly: 'polygon',
      bnb: 'binancecoin',
      cake: 'pancakeswap-token',
      bsw: 'biswap',
      wbnb: 'wbnb',
      
      // Gaming and metaverse
      gala: 'gala',
      ilv: 'illuvium',
      alice: 'my-neighbor-alice',
      hero: 'step-hero',
      c98: 'coin98',
      high: 'highstreet',
      cgg: 'chain-guardians',
      dg: 'decentral-games',
      vox: 'voxies',
      gst: 'green-satoshi-token',
      gmt: 'stepn',
      
      // AI and tech
      oai: 'openai',
      ai: 'artificial-intelligence',
      ml: 'machine-learning',
      data: 'data',
      api: 'api',
      web: 'web',
      app: 'app',
      dev: 'dev',
      tech: 'tech',
      
      // Common abbreviations
      usdt: 'tether',
      usdc: 'usd-coin',
      dai: 'dai',
      busd: 'binance-usd',
      tusd: 'true-usd',
      frax: 'frax',
      usdp: 'paxos-standard',
      fei: 'fei-usd',
      rai: 'rai',
      lusd: 'liquity-usd',
      susd: 'nusd',
      musd: 'musd',
      husd: 'husd',
      gusd: 'gemini-dollar',
      eurs: 'stasis-eurs',
      seur: 'seur',
      jeur: 'jeur',
      xsushi: 'xsushi',
      yvusdc: 'yvusdc',
      yvdai: 'yvdai',
      yvweth: 'yvweth',
      yvusdt: 'yvusdt',
      yvfrax: 'yvfrax',
      yvcrv: 'yvcrv',
      yvlink: 'yvlink',
      yvuni: 'yvuni',
      yvaave: 'yvaave',
      yvcomp: 'yvcomp',
      yvsnx: 'yvsnx',
      yvbal: 'yvbal',
      yvren: 'yvren',
      yvzrx: 'yvzrx',
      yvknc: 'yvknc',
      yvband: 'yvband',
      yvoxt: 'yvoxt',
      yvenj: 'yvenj',
      yvmana: 'yvmana',
      yvsand: 'yvsand',
      yvaxs: 'yvaxs',
      yvchz: 'yvchz',
      yvhot: 'yvhot',
      yvbat: 'yvbat',
      yvzil: 'yvzil',
      yvone: 'yvone',
      yviota: 'yviota',
      yvneo: 'yvneo',
      yvqtum: 'yvqtum',
      yvwaves: 'yvwaves',
      yvnano: 'yvnano',
      yvxmr: 'yvxmr',
      yvdash: 'yvdash',
      yvzec: 'yvzec',
    };
    
    const id = symbolToId[symbol.toLowerCase()];
    if (!id) {
      // For unsupported tokens, return error but don't crash
      return res.status(404).json({ 
        success: false, 
        error: `Token ${symbol} not supported in demo. Supported tokens: ${Object.keys(symbolToId).slice(0, 20).join(', ')}...` 
      });
    }
    
    // Fetch 7d price history (hourly)
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=hourly`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ 
        success: false, 
        error: `Failed to fetch from CoinGecko for ${symbol} (${id})` 
      });
    }
    const data = await response.json();
    // data.prices is an array of [timestamp, price]
    const prices = data.prices.map((p: [number, number]) => p[1]);
    res.status(200).json({ success: true, prices });
  } catch (error) {
    console.error(`Error fetching sparkline for ${symbol}:`, error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
} 