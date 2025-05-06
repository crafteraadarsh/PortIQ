'use client'
import { useState, useEffect } from 'react'

interface Suggestion {
  fromToken: string
  toToken: string
  amount: number
  potentialGain: number
  confidence: number
}

const SwapSuggestions = ({ portfolio }: { portfolio: any[] }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const analyzePortfolio = async () => {
      setIsLoading(true)
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock suggestions (replace with actual AI logic)
      const mockSuggestions = [
        {
          fromToken: 'SOL',
          toToken: 'ETH',
          amount: 20,
          potentialGain: 8.5,
          confidence: 75
        },
        {
          fromToken: 'USDC',
          toToken: 'BTC',
          amount: 15,
          potentialGain: 5.2,
          confidence: 65
        }
      ]
      
      setSuggestions(mockSuggestions)
      setIsLoading(false)
    }

    analyzePortfolio()
  }, [portfolio])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Smart Swap Suggestions</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          AI-powered suggestions to optimize your portfolio.
        </p>
      </div>
      {isLoading ? (
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      ) : suggestions.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="px-4 py-4 sm:px-6">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Swap {suggestion.amount}% {suggestion.fromToken} → {suggestion.toToken}
                </p>
                <p className={`text-sm font-semibold ${suggestion.potentialGain > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  +{suggestion.potentialGain}%
                </p>
              </div>
              <div className="mt-2 flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${suggestion.confidence}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{suggestion.confidence}% confidence</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">No swap suggestions available</p>
        </div>
      )}
    </div>
  )
}

export default SwapSuggestions