import React, { useState, useMemo } from 'react';
import {
  Users, Search, Filter, PlusCircle, CheckCircle2, XCircle,
  Phone, MapPin, Calendar, Star, TrendingUp, Sprout, ArrowRight,
  ShieldCheck, Clock, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';
import type { AggregatorFarmer } from '../../types';

export const AggregatorFarmersPage: React.FC = () => {
  const { aggregatorFarmers, addAggregatorFarmer, updateFarmerStatus, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');
  const [selectedFarmerForModal, setSelectedFarmerForModal] = useState<AggregatorFarmer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Farmer Form State
  const [newFarmerName, setNewFarmerName] = useState('');
  const [newFarmerPhone, setNewFarmerPhone] = useState('');
  const [newFarmerVillage, setNewFarmerVillage] = useState('');
  const [newFarmerTaluka, setNewFarmerTaluka] = useState('');
  const [newFarmerDistrict, setNewFarmerDistrict] = useState('Nashik');
  const [newFarmerFarmSize, setNewFarmerFarmSize] = useState('10');
  const [newFarmerCrop, setNewFarmerCrop] = useState('Tomato');

  const filteredFarmers = useMemo(() => {
    return aggregatorFarmers.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.phone.includes(searchQuery);
      const matchesCrop = selectedCropFilter === 'ALL' || f.cropsGrown.includes(selectedCropFilter);
      const matchesDistrict = selectedDistrictFilter === 'ALL' || f.district === selectedDistrictFilter;
      return matchesSearch && matchesCrop && matchesDistrict;
    });
  }, [aggregatorFarmers, searchQuery, selectedCropFilter, selectedDistrictFilter]);

  const handleCreateFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmerName || !newFarmerPhone) return;

    addAggregatorFarmer({
      name: newFarmerName,
      phone: newFarmerPhone,
      village: newFarmerVillage || 'Palkhed',
      taluka: newFarmerTaluka || 'Dindori',
      district: newFarmerDistrict,
      state: 'Maharashtra',
      farmSizeAcres: parseFloat(newFarmerFarmSize) || 5,
      cropsGrown: [newFarmerCrop],
      expectedHarvests: [
        { crop: newFarmerCrop, expectedTonnes: 15, expectedDate: '2026-09-15', variety: 'Hybrid' }
      ]
    });

    setIsAddModalOpen(false);
    setNewFarmerName('');
    setNewFarmerPhone('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" /> Farmer Network CRM
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Registered Cultivators & FPO Farmers
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-light">
            Manage contract farmers, upcoming harvest forecasts, historical supplies, and direct dispatch routing.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Register New Farmer</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 md:p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search farmer by name, village, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:border-emerald-500/50 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#121214]">All Crops</option>
            <option value="Tomato" className="bg-[#121214]">Tomato</option>
            <option value="Red Onion" className="bg-[#121214]">Red Onion</option>
            <option value="Soybean" className="bg-[#121214]">Soybean</option>
            <option value="Wheat" className="bg-[#121214]">Wheat</option>
            <option value="Turmeric" className="bg-[#121214]">Turmeric</option>
          </select>

          <select
            value={selectedDistrictFilter}
            onChange={(e) => setSelectedDistrictFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#121214]">All Districts</option>
            <option value="Nashik" className="bg-[#121214]">Nashik</option>
            <option value="Latur" className="bg-[#121214]">Latur</option>
            <option value="Pune" className="bg-[#121214]">Pune</option>
            <option value="Sangli" className="bg-[#121214]">Sangli</option>
          </select>
        </div>
      </div>

      {/* Farmers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer.id}
            className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div>
              {/* Farmer Header info */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                      {farmer.name}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {farmer.village}, {farmer.taluka}, {farmer.district}
                  </p>
                  <p className="text-xs font-mono text-neutral-300 mt-0.5">
                    📞 {farmer.phone}
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  farmer.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {farmer.status}
                </span>
              </div>

              {/* Crops Grown Pills */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Crops Cultivated</span>
                <div className="flex flex-wrap gap-1.5">
                  {farmer.cropsGrown.map((crop) => (
                    <span
                      key={crop}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    >
                      <img src={getCropImage(crop)} alt={crop} className="w-3.5 h-3.5 rounded-full object-cover" />
                      <span>{crop}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Expected Harvests Forecast */}
              {farmer.expectedHarvests.length > 0 && (
                <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Next Expected Harvest
                  </span>
                  <div className="text-xs font-mono text-white flex justify-between">
                    <span>{farmer.expectedHarvests[0].crop} ({farmer.expectedHarvests[0].variety})</span>
                    <strong className="text-emerald-400">{farmer.expectedHarvests[0].expectedTonnes} Tonnes</strong>
                  </div>
                  <span className="text-[10px] text-neutral-400 block">Due: {farmer.expectedHarvests[0].expectedDate}</span>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono text-neutral-300">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-neutral-500 block font-sans">Supplied</span>
                  <span className="font-bold text-white">{farmer.totalSuppliedTonnes} T</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-neutral-500 block font-sans">Rating</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {farmer.rating} / 5.0
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => setSelectedFarmerForModal(farmer)}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
              >
                View Full Profile
              </button>

              {farmer.status === 'PENDING' ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateFarmerStatus(farmer.id, 'ACTIVE')}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer"
                    title="Approve Farmer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateFarmerStatus(farmer.id, 'REJECTED')}
                    className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all cursor-pointer"
                    title="Reject"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('aggregator-collection');
                  }}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Pickup</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Full Farmer Profile & Harvest Details */}
      {selectedFarmerForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121214] border border-white/15 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                  {selectedFarmerForModal.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedFarmerForModal.name}</h3>
                  <p className="text-xs text-neutral-400">Farmer ID: {selectedFarmerForModal.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFarmerForModal(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <span className="text-neutral-400 block font-bold">Location</span>
                  <span className="text-white font-medium">{selectedFarmerForModal.village}, {selectedFarmerForModal.taluka}, {selectedFarmerForModal.district}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-bold">Farm Area</span>
                  <span className="text-white font-medium">{selectedFarmerForModal.farmSizeAcres} Acres</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-bold">Contact Number</span>
                  <span className="text-white font-mono">{selectedFarmerForModal.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-bold">Cumulative Payments</span>
                  <span className="text-emerald-400 font-mono font-bold">₹{selectedFarmerForModal.totalPaymentsReceived.toLocaleString()}</span>
                </div>
              </div>

              {/* Harvest Schedule */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Scheduled Harvest Ready Dates</h4>
                {selectedFarmerForModal.expectedHarvests.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2">
                      <img src={getCropImage(h.crop)} alt={h.crop} className="w-6 h-6 rounded-md object-cover" />
                      <span className="text-white font-sans">{h.crop} ({h.variety})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">{h.expectedTonnes} Tonnes</span>
                      <span className="text-[10px] text-neutral-400">{h.expectedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex gap-3">
              <a
                href={`tel:${selectedFarmerForModal.phone}`}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Direct Call Farmer</span>
              </a>
              <button
                onClick={() => {
                  setSelectedFarmerForModal(null);
                  setActiveTab('aggregator-collection');
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sprout className="w-4 h-4" />
                <span>Schedule Gate Pickup</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Farmer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleCreateFarmer} className="bg-[#121214] border border-white/15 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Register New Contract Farmer
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tukaram Shankar Shinde"
                  value={newFarmerName}
                  onChange={(e) => setNewFarmerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={newFarmerPhone}
                    onChange={(e) => setNewFarmerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Farm Size (Acres)</label>
                  <input
                    type="number"
                    value={newFarmerFarmSize}
                    onChange={(e) => setNewFarmerFarmSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Village</label>
                  <input
                    type="text"
                    placeholder="e.g. Palkhed"
                    value={newFarmerVillage}
                    onChange={(e) => setNewFarmerVillage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Taluka</label>
                  <input
                    type="text"
                    placeholder="e.g. Dindori"
                    value={newFarmerTaluka}
                    onChange={(e) => setNewFarmerTaluka(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">District</label>
                  <select
                    value={newFarmerDistrict}
                    onChange={(e) => setNewFarmerDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Nashik" className="bg-[#121214]">Nashik</option>
                    <option value="Latur" className="bg-[#121214]">Latur</option>
                    <option value="Pune" className="bg-[#121214]">Pune</option>
                    <option value="Sangli" className="bg-[#121214]">Sangli</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Primary Crop Cultivated</label>
                <select
                  value={newFarmerCrop}
                  onChange={(e) => setNewFarmerCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                >
                  <option value="Tomato" className="bg-[#121214]">Tomato</option>
                  <option value="Red Onion" className="bg-[#121214]">Red Onion</option>
                  <option value="Soybean" className="bg-[#121214]">Soybean</option>
                  <option value="Wheat" className="bg-[#121214]">Wheat</option>
                  <option value="Turmeric" className="bg-[#121214]">Turmeric</option>
                  <option value="Cotton" className="bg-[#121214]">Cotton</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer"
              >
                Confirm Registration
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
