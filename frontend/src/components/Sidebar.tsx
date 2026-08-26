import React from 'react';
import {
  LayoutDashboard, Sprout, PlusCircle, Wrench, TrendingUp, Users,
  Bot, User, LogOut, FileText, Search, Truck, ShieldAlert,
  Scale, Package, Factory, Gauge, QrCode, Trash2, Store, DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { user, activeTab, setActiveTab, setIsAuthModalOpen, setIsAIModalOpen, switchBuyerType, logout, isAuthenticated } = useApp();

  const farmerItems = [
    { id: 'farmer-dashboard', label: 'Farmer Dashboard', icon: LayoutDashboard },
    { id: 'my-crops', label: 'My Crops', icon: Sprout },
    { id: 'add-crop', label: '+ Add Crop', icon: PlusCircle },
    { id: 'transport', label: 'Transport Calculator', icon: Truck },
    { id: 'solutions', label: 'Solutions Suite', icon: Wrench },
    { id: 'market-prices', label: 'Market Prices', icon: TrendingUp },
    { id: 'buyer-connections', label: 'Buyer Connections', icon: Users },
    { id: 'schemes', label: 'Govt Schemes', icon: FileText },
    { id: 'losses-prevention', label: 'Krishi Rakshak', icon: ShieldAlert },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  // Aggregator Sidebar
  const aggregatorItems = [
    { id: 'buyer-dashboard', label: 'Aggregator Command', icon: LayoutDashboard },
    { id: 'aggregator-farmers', label: 'Farmer Network CRM', icon: Users },
    { id: 'aggregator-collection', label: 'Harvest Collection', icon: Truck },
    { id: 'aggregator-weighing-qc', label: 'Weighing & QC Lab', icon: Scale },
    { id: 'aggregator-inventory-market', label: 'Warehouse & Selling', icon: Package },
    { id: 'market-prices', label: 'APMC Market Prices', icon: TrendingUp },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  // Processor Sidebar
  const processorItems = [
    { id: 'processor-dashboard', label: 'Processor Command', icon: LayoutDashboard },
    { id: 'processor-machines', label: 'Machine Telemetry & Pack', icon: Factory },
    { id: 'processor-traceability', label: 'QR Trace & Zero Waste', icon: QrCode },
    { id: 'find-farmers', label: 'Procure Agri Batches', icon: Search },
    { id: 'market-prices', label: 'APMC Market Prices', icon: TrendingUp },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  // Wholesaler Sidebar
  const wholesalerItems = [
    { id: 'wholesaler-dashboard', label: 'Wholesale Command', icon: LayoutDashboard },
    { id: 'wholesaler-marketplace', label: 'Bulk Lots & Sales Orders', icon: Store },
    { id: 'wholesaler-customers', label: 'Client CRM & Dispatch', icon: Users },
    { id: 'market-prices', label: 'APMC Market Prices', icon: TrendingUp },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const currentItems = user.role === 'FARMER'
    ? farmerItems
    : user.buyerType === 'PROCESSOR'
    ? processorItems
    : user.buyerType === 'WHOLESALER'
    ? wholesalerItems
    : aggregatorItems;

  return (
    <aside className="group w-20 hover:w-64 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] px-3 py-4 sticky top-16 z-50 overflow-x-hidden shadow-2xl">
      <div className="space-y-6">
        
        {/* User Card info */}
        <div className="bg-white/5 p-2 rounded-2xl border border-white/10 flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all duration-300 w-full">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-300">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            <span className="text-xs font-bold text-white truncate">{user.name}</span>
            <span className="text-[10px] text-emerald-400 font-medium capitalize">
              {user.role === 'FARMER' ? `Farmer • ${user.district}` : `${user.buyerType} • ${user.district}`}
            </span>
          </div>
        </div>

        {/* Role Quick Switcher (when in Buyer mode) */}
        {user.role === 'BUYER' && (
          <div className="space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider px-2 block">
              Switch Supply Chain Role
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-black/60 rounded-xl border border-white/10 text-[10px] font-bold">
              <button
                onClick={() => switchBuyerType('AGGREGATOR')}
                className={`py-1 rounded-lg transition-all cursor-pointer text-center ${
                  user.buyerType === 'AGGREGATOR' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Aggr
              </button>
              <button
                onClick={() => switchBuyerType('PROCESSOR')}
                className={`py-1 rounded-lg transition-all cursor-pointer text-center ${
                  user.buyerType === 'PROCESSOR' ? 'bg-cyan-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Proc
              </button>
              <button
                onClick={() => switchBuyerType('WHOLESALER')}
                className={`py-1 rounded-lg transition-all cursor-pointer text-center ${
                  user.buyerType === 'WHOLESALER' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Whol
              </button>
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap h-4">
            Navigation Menu
          </div>
          {currentItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-2 rounded-2xl text-xs font-semibold transition-all overflow-hidden cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 font-bold border border-emerald-500/50'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                title={item.label}
              >
                <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-neutral-400 group-hover/btn:text-white'}`} />
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer AI assistant launcher */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="w-full flex items-center justify-between p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-2xl border border-amber-500/20 text-amber-400 transition-colors overflow-hidden whitespace-nowrap cursor-pointer"
          title="Ask AgriAI"
        >
          <div className="flex items-center gap-3 text-xs font-bold shrink-0">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <Bot className="w-5 h-5 shrink-0 text-amber-400" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Ask AgriAI</span>
          </div>
          <span className="text-[10px] bg-amber-500/80 text-white px-2 py-0.5 rounded-full font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Live</span>
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 p-2 text-xs text-rose-400 font-semibold hover:bg-rose-500/10 hover:text-rose-300 rounded-2xl transition-colors overflow-hidden whitespace-nowrap cursor-pointer"
            title="Sign Out"
          >
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <LogOut className="w-5 h-5 shrink-0" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full flex items-center gap-3 p-2 text-xs text-emerald-400 font-semibold hover:bg-emerald-500/10 hover:text-emerald-300 rounded-2xl transition-colors overflow-hidden whitespace-nowrap cursor-pointer"
            title="Sign In"
          >
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <LogOut className="w-5 h-5 shrink-0 rotate-180" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Sign In / Register</span>
          </button>
        )}
      </div>
    </aside>
  );
};
