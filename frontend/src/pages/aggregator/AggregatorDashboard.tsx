import React, { useState } from 'react';
import {
  Users, Truck, Package, Scale, ShieldCheck, TrendingUp,
  DollarSign, ArrowUpRight, ArrowDownRight, Clock, PlusCircle,
  FileText, CheckCircle2, ChevronRight, AlertTriangle, Sparkles,
  MapPin, Phone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';
import { useTranslation } from 'react-i18next';

export const AggregatorDashboard: React.FC = () => {
  const { t } = useTranslation();
  const {
    user, setActiveTab, aggregatorFarmers, collectionRequests,
    weighingSlips, aggregatorInventory, marketOffers, openDocument
  } = useApp();

  const totalInventoryKg = aggregatorInventory.reduce((acc, i) => acc + i.availableQuantityKg, 0);
  const activeFarmersCount = aggregatorFarmers.filter(f => f.status === 'ACTIVE').length;
  const inTransitPickups = collectionRequests.filter(c => c.status === 'IN_TRANSIT' || c.status === 'SCHEDULED').length;
  const todayPurchases = 142000;
  const todaySales = 208750;
  const pendingPayments = 38500;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t('aggregatorDashboard.commandCenter')} • {user.district || 'Nashik'}, Maharashtra
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {user.businessName || 'MahaAgri Aggregators FPC Hub'}
          </h1>
          <p className="text-xs md:text-sm text-neutral-300 max-w-2xl font-light">
            {t('aggregatorDashboard.description')}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setActiveTab('aggregator-collection')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950 transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>{t('aggregatorDashboard.schedulePickup')}</span>
          </button>

          <button
            onClick={() => setActiveTab('aggregator-weighing-qc')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 transition-all cursor-pointer"
          >
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>{t('aggregatorDashboard.newWeighmentSlip')}</span>
          </button>

          <button
            onClick={() => setActiveTab('aggregator-inventory-market')}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-950 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('aggregatorDashboard.postB2BSellOffer')}</span>
          </button>
        </div>
      </div>

      {/* 2. 9 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        
        {/* KPI 1: Connected Farmers */}
        <div 
          onClick={() => setActiveTab('aggregator-farmers')}
          className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('aggregatorDashboard.farmersConnected')}</span>
            <Users className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{activeFarmersCount}</div>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 block">{t('aggregatorDashboard.activeDistricts')}</span>
        </div>

        {/* KPI 2: Produce Collected Today */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('aggregatorDashboard.collectedToday')}</span>
            <Scale className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">28.47 <span className="text-sm font-normal text-neutral-400">{t('aggregatorDashboard.tonnes')}</span></div>
          <span className="text-[11px] text-cyan-400 font-medium mt-1 block">{t('aggregatorDashboard.acrossVehicleTrips')}</span>
        </div>

        {/* KPI 3: Total Warehouse Inventory */}
        <div 
          onClick={() => setActiveTab('aggregator-inventory-market')}
          className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('aggregatorDashboard.totalInventory')}</span>
            <Package className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{(totalInventoryKg / 1000).toFixed(1)} <span className="text-sm font-normal text-neutral-400">{t('aggregatorDashboard.tonnes')}</span></div>
          <span className="text-[11px] text-purple-400 font-medium mt-1 block">{t('aggregatorDashboard.cropBatchesStored')}</span>
        </div>

        {/* KPI 4: Pending Pickups */}
        <div 
          onClick={() => setActiveTab('aggregator-collection')}
          className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('aggregatorDashboard.pendingPickups')}</span>
            <Truck className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{inTransitPickups}</div>
          <span className="text-[11px] text-amber-400 font-medium mt-1 block">{t('aggregatorDashboard.inTransitScheduled')}</span>
        </div>

        {/* KPI 5: Incoming / Outgoing Orders */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('aggregatorDashboard.activeB2BOrders')}</span>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">7 <span className="text-sm font-normal text-neutral-400">{t('aggregatorDashboard.deals')}</span></div>
          <span className="text-[11px] text-blue-400 font-medium mt-1 block">{t('aggregatorDashboard.offersContracts')}</span>
        </div>

        {/* KPI 6: Today's Purchase Value */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-rose-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('aggregatorDashboard.todaysPurchases')}</span>
            <DollarSign className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">₹{todayPurchases.toLocaleString()}</div>
          <span className="text-[11px] text-rose-400 font-medium mt-1 block">{t('aggregatorDashboard.farmerGateProcurement')}</span>
        </div>

        {/* KPI 7: Today's Sales Value */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('aggregatorDashboard.todaysSalesRevenue')}</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">₹{todaySales.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-300 font-medium mt-1 block">{t('aggregatorDashboard.vsYesterday')}</span>
        </div>

        {/* KPI 8: Pending Farmer Payments */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-orange-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('aggregatorDashboard.pendingPayments')}</span>
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">₹{pendingPayments.toLocaleString()}</div>
          <span className="text-[11px] text-orange-400 font-medium mt-1 block">{t('aggregatorDashboard.rtgsClearance')}</span>
        </div>

        {/* KPI 9: AI Demand Match Index */}
        <div className="p-5 rounded-2xl bg-emerald-950/30 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400 transition-all shadow-lg">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('aggregatorDashboard.aiMatchIndex')}</span>
            <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">96.4%</div>
          <span className="text-[11px] text-emerald-200 font-medium mt-1 block">{t('aggregatorDashboard.highProcessorDemand')}</span>
        </div>

      </div>

      {/* 3. Main Operational Sections: Active Pickups & Live Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Harvest Pickups Timeline */}
        <div className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{t('aggregatorDashboard.liveHarvestPickups')}</h3>
              <p className="text-xs text-neutral-400">{t('aggregatorDashboard.assignedTransportRoutes')}</p>
            </div>
            <button
              onClick={() => setActiveTab('aggregator-collection')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('aggregatorDashboard.viewAll')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {collectionRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getCropImage(req.crop)}
                    alt={req.crop}
                    className="w-12 h-12 rounded-xl object-cover border border-white/15 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{req.farmerName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'IN_TRANSIT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        req.status === 'COLLECTED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-mono">
                      {req.crop} ({req.variety}) • <strong>{req.expectedTonnes} {t('aggregatorDashboard.tonnes')}</strong>
                    </p>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {req.village}, {req.district}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs text-neutral-300 shrink-0">
                  <div className="text-emerald-400 font-bold">{req.assignedVehicle}</div>
                  <div className="text-neutral-400 text-[11px]">{req.assignedDriver}</div>
                  <span className="text-[10px] text-amber-300 font-sans block mt-0.5">ETA: {req.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Storage Inventory Snapshot */}
        <div className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{t('aggregatorDashboard.warehouseInventorySpoilage')}</h3>
              <p className="text-xs text-neutral-400">{t('aggregatorDashboard.realTimeBatchVolume')}</p>
            </div>
            <button
              onClick={() => setActiveTab('aggregator-inventory-market')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('aggregatorDashboard.manageStock')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {aggregatorInventory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getCropImage(item.crop)}
                    alt={item.crop}
                    className="w-12 h-12 rounded-xl object-cover border border-white/15 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{item.crop}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {t('aggregatorDashboard.grade')} {item.grade}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-mono">
                      {t('aggregatorDashboard.batch')}: {item.batchId} • <strong>{(item.availableQuantityKg / 1000).toFixed(1)} {t('aggregatorDashboard.tonnes')} {t('aggregatorDashboard.avail')}</strong>
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate max-w-xs">
                      📍 {item.warehouse}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs text-neutral-300 shrink-0">
                  <div className="font-bold text-white">₹{item.purchasePricePerKg.toFixed(2)} / kg</div>
                  <div className="text-[11px] text-neutral-400">{item.daysInStorage}{t('aggregatorDashboard.inStorage')}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold block mt-1">
                    {t('aggregatorDashboard.risk')} {item.spoilageRisk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
