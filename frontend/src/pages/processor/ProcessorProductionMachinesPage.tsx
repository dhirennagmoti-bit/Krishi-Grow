import React, { useState } from 'react';
import {
  Factory, Gauge, PlusCircle, Wrench, AlertTriangle, CheckCircle2,
  Zap, Package, Clock, QrCode, Play, Pause, RefreshCw, X, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ProcessingMachine, PackagingBatch } from '../../types';

export const ProcessorProductionMachinesPage: React.FC = () => {
  const {
    processingMachines, updateMachineStatus, addProcessingMachine,
    packagingBatches, addPackagingBatch, openDocument
  } = useApp();

  const [activeTab, setActiveTab] = useState<'MACHINES' | 'PACKAGING'>('MACHINES');
  const [isAddMachineModalOpen, setIsAddMachineModalOpen] = useState(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);

  // New Machine Form
  const [machineName, setMachineName] = useState('Industrial Mango Pulp Extractor #03');
  const [machineCode, setMachineCode] = useState('MP-03');
  const [machineType, setMachineType] = useState('Cold Extraction & Deaeration');
  const [capacity, setCapacity] = useState('3.0');
  const [operator, setOperator] = useState('Santosh Kadam');

  // New Packaging Batch Form
  const [productName, setProductName] = useState('Krishi Grow Pure Tomato Puree (Brix 28%)');
  const [cropSource, setCropSource] = useState('Tomato (Abhinav Hybrid)');
  const [farmerSource, setFarmerSource] = useState('Ramesh Balasaheb Patil (Palkhed)');
  const [packageSize, setPackageSize] = useState('850 g Tin / Pouch');
  const [quantityUnits, setQuantityUnits] = useState('5000');
  const [packagingMat, setPackagingMat] = useState('Multi-layer Barrier Pouch');
  const [expiryMonths, setExpiryMonths] = useState('12');

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    addProcessingMachine({
      name: machineName,
      code: machineCode,
      type: machineType,
      status: 'IDLE',
      capacityTonnesPerHour: parseFloat(capacity) || 1.5,
      todayOutputTonnes: 0,
      nextMaintenanceDate: '2026-09-30',
      lastMaintenanceDate: '2026-08-20',
      operatorInCharge: operator
    });

    setIsAddMachineModalOpen(false);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const batchCode = `PKG-${machineCode}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
    const mfgDate = new Date().toISOString().split('T')[0];
    const expDate = new Date(Date.now() + parseInt(expiryMonths) * 30 * 24 * 3600 * 1000).toISOString().split('T')[0];

    addPackagingBatch({
      batchId: batchCode,
      productName,
      rawMaterialSource: {
        crop: cropSource,
        rawBatchId: 'BATCH-RAW-8821',
        aggregator: 'MahaAgri Aggregators FPC',
        farmer: farmerSource,
        farmOrigin: 'Nashik Agro Belt, Maharashtra'
      },
      packageSize,
      quantityUnits: parseInt(quantityUnits) || 1000,
      manufacturingDate: mfgDate,
      expiryDate: expDate,
      packagingMaterial: packagingMat,
      barcode: '8901030' + Math.floor(100000 + Math.random() * 900000),
      qrCodeUrl: `https://krishigrow.org/trace/${batchCode}`,
      nutritionalGrade: 'Grade A+ Certified Organoleptic',
      status: 'PACKAGED'
    });

    setIsNewBatchModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-6 md:p-8 rounded-xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Factory className="w-3.5 h-3.5" /> Processing Floor Operations
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Industrial Machines & Packaging Hub
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-normal">
            Monitor real-time machine telemetry, schedule preventive maintenance, and generate serialized packaging batches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'MACHINES' ? (
            <button
              onClick={() => setIsAddMachineModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-950 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Register New Machine</span>
            </button>
          ) : (
            <button
              onClick={() => setIsNewBatchModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create Packaging Batch</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Toggle */}
      <div className="flex p-1.5 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 max-w-md">
        <button
          onClick={() => setActiveTab('MACHINES')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'MACHINES'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>Processing Machines ({processingMachines.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('PACKAGING')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'PACKAGING'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Packaging Lots ({packagingBatches.length})</span>
        </button>
      </div>

      {/* 1. MACHINES TELEMETRY VIEW */}
      {activeTab === 'MACHINES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processingMachines.map((machine) => (
            <div
              key={machine.id}
              className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all space-y-5 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{machine.name}</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">Line Code: {machine.code} • {machine.type}</p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    machine.status === 'RUNNING' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    machine.status === 'MAINTENANCE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    machine.status === 'BREAKDOWN' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-neutral-500/20 text-neutral-300 border border-white/10'
                  }`}>
                    {machine.status}
                  </span>
                </div>

                {/* Telemetry Sensor Metrics */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-xs text-neutral-400 block font-sans">Capacity Rate</span>
                    <strong className="text-white text-sm">{machine.capacityTonnesPerHour} T/hr</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-xs text-neutral-400 block font-sans">Today's Output</span>
                    <strong className="text-cyan-400 text-sm">{machine.todayOutputTonnes} T</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-xs text-neutral-400 block font-sans">Temp / Power</span>
                    <strong className="text-amber-300 text-xs font-mono">{machine.temperatureCelsius ? `${machine.temperatureCelsius}°C` : 'Norm'}</strong>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-neutral-300 font-normal">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Chief Operator:</span>
                    <strong className="text-white">{machine.operatorInCharge}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Next Scheduled Maintenance:</span>
                    <span className="text-amber-300 font-mono font-medium">{machine.nextMaintenanceDate}</span>
                  </div>
                </div>
              </div>

              {/* Status Controls */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => updateMachineStatus(machine.id, machine.status === 'RUNNING' ? 'IDLE' : 'RUNNING')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    machine.status === 'RUNNING'
                      ? 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  {machine.status === 'RUNNING' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{machine.status === 'RUNNING' ? 'Pause Line' : 'Start Machine'}</span>
                </button>

                <button
                  onClick={() => updateMachineStatus(machine.id, 'MAINTENANCE')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-white/10"
                  title="Schedule Maintenance"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Service</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. PACKAGING STATION VIEW */}
      {activeTab === 'PACKAGING' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packagingBatches.map((batch) => (
            <div
              key={batch.id}
              className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{batch.productName}</h3>
                  <span className="text-xs text-cyan-400 font-mono font-bold block mt-0.5">
                    Batch Code: {batch.batchId}
                  </span>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {batch.status}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Packaged Quantity:</span>
                  <strong className="text-white font-bold">{batch.quantityUnits.toLocaleString()} units ({batch.packageSize})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Packaging Standard:</span>
                  <span className="text-neutral-300 font-sans">{batch.packagingMaterial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Barcode Ref:</span>
                  <span className="text-emerald-400">{batch.barcode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Shelf Life Expiry:</span>
                  <span className="text-amber-400 font-sans">{batch.expiryDate} (Mfg: {batch.manufacturingDate})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                <span className="text-xs uppercase font-bold text-emerald-400 block mb-1">Source Lineage Record</span>
                <p className="text-neutral-300 text-xs">
                  Raw Material: <strong>{batch.rawMaterialSource.crop}</strong> from Cultivator <strong>{batch.rawMaterialSource.farmer}</strong>.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => {
                    openDocument({
                      id: batch.id,
                      type: 'TRACEABILITY_PASSPORT',
                      docNumber: `QR-PASSPORT-${batch.batchId}`,
                      date: batch.manufacturingDate,
                      issuerName: 'Sahyadri Agro Processing Directorate',
                      issuerRole: 'Certified Packaging Station Incharge',
                      recipientName: 'Consumer Retail Distribution Chain',
                      cropOrProduct: batch.productName,
                      quantity: `${batch.quantityUnits} Units (${batch.packageSize})`,
                      grade: batch.nutritionalGrade,
                      status: 'CERTIFIED COMPLIANT BATCH',
                      metadata: {
                        trace: batch.rawMaterialSource,
                        barcode: batch.barcode,
                        qrUrl: batch.qrCodeUrl
                      }
                    });
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Print Batch QR Label & Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Register New Machine */}
      {isAddMachineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleAddMachine} className="bg-[#121214] border border-white/15 rounded-xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Factory className="w-5 h-5 text-cyan-400" />
                Register Production Machine Line
              </h3>
              <button type="button" onClick={() => setIsAddMachineModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Machine Name & Line #</label>
                <input
                  type="text"
                  required
                  value={machineName}
                  onChange={(e) => setMachineName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Line Code Identifier</label>
                  <input
                    type="text"
                    required
                    value={machineCode}
                    onChange={(e) => setMachineCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Rated Capacity (Tonnes / Hr)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Processing Mechanism</label>
                  <input
                    type="text"
                    required
                    value={machineType}
                    onChange={(e) => setMachineType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Assigned Line Operator</label>
                  <input
                    type="text"
                    required
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsAddMachineModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Register Machine Line
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Create Packaging Batch */}
      {isNewBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleCreateBatch} className="bg-[#121214] border border-white/15 rounded-xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                Generate New Packaging Batch
              </h3>
              <button type="button" onClick={() => setIsNewBatchModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Finished Product Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Raw Agri Source</label>
                  <input
                    type="text"
                    required
                    value={cropSource}
                    onChange={(e) => setCropSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Farmer / Origin</label>
                  <input
                    type="text"
                    required
                    value={farmerSource}
                    onChange={(e) => setFarmerSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Package Unit Size</label>
                  <input
                    type="text"
                    required
                    value={packageSize}
                    onChange={(e) => setPackageSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    required
                    value={quantityUnits}
                    onChange={(e) => setQuantityUnits(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Packaging Material</label>
                  <input
                    type="text"
                    required
                    value={packagingMat}
                    onChange={(e) => setPackagingMat(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Shelf Life (Months)</label>
                  <input
                    type="number"
                    required
                    value={expiryMonths}
                    onChange={(e) => setExpiryMonths(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsNewBatchModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Encode & Package Batch
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
