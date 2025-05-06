'use client';

import TokenPriceCard from '../components/TokenPriceCard';
import TokenChart from '../components/TokenChart';

export default function HomePage() {
  return (
    <div>
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TokenPriceCard symbol="ETH" name="Ethereum" coingeckoId="ethereum" />
          <TokenPriceCard symbol="BTC" name="Bitcoin" coingeckoId="bitcoin" />
          <TokenPriceCard symbol="SOL" name="Solana" coingeckoId="solana" />
        </div>
        <TokenChart coingeckoId="ethereum" />
      </main>
    </div>
  );
}