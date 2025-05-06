import AdvancedTokenAnalytics from '../components/AdvancedTokenAnalytics'
import SwapSuggestions from '../components/SwapSuggestions'
import PredictiveTrends from '../components/PredictiveTrends'
import EnhancedPortfolioOverview from '../components/EnhancedPortfolioOverview'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <div className="lg:col-span-2">
        <EnhancedPortfolioOverview />
      </div>
      
      
      <div className="space-y-6">
        <AdvancedTokenAnalytics coinId="ethereum" />
        <PredictiveTrends coinId="ethereum" />
      </div>
      
      <div className="space-y-6">
        <SwapSuggestions portfolio={[]} />
        {/* Add other components as needed */}
      </div>
    </div>
  )
}
