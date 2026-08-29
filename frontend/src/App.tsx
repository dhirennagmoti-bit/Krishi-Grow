import React, { useEffect } from 'react';
import { ToastProvider } from './components/Toast';
import { Bot, ScanLine } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CropScannerModal } from './components/CropScannerModal';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { AddCropPage } from './pages/AddCropPage';
import { SolutionsHub } from './pages/SolutionsHub';
import { TransportCalculatorPage } from './pages/TransportCalculatorPage';
import { WeatherPage } from './pages/WeatherPage';
import { StorageProcessingPage } from './pages/StorageProcessingPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { ProductRecommendationsPage } from './pages/ProductRecommendationsPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { BuyerConnectionsPage } from './pages/BuyerConnectionsPage';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { BuyerRequirementsPage } from './pages/BuyerRequirementsPage';
import { FindFarmersPage } from './pages/FindFarmersPage';
import { ProfilePage } from './pages/ProfilePage';
import { LossesPreventionPage } from './pages/LossesPreventionPage';
import { CustomerSupportPage } from './pages/CustomerSupportPage';
import { ScrollCanvasBackground } from './components/ScrollCanvasBackground';

// Aggregator sub-pages
import { AggregatorFarmersPage } from './pages/aggregator/AggregatorFarmersPage';
import { AggregatorCollectionLogisticsPage } from './pages/aggregator/AggregatorCollectionLogisticsPage';
import { AggregatorWeighingQCPage } from './pages/aggregator/AggregatorWeighingQCPage';
import { AggregatorInventoryMarketPage } from './pages/aggregator/AggregatorInventoryMarketPage';

// Processor sub-pages
import { ProcessorDashboard } from './pages/processor/ProcessorDashboard';
import { ProcessorProductionMachinesPage } from './pages/processor/ProcessorProductionMachinesPage';
import { ProcessorWasteTraceabilityPage } from './pages/processor/ProcessorWasteTraceabilityPage';

// Wholesaler sub-pages
import { WholesalerDashboard } from './pages/wholesaler/WholesalerDashboard';
import { WholesalerMarketplaceSalesPage } from './pages/wholesaler/WholesalerMarketplaceSalesPage';
import { WholesalerCustomersLogisticsPage } from './pages/wholesaler/WholesalerCustomersLogisticsPage';

// ─── Farmer pages with proper role guard ───────────────────────────────────
const FARMER_TABS = [
  'farmer-dashboard', 'my-crops', 'add-crop', 'solutions', 'transport',
  'weather', 'storage-processing', 'schemes', 'products',
  'market-prices', 'buyer-connections', 'buyer-requirements',
  'losses-prevention', 'krishi-rakshak', 'pesticides', 'profile',
  'find-farmers', 'customer-support'
];

