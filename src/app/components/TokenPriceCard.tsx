'use client';
import { useEffect, useState } from 'react';

interface TokenPriceCardProps {
  symbol: string;
  name: string;
  coingeckoId: string;
  className?: string;
}

export default function TokenPriceCard({ 
  symbol, 
  name, 
  coingeckoId,
  className = '' 
}: TokenPriceCardProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchPrice = async () => {
    if (!coingeckoId) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd&include_24hr_change=true`
      );
      
      if (!res.ok) throw new Error('Failed to fetch price');
      
      const data = await res.json();
      setPrice(data[coingeckoId]?.usd);
      setChange(data[coingeckoId]?.usd_24h_change);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load price data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [coingeckoId]);

  const formatPrice = (value: number | null) => {
    if (value === null) return '...';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
  };

  const isPositive = change !== null && change > 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBg = isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const changeText = isPositive ? 'Rising' : 'Falling';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {name} <span className="text-gray-500 dark:text-gray-400">({symbol})</span>
          </h3>
        </div>
        <button 
          onClick={fetchPrice}
          disabled={isLoading}
          className={`p-1 rounded-full ${isLoading ? 'animate-spin' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          aria-label="Refresh price"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-gray-500 dark:text-gray-400"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </button>
      </div>

      {error ? (
        <div className="text-red-500 dark:text-red-400 text-center py-4">
          {error}
          <button 
            onClick={fetchPrice}
            className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 mx-auto"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold my-3 text-gray-900 dark:text-white">
            {formatPrice(price)}
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
              {isPositive ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="m19 12-7 7-7-7" />
                  <path d="M12 5v14" />
                </svg>
              )}
              <span>{change !== null ? `${Math.abs(change).toFixed(2)}%` : '...'}</span>
            </div>
            
            <span className={`text-xs px-2 py-1 rounded-full ${changeColor} ${changeBg}`}>
              {changeText}
            </span>
          </div>
          
          {lastUpdated && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-right">
              Updated: {lastUpdated}
            </div>
          )}
        </>
      )}
    </div>
  );
}