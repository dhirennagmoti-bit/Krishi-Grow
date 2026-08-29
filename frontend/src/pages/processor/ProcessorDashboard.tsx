import React from 'react';
import {
  Factory, Gauge, Activity, PackageCheck, Zap, Trash2,
  DollarSign, TrendingUp, Sparkles, PlusCircle, CheckCircle2,
  QrCode, Scale, ChevronRight, Clock, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';
import { useTranslation } from 'react-i18next';

export const ProcessorDashboard: React.FC = () => {
  const { t } = useTranslation();
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
      <div className="p-6 md:p-8 rounded-xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-md relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {t('processorDashboard.hubName')} • {user.district || 'Nashik'}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {user.businessName || 'Sahyadri Agro Processing & Purees Ltd'}
          </h1>
          <p className="text-xs md:text-sm text-neutral-300 max-w-2xl font-normal">
            {t('processorDashboard.description')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setActiveTab('processor-machines')}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-950 transition-all cursor-pointer"
          >
            <Factory className="w-4 h-4" />
            <span>{t('processorDashboard.machineConsole')}</span>
          </button>

          <button
            onClick={() => setActiveTab('processor-traceability')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-md transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>{t('processorDashboard.qrTraceabilityEngine')}</span>
          </button>

          <button
            onClick={() => setActiveTab('find-farmers')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 transition-all cursor-pointer"
          >
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>{t('processorDashboard.procureRawLots')}</span>
          </button>
        </div>
      </div>

      {/* 2. 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Raw Material Inventory */}
        <div className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.rawMaterialStock')}</span>
            <PackageCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">48.5 <span className="text-xs font-normal text-neutral-400">{t('processorDashboard.tonnes')}</span></div>
          <span className="text-xs text-emerald-400 font-medium mt-1 block">{t('processorDashboard.cropList')}</span>
        </div>

        {/* KPI 2: Production Today */}
        <div className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.productionToday')}</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono">{totalTodayProductionTonnes.toFixed(1)} <span className="text-xs font-normal text-neutral-400">{t('processorDashboard.tonnes')}</span></div>
          <span className="text-xs text-cyan-300 font-medium mt-1 block">{t('processorDashboard.acrossActiveLines')}</span>
        </div>

        {/* KPI 3: Active Batches */}
        <div className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.activeBatches')}</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{packagingBatches.length} <span className="text-xs font-normal text-neutral-400">{t('processorDashboard.batches')}</span></div>
          <span className="text-xs text-amber-400 font-medium mt-1 block">{t('processorDashboard.inPackagingQA')}</span>
        </div>

        {/* KPI 4: Finished Goods Units */}
        <div className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.finishedGoods')}</span>
            <PackageCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{totalFinishedGoodsStock.toLocaleString()} <span className="text-xs font-normal text-neutral-400">{t('processorDashboard.units')}</span></div>
          <span className="text-xs text-blue-400 font-medium mt-1 block">{t('processorDashboard.readyInWarehouse')}</span>
        </div>

        {/* KPI 5: Machine Running Capacity */}
        <div 
          onClick={() => setActiveTab('processor-machines')}
          className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.machinesStatus')}</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{runningMachinesCount} / {processingMachines.length} <span className="text-xs font-normal text-neutral-400">{t('processorDashboard.online')}</span></div>
          <span className="text-xs text-cyan-400 font-medium mt-1 block">{t('processorDashboard.lineInMaintenance')}</span>
        </div>

        {/* KPI 6: Waste Rate % */}
        <div 
          onClick={() => setActiveTab('processor-traceability')}
          className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.avgWasteRate')}</span>
            <Trash2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">{avgWastePercent}%</div>
          <span className="text-xs text-emerald-400 font-medium mt-1 block">{t('processorDashboard.valorizedAsFeed')}</span>
        </div>

        {/* KPI 7: Today's Production Cost */}
        <div className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.productionCost')}</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">₹1,84,200</div>
          <span className="text-xs text-rose-400 font-medium mt-1 block">{t('processorDashboard.rawEnergyLabor')}</span>
        </div>

        {/* KPI 8: Pending Wholesale Orders */}
        <div className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.wholesaleOrders')}</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">12 <span className="text-xs font-normal text-neutral-400">{t('processorDashboard.contracts')}</span></div>
          <span className="text-xs text-blue-400 font-medium mt-1 block">{t('processorDashboard.retailFBChains')}</span>
        </div>

        {/* KPI 9: Today's Revenue */}
        <div className="p-5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.dailyRevenue')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">₹3,45,000</div>
          <span className="text-xs text-emerald-300 font-medium mt-1 block">{t('processorDashboard.yoyGrowth')}</span>
        </div>

        {/* KPI 10: AI Yield Optimizer Index */}
        <div className="p-5 rounded-xl bg-cyan-950/30 backdrop-blur-xl border border-cyan-500/30 shadow-md">
          <div className="flex items-center justify-between text-cyan-300 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('processorDashboard.aiYieldScore')}</span>
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          </div>
          <div className="text-xl font-black text-cyan-300 font-mono">98.2%</div>
          <span className="text-xs text-cyan-200 font-medium mt-1 block">{t('processorDashboard.optimalRefiningTemp')}</span>
        </div>

      </div>

      {/* 3. Operational Sections: Active Packaging Batches & Machine Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Packaging Batches & Line Status */}
        <div className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{t('processorDashboard.activePackagingBatches')}</h3>
              <p className="text-xs text-neutral-400">{t('processorDashboard.batchCodedPackaging')}</p>
            </div>
            <button
              onClick={() => setActiveTab('processor-traceability')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('processorDashboard.viewQRTrace')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {packagingBatches.map((batch) => (
              <div
                key={batch.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{batch.productName}</h4>
                    <span className="text-xs text-cyan-400 font-mono font-bold block mt-0.5">
                      {t('processorDashboard.batchId')} {batch.batchId}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {batch.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs font-mono text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">{t('processorDashboard.rawProduceSource')}</span>
                    <strong className="text-white font-sans">{batch.rawMaterialSource.crop}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">{t('processorDashboard.cultivatorOrigin')}</span>
                    <span className="text-emerald-400 font-sans truncate max-w-[200px]">{batch.rawMaterialSource.farmer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">{t('processorDashboard.unitsPackaged')}</span>
                    <strong className="text-white">{batch.quantityUnits.toLocaleString()} {t('processorDashboard.pkts')} ({batch.packageSize})</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-neutral-400">{t('processorDashboard.mfg')} {batch.manufacturingDate} • {t('processorDashboard.exp')} {batch.expiryDate}</span>
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
                    <span>{t('processorDashboard.viewQRTracePassport')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Processing Machine Status */}
        <div className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{t('processorDashboard.liveMachineTelemetry')}</h3>
              <p className="text-xs text-neutral-400">{t('processorDashboard.continuousThroughputSensors')}</p>
            </div>
            <button
              onClick={() => setActiveTab('processor-machines')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('processorDashboard.manageLines')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {processingMachines.map((machine) => (
              <div
                key={machine.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{machine.name}</h4>
                    <span className="text-xs text-neutral-400 font-mono">{t('processorDashboard.code')} {machine.code} • {machine.type}</span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    machine.status === 'RUNNING' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    machine.status === 'MAINTENANCE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-neutral-500/20 text-neutral-300 border border-white/10'
                  }`}>
                    {machine.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-xs text-neutral-400 block font-sans">{t('processorDashboard.throughput')}</span>
                    <strong className="text-white">{machine.capacityTonnesPerHour} {t('processorDashboard.tHr')}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block font-sans">{t('processorDashboard.todaysOutput')}</span>
                    <strong className="text-cyan-400">{machine.todayOutputTonnes} {t('processorDashboard.t')}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block font-sans">{t('processorDashboard.nextService')}</span>
                    <span className="text-amber-300 text-xs font-sans">{machine.nextMaintenanceDate}</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 flex items-center justify-between font-normal">
                  <span>{t('processorDashboard.operator')} {machine.operatorInCharge}</span>
                  {machine.temperatureCelsius && (
                    <span className="font-mono text-emerald-400">{machine.temperatureCelsius}°C {t('processorDashboard.operatingTemp')}</span>
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
