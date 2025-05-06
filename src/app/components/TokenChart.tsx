'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const timeRanges = [
  { label: "1D", value: 1 },
  { label: "7D", value: 7 },
  { label: "1M", value: 30 },
  { label: "3M", value: 90 },
  { label: "1Y", value: 365 },
  { label: "All", value: "max" }
];

type ChartDataPoint = {
  date: string;
  price: number;
  formattedDate: string;
};

type TokenChartProps = {
  coingeckoId: string;
  tokenName?: string;
};

export default function TokenChart({ coingeckoId, tokenName = "Token" }: TokenChartProps) {
  const [days, setDays] = useState<number | string>(7);
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${days}`
        );
        
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }
        
        const json = await res.json();
        
        const formattedData = json.prices.map(([timestamp, price]: [number, number]) => ({
          date: new Date(timestamp).toISOString(),
          price: Number(price.toFixed(4)),
          formattedDate: new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: typeof days === 'number' && days > 90 ? 'numeric' : undefined
          })
        }));
        
        setData(formattedData);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
        if (retryCount < 3) {
          // Auto-retry after 2 seconds
          setTimeout(() => setRetryCount(c => c + 1), 2000);
        } else {
          setError('Failed to load price data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [coingeckoId, days, retryCount]);

  // Calculate price change with proper parentheses
  const priceChange = data.length > 1 
    ? ((data[data.length - 1].price - data[0].price) / data[0].price * 100)
    : 0;

  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-4 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {tokenName} Price Chart
          </h3>
          {data.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTooltip(data[data.length - 1].price)}
              </span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                priceChange >= 0 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {timeRanges.map(range => (
            <button
              key={range.value}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                days === range.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
              }`}
              onClick={() => setDays(range.value)}
              disabled={isLoading}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-[250px] flex items-center justify-center">
          <div className="animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 w-full h-full" />
        </div>
      ) : error ? (
        <div className="h-[250px] flex flex-col items-center justify-center text-red-500 dark:text-red-400 gap-2">
          <span>{error}</span>
          <button 
            onClick={() => setRetryCount(0)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" strokeOpacity={0.2} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip 
              formatter={(value) => [formatTooltip(Number(value)), 'Price']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#eee',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}