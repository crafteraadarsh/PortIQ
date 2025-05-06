'use client'
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { scaleTime } from 'd3-scale'

const AdvancedTokenAnalytics = ({ coinId }: { coinId: string }) => {
  const [data, setData] = useState<any[]>([])
  const [indicators, setIndicators] = useState({
    sma: true,
    ema: false,
    rsi: false,
    macd: false
  })

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=30`
      )
      const json = await res.json()
      const formatted = json.map(([date, open, high, low, close]: number[]) => ({
        date: new Date(date),
        open,
        high,
        low,
        close,
        volume: 0
      }))
      setData(formatted)
    }
    fetchData()
  }, [coinId])

  // SMA calculation
  const calculateSMA = (data: any[], period: number) => {
    return data.map((d, index) => {
      if (index < period - 1) return { date: d.date, sma: null }
      const sma = data.slice(index - period + 1, index + 1).reduce((sum, d) => sum + d.close, 0) / period
      return { date: d.date, sma }
    })
  }

  // EMA calculation
  const calculateEMA = (data: any[], period: number) => {
    const k = 2 / (period + 1)
    let ema = data[0].close
    return data.map((d, index) => {
      if (index === 0) return { date: d.date, ema }
      ema = (d.close - ema) * k + ema
      return { date: d.date, ema }
    })
  }

  const smaData = indicators.sma ? calculateSMA(data, 14) : []
  const emaData = indicators.ema ? calculateEMA(data, 14) : []

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <button onClick={() => setIndicators({ ...indicators, sma: !indicators.sma })} 
          className={`px-3 py-1 rounded ${indicators.sma ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          SMA
        </button>
        <button onClick={() => setIndicators({ ...indicators, ema: !indicators.ema })}
          className={`px-3 py-1 rounded ${indicators.ema ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          EMA
        </button>
      </div>

      {data.length > 0 && (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" scale="time" type="number" domain={['dataMin', 'dataMax']} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
              {indicators.sma && <Line type="monotone" dataKey="sma" stroke="#82ca9d" dot={false} />}
              {indicators.ema && <Line type="monotone" dataKey="ema" stroke="#ff7300" dot={false} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default AdvancedTokenAnalytics
