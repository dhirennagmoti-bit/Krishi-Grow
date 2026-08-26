import React from 'react';
import {
  Factory, Gauge, Activity, PackageCheck, Zap, Trash2,
  DollarSign, TrendingUp, Sparkles, PlusCircle, CheckCircle2,
  QrCode, Scale, ChevronRight, Clock, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';

export const ProcessorDashboard: React.FC = () => {
  const {
    user, setActiveTab, processingMachines, packagingBatches,
    finishedGoods, wasteRecords, openDocument
  } = useApp();

  const totalFinishedGoodsStock = finishedGoods.reduce((acc, f) => acc + f.unitsInStock, 0);
  const runningMachinesCount = processingMachines.filter(m => m.status === 'RUNNING').length;
  const totalTodayProductionTonnes = processingMachines.reduce((acc, m) => acc + m.todayOutputTonnes, 0);
  const avgWastePercent = (wasteRecords.reduce((acc, w) => acc + w.wastePercentage, 0) / (wasteRecords.length || 1)).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Food Processing & Value Addition Industrial Hub • {user.district || 'Nashik'}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {user.businessName || 'Sahyadri Agro Processing & Purees Ltd'}
          </h1>
          <p className="text-xs md:text-sm text-neutral-300 max-w-2xl font-light">
            Automated production telemetry, packaging batching, waste minimization, and QR code farm-to-fork traceability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setActiveTab('processor-machines')}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-950 transition-all cursor-pointer"
          >
            <Factory className="w-4 h-4" />
            <span>Machine Console</span>
          </button>

          <button
            onClick={() => setActiveTab('processor-traceability')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Traceability Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('find-farmers')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 transition-all cursor-pointer"
          >
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Procure Raw Agri Lots</span>
          </button>
        </div>
      </div>

      {/* 2. 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Raw Material Inventory */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Raw Material Stock</span>
            <PackageCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">48.5 <span className="text-xs font-normal text-neutral-400">Tonnes</span></div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">Tomato, Turmeric, Soybean</span>
        </div>

        {/* KPI 2: Production Today */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Production Today</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono">{totalTodayProductionTonnes.toFixed(1)} <span className="text-xs font-normal text-neutral-400">Tonnes</span></div>
          <span className="text-[10px] text-cyan-300 font-medium mt-1 block">Across Active Lines</span>
        </div>

        {/* KPI 3: Active Batches */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Batches</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{packagingBatches.length} <span className="text-xs font-normal text-neutral-400">Batches</span></div>
          <span className="text-[10px] text-amber-400 font-medium mt-1 block">In Packaging & QA</span>
        </div>

        {/* KPI 4: Finished Goods Units */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Finished Goods</span>
            <PackageCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{totalFinishedGoodsStock.toLocaleString()} <span className="text-xs font-normal text-neutral-400">Units</span></div>
          <span className="text-[10px] text-purple-400 font-medium mt-1 block">Ready in Warehouse</span>
        </div>

        {/* KPI 5: Machine Running Capacity */}
        <div 
          onClick={() => setActiveTab('processor-machines')}
          className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Machines Status</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{runningMachinesCount} / {processingMachines.length} <span className="text-xs font-normal text-neutral-400">Online</span></div>
          <span className="text-[10px] text-cyan-400 font-medium mt-1 block">1 Line in Maintenance</span>
        </div>

        {/* KPI 6: Waste Rate % */}
        <div 
          onClick={() => setActiveTab('processor-traceability')}
          className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Waste Rate</span>
            <Trash2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">{avgWastePercent}%</div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">100% Valorized as Feed</span>
        </div>

        {/* KPI 7: Today's Production Cost */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Production Cost</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">₹1,84,200</div>
          <span className="text-[10px] text-rose-400 font-medium mt-1 block">Raw + Energy + Labor</span>
        </div>

        {/* KPI 8: Pending Wholesale Orders */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Wholesale Orders</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">12 <span className="text-xs font-normal text-neutral-400">Contracts</span></div>
          <span className="text-[10px] text-blue-400 font-medium mt-1 block">Retail & F&B Chains</span>
        </div>

        {/* KPI 9: Today's Revenue */}
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Daily Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">₹3,45,000</div>
          <span className="text-[10px] text-emerald-300 font-medium mt-1 block">+22% YoY</span>
        </div>

        {/* KPI 10: AI Yield Optimizer Index */}
        <div className="p-5 rounded-2xl bg-cyan-950/30 backdrop-blur-xl border border-cyan-500/30 shadow-lg">
          <div className="flex items-center justify-between text-cyan-300 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">AI Yield Score</span>
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          </div>
          <div className="text-xl font-black text-cyan-300 font-mono">98.2%</div>
          <span className="text-[10px] text-cyan-200 font-medium mt-1 block">Optimal Refining Temperature</span>
        </div>

      </div>

      {/* 3. Operational Sections: Active Packaging Batches & Machine Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Packaging Batches & Line Status */}
        <div className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Active Packaging Batches</h3>
              <p className="text-xs text-neutral-400">Batch-coded consumer packaging with QR passports</p>
            </div>
            <button
              onClick={() => setActiveTab('processor-traceability')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View QR Trace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {packagingBatches.map((batch) => (
              <div
                key={batch.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{batch.productName}</h4>
                    <span className="text-xs text-cyan-400 font-mono font-bold block mt-0.5">
                      Batch ID: {batch.batchId}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {batch.status}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs font-mono text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Raw Produce Source:</span>
                    <strong className="text-white font-sans">{batch.rawMaterialSource.crop}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Cultivator / Origin:</span>
                    <span className="text-emerald-400 font-sans truncate max-w-[200px]">{batch.rawMaterialSource.farmer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Units Packaged:</span>
                    <strong className="text-white">{batch.quantityUnits.toLocaleString()} pkts ({batch.packageSize})</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-400">Mfg: {batch.manufacturingDate} • Exp: {batch.expiryDate}</span>
                  <button
                    onClick={() => {
                      openDocument({
                        id: batch.id,
                        type: 'TRACEABILITY_PASSPORT',
                        docNumber: `QR-PASSPORT-${batch.batchId}`,
                        date: batch.manufacturingDate,
                        issuerName: user.businessName || 'Sahyadri Agro Processing Ltd',
                        issuerRole: 'Quality & Line Operations Directorate',
                        recipientName: 'Consumer Public / Wholesale Retail Network',
                        cropOrProduct: batch.productName,
                        quantity: `${batch.quantityUnits} Units (${batch.packageSize})`,
                        grade: batch.nutritionalGrade,
                        status: 'VERIFIED TRACEABILITY PASSPORT',
                        metadata: {
                          trace: batch.rawMaterialSource,
                          barcode: batch.barcode,
                          qrUrl: batch.qrCodeUrl
                        }
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View QR Trace Passport</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Processing Machine Status */}
        <div className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Live Machine Line Telemetry</h3>
              <p className="text-xs text-neutral-400">Continuous industrial throughput & maintenance sensors</p>
            </div>
            <button
              onClick={() => setActiveTab('processor-machines')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Lines</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {processingMachines.map((machine) => (
              <div
                key={machine.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{machine.name}</h4>
                    <span className="text-xs text-neutral-400 font-mono">Code: {machine.code} • {machine.type}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    machine.status === 'RUNNING' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    machine.status === 'MAINTENANCE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-neutral-500/20 text-neutral-300 border border-white/10'
                  }`}>
                    {machine.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-sans">Throughput</span>
                    <strong className="text-white">{machine.capacityTonnesPerHour} T/hr</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-sans">Today's Output</span>
                    <strong className="text-cyan-400">{machine.todayOutputTonnes} T</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-sans">Next Service</span>
                    <span className="text-amber-300 text-[11px] font-sans">{machine.nextMaintenanceDate}</span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400 flex items-center justify-between font-light">
                  <span>Operator: {machine.operatorInCharge}</span>
                  {machine.temperatureCelsius && (
                    <span className="font-mono text-emerald-400">{machine.temperatureCelsius}°C Operating Temp</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
