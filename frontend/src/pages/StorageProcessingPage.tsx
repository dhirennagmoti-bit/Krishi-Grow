import React, { useState } from 'react';
import {
  Warehouse, Factory, MapPin, Phone, CheckCircle2, ShieldCheck,
  Search, ArrowRight
} from 'lucide-react';
import { storageFacilities, processingFacilities } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const StorageProcessingPage: React.FC = () => {
  const { setActiveTab: setGlobalActiveTab } = useApp();
  const [activeTab, setActiveTab] = useState<'STORAGE' | 'PROCESSING'>('STORAGE');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStorage = storageFacilities.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProcessing = processingFacilities.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cropsAccepted.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInquiry = (name: string) => {
    setBookingSuccess(name);
    setTimeout(() => setBookingSuccess(null), 6000);
  };

  return (
    <div className="space-y-8">

      {/* Header Banner */}
      <div className="bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50">
              <Warehouse className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-white">
                  Cold Storage & Food Processing Hub
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  WDRA & FSSAI Verified
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Discover verified cold storages, dry godowns & industrial food processing facilities near Maharashtra.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-right">
              <span className="text-[10px] text-neutral-400 block">Total Storages</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{storageFacilities.length} Units</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-right">
              <span className="text-[10px] text-neutral-400 block">Processing Plants</span>
              <span className="text-sm font-bold text-purple-400 font-mono">{processingFacilities.length} Plants</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('STORAGE')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'STORAGE'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 border border-emerald-500/40'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <Warehouse className="w-4 h-4" />
              <span>Cold Storages & Warehouses ({storageFacilities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('PROCESSING')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'PROCESSING'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950 border border-purple-500/40'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <Factory className="w-4 h-4" />
              <span>Food Processing Plants ({processingFacilities.length})</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {bookingSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-3 shadow-xl animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Inquiry sent to facility manager ({bookingSuccess})! They will call you at your registered mobile number shortly.</span>
        </div>
      )}

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'STORAGE' ? (
          filteredStorage.map((f) => {
            const availPct = Math.round((f.availableCapacityTonnes / f.totalCapacityTonnes) * 100);
            return (
              <div
                key={f.id}
                className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5 flex flex-col justify-between hover:border-emerald-500/30 transition-all group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                      {f.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ₹{f.pricePerTonDay} <span className="text-[10px] text-neutral-400 font-sans font-normal">/ Ton / Day</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {f.name}
                  </h3>

                  <div className="text-xs text-neutral-400 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f.location} ({f.distanceKm} km away)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-neutral-300">{f.contactPhone}</span>
                    </div>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">Available Capacity</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {f.availableCapacityTonnes.toLocaleString()} / {f.totalCapacityTonnes.toLocaleString()} T ({availPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${availPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Features Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {f.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <a
                    href={`tel:${f.contactPhone.replace(/[^0-9+]/g, '')}`}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-bold text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>Call Facility</span>
                  </a>
                  <button
                    onClick={() => handleInquiry(f.name)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center border border-emerald-500/40 transition-colors cursor-pointer shadow-sm shadow-emerald-950"
                  >
                    Book Space
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          filteredProcessing.map((p) => (
            <div
              key={p.id}
              className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5 flex flex-col justify-between hover:border-purple-500/30 transition-all group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-600/20 text-purple-300 border border-purple-500/30">
                    Industrial Processing
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-400">
                    {p.dailyCapacityTonnes} T / Day
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {p.name}
                </h3>

                <div className="text-xs text-neutral-400 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{p.location} ({p.distanceKm} km away)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="font-mono text-neutral-300">{p.contactPhone}</span>
                  </div>
                </div>

                {/* Crops Accepted & Processing */}
                <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                      Crops Accepted:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.cropsAccepted.map((crop, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-200 text-[11px] font-medium">
                          🌾 {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 border-t border-white/5">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                      Processing Output:
                    </span>
                    <span className="text-neutral-300 text-[11px] block mt-0.5">
                      ⚙️ {p.processingTypes.join(' • ')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400">
                  <span>Min Batch Size: </span>
                  <strong className="text-purple-300 font-mono">{p.minBatchTonnes} Tonnes</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <a
                  href={`tel:${p.contactPhone.replace(/[^0-9+]/g, '')}`}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-bold text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-purple-400" />
                  <span>Call Facility</span>
                </a>
                <button
                  onClick={() => handleInquiry(p.name)}
                  className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold text-center border border-purple-500/40 transition-colors cursor-pointer shadow-sm shadow-purple-950"
                >
                  Send Inquiry
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
