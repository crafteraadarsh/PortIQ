"use client";

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';


export default function Home() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          // Replace with actual token fetching logic
          const mockTokens = [
            { symbol: 'ETH', name: 'Ethereum' },
            { symbol: 'BTC', name: 'Bitcoin' },
            { symbol: 'SOL', name: 'Solana' },
          ];
          setTokens(mockTokens);

        } catch (error) {
          console.error("MetaMask Connection Error:", error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    fetchTokens();
  }, []);

  return (
    <div>
      <main className="p-8">
        {account ? (
          <>
            <h2>Connected Account: {account}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tokens.map((token) => (
                <button
                  key={token.symbol}
                  className="p-4 border rounded-md hover:bg-gray-100"
                  onClick={() => alert(`Clicked on ${token.name}`)}
                >
                  <h3>{token.name}</h3>
                  <p>Symbol: {token.symbol}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p>Please connect your MetaMask wallet.</p>
        )}
      </main>
    </div>
  );
}