const BUYER_TABS = [
  'buyer-dashboard', 'aggregator-farmers', 'aggregator-collection',
  'aggregator-weighing-qc', 'aggregator-inventory-market',
  'processor-dashboard', 'processor-machines', 'processor-traceability',
  'wholesaler-dashboard', 'wholesaler-marketplace', 'wholesaler-customers',
  'find-farmers', 'market-prices', 'customer-support'
];

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsAIModalOpen, setIsScannerModalOpen, requireAuth, user } = useApp();

  const isDashboardView = activeTab !== 'landing';

  // Scroll to top on every tab change — fixes "stuck at bottom" issue
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Guard: if a buyer tabs into a farmer section or vice versa, redirect
  useEffect(() => {
    if (user.role === 'BUYER' && FARMER_TABS.includes(activeTab) && activeTab !== 'market-prices' && activeTab !== 'profile') {
      setActiveTab('buyer-dashboard');
    }
    if (user.role === 'FARMER' && BUYER_TABS.includes(activeTab) && activeTab !== 'market-prices' && activeTab !== 'find-farmers') {
      setActiveTab('farmer-dashboard');
    }
  }, [activeTab, user.role, setActiveTab]);

  return (
    <div className="min-h-screen flex flex-col text-white bg-transparent">
      <ScrollCanvasBackground />
      <Navbar />

      <div className="flex-1 flex w-full">
        {/* Render Sidebar only in dashboard views */}
        {isDashboardView && <Sidebar />}

        <main className={`flex-1 p-4 md:p-8 pb-16 md:pb-24 max-w-[1440px] mx-auto w-full ${isDashboardView ? 'lg:pl-6' : ''}`}>
          {activeTab === 'landing' && <LandingPage />}

          {/* ── Farmer Tabs ── */}
          {(activeTab === 'farmer-dashboard' || activeTab === 'my-crops') && <FarmerDashboard />}
          {activeTab === 'add-crop' && <AddCropPage />}
          {activeTab === 'solutions' && <SolutionsHub />}
          {activeTab === 'transport' && <TransportCalculatorPage />}
          {activeTab === 'weather' && <WeatherPage />}
          {activeTab === 'storage-processing' && <StorageProcessingPage />}
          {activeTab === 'schemes' && <GovernmentSchemesPage />}
          {activeTab === 'products' && <ProductRecommendationsPage />}
          {activeTab === 'buyer-connections' && <BuyerConnectionsPage />}
          {activeTab === 'buyer-requirements' && <BuyerRequirementsPage />}
          {(activeTab === 'losses-prevention' || activeTab === 'krishi-rakshak' || activeTab === 'pesticides') && <LossesPreventionPage />}
          {activeTab === 'profile' && <ProfilePage />}

          {/* ── Shared Tabs ── */}
          {activeTab === 'customer-support' && <CustomerSupportPage />}
          {activeTab === 'market-prices' && <MarketPricesPage />}
          {activeTab === 'find-farmers' && <FindFarmersPage />}

          {/* ── Buyer / Aggregator Tabs ── */}
          {activeTab === 'buyer-dashboard' && <BuyerDashboard />}
          {activeTab === 'aggregator-farmers' && <AggregatorFarmersPage />}
          {activeTab === 'aggregator-collection' && <AggregatorCollectionLogisticsPage />}
          {activeTab === 'aggregator-weighing-qc' && <AggregatorWeighingQCPage />}
          {activeTab === 'aggregator-inventory-market' && <AggregatorInventoryMarketPage />}

          {/* ── Processor Tabs ── */}
          {activeTab === 'processor-dashboard' && <ProcessorDashboard />}
          {activeTab === 'processor-machines' && <ProcessorProductionMachinesPage />}
          {activeTab === 'processor-traceability' && <ProcessorWasteTraceabilityPage />}

          {/* ── Wholesaler Tabs ── */}
          {activeTab === 'wholesaler-dashboard' && <WholesalerDashboard />}
          {activeTab === 'wholesaler-marketplace' && <WholesalerMarketplaceSalesPage />}
          {activeTab === 'wholesaler-customers' && <WholesalerCustomersLogisticsPage />}
        </main>
      </div>

      <Footer />

      {/* Global Modals */}
      <AIAssistantModal />
      <CropScannerModal />
      <AuthModal />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        <button
          onClick={() => requireAuth(() => setIsScannerModalOpen(true))}
          className="flex items-center gap-2 p-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full shadow-2xl transition-all hover:pr-5 group cursor-pointer border border-amber-400/40"
          title="Scan crop leaves or fruit for disease diagnosis"
        >
          <ScanLine className="w-6 h-6" />
          <span className="text-xs font-bold max-w-0 overflow-hidden opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap">
            AI Scanner
          </span>
        </button>

        <button
          onClick={() => requireAuth(() => setIsAIModalOpen(true))}
          className="flex items-center gap-2 p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all hover:pr-5 group cursor-pointer border border-emerald-400/40"
          title="AgriAI Assistant"
        >
          <Bot className="w-6 h-6" />
          <span className="text-xs font-bold max-w-0 overflow-hidden opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap">
            AgriAI Assistant
          </span>
        </button>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
