"use client";

import React, { useState } from 'react';
import TokenPriceCard from '../components/TokenPriceCard';
import TokenChart from '../components/TokenChart';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock token data (replace with actual data fetching)
  const tokens = [
    { name: 'Ethereum', symbol: 'ETH', quantity: 1.5, value: 4500, network: 'Ethereum' },
    { name: 'Bitcoin', symbol: 'BTC', quantity: 0.2, value: 12000, network: 'Bitcoin' },
    { name: 'Solana', symbol: 'SOL', quantity: 25, value: 3750, network: 'Solana' },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <main className="p-8">
        <h2>My Tokens</h2>
        <input
          type="text"
          placeholder="Search tokens..."
          className="w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleSearch}
        />
        <ul>
          {tokens.map((token) => (
            <li key={token.symbol} className="p-4 border rounded-md">
              <h3>{token.name}</h3>
              <p>Symbol: {token.symbol}</p>
              <p>Quantity: {token.quantity}</p>
              <p>Value: {token.value}</p>
              <p>Network: {token.network}</p>
            </li>
          ))}
        </ul>
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
