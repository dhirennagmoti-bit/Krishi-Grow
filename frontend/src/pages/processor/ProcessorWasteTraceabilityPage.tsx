import React, { useState } from 'react';
import {
  Trash2, QrCode, Sparkles, TrendingDown, ArrowRight, ShieldCheck,
  CheckCircle2, AlertTriangle, FileText, Search, MapPin, Sprout,
  Building2, Factory, Package, Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';

export const ProcessorWasteTraceabilityPage: React.FC = () => {
  const { wasteRecords, packagingBatches, openDocument, user } = useApp();
  const [selectedBatchForTrace, setSelectedBatchForTrace] = useState(packagingBatches[0] || null);
  const [qrSearchInput, setQrSearchInput] = useState('');

  const totalInputKg = wasteRecords.reduce((acc, w) => acc + w.inputRawKg, 0);
  const totalOutputKg = wasteRecords.reduce((acc, w) => acc + w.outputProductKg, 0);
  const totalWasteKg = wasteRecords.reduce((acc, w) => acc + w.wasteKg, 0);
  const aggregateWastePercent = ((totalWasteKg / (totalInputKg || 1)) * 100).toFixed(1);

  const searchedBatch = qrSearchInput
    ? packagingBatches.find(b => b.batchId.toLowerCase().includes(qrSearchInput.toLowerCase()) || b.productName.toLowerCase().includes(qrSearchInput.toLowerCase()))
    : selectedBatchForTrace;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <QrCode className="w-3.5 h-3.5" /> Farm-to-Fork Integrity & Zero-Waste
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Traceability Engine & Circular Waste Analytics
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-light">
            Immutable QR batch tracking across the value chain and automated industrial by-product monetization.
          </p>
        </div>

        <button
          onClick={() => {
            if (searchedBatch) {
              openDocument({
                id: searchedBatch.id,
                type: 'TRACEABILITY_PASSPORT',
                docNumber: `QR-PASSPORT-${searchedBatch.batchId}`,
                date: searchedBatch.manufacturingDate,
                issuerName: user.businessName || 'Sahyadri Agro Processing Directorate',
                issuerRole: 'Quality & Line Operations Directorate',
                recipientName: 'Consumer Retail Distribution Chain',
                cropOrProduct: searchedBatch.productName,
                quantity: `${searchedBatch.quantityUnits} Units (${searchedBatch.packageSize})`,
                grade: searchedBatch.nutritionalGrade,
                status: 'VERIFIED TRACEABILITY PASSPORT',
                metadata: {
                  trace: searchedBatch.rawMaterialSource,
                  barcode: searchedBatch.barcode,
                  qrUrl: searchedBatch.qrCodeUrl
                }
              });
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950 transition-all cursor-pointer shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>Generate QR Passport Certificate</span>
        </button>
      </div>

      {/* 1. TRACEABILITY VISUAL PIPELINE EXPLORER */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Full Value-Chain Lineage Tree
            </h3>
            <p className="text-xs text-neutral-400">Select any manufactured batch to inspect exact cultivator origins</p>
          </div>

          {/* Search Batch Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Batch ID or Product..."
              value={qrSearchInput}
              onChange={(e) => setQrSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:border-cyan-500 outline-none"
            />
          </div>
        </div>

        {searchedBatch ? (
          <div className="space-y-6">
            
            {/* Visual 5-Stage Step Sequence */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              
              {/* Step 1: Farm Origin */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">1</div>
                <h4 className="font-bold text-white text-xs">Farm Origin</h4>
                <p className="text-[11px] text-emerald-300 font-mono">{searchedBatch.rawMaterialSource.farmOrigin}</p>
                <span className="text-[10px] text-neutral-400 block">Soil & Climate Certified</span>
              </div>

              {/* Step 2: Farmer */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">2</div>
                <h4 className="font-bold text-white text-xs">Cultivator</h4>
                <p className="text-[11px] text-emerald-300 font-medium">{searchedBatch.rawMaterialSource.farmer}</p>
                <span className="text-[10px] text-neutral-400 block font-mono">Crop: {searchedBatch.rawMaterialSource.crop}</span>
              </div>

              {/* Step 3: Aggregator Hub */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">3</div>
                <h4 className="font-bold text-white text-xs">Aggregator & QC</h4>
                <p className="text-[11px] text-cyan-300 font-medium">{searchedBatch.rawMaterialSource.aggregator}</p>
                <span className="text-[10px] text-neutral-400 block font-mono">Weighed & Graded A+</span>
              </div>

              {/* Step 4: Industrial Processor */}
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">4</div>
                <h4 className="font-bold text-white text-xs">Processing Plant</h4>
                <p className="text-[11px] text-purple-300 font-medium">{user.businessName || 'Sahyadri Processing'}</p>
                <span className="text-[10px] text-neutral-400 block font-mono">Batch: {searchedBatch.batchId}</span>
              </div>

              {/* Step 5: Finished Good */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">5</div>
                <h4 className="font-bold text-white text-xs">Consumer Retail</h4>
                <p className="text-[11px] text-amber-300 font-medium truncate">{searchedBatch.productName}</p>
                <span className="text-[10px] text-emerald-400 block font-bold">100% Traceable Verified</span>
              </div>

            </div>

            {/* QR Scanner Live Simulation Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white p-2 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
                    <rect width="25" height="25" />
                    <rect x="75" width="25" height="25" />
                    <rect y="75" width="25" height="25" />
                    <rect x="35" y="35" width="30" height="30" />
                    <rect x="5" y="35" width="10" height="20" />
                    <rect x="85" y="45" width="10" height="30" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{searchedBatch.productName}</h4>
                  <p className="text-xs text-neutral-400 font-mono">Digital Code: {searchedBatch.qrCodeUrl}</p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    ✓ Consumers scanning this packaging receive real-time farmer photos, soil test records, and harvest dates.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-neutral-400 block">Barcode: {searchedBatch.barcode}</span>
                <span className="text-xs font-bold text-amber-400 block">Nutritional: {searchedBatch.nutritionalGrade}</span>
              </div>
            </div>

          </div>
        ) : (
          <p className="text-xs text-neutral-400">No matching packaging batches found.</p>
        )}

      </div>

      {/* 2. CIRCULAR WASTE MANAGEMENT & BY-PRODUCT VALORIZATION */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-amber-400" />
              Circular Waste Analytics & By-Product Revenue
            </h3>
            <p className="text-xs text-neutral-400">
              Formula: <span className="font-mono text-emerald-400 font-bold">Waste % = (Waste Kg / Input Kg) × 100</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-amber-400 font-mono">{aggregateWastePercent}%</span>
            <span className="text-[10px] text-neutral-400 block">Facility Average Waste Ratio</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wasteRecords.map((record) => (
            <div
              key={record.id}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{record.processName}</h4>
                  <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">Date: {record.date}</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  {record.wastePercentage}% Waste
                </span>
              </div>

              {/* Mass Balance Math */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Raw Input</span>
                  <strong className="text-white">{record.inputRawKg.toLocaleString()} kg</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Pure Output</span>
                  <strong className="text-emerald-400">{record.outputProductKg.toLocaleString()} kg</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">By-Product Waste</span>
                  <strong className="text-amber-400">{record.wasteKg.toLocaleString()} kg</strong>
                </div>
              </div>

              {/* AI By-Product Monetization Recommendation */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Circular Economy By-Product Monetization
                </span>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  {record.byProductUtilization}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
