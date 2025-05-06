'use client';

import React, { useState, useEffect } from 'react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

const CoinSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteCoins, setFavoriteCoins] = useState<Coin[]>(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favoriteCoins');
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    }
    return [];
  });

  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch coins: ${res.status}`);
        }
        const data: Coin[] = await res.json();
        setCoins(data);
        setFilteredCoins(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    const filterCoins = () => {
      const filtered = coins.filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCoins(filtered);
    };

    filterCoins();
  }, [searchTerm, coins]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleFavorite = (coin: Coin) => {
    const isFavorite = favoriteCoins.some((favCoin) => favCoin.id === coin.id);

    if (isFavorite) {
      const updatedFavorites = favoriteCoins.filter((favCoin) => favCoin.id !== coin.id);
      setFavoriteCoins(updatedFavorites);
      localStorage.setItem('favoriteCoins', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favoriteCoins, coin];
      setFavoriteCoins(updatedFavorites);
      localStorage.setItem('favoriteCoins', JSON.stringify(updatedFavorites));
    }
  };

  if (isLoading) {
    return <p>Loading coins...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search coins..."
        className="w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSearch}
      />
      {filteredCoins.length > 0 && (
        <ul>
          {filteredCoins.map((coin) => (
            <li key={coin.id} className="flex items-center justify-between">
              <div>
                {coin.name} ({coin.symbol}): ${coin.current_price}
              </div>
              <button onClick={() => toggleFavorite(coin)}>
                {favoriteCoins.some((favCoin) => favCoin.id === coin.id) ? 'Unpin' : 'Pin'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoinSearch;