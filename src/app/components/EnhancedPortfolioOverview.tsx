'use client'
import { useEffect, useState } from 'react'

interface TokenGrowth {
  symbol: string
  balance: number
  currentValue: number
  value7d: number
  value30d: number
  growth7d: number
  growth30d: number
}

const EnhancedPortfolioOverview = () => {
  const [portfolio, setPortfolio] = useState<TokenGrowth[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [totalGrowth7d, setTotalGrowth7d] = useState(0)
  const [totalGrowth30d, setTotalGrowth30d] = useState(0)

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPortfolio = [
      {
        symbol: 'ETH',
        balance: 1.5,
        currentValue: 4500,
        value7d: 4200,
        value30d: 3800,
        growth7d: 7.14,
        growth30d: 18.42
      },
      {
        symbol: 'SOL',
        balance: 25,
        currentValue: 3750,
        value7d: 4000,
        value30d: 3000,
        growth7d: -6.25,
        growth30d: 25.00
      }
    ]

    const total = mockPortfolio.reduce((sum, t) => sum + t.currentValue, 0)
    const total7d = mockPortfolio.reduce((sum, t) => sum + t.value7d, 0)
    const total30d = mockPortfolio.reduce((sum, t) => sum + t.value30d, 0)
    
    setPortfolio(mockPortfolio)
    setTotalValue(total)
    setTotalGrowth7d(((total - total7d) / total7d) * 100)
    setTotalGrowth30d(((total - total30d) / total30d) * 100)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Portfolio Growth Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-gray-500 dark:text-gray-300">Total Value</div>
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-gray-500 dark:text-gray-300">7D Growth</div>
          <div className={`text-2xl font-bold ${totalGrowth7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalGrowth7d >= 0 ? '+' : ''}{totalGrowth7d.toFixed(2)}%
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-gray-500 dark:text-gray-300">30D Growth</div>
          <div className={`text-2xl font-bold ${totalGrowth30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalGrowth30d >= 0 ? '+' : ''}{totalGrowth30d.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2">Asset</th>
              <th className="text-right py-2">Balance</th>
              <th className="text-right py-2">Value</th>
              <th className="text-right py-2">7D Growth</th>
              <th className="text-right py-2">30D Growth</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((token, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 font-medium">{token.symbol}</td>
                <td className="text-right">{token.balance.toFixed(4)}</td>
                <td className="text-right">${token.currentValue.toFixed(2)}</td>
                <td className={`text-right ${token.growth7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.growth7d >= 0 ? '+' : ''}{token.growth7d.toFixed(2)}%
                </td>
                <td className={`text-right ${token.growth30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.growth30d >= 0 ? '+' : ''}{token.growth30d.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EnhancedPortfolioOverview