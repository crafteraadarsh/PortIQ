'use client'
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

interface TokenBalance {
  symbol: string;
  balance: string;
  valueUSD: number;
  change24h: number;
}

const WalletConnectButton = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTokenBalances = async (walletAddress: string) => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API calls in production
      const mockTokens: TokenBalance[] = [
        { symbol: 'ETH', balance: '1.42', valueUSD: 4200, change24h: 2.5 },
        { symbol: 'SOL', balance: '25.3', valueUSD: 3200, change24h: -1.8 },
        { symbol: 'USDC', balance: '500', valueUSD: 500, change24h: 0.01 }
      ];
      
      setTokenBalances(mockTokens);
      setPortfolioValue(mockTokens.reduce((sum, token) => sum + token.valueUSD, 0));
    } catch (err) {
      console.error('Error fetching balances:', err);
      setError('Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (accounts.length === 0) throw new Error('No accounts found');

        setAddress(accounts[0]);
        setIsConnected(true);
        setError(null);
        fetchTokenBalances(accounts[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection failed');
      }
    } else {
      setError('Install MetaMask or WalletConnect');
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    setTokenBalances([]);
    setPortfolioValue(0);
  };

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            fetchTokenBalances(accounts[0]);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      }
    };
    checkWalletConnection();
  }, []);

  if (isConnected && address) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={copyToClipboard}
            title={address}
          >
            <span className={`bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-mono ${
              isCopied ? 'text-green-500' : 'text-gray-800 dark:text-gray-200'
            }`}>
              {isCopied ? 'Copied!' : `${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
            <svg 
              className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </div>
          <button
            onClick={disconnectWallet}
            className="flex items-center text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-300 px-3 py-1 rounded-full transition-colors"
          >
            Disconnect
            <svg 
              className="w-4 h-4 ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading portfolio...</p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Portfolio Value: <span className="font-bold">${portfolioValue.toLocaleString()}</span>
            </h3>
            
            <div className="space-y-3 mt-4">
              {tokenBalances.map((token) => (
                <div key={token.symbol} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {token.symbol}
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-white">
                      {token.balance} {token.symbol}
                    </div>
                    <div className={`text-sm ${
                      token.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {token.change24h >= 0 ? '↑' : '↓'} {Math.abs(token.change24h)}% · ${token.valueUSD.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={connectWallet}
        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg transition-colors"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Connect Wallet
      </button>
      {error && (
        <div className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm max-w-xs mx-auto">
          {error}
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;