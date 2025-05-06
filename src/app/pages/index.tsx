'use client';

import Header from '../components/Header';
import TokenPriceCard from '../components/TokenPriceCard';
import TokenChart from '../components/TokenChart';
import WalletConnectButton from '../components/WalletConnectButton';


export default function Home() {
  return (
    <div>
      <Header />
      <main className="p-8">
        <div className="flex justify-end mb-4">
          <WalletConnectButton />
        </div>
     
        <h1 className="text-3xl font-bold mb-4">Crypto Market Overview</h1>
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
