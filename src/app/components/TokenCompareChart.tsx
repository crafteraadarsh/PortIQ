'use client';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';

type Token = {
  name: string;
  id: string;
  color: string;
};

type ChartDataPoint = {
  date: string;
  formattedDate: string;
  [key: string]: string | number;
};

const tokens: Token[] = [
  { name: "Ethereum", id: "ethereum", color: "#6366f1" },
  { name: "Bitcoin", id: "bitcoin", color: "#f59e0b" },
  { name: "Solana", id: "solana", color: "#10b981" },
];

const timeRanges = [
  { label: "1D", value: 1 },
  { label: "7D", value: 7 },
  { label: "1M", value: 30 },
  { label: "3M", value: 90 },
  { label: "1Y", value: 365 },
  { label: "All", value: "max" }
];

export default function TokenCompareChart() {
  const [days, setDays] = useState<number | string>(7);
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const results = await Promise.all(
          tokens.map(async (t) => {
            const res = await fetch(
              `https://api.coingecko.com/api/v3/coins/${t.id}/market_chart?vs_currency=usd&days=${days}`
            );
            if (!res.ok) throw new Error(`Failed to fetch ${t.name} data`);
            const json = await res.json();
            return json.prices.map(([timestamp, price]: [number, number]) => ({
              date: new Date(timestamp).toISOString(),
              formattedDate: new Date(timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: typeof days === 'number' && days > 30 ? 'numeric' : undefined
              }),
              [t.name]: price,
            }));
          })
        );

        // Merge data by date
        const merged: Record<string, ChartDataPoint> = {};
        results.forEach((tokenData: ChartDataPoint[]) => {
          tokenData.forEach((d: ChartDataPoint) => {
            if (!merged[d.date]) {
              merged[d.date] = { 
                date: d.date,
                formattedDate: d.formattedDate
              };
            }
            Object.assign(merged[d.date], d);
          });
        });

        setData(Object.values(merged));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load chart data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [days]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-4 h-[350px]">
        <div className="animate-pulse flex flex-col h-full">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i: number) => (
              <div key={i} className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            ))}
          </div>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-4 h-[350px] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-center">{error}</div>
        <button 
          onClick={() => {
            setError(null);
            setIsLoading(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-4 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Token Performance Comparison
        </h2>
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range: { label: string; value: number | string }) => (
            <button
              key={range.value.toString()}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                days === range.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
              }`}
              onClick={() => setDays(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value: number) => `$${value}`}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip 
              formatter={(value: number) => [formatPrice(value), 'Price']}
              labelFormatter={(label: string) => `Date: ${label}`}
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#eee',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value: string) => (
                <span className="text-gray-700 dark:text-gray-300">{value}</span>
              )}
            />
            {tokens.map((t: Token) => (
              <Line
                key={t.name}
                type="monotone"
                dataKey={t.name}
                stroke={t.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={300}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}