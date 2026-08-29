import React, { useState } from 'react';
import {
  Scale, ShieldCheck, PlusCircle, CheckCircle2, AlertTriangle,
  FileText, Printer, Check, X, ArrowRight, Eye, Droplet, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';
import type { QualityGrade, WeighingSlip, QualityReport } from '../../types';

export const AggregatorWeighingQCPage: React.FC = () => {
  const {
    weighingSlips, qualityReports, addWeighingSlip, addQualityReport,
    openDocument
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'WEIGHING' | 'QC'>('WEIGHING');
  const [isWeighModalOpen, setIsWeighModalOpen] = useState(false);
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);

  // New Weighing Slip Form
  const [farmerName, setFarmerName] = useState('Ramesh Patil');
  const [crop, setCrop] = useState('Tomato');
  const [variety, setVariety] = useState('Abhinav Hybrid');
  const [grossWeight, setGrossWeight] = useState('14820');
  const [tareWeight, setTareWeight] = useState('6400');
  const [moisture, setMoisture] = useState('88.2');
  const [damage, setDamage] = useState('1.4');
  const [foreignMatter, setForeignMatter] = useState('0.2');
  const [weighbridgeLoc, setWeighbridgeLoc] = useState('Dindori APMC Hub Weighbridge');

  const netWeight = Math.max(0, (parseFloat(grossWeight) || 0) - (parseFloat(tareWeight) || 0));

  // Determine auto-grade based on quality metrics
  const calculatedGrade: QualityGrade = 
    parseFloat(damage) > 10 ? 'Rejected' :
    parseFloat(damage) > 5 ? 'C' :
    parseFloat(damage) > 2.5 ? 'B' :
    parseFloat(damage) < 1.5 ? 'A+' : 'A';

  // New QC Report Form
  const [qcBatchId, setQcBatchId] = useState('BATCH-TOM-2026-0824');
  const [qcCrop, setQcCrop] = useState('Tomato');
  const [qcSupplier, setQcSupplier] = useState('Ramesh Patil (Palkhed)');
  const [qcGrade, setQcGrade] = useState<QualityGrade>('A');
  const [qcDecision, setQcDecision] = useState<'ACCEPT' | 'PARTIALLY_ACCEPT' | 'REJECT'>('ACCEPT');
  const [qcSize, setQcSize] = useState<'Large' | 'Medium' | 'Small' | 'Uniform'>('Uniform');
  const [qcColor, setQcColor] = useState<'Deep Natural' | 'Moderate' | 'Faded / Uneven'>('Deep Natural');
  const [qcRipeness, setQcRipeness] = useState<'Optimal' | 'Overripe' | 'Underripe'>('Optimal');
  const [qcMoisture, setQcMoisture] = useState('88.2');
  const [qcDamage, setQcDamage] = useState('1.4');
  const [qcDisease, setQcDisease] = useState('0.0');
  const [qcForeign, setQcForeign] = useState('0.2');

  const handleCreateWeighSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const batchId = `BATCH-${crop.substring(0, 3).toUpperCase()}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;

    addWeighingSlip({
      batchId,
      farmerName,
      crop,
      variety,
      grossWeightKg: parseFloat(grossWeight) || 0,
      tareWeightKg: parseFloat(tareWeight) || 0,
      netWeightKg: netWeight,
      moisturePercent: parseFloat(moisture) || 0,
      damagedPercent: parseFloat(damage) || 0,
      foreignMatterPercent: parseFloat(foreignMatter) || 0,
      calculatedGrade,
      weighmentTime: new Date().toLocaleString(),
      operatorName: 'Anil Bhamare (Weighbridge Incharge)',
      weighbridgeLocation: weighbridgeLoc
    });

    setIsWeighModalOpen(false);
  };

  const handleCreateQC = (e: React.FormEvent) => {
    e.preventDefault();
    addQualityReport({
      batchId: qcBatchId,
      crop: qcCrop,
      farmerOrSupplier: qcSupplier,
      date: new Date().toISOString().split('T')[0],
      assignedGrade: qcGrade,
      parameters: {
        size: qcSize,
        color: qcColor,
        moisturePercent: parseFloat(qcMoisture) || 0,
        damagePercent: parseFloat(qcDamage) || 0,
        diseasePercent: parseFloat(qcDisease) || 0,
        foreignMaterialPercent: parseFloat(qcForeign) || 0,
        ripeness: qcRipeness
      },
      inspectorName: 'Dr. Vivek Joshi (Certified Quality Auditor)',
      decision: qcDecision
    });

    setIsQCModalOpen(false);
  };

  const handleViewQCCertificate = (report: QualityReport) => {
    openDocument({
      id: report.id,
      type: 'QUALITY_CERTIFICATE',
      docNumber: `QC-CERT-${report.batchId}`,
      date: report.date,
      issuerName: 'Krishi Grow Certified Quality Testing Lab',
      issuerRole: report.inspectorName,
      recipientName: report.farmerOrSupplier,
      cropOrProduct: report.crop,
      quantity: 'Verified Laboratory Sample',
      grade: `Grade ${report.assignedGrade} (${report.decision})`,
      status: 'APPROVED & CERTIFIED',
      metadata: {
        parameters: report.parameters,
        rejectionReason: report.rejectionReason
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-6 md:p-8 rounded-xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" /> Automated Intake Weighment & QC
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Weighbridge Station & Quality Grading Lab
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-normal">
            Generate tamper-proof weighment slips, inspect moisture/defects, assign standardized grades, and issue digital certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'WEIGHING' ? (
            <button
              onClick={() => setIsWeighModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Record Weighment Slip</span>
            </button>
          ) : (
            <button
              onClick={() => setIsQCModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-950 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Quality Inspection</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex p-1.5 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 max-w-md">
        <button
          onClick={() => setActiveSubTab('WEIGHING')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'WEIGHING'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Weighbridge Slips ({weighingSlips.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('QC')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'QC'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Quality Lab Reports ({qualityReports.length})</span>
        </button>
      </div>

      {/* 1. WEIGHING SLIPS TAB */}
      {activeSubTab === 'WEIGHING' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-neutral-300 font-bold uppercase text-xs border-b border-white/10">
                  <tr>
                    <th className="py-4 px-5">Batch ID & Crop</th>
                    <th className="py-4 px-5">Farmer</th>
                    <th className="py-4 px-5 font-mono">Gross Wt</th>
                    <th className="py-4 px-5 font-mono">Tare Wt</th>
                    <th className="py-4 px-5 font-mono">Net Produce Wt</th>
                    <th className="py-4 px-5">Moisture & Defect</th>
                    <th className="py-4 px-5">Auto Grade</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {weighingSlips.map((slip) => (
                    <tr key={slip.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img src={getCropImage(slip.crop)} alt={slip.crop} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                          <div>
                            <span className="font-bold text-white font-sans text-sm block">{slip.crop}</span>
                            <span className="text-xs text-neutral-400">{slip.batchId}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-sans font-medium text-white">
                        {slip.farmerName}
                        <span className="text-xs text-neutral-400 block font-mono">{slip.weighbridgeLocation}</span>
                      </td>

                      <td className="py-4 px-5 text-neutral-300">
                        {slip.grossWeightKg.toLocaleString()} kg
                      </td>

                      <td className="py-4 px-5 text-neutral-400">
                        {slip.tareWeightKg.toLocaleString()} kg
                      </td>

                      <td className="py-4 px-5 font-black text-emerald-400 text-sm">
                        {slip.netWeightKg.toLocaleString()} kg
                        <span className="text-xs text-neutral-400 font-sans block">({(slip.netWeightKg / 1000).toFixed(2)} T)</span>
                      </td>

                      <td className="py-4 px-5 font-sans">
                        <span className="text-white block font-mono">{slip.moisturePercent}% Moist</span>
                        <span className="text-xs text-neutral-400 font-mono">{slip.damagedPercent}% Damage</span>
                      </td>

                      <td className="py-4 px-5 font-sans">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          slip.calculatedGrade === 'A+' || slip.calculatedGrade === 'A'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          Grade {slip.calculatedGrade}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right font-sans">
                        <button
                          onClick={() => {
                            openDocument({
                              id: slip.id,
                              type: 'WAYBILL',
                              docNumber: `WEIGH-${slip.batchId}`,
                              date: slip.weighmentTime,
                              issuerName: slip.weighbridgeLocation,
                              issuerRole: slip.operatorName,
                              recipientName: slip.farmerName,
                              cropOrProduct: `${slip.crop} (${slip.variety})`,
                              quantity: `${slip.netWeightKg} Kg (${(slip.netWeightKg / 1000).toFixed(2)} Tonnes)`,
                              grade: `Grade ${slip.calculatedGrade}`,
                              status: 'WEIGHED & VALIDATED',
                              metadata: {
                                grossWeightKg: slip.grossWeightKg,
                                tareWeightKg: slip.tareWeightKg,
                                moisturePercent: slip.moisturePercent
                              }
                            });
                          }}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Slip</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. QUALITY LAB REPORTS TAB */}
      {activeSubTab === 'QC' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qualityReports.map((report) => (
            <div
              key={report.id}
              className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getCropImage(report.crop)}
                    alt={report.crop}
                    className="w-14 h-14 rounded-xl object-cover border border-white/15 shrink-0 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{report.crop}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Grade {report.assignedGrade}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono">Batch: {report.batchId}</p>
                    <p className="text-xs text-neutral-300 mt-0.5">Supplier: {report.farmerOrSupplier}</p>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                  report.decision === 'ACCEPT'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {report.decision}
                </span>
              </div>

              {/* Quality Radar Spec Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-xs text-neutral-400 block font-sans">Moisture</span>
                  <strong className="text-white">{report.parameters.moisturePercent}%</strong>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-xs text-neutral-400 block font-sans">Defects</span>
                  <strong className="text-emerald-400">{report.parameters.damagePercent}%</strong>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-xs text-neutral-400 block font-sans">Foreign Mat</span>
                  <strong className="text-white">{report.parameters.foreignMaterialPercent}%</strong>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-xs text-neutral-400 block font-sans">Size Class</span>
                  <strong className="text-cyan-300">{report.parameters.size}</strong>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-xs text-neutral-400 block font-sans">Coloration</span>
                  <strong className="text-amber-300">{report.parameters.color}</strong>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-xs text-neutral-400 block font-sans">Ripeness</span>
                  <strong className="text-emerald-400">{report.parameters.ripeness}</strong>
                </div>
              </div>

              <div className="text-xs text-neutral-400 font-normal flex items-center justify-between">
                <span>Auditor: {report.inspectorName}</span>
                <span className="font-mono">{report.date}</span>
              </div>

              <div className="pt-2 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => handleViewQCCertificate(report)}
                  className="w-full py-2.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Digital Quality Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: New Weighment Slip */}
      {isWeighModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleCreateWeighSlip} className="bg-[#121214] border border-white/15 rounded-xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                Digital Weighbridge Terminal Slip
              </h3>
              <button type="button" onClick={() => setIsWeighModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Farmer / Supplier Name</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Crop</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Tomato" className="bg-[#121214]">Tomato</option>
                    <option value="Red Onion" className="bg-[#121214]">Red Onion</option>
                    <option value="Soybean" className="bg-[#121214]">Soybean</option>
                    <option value="Wheat" className="bg-[#121214]">Wheat</option>
                    <option value="Turmeric" className="bg-[#121214]">Turmeric</option>
                  </select>
                </div>
              </div>

              {/* Weight Inputs */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Gross Wt (kg)</label>
                  <input
                    type="number"
                    required
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Tare Wt (kg)</label>
                  <input
                    type="number"
                    required
                    value={tareWeight}
                    onChange={(e) => setTareWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-emerald-400 font-bold mb-1">Net Weight</label>
                  <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono font-black text-sm">
                    {netWeight} kg
                  </div>
                </div>
              </div>

              {/* Quality Sliders / Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Moisture (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisture}
                    onChange={(e) => setMoisture(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Damage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={damage}
                    onChange={(e) => setDamage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Foreign Mat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foreignMatter}
                    onChange={(e) => setForeignMatter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-neutral-300 font-bold">Auto-Calculated Intake Grade:</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-black font-black text-xs font-mono">
                  Grade {calculatedGrade}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsWeighModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Save & Print Slip
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: New QC Report */}
      {isQCModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleCreateQC} className="bg-[#121214] border border-white/15 rounded-xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Laboratory Quality Inspection
              </h3>
              <button type="button" onClick={() => setIsQCModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Batch Reference ID</label>
                  <input
                    type="text"
                    required
                    value={qcBatchId}
                    onChange={(e) => setQcBatchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Commodity / Crop</label>
                  <input
                    type="text"
                    required
                    value={qcCrop}
                    onChange={(e) => setQcCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Size Uniformity</label>
                  <select
                    value={qcSize}
                    onChange={(e) => setQcSize(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  >
                    <option value="Uniform" className="bg-[#121214]">Uniform</option>
                    <option value="Large" className="bg-[#121214]">Large</option>
                    <option value="Medium" className="bg-[#121214]">Medium</option>
                    <option value="Small" className="bg-[#121214]">Small</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Ripeness</label>
                  <select
                    value={qcRipeness}
                    onChange={(e) => setQcRipeness(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  >
                    <option value="Optimal" className="bg-[#121214]">Optimal</option>
                    <option value="Underripe" className="bg-[#121214]">Underripe</option>
                    <option value="Overripe" className="bg-[#121214]">Overripe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Final Grade</label>
                  <select
                    value={qcGrade}
                    onChange={(e) => setQcGrade(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                  >
                    <option value="A+" className="bg-[#121214]">Grade A+</option>
                    <option value="A" className="bg-[#121214]">Grade A</option>
                    <option value="B" className="bg-[#121214]">Grade B</option>
                    <option value="C" className="bg-[#121214]">Grade C</option>
                    <option value="Rejected" className="bg-[#121214]">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Inspector Acceptance Decision</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ACCEPT', 'PARTIALLY_ACCEPT', 'REJECT'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setQcDecision(d)}
                      className={`py-2 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                        qcDecision === d
                          ? d === 'ACCEPT' ? 'bg-emerald-600 text-white border-emerald-500' :
                            d === 'PARTIALLY_ACCEPT' ? 'bg-amber-600 text-white border-amber-500' :
                            'bg-rose-600 text-white border-rose-500'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {d.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsQCModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Issue Quality Report
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
