import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, CheckCircle2, MapPin, Building2, ArrowRight, Warehouse, Factory,
  Send, Mail, Phone, Clock, ShieldCheck, Sparkles, Filter, X, Eye,
  Search, Sprout, AlertCircle, ChevronRight, Check, Ban
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { storageFacilities, processingFacilities } from '../data/mockData';
import type { ConnectionRequest, BuyerRequirement, StorageFacility, CropRecord } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export const BuyerConnectionsPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    user, buyerReqs, connectionRequests, requestConnection,
    updateConnectionStatus, requireAuth, crops
  } = useApp();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'BUYERS' | 'STORAGES' | 'FARMERS' | 'MY_CONNECTIONS'>('BUYERS');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate network fetch for data-heavy section
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Proposal Modal State
  const [proposalTarget, setProposalTarget] = useState<{
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    district: string;
    crop: string;
    defaultQty: number;
    defaultPrice?: number;
    type: 'CROP_TRADE' | 'COLD_STORAGE_BOOKING';
  } | null>(null);

  const [propQuantity, setPropQuantity] = useState<number>(10);
  const [propPrice, setPropPrice] = useState<number>(2500);
  const [propDeliveryDate, setPropDeliveryDate] = useState<string>(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [propMessage, setPropMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  // Email Notification Preview Modal State
  const [previewConn, setPreviewConn] = useState<ConnectionRequest | null>(null);

  const openProposalModal = (target: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    district: string;
    crop: string;
    defaultQty: number;
    defaultPrice?: number;
    type: 'CROP_TRADE' | 'COLD_STORAGE_BOOKING';
  }) => {
    requireAuth(() => {
      setProposalTarget(target);
      setPropQuantity(target.defaultQty);
      setPropPrice(target.defaultPrice || 2500);
      setPropMessage(
        target.type === 'COLD_STORAGE_BOOKING'
          ? `Namaste ${target.name}. I would like to reserve storage space for ${target.defaultQty} Tonnes of ${target.crop} starting from ${propDeliveryDate}.`
          : `Namaste ${target.name}. I am proposing direct dispatch of ${target.defaultQty} Tonnes of Grade A ${target.crop} from my farm in ${user.district}.`
      );
    });
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTarget) return;

    setIsSending(true);
    try {
      const createdConn = await requestConnection(
        proposalTarget.id,
        proposalTarget.name,
        proposalTarget.crop,
        propQuantity,
        {
          offeredPricePerQuintal: propPrice,
          targetDate: propDeliveryDate,
          customMessage: propMessage,
          targetType: proposalTarget.type,
          receiverEmail: proposalTarget.email,
          receiverPhone: proposalTarget.phone,
          receiverType: proposalTarget.role,
          receiverDistrict: proposalTarget.district
        }
      );

      setProposalTarget(null);
      setPreviewConn(createdConn); // Show automated email notification preview immediately!
      success(`Trade proposal sent to ${proposalTarget.name}! Automated email notification delivered.`);
    } catch {
      error('Failed to dispatch connection request. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleAccept = async (id: string) => {
    await updateConnectionStatus(id, 'ACCEPTED');
    success('Connection accepted! Contact phone numbers and dispatch coordinates are now unlocked.');
  };

  const handleDecline = async (id: string) => {
    await updateConnectionStatus(id, 'REJECTED');
    success('Connection request declined.');
  };

  // Filtered Buyers
  const filteredBuyers = buyerReqs.filter(b => {
    const matchCrop = selectedCropFilter === 'ALL' || b.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchQuery = !searchQuery || b.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) || b.pickupRegion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCrop && matchQuery;
  });

  // Filtered Storages
  const filteredStorages = storageFacilities.filter(s => {
    const matchQuery = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchQuery;
  });

  // Filtered Farmers
  const filteredFarmers = crops.filter(c => {
    const matchCrop = selectedCropFilter === 'ALL' || c.name.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchQuery = !searchQuery || c.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) || c.location.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCrop && matchQuery;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-r from-blue-950/60 via-[#121218] to-black p-6 md:p-8 rounded-xl border border-blue-500/20 backdrop-blur-xl relative overflow-hidden shadow-md">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/30 border border-blue-400/40 rounded-xl text-blue-400">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  {t('buyers.directTrade', 'Direct Trade & Cold Chain Network')}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  {t('buyers.connectionHub', 'Buyer & Farmer Connection Hub')}
                </h1>
              </div>
            </div>
            <p className="text-neutral-400 text-sm mt-2 max-w-2xl">
              {t('buyers.description', 'Bidirectional matchmaking between Farmers, Aggregators, Food Processors, Wholesalers, and Cold Storage Owners with instant automated email notifications.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
              <span className="text-xs text-neutral-400 font-bold block uppercase">Active Trades</span>
              <span className="text-base font-black text-emerald-400 font-mono">{connectionRequests.length} Conns</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
              <span className="text-xs text-neutral-400 font-bold block uppercase">Verified Buyers</span>
              <span className="text-base font-black text-blue-400 font-mono">{buyerReqs.length} Buyers</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
              <span className="text-xs text-neutral-400 font-bold block uppercase">Cold Storages</span>
              <span className="text-base font-black text-cyan-400 font-mono">{storageFacilities.length} Units</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('BUYERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'BUYERS'
                ? 'bg-blue-600 text-white shadow-md shadow-md border border-blue-400/40'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t('buyers.verifiedBuyers', 'Verified Buyers')} ({buyerReqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('STORAGES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'STORAGES'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950 border border-cyan-400/40'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>{t('buyers.coldStorages', 'Cold Storages & Silos')} ({storageFacilities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('FARMERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'FARMERS'
                ? 'bg-emerald-600 text-white shadow-md shadow-md border border-emerald-400/40'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>{t('buyers.activeFarmers', 'Active Farmers')} ({crops.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MY_CONNECTIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'MY_CONNECTIONS'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950 border border-amber-400/40'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{t('buyers.myConnections', 'My Connections & Trades')} ({connectionRequests.length})</span>
          </button>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      {activeTab !== 'MY_CONNECTIONS' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#12161c]/80 backdrop-blur-xl p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-neutral-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Crop Filter:
            </span>
            {['ALL', 'Tomato', 'Red Onion', 'Soybean', 'Cotton', 'Wheat', 'Mango'].map(c => (
              <button
                key={c}
                onClick={() => setSelectedCropFilter(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCropFilter === c
                    ? 'bg-blue-600 text-white border border-blue-400/40'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, district, or region..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* ── TAB 1: BUYERS DIRECTORY ── */}
      {activeTab === 'BUYERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md flex flex-col justify-between space-y-5 animate-pulse h-[350px]">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10" />
                    <div>
                      <div className="h-4 w-24 bg-white/10 rounded mb-1.5" />
                      <div className="h-4 w-16 bg-blue-950 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-16 bg-white/5 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/10">
                  <div className="h-10 bg-white/5 rounded" />
                  <div className="h-10 bg-white/5 rounded" />
                  <div className="h-10 bg-white/5 rounded" />
                  <div className="h-10 bg-white/5 rounded" />
                </div>
                <div className="h-10 bg-white/5 rounded w-full" />
                <div className="pt-3 border-t border-white/10 mt-auto">
                  <div className="h-10 bg-white/10 rounded-xl w-full" />
                </div>
              </div>
            ))
          ) : (
            filteredBuyers.map(req => {
            const hasRequested = connectionRequests.some(c => c.receiverId === req.buyerId || c.buyerId === req.buyerId);
            return (
              <div
                key={req.id}
                className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md flex flex-col justify-between space-y-5 hover:border-blue-500/40 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                          {req.buyerName}
                        </h3>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-950 px-2 py-0.5 rounded border border-blue-500/20">
                          {req.buyerType}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-emerald-400 block font-bold uppercase">AI Match</span>
                      <span className="text-base font-bold text-emerald-400 font-mono">{req.matchScore}%</span>
                    </div>
                  </div>

                  {/* Requirements details */}
                  <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/10 text-xs">
                    <div>
                      <span className="text-xs text-neutral-400 block">Required Crop</span>
                      <span className="font-bold text-white">{req.crop}</span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">Target Quantity</span>
                      <span className="font-bold text-white font-mono">{req.quantityRequiredTonnes} Tonnes</span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">Indicative Price</span>
                      <span className="font-bold text-emerald-400 font-mono">₹{req.targetPricePerQuintal}/Qtl</span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block">Min Grade</span>
                      <span className="font-bold text-cyan-300">Grade {req.minGrade}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    <strong className="text-neutral-300">Notes:</strong> {req.notes}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Pickup: <strong className="text-white">{req.pickupRegion}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/10">
                  {hasRequested ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Connection Proposal Active</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => openProposalModal({
                        id: req.buyerId,
                        name: req.buyerName,
                        role: req.buyerType,
                        email: 'procurement@' + req.buyerName.toLowerCase().replace(/[^a-z]/g, '') + '.in',
                        phone: '+91 98220 99881',
                        district: req.pickupRegion,
                        crop: req.crop,
                        defaultQty: req.quantityRequiredTonnes,
                        defaultPrice: req.targetPricePerQuintal,
                        type: 'CROP_TRADE'
                      })}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Propose Trade & Notify via Email</span>
                    </button>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      )}

      {/* ── TAB 2: COLD STORAGE & SILOS ── */}
      {activeTab === 'STORAGES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md flex flex-col justify-between space-y-5 animate-pulse h-[350px]">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10" />
                    <div>
                      <div className="h-4 w-32 bg-white/10 rounded mb-1.5" />
                      <div className="h-4 w-24 bg-cyan-950 rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-white/5 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-white/5 rounded" />
                  <div className="h-4 w-32 bg-white/5 rounded" />
                </div>
                <div className="h-16 bg-black/40 rounded-xl border border-white/10" />
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-white/5 rounded-full" />
                  <div className="h-5 w-24 bg-white/5 rounded-full" />
                </div>
                <div className="pt-3 border-t border-white/10 mt-auto">
                  <div className="h-10 bg-white/10 rounded-xl w-full" />
                </div>
              </div>
            ))
          ) : (
            filteredStorages.map(st => (
            <div
              key={st.id}
              className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md flex flex-col justify-between space-y-5 hover:border-cyan-500/40 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold">
                      <Warehouse className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {st.name}
                      </h3>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/20">
                        {st.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ₹{st.pricePerTonDay} <span className="text-xs text-neutral-400 font-sans">/T/Day</span>
                  </span>
                </div>

                <div className="space-y-1 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{st.location} ({st.distanceKm} km away)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-mono text-neutral-300">{st.contactPhone}</span>
                  </div>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1 text-xs">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Available Space:</span>
                    <span className="font-bold text-cyan-300 font-mono">
                      {st.availableCapacityTonnes.toLocaleString()} / {st.totalCapacityTonnes.toLocaleString()} Tonnes
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${Math.round((st.availableCapacityTonnes / st.totalCapacityTonnes) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {st.features.map((feat, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={() => openProposalModal({
                    id: st.id,
                    name: st.name,
                    role: 'COLD_STORAGE_OWNER',
                    email: 'manager@' + st.name.toLowerCase().replace(/[^a-z]/g, '') + '.in',
                    phone: st.contactPhone,
                    district: st.location,
                    crop: 'Red Onion / Fruit Storage',
                    defaultQty: 25,
                    type: 'COLD_STORAGE_BOOKING'
                  })}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Warehouse className="w-3.5 h-3.5" />
                  <span>Reserve Storage & Notify Owner</span>
                </button>
              </div>
            </div>
          )))}
        </div>
      )}

      {/* ── TAB 3: FARMERS DIRECTORY (FOR BUYERS) ── */}
      {activeTab === 'FARMERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md flex flex-col justify-between space-y-5 animate-pulse h-[350px]">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-white/10" />
                  <div>
                    <div className="h-4 w-28 bg-white/10 rounded mb-1.5" />
                    <div className="flex gap-2">
                      <div className="h-4 w-20 bg-emerald-950 rounded" />
                      <div className="h-4 w-16 bg-cyan-950 rounded" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/10">
                  <div className="h-10 bg-white/5 rounded" />
                  <div className="h-10 bg-white/5 rounded" />
                  <div className="h-10 bg-white/5 rounded" />
                  <div className="h-10 bg-white/5 rounded" />
                </div>
                <div className="h-4 w-48 bg-white/5 rounded" />
                <div className="pt-3 border-t border-white/10 mt-auto">
                  <div className="h-10 bg-white/10 rounded-xl w-full" />
                </div>
              </div>
            ))
          ) : (
            filteredFarmers.map(crop => (
            <div
              key={crop.id}
              className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md flex flex-col justify-between space-y-5 hover:border-emerald-500/40 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <img
                    src={crop.imageUrl || '/crops/tomato.jpg'}
                    alt={crop.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-white/5"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {crop.farmerName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/20">
                        {t(`crops.${crop.name}`, crop.name)} ({crop.variety ? t(`varieties.${crop.variety}`, crop.variety) : ''})
                      </span>
                      <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded">
                        Grade {crop.grade}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/10 text-xs">
                  <div>
                    <span className="text-xs text-neutral-400 block">Available Batch</span>
                    <span className="font-bold text-white font-mono">{crop.quantity} {crop.unit}s</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">Harvest Date</span>
                    <span className="font-bold text-white">{crop.harvestDate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">Shelf Life Remaining</span>
                    <span className="font-bold text-amber-400 font-mono">{crop.daysRemaining} Days</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block">Farming Mode</span>
                    <span className="font-bold text-emerald-300">{crop.isOrganic ? '🌿 Organic' : 'Standard'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Farm Origin: <strong className="text-white">{crop.location.district}, {crop.location.state}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={() => openProposalModal({
                    id: crop.farmerId,
                    name: crop.farmerName,
                    role: 'FARMER',
                    email: crop.farmerName.toLowerCase().replace(/[^a-z]/g, '') + '@kisan.in',
                    phone: '+91 98220 44556',
                    district: crop.location.district,
                    crop: crop.name,
                    defaultQty: crop.quantity,
                    defaultPrice: 2800,
                    type: 'CROP_TRADE'
                  })}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Place Procurement Bid & Email Farmer</span>
                </button>
              </div>
            </div>
          )))}
        </div>
      )}

      {/* ── TAB 4: MY CONNECTIONS & TRADES ── */}
      {activeTab === 'MY_CONNECTIONS' && (
        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md space-y-4 animate-pulse">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10" />
                    <div>
                      <div className="flex gap-2 mb-1.5">
                        <div className="h-4 w-16 bg-emerald-950 rounded" />
                        <div className="h-4 w-16 bg-emerald-950 rounded-full" />
                      </div>
                      <div className="h-4 w-48 bg-white/10 rounded" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/40 p-4 rounded-xl border border-white/10">
                  <div className="h-10 bg-white/5 rounded" />
                  <div className="h-10 bg-white/5 rounded" />
                  <div className="h-10 bg-white/5 rounded" />
                </div>
              </div>
            ))
          ) : connectionRequests.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 bg-white/5 rounded-xl border border-white/10">
              No active connection proposals yet. Browse buyers, farmers, or cold storage units to dispatch your first trade proposal!
            </div>
          ) : (
            connectionRequests.map(conn => {
              const isAccepted = conn.status === 'ACCEPTED';
              const isPending = conn.status === 'PENDING';
              return (
                <div
                  key={conn.id}
                  className="bg-[#12161c]/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-md space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl font-bold ${
                        isAccepted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isAccepted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400">
                            {conn.requestNumber || conn.id}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                            isAccepted ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}>
                            {conn.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white mt-1">
                          Trade: {conn.quantityTonnes} Tonnes {conn.cropName} ({conn.variety || 'Grade A'})
                        </h3>
                      </div>
                    </div>

                    {/* Email preview button */}
                    {conn.emailPreview && (
                      <button
                        onClick={() => setPreviewConn(conn)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        title="View auto-sent notification email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>View Auto-Sent Email</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/40 p-4 rounded-xl border border-white/10 text-xs">
                    <div>
                      <span className="text-xs text-neutral-400 uppercase tracking-wider block">Sender Party</span>
                      <strong className="text-white block mt-0.5">{conn.senderName || conn.farmerName}</strong>
                      <span className="text-xs text-neutral-400">{conn.senderDistrict || 'Nashik'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 uppercase tracking-wider block">Receiver Party</span>
                      <strong className="text-white block mt-0.5">{conn.receiverName || conn.buyerName}</strong>
                      <span className="text-xs text-neutral-400">{conn.receiverType || 'Buyer / Facility'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 uppercase tracking-wider block">Contact Information</span>
                      {isAccepted ? (
                        <div className="text-emerald-300 font-mono font-bold mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{conn.buyerPhone || conn.receiverPhone || '+91 98220 99881'}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-xs block mt-0.5 italic">
                          🔒 Unlocks upon acceptance
                        </span>
                      )}
                    </div>
                  </div>

                  {conn.customMessage && (
                    <p className="text-xs text-neutral-300 bg-white/5 p-3 rounded-xl border border-white/5 italic">
                      "{conn.customMessage}"
                    </p>
                  )}

                  {isPending && (
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => handleDecline(conn.id)}
                        className="px-4 py-2 bg-white/5 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/10 flex items-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" /> Decline
                      </button>
                      <button
                        onClick={() => handleAccept(conn.id)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept Trade Proposal
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Proposal Dispatch Modal ── */}
      <AnimatePresence>
        {proposalTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-[#161b22] border border-blue-500/30 rounded-xl max-w-lg w-full p-6 shadow-md space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Send Direct Trade Proposal</h3>
                    <p className="text-xs text-neutral-400">
                      To: <strong className="text-blue-300">{proposalTarget.name}</strong> ({proposalTarget.role})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setProposalTarget(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendProposal} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Crop / Service Item</label>
                  <input
                    type="text"
                    value={proposalTarget.crop}
                    readOnly
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Quantity (Tonnes) *</label>
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={propQuantity}
                      onChange={e => setPropQuantity(Number(e.target.value))}
                      required
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">Offered Price (₹ / Qtl)</label>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={propPrice}
                      onChange={e => setPropPrice(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Target Dispatch / Delivery Date *</label>
                  <input
                    type="date"
                    value={propDeliveryDate}
                    onChange={e => setPropDeliveryDate(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Custom Message / Dispatch Terms</label>
                  <textarea
                    rows={3}
                    value={propMessage}
                    onChange={e => setPropMessage(e.target.value)}
                    placeholder="Include moisture percentage, packaging preference, or weighbridge pickup terms..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-500/20 text-xs text-neutral-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>An automated official email notification with trade details will be dispatched immediately to <strong>{proposalTarget.email}</strong>.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setProposalTarget(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending Notification...' : 'Dispatch Connection Request'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Email Notification Preview Modal ── */}
      <AnimatePresence>
        {previewConn && previewConn.emailPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-[#161b22] border border-blue-500/30 rounded-xl max-w-2xl w-full p-6 shadow-md space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Automated Trade Notification Email</h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      To: {previewConn.emailPreview.recipient} • Sent: {previewConn.emailPreview.sentAt}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewConn(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Email Body Card */}
              <div className="rounded-xl border border-white/10 p-5 bg-[#0d1117] space-y-4 text-xs">
                <div className="bg-blue-950/60 p-4 rounded-xl border border-blue-500/30 text-center">
                  <span className="text-lg font-black text-white block">🌾 Krishi Grow Matchmaking Network</span>
                  <span className="text-xs text-blue-300 uppercase tracking-widest font-bold">
                    Official Trade Procurement Connection Notice
                  </span>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-neutral-400">Reference ID:</span><span className="font-mono font-bold text-blue-400">{previewConn.requestNumber || previewConn.id}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Sender Party:</span><span className="font-bold text-white">{previewConn.senderName || user.name} ({user.district})</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Recipient Party:</span><span className="font-bold text-white">{previewConn.receiverName || previewConn.buyerName}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Crop / Service:</span><span className="font-bold text-emerald-400">{previewConn.quantityTonnes} Tonnes {previewConn.cropName}</span></div>
                  {previewConn.offeredPricePerQuintal && (
                    <div className="flex justify-between"><span className="text-neutral-400">Target Price:</span><span className="font-bold text-emerald-300 font-mono">₹{previewConn.offeredPricePerQuintal} / Quintal</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-neutral-400">Target Date:</span><span className="font-bold text-white">{previewConn.targetDate}</span></div>
                </div>

                {previewConn.customMessage && (
                  <div className="p-3 bg-blue-950/30 border-l-4 border-blue-500 rounded-r-xl text-neutral-200 italic">
                    "{previewConn.customMessage}"
                  </div>
                )}

                <div className="pt-2 border-t border-white/10 text-center text-xs text-neutral-400 space-y-1">
                  <p>24x7 Kisan Grievance Toll-Free: <strong>1800-180-1551</strong></p>
                  <p>Direct Portal: <strong>https://krishigrow.in</strong> • Escrow Protected Trade</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setPreviewConn(null)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close Email Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
