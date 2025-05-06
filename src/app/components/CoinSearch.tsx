'use client';

import React, { useState, useEffect, useRef } from 'react';

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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setIsDropdownVisible(true);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <p>Loading coins...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search coins..."
        className="w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSearch}
        ref={searchInputRef}
      />
      {isDropdownVisible && filteredCoins.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white dark:bg-gray-800 z-10"
        >
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-md shadow-sm">
            {filteredCoins.map((coin) => (
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
                  <button
                    onClick={() => toggleFavorite(coin)}
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {favoriteCoins.some((favCoin) => favCoin.id === coin.id) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM10.5 17.25a.75.75 0 001.5 0v-2.625H14.25a.75.75 0 000-1.5H12v-2.625a.75.75 0 00-1.5 0V13.5H9.75a.75.75 0 000 1.5h2.25v2.625z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoinSearch;