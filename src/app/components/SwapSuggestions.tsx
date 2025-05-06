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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Smart Swap Suggestions</h3>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      ) : suggestions.length > 0 ? (
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">
                  Swap {suggestion.amount}% {suggestion.fromToken} → {suggestion.toToken}
                </span>
                <span className={`font-bold ${suggestion.potentialGain > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  +{suggestion.potentialGain}%
                </span>
              </div>
              <div className="mt-1 flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${suggestion.confidence}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-500">{suggestion.confidence}% confidence</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No swap suggestions available</p>
      )}
    </div>
  )
}

export default SwapSuggestions