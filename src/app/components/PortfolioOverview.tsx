'use client'
import { useEffect, useState } from 'react';

interface Token {
  symbol: string;
  balance: number;
  value: number;
}

export default function PortfolioOverview() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // Check if wallet is connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsConnected(false);
        setAddress(null);
      } else {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (!isConnected || !address) return;

    async function fetchTokens() {
      try {
        // Fetch ETH balance
        const res = await fetch(
          `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`
        );
        const json = await res.json();
        const eth = Number(json.result) / 1e18;

        // Fetch ETH price
        const priceRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const priceJson = await priceRes.json();
        const ethPrice = priceJson.ethereum.usd;

        const ethValue = eth * ethPrice;
        setTokens([{ symbol: 'ETH', balance: eth, value: ethValue }]);
        setTotal(ethValue);
      } catch (error) {
        console.error('Failed to fetch tokens', error);
      }
    }

    fetchTokens();
  }, [address, isConnected]);

  if (!isConnected)
    return (
      <div className="text-gray-400 text-center italic mt-6">
        Connect your wallet to view your portfolio.
      </div>
    );

  return (
    <div className="portfolio-card max-w-md mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 mt-6 transition-all">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b border-blue-200 dark:border-blue-500 pb-2">
        Portfolio Overview
      </h2>

      <div className="text-gray-700 dark:text-gray-200 text-lg font-medium mb-4">
        Total Value:{' '}
        <span className="font-extrabold text-green-600 dark:text-green-400">
          ${total.toFixed(2)}
        </span>
      </div>

      <ul className="space-y-2">
        {tokens.map((t) => (
          <li
            key={t.symbol}
            className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <span className="font-semibold text-blue-500 dark:text-blue-300">
              {t.symbol}
            </span>
            <span className="text-right text-sm text-gray-600 dark:text-gray-300">
              {t.balance.toFixed(4)} <br />
              <span className="font-bold text-green-500">${t.value.toFixed(2)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}