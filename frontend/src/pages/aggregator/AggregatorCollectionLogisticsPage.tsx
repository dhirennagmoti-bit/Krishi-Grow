import React, { useState } from 'react';
import {
  Truck, PlusCircle, Calendar, MapPin, Phone, CheckCircle2,
  Clock, ArrowRight, ShieldCheck, Scale, FileText, AlertCircle,
  X, Navigation, UserCheck, DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';
import type { HarvestCollectionRequest } from '../../types';

export const AggregatorCollectionLogisticsPage: React.FC = () => {
  const {
    collectionRequests, addCollectionRequest, updateCollectionStatus,
    aggregatorFarmers, setActiveTab
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequestForConfirm, setSelectedRequestForConfirm] = useState<HarvestCollectionRequest | null>(null);
  const [actualReceivedKg, setActualReceivedKg] = useState('');

  // New Collection Form
  const [selectedFarmerId, setSelectedFarmerId] = useState(aggregatorFarmers[0]?.id || 'frm_01');
  const [crop, setCrop] = useState('Tomato');
  const [variety, setVariety] = useState('Abhinav Hybrid (Red)');
  const [expectedTonnes, setExpectedTonnes] = useState('10');
  const [collectionDate, setCollectionDate] = useState('2026-08-26');
  const [village, setVillage] = useState('Palkhed Farm Gate #1');
  const [district, setDistrict] = useState('Nashik');
  const [vehicle, setVehicle] = useState('Eicher Pro 3015 (MH-15-EG-4402)');
  const [driver, setDriver] = useState('Santosh Gaikwad');
  const [driverPhone, setDriverPhone] = useState('+91 98231 11405');
  const [notes, setNotes] = useState('Bring 400 clean plastic ventilated crates.');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const farmer = aggregatorFarmers.find(f => f.id === selectedFarmerId) || aggregatorFarmers[0];

    addCollectionRequest({
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      crop,
      variety,
      expectedTonnes: parseFloat(expectedTonnes) || 5,
      collectionDate,
      village: village || farmer.village,
      district: district || farmer.district,
      assignedVehicle: vehicle,
      assignedDriver: driver,
      driverPhone: driverPhone,
      eta: 'Scheduled for ' + collectionDate,
      notes
    });

    setIsCreateModalOpen(false);
  };

  const handleConfirmCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForConfirm) return;
    const actualTonnes = parseFloat(actualReceivedKg) / 1000 || selectedRequestForConfirm.expectedTonnes;

    updateCollectionStatus(selectedRequestForConfirm.id, 'COLLECTED', actualTonnes);
    setSelectedRequestForConfirm(null);
    setActualReceivedKg('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-6 md:p-8 rounded-xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" /> First-Mile Farmgate Logistics
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Harvest Collection & Pickup Routing
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-normal">
            Dispatch fleet vehicles, schedule farmgate pickups, track real-time transit ETAs, and record delivery arrivals.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-950 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create Pickup Request</span>
        </button>
      </div>

      {/* Collection Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {collectionRequests.map((req) => (
          <div
            key={req.id}
            className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-5 shadow-xl group"
          >
            <div className="space-y-4">
              
              {/* Top Meta */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getCropImage(req.crop)}
                    alt={req.crop}
                    className="w-14 h-14 rounded-xl object-cover border border-white/15 shrink-0 shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      {req.crop}
                    </h3>
                    <p className="text-xs text-neutral-400">{req.variety}</p>
                    <span className="text-xs font-mono font-bold text-cyan-400 mt-1 block">
                      Target: {req.expectedTonnes} Tonnes
                    </span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  req.status === 'IN_TRANSIT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  req.status === 'COLLECTED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {req.status.replace('_', ' ')}
                </span>
              </div>

              {/* Farmer & Location Box */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Farmer:</span>
                  <strong className="text-white">{req.farmerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Farm Gate:</span>
                  <span className="text-neutral-300">{req.village}, {req.district}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-neutral-400">Phone:</span>
                  <a href={`tel:${req.farmerPhone}`} className="text-cyan-400 underline">{req.farmerPhone}</a>
                </div>
              </div>

              {/* Vehicle & Fleet Dispatch Details */}
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Assigned Fleet</span>
                  <span>{req.assignedVehicle.split(' ')[0]}</span>
                </div>
                <div className="text-white font-medium">{req.assignedVehicle}</div>
                <div className="flex justify-between text-neutral-300 text-xs">
                  <span>Driver: {req.assignedDriver}</span>
                  <a href={`tel:${req.driverPhone}`} className="text-cyan-400 underline">{req.driverPhone}</a>
                </div>
                <div className="text-xs text-amber-300 pt-1 border-t border-white/10 font-sans flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ETA / Status: {req.eta}
                </div>
              </div>

              {req.notes && (
                <p className="text-xs text-neutral-400 italic bg-black/40 p-2.5 rounded-xl border border-white/5">
                  "{req.notes}"
                </p>
              )}

            </div>

            {/* Status Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              {req.status === 'SCHEDULED' && (
                <button
                  onClick={() => updateCollectionStatus(req.id, 'IN_TRANSIT')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Dispatch Vehicle to Farm</span>
                </button>
              )}

              {req.status === 'IN_TRANSIT' && (
                <button
                  onClick={() => {
                    setSelectedRequestForConfirm(req);
                    setActualReceivedKg((req.expectedTonnes * 1000).toString());
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Farm Arrival & Load</span>
                </button>
              )}

              {req.status === 'COLLECTED' && (
                <button
                  onClick={() => setActiveTab('aggregator-weighing-qc')}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/15"
                >
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Go to Weighbridge Slip ({req.actualTonnes || req.expectedTonnes} T)</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Create Collection Request */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleCreate} className="bg-[#121214] border border-white/15 rounded-xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                Schedule Farm Harvest Pickup
              </h3>
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Select Registered Farmer</label>
                <select
                  value={selectedFarmerId}
                  onChange={(e) => setSelectedFarmerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                >
                  {aggregatorFarmers.map(f => (
                    <option key={f.id} value={f.id} className="bg-[#121214]">
                      {f.name} ({f.village}, {f.district}) - {f.cropsGrown.join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Crop</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Tomato" className="bg-[#121214]">Tomato</option>
                    <option value="Red Onion" className="bg-[#121214]">Red Onion</option>
                    <option value="Soybean" className="bg-[#121214]">Soybean</option>
                    <option value="Turmeric" className="bg-[#121214]">Turmeric</option>
                    <option value="Wheat" className="bg-[#121214]">Wheat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Expected Tonnes</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={expectedTonnes}
                    onChange={(e) => setExpectedTonnes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Collection Date</label>
                  <input
                    type="date"
                    required
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Farm Pickup Location</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Assign Fleet Vehicle</label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Eicher Pro 3015 (MH-15-EG-4402)" className="bg-[#121214]">Eicher Pro 3015 (10T)</option>
                    <option value="Tata 407 LPT (MH-10-CT-8921)" className="bg-[#121214]">Tata 407 LPT (3.5T)</option>
                    <option value="Mahindra Bolero Maxi Truck (MH-12-PQ-9081)" className="bg-[#121214]">Mahindra Bolero (1.5T)</option>
                    <option value="BharatBenz 1617R (MH-24-AA-5519)" className="bg-[#121214]">BharatBenz 1617R (16T)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Assign Driver</label>
                  <input
                    type="text"
                    required
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Dispatch Instructions & Logistics Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Dispatch & Schedule Pickup
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Confirm Received Quantity */}
      {selectedRequestForConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleConfirmCollection} className="bg-[#121214] border border-white/15 rounded-xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Confirm Farm Load Arrival
              </h3>
              <button type="button" onClick={() => setSelectedRequestForConfirm(null)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-neutral-300">
                Confirming collection for <strong className="text-white">{selectedRequestForConfirm.farmerName}</strong> ({selectedRequestForConfirm.crop}).
              </p>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Actual Loaded Gross Weight (in Kg)</label>
                <input
                  type="number"
                  required
                  value={actualReceivedKg}
                  onChange={(e) => setActualReceivedKg(e.target.value)}
                  placeholder="e.g. 8420"
                  className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-base outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-neutral-400 mt-1 block">
                  Equivalent to {(parseFloat(actualReceivedKg || '0') / 1000).toFixed(2)} Tonnes
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedRequestForConfirm(null)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Record Arrival & Proceed
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
