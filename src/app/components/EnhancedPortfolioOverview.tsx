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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Portfolio Growth Analysis</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Overview of your portfolio performance over the last 7 and 30 days.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-4">
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 flex items-center justify-between">
          <div>
            <dt className="text-base font-normal text-gray-900 dark:text-gray-300">Total Value</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-700 dark:text-blue-300">${totalValue.toLocaleString()}</dd>
          </div>
          <svg className="h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 9.505a.75.75 0 00-1.09 0l-2.5 2.5a.75.75 0 101.06 1.06L6.75 11.06l2.22 2.22a.75.75 0 101.06-1.06l-2.5-2.5a.75.75 0 000-1.09zM15.453 9.505a.75.75 0 011.09 0l2.5 2.5a.75.75 0 01-1.06 1.06l-2.22-2.22 2.22-2.22a.75.75 0 010-1.09z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 flex items-center justify-between">
          <div>
            <dt className="text-base font-normal text-gray-900 dark:text-gray-300">7D Growth</dt>
            <dd className={`mt-1 text-3xl font-semibold ${totalGrowth7d >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {totalGrowth7d >= 0 ? '+' : ''}{totalGrowth7d.toFixed(2)}%
            </dd>
          </div>
          <svg className="h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 14.495a.75.75 0 00-1.09 0l-2.5-2.5a.75.75 0 001.06-1.06L6.75 12.94l2.22-2.22a.75.75 0 001.06 1.06l-2.5 2.5a.75.75 0 000 1.09zm6.906 0a.75.75 0 011.09 0l2.5-2.5a.75.75 0 01-1.06-1.06l-2.22 2.22 2.22 2.22a.75.75 0 010 1.09z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 flex items-center justify-between">
          <div>
            <dt className="text-base font-normal text-gray-900 dark:text-gray-300">30D Growth</dt>
            <dd className={`mt-1 text-3xl font-semibold ${totalGrowth30d >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {totalGrowth30d >= 0 ? '+' : ''}{totalGrowth30d.toFixed(2)}%
            </dd>
          </div>
          <svg className="h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 14.495a.75.75 0 00-1.09 0l-2.5-2.5a.75.75 0 001.06-1.06L6.75 12.94l2.22-2.22a.75.75 0 001.06 1.06l-2.5 2.5a.75.75 0 000 1.09zm6.906 0a.75.75 0 011.09 0l2.5-2.5a.75.75 0 01-1.06-1.06l-2.22 2.22 2.22 2.22a.75.75 0 010 1.09z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-300 sm:pl-6">Asset</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">Balance</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">Value</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">7D Growth</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">30D Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {portfolio.map((token) => (
              <tr key={token.symbol}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">{token.symbol}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">{token.balance.toFixed(4)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-right">${token.currentValue.toFixed(2)}</td>
                <td className={`whitespace-nowrap px-3 py-4 text-sm font-medium text-right ${token.growth7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.growth7d >= 0 ? '+' : ''}{token.growth7d.toFixed(2)}%
                </td>
                <td className={`whitespace-nowrap px-3 py-4 text-sm font-medium text-right ${token.growth30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
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