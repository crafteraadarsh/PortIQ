'use client'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface DataPoint {
  date: string
  price: number
  type: 'actual' | 'prediction'
}

const PredictiveTrends = ({ coinId }: { coinId: string }) => {
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([])
  const [predictionData, setPredictionData] = useState<DataPoint[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch historical data
        const histRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
        )
        const histJson = await histRes.json()
        const formattedHist = histJson.prices.map(([timestamp, price]: [number, number]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price,
          type: 'actual' as const
        }))
        
        // Generate mock predictions (replace with real model)
        const lastPrice = formattedHist[formattedHist.length - 1]?.price || 0
        const mockPredictions = [...Array(7)].map((_, i) => ({
          date: `Day +${i + 1}`,
          price: lastPrice * (1 + (Math.random() * 0.1 - 0.05)),
          type: 'prediction' as const
        }))
        
        setHistoricalData(formattedHist)
        setPredictionData(mockPredictions)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [coinId])

  const combinedData = [...historicalData, ...predictionData]

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">7-Day Price Forecast</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']} 
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={false}
              name="Price"
              strokeDasharray={combinedData[0]?.type === 'prediction' ? '5 5' : undefined}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#82ca9d" 
              strokeWidth={2}
              dot={false}
              name="Trend"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        <span className="inline-block w-3 h-3 bg-[#8884d8] mr-1"></span> Actual
        <span className="inline-block w-3 h-3 bg-[#82ca9d] ml-3 mr-1"></span> Predicted
      </div>
    </div>
  )
}

export default PredictiveTrends