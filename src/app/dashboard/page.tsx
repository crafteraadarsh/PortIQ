'use client';

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Favorites</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Your favorite coins.
        </p>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {favoriteCoins.map((coin) => (
          <li
            key={coin.id}
            className="flex items-center justify-between py-3 px-5 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{coin.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-300">${coin.current_price.toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
