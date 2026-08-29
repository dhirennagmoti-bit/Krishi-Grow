import React from 'react';
import {
  TrendingUp, Store, Users, Truck, Package, DollarSign,
  ArrowUpRight, ArrowDownRight, Clock, PlusCircle, CheckCircle2,
  ChevronRight, Sparkles, Scale, FileText, PieChart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';
import { useTranslation } from 'react-i18next';

export const WholesalerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const {
    user, setActiveTab, wholesalerCustomers, bulkSalesOrders,
    profitAnalytics, marketOffers
  } = useApp();

  const totalRevenue = profitAnalytics.reduce((acc, p) => acc + p.sellingRevenue, 0);
  const totalCost = profitAnalytics.reduce((acc, p) => acc + p.totalCost, 0);
  const totalNetProfit = profitAnalytics.reduce((acc, p) => acc + p.netProfit, 0);
  const avgProfitMargin = ((totalNetProfit / (totalRevenue || 1)) * 100).toFixed(1);

  const pendingDeliveries = bulkSalesOrders.filter(o => o.status === 'CONFIRMED' || o.status === 'DISPATCHED').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            {t('wholesalerDashboard.terminalName')} • {user.district || 'Pune / Mumbai APMC'}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {user.businessName || 'Mahalaxmi Agri Wholesale & Distribution Ltd'}
          </h1>
          <p className="text-xs md:text-sm text-neutral-300 max-w-2xl font-light">
            {t('wholesalerDashboard.description')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setActiveTab('wholesaler-marketplace')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950 transition-all cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>{t('wholesalerDashboard.browseProduce')}</span>
          </button>

          <button
            onClick={() => setActiveTab('wholesaler-customers')}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-950 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('wholesalerDashboard.createB2BOrder')}</span>
          </button>

          <button
            onClick={() => setActiveTab('market-prices')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{t('wholesalerDashboard.apmcLiveTicker')}</span>
          </button>
        </div>
      </div>

      {/* 2. 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Total Inventory */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.totalInventory')}</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">135 <span className="text-xs font-normal text-neutral-400">{t('wholesalerDashboard.tonnes')}</span></div>
          <span className="text-[10px] text-blue-400 font-medium mt-1 block">{t('wholesalerDashboard.inColdDryGodowns')}</span>
        </div>

        {/* KPI 2: Inventory Value */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.inventoryValue')}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">₹42.8 <span className="text-xs font-normal text-neutral-400">{t('wholesalerDashboard.lakhs')}</span></div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">{t('wholesalerDashboard.costValuationBasis')}</span>
        </div>

        {/* KPI 3: Today's Purchases */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.todaysPurchases')}</span>
            <Store className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono">₹1,84,000</div>
          <span className="text-[10px] text-cyan-300 font-medium mt-1 block">{t('wholesalerDashboard.fromAggregatorLots')}</span>
        </div>

        {/* KPI 4: Today's Sales */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.todaysSales')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">₹2,08,750</div>
          <span className="text-[10px] text-emerald-300 font-medium mt-1 block">{t('wholesalerDashboard.dispatchedToRetail')}</span>
        </div>

        {/* KPI 5: Pending Deliveries */}
        <div 
          onClick={() => setActiveTab('wholesaler-customers')}
          className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.pendingShipments')}</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{pendingDeliveries} <span className="text-xs font-normal text-neutral-400">{t('wholesalerDashboard.trucks')}</span></div>
          <span className="text-[10px] text-amber-400 font-medium mt-1 block">{t('wholesalerDashboard.enrouteMumbaiPune')}</span>
        </div>

        {/* KPI 6: Institutional Customers */}
        <div 
          onClick={() => setActiveTab('wholesaler-customers')}
          className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.b2bCustomers')}</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{wholesalerCustomers.length} <span className="text-xs font-normal text-neutral-400">{t('wholesalerDashboard.accounts')}</span></div>
          <span className="text-[10px] text-purple-400 font-medium mt-1 block">{t('wholesalerDashboard.retailersHotelGroups')}</span>
        </div>

        {/* KPI 7: Cumulative Revenue */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.totalSalesRev')}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">₹{(totalRevenue / 100000).toFixed(2)} L</div>
          <span className="text-[10px] text-emerald-300 font-medium mt-1 block">{t('wholesalerDashboard.currentCycleVolume')}</span>
        </div>

        {/* KPI 8: Total Operations Cost */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.totalCOGSLogistics')}</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">₹{(totalCost / 100000).toFixed(2)} L</div>
          <span className="text-[10px] text-rose-400 font-medium mt-1 block">{t('wholesalerDashboard.purchTranspStorage')}</span>
        </div>

        {/* KPI 9: Net Profit */}
        <div className="p-5 rounded-2xl bg-emerald-950/30 backdrop-blur-xl border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.netRealizedProfit')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">₹{totalNetProfit.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-300 font-medium mt-1 block">{t('wholesalerDashboard.margin')} {avgProfitMargin}%</span>
        </div>

        {/* KPI 10: AI Arbitrage Optimizer */}
        <div className="p-5 rounded-2xl bg-blue-950/30 backdrop-blur-xl border border-blue-500/30 shadow-lg">
          <div className="flex items-center justify-between text-blue-300 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('wholesalerDashboard.aiMarginIndex')}</span>
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
          </div>
          <div className="text-xl font-black text-blue-300 font-mono">+14.6%</div>
          <span className="text-[10px] text-blue-200 font-medium mt-1 block">{t('wholesalerDashboard.topCropTomato')}</span>
        </div>

      </div>

      {/* 3. PROFIT & COST BREAKDOWN ANALYTICS */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              {t('wholesalerDashboard.fullLedger')}
            </h3>
            <p className="text-xs text-neutral-400">
              {t('wholesalerDashboard.formula')} <span className="font-mono text-emerald-400 font-bold">{t('wholesalerDashboard.formulaText')}</span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {profitAnalytics.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-base">{p.crop}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-neutral-400">{t('wholesalerDashboard.revenue')} <strong className="text-white">₹{p.sellingRevenue.toLocaleString()}</strong></span>
                  <span className="text-neutral-400">{t('wholesalerDashboard.cost')} <strong className="text-rose-400">₹{p.totalCost.toLocaleString()}</strong></span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-sm">
                    {t('wholesalerDashboard.profit')} +₹{p.netProfit.toLocaleString()} ({p.marginPercent}%)
                  </span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block font-sans">{t('wholesalerDashboard.purchaseCost')}</span>
                  <span className="text-white font-bold">₹{p.purchaseCost.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block font-sans">{t('wholesalerDashboard.transportLogistics')}</span>
                  <span className="text-neutral-300">₹{p.transportCost.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block font-sans">{t('wholesalerDashboard.coldDryStorage')}</span>
                  <span className="text-neutral-300">₹{p.storageCost.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block font-sans">{t('wholesalerDashboard.packhouseHandling')}</span>
                  <span className="text-neutral-300">₹{p.handlingCost.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-neutral-400 block font-sans">{t('wholesalerDashboard.otherLevies')}</span>
                  <span className="text-neutral-300">₹{p.otherCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
