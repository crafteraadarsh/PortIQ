import Header from '../components/Header';
import TokenCompareChart from '../components/TokenCompareChart';

export default function Compare() {
  return (
    <div>
      <Header />
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Compare Tokens</h1>
        <TokenCompareChart />
      </main>
    </div>
  );
}
