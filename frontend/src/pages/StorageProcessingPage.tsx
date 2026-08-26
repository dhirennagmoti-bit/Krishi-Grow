import React, { useState, useMemo } from 'react';
import {
  Warehouse, Factory, MapPin, Phone, CheckCircle2, ShieldCheck,
  Search, Users, Briefcase, Sprout, Star, Mail, ArrowRight,
  ChevronDown, ChevronUp, X
} from 'lucide-react';
import { storageFacilities, processingFacilities } from '../data/mockData';
import { useApp } from '../context/AppContext';

// Unified search result type for cross-role matching
interface SearchResult {
  id: string;
  name: string;
  role: 'FARMER' | 'AGGREGATOR' | 'PROCESSOR' | 'WHOLESALER';
  phone: string;
  email?: string;
  location: string;
  crops: string[];
  extra: Record<string, string | number>;
}

export const StorageProcessingPage: React.FC = () => {
  const {
    setActiveTab: setGlobalActiveTab,
    user, buyerReqs, aggregatorFarmers, wholesalerCustomers, crops
  } = useApp();

  const [activeTab, setActiveTab] = useState<'STORAGE' | 'PROCESSING'>('STORAGE');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  // ---------- Build cross-role people directory ----------
  const peopleDirectory = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];

    // Add buyers from buyer requirements (Aggregators / Processors / Wholesalers)
    buyerReqs.forEach(b => {
      if (!results.find(r => r.id === b.buyerId)) {
        results.push({
          id: b.buyerId,
          name: b.buyerName,
          role: b.buyerType,
          phone: '',
          location: b.pickupRegion,
          crops: [b.crop],
          extra: {
            'Required Qty': `${b.quantityRequiredTonnes} T`,
            'Target Price': `₹${b.targetPricePerQuintal}/Qtl`,
            'Min Grade': b.minGrade,
            'Frequency': b.frequency.replace('_', ' '),
          }
        });
      } else {
        const existing = results.find(r => r.id === b.buyerId);
        if (existing && !existing.crops.includes(b.crop)) existing.crops.push(b.crop);
      }
    });

    // Add wholesaler customers
    wholesalerCustomers.forEach(w => {
      if (!results.find(r => r.id === w.id)) {
        results.push({
          id: w.id,
          name: w.businessName,
          role: 'WHOLESALER',
          phone: w.phone,
          email: w.email,
          location: `${w.city}, ${w.state}`,
          crops: [],
          extra: {
            'Contact Person': w.contactPerson,
            'Business Type': w.type.replace('_', ' '),
            'Total Orders': `${w.totalOrdersCount}`,
            'Total Value': `₹${(w.totalOrderValue / 100000).toFixed(1)}L`,
            'Status': w.status,
          }
        });
      }
    });

    // Add farmers from aggregator farmer directory
    aggregatorFarmers.forEach(f => {
      if (!results.find(r => r.id === f.id)) {
        results.push({
          id: f.id,
          name: f.name,
          role: 'FARMER',
          phone: f.phone,
          location: `${f.village}, ${f.taluka}, ${f.district}`,
          crops: f.cropsGrown,
          extra: {
            'Farm Size': `${f.farmSizeAcres} Acres`,
            'Total Supplied': `${f.totalSuppliedTonnes} T`,
            'Rating': `${f.rating} ★`,
            'Status': f.status,
          }
        });
      }
    });

    return results;
  }, [buyerReqs, wholesalerCustomers, aggregatorFarmers]);

  // Filter people by search
  const matchedPeople = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return peopleDirectory.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.crops.some(c => c.toLowerCase().includes(q))
    );
  }, [searchTerm, peopleDirectory]);

  // Filter facilities
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'FARMER': return { bg: 'bg-emerald-600/20', text: 'text-emerald-300', border: 'border-emerald-500/30', icon: <Sprout className="w-3 h-3" /> };
      case 'AGGREGATOR': return { bg: 'bg-cyan-600/20', text: 'text-cyan-300', border: 'border-cyan-500/30', icon: <Users className="w-3 h-3" /> };
      case 'PROCESSOR': return { bg: 'bg-amber-600/20', text: 'text-amber-300', border: 'border-amber-500/30', icon: <Factory className="w-3 h-3" /> };
      case 'WHOLESALER': return { bg: 'bg-purple-600/20', text: 'text-purple-300', border: 'border-purple-500/30', icon: <Briefcase className="w-3 h-3" /> };
      default: return { bg: 'bg-white/10', text: 'text-neutral-300', border: 'border-white/10', icon: null };
    }
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
                Search facilities, farmers, aggregators, processors & wholesalers — all in one place.
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
            <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-right">
              <span className="text-[10px] text-neutral-400 block">People Directory</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{peopleDirectory.length} Profiles</span>
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
              <span>Cold Storages ({storageFacilities.length})</span>
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
              <span>Processing Plants ({processingFacilities.length})</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search facilities, farmers, buyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {bookingSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-3 shadow-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Inquiry sent to facility manager ({bookingSuccess})! They will call you at your registered mobile number shortly.</span>
        </div>
      )}

      {/* ========== People Search Results ========== */}
      {matchedPeople.length > 0 && (
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">People & Business Matches</h3>
                <p className="text-[11px] text-gray-400">
                  {user.role === 'FARMER' ? 'Buyers, aggregators & processors matching your search' : 'Farmers & suppliers matching your search'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-900/40 border border-cyan-500/30 px-3 py-1 rounded-full">
              {matchedPeople.length} found
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {matchedPeople.map((person) => {
              const badge = getRoleBadge(person.role);
              const isExpanded = expandedPerson === person.id;

              return (
                <div key={person.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedPerson(isExpanded ? null : person.id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${badge.bg} border ${badge.border} flex items-center justify-center shrink-0`}>
                        {badge.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white truncate">{person.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} border ${badge.border}`}>
                            {person.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-500" />
                            {person.location}
                          </span>
                          {person.crops.length > 0 && (
                            <span className="text-emerald-400/70">
                              🌾 {person.crops.slice(0, 3).join(', ')}{person.crops.length > 3 ? ` +${person.crops.length - 3}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4">
                      {/* Detail Grid */}
                      <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Object.entries(person.extra).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">{key}</span>
                              <span className="text-xs text-white font-semibold mt-0.5 block">{String(value)}</span>
                            </div>
                          ))}
                          {person.crops.length > 0 && (
                            <div className="col-span-2 sm:col-span-3">
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold mb-1">Crops</span>
                              <div className="flex flex-wrap gap-1">
                                {person.crops.map((c, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-200 text-[11px] font-medium">
                                    🌾 {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {person.phone && (
                          <a
                            href={`tel:${person.phone.replace(/[^0-9+]/g, '')}`}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-950"
                          >
                            <Phone className="w-3 h-3" />
                            Call {person.phone}
                          </a>
                        )}
                        {person.email && (
                          <a
                            href={`mailto:${person.email}`}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                          >
                            <Mail className="w-3 h-3" />
                            Email
                          </a>
                        )}
                        <button
                          onClick={() => setGlobalActiveTab('buyer-connections')}
                          className="px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 border border-cyan-500/30 transition-colors cursor-pointer"
                        >
                          <ArrowRight className="w-3 h-3" />
                          Request Connection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== Facilities Cards Grid ========== */}
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
