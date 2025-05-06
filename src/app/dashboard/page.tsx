import AdvancedTokenAnalytics from '../components/AdvancedTokenAnalytics'
import SwapSuggestions from '../components/SwapSuggestions'
import PredictiveTrends from '../components/PredictiveTrends'
import EnhancedPortfolioOverview from '../components/EnhancedPortfolioOverview';
import React, { useState, useEffect } from 'react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <div className="lg:col-span-2">
        <EnhancedPortfolioOverview />
      </div>
      
      
      <div className="space-y-6">
        <AdvancedTokenAnalytics coinId="ethereum" />
        <PredictiveTrends coinId="ethereum" />
      </div>
      
      <div className="space-y-6">
        <SwapSuggestions portfolio={[]} />
        {/* Add other components as needed */}
      </div>
      {/* Favorites Section */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Favorites</h2>
        <FavoriteCoinsList />
      </div>
    </div>
  );
}

const FavoriteCoinsList = () => {
  const [favoriteCoins, setFavoriteCoins] = useState<Coin[]>(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favoriteCoins');
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    }
    return [];
  });

  if (favoriteCoins.length === 0) {
    return <p>No favorite coins yet.</p>;
  }

  return (
    <ul>
      {favoriteCoins.map((coin) => (
        <li key={coin.id} className="flex items-center justify-between">
          <div>
            {coin.name} ({coin.symbol}): ${coin.current_price}
          </div>
        </li>
      ))}
    </ul>
  );
};
