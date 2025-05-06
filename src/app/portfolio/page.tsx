import Header from '../components/Header';
import PortfolioOverview from '../components/PortfolioOverview';
import WalletConnectButton from '../components/WalletConnectButton';
export default function Portfolio() {
  return (
    <div>
      <Header />
      <main className="p-8">
        <div className="flex justify-end mb-4">
        </div>
        <WalletConnectButton/>
        <PortfolioOverview />
      </main>
    </div>
  );
}
