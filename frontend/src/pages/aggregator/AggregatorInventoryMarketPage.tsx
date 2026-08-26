import React, { useState } from 'react';
import {
  Package, PlusCircle, AlertTriangle, TrendingUp, Store,
  CheckCircle2, DollarSign, Clock, ArrowRight, X, ShieldAlert,
  Building2, MapPin, Eye, Filter, Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCropImage } from '../../data/cropCatalog';
import type { QualityGrade, AggregatorInventoryItem, AggregatorMarketOffer } from '../../types';

export const AggregatorInventoryMarketPage: React.FC = () => {
  const {
    aggregatorInventory, marketOffers, addAggregatorInventoryItem,
    addMarketOffer, openDocument
  } = useApp();

  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'MARKETPLACE'>('INVENTORY');
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);

  // New Stock Form State
  const [crop, setCrop] = useState('Red Onion');
  const [variety, setVariety] = useState('Nashik Red F1');
  const [grade, setGrade] = useState<QualityGrade>('A');
  const [warehouse, setWarehouse] = useState('Lasalgaon Mega Godown B-4');
  const [location, setLocation] = useState('Bay 12, Rack A');
  const [quantityKg, setQuantityKg] = useState('10000');
  const [shelfLifeDays, setShelfLifeDays] = useState('90');
  const [purchasePrice, setPurchasePrice] = useState('21.50');

  // New B2B Offer Form State
  const [offerCrop, setOfferCrop] = useState('Red Onion');
  const [offerVariety, setOfferVariety] = useState('Nashik Red F1');
  const [offerGrade, setOfferGrade] = useState<QualityGrade>('A');
  const [offerQuantityKg, setOfferQuantityKg] = useState('5000');
  const [offerPrice, setOfferPrice] = useState('26.00');
  const [offerLocation, setOfferLocation] = useState('Nashik Central Packhouse');
  const [offerAvailDate, setOfferAvailDate] = useState('2026-08-26');

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const batchId = `BATCH-${crop.substring(0, 3).toUpperCase()}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;

    addAggregatorInventoryItem({
      crop,
      variety,
      grade,
      batchId,
      warehouse,
      storageLocation: location,
      entryDate: new Date().toISOString().split('T')[0],
      totalQuantityKg: parseFloat(quantityKg) || 1000,
      availableQuantityKg: parseFloat(quantityKg) || 1000,
      reservedQuantityKg: 0,
      expectedShelfLifeDays: parseInt(shelfLifeDays) || 30,
      daysInStorage: 0,
      spoilageRisk: 'LOW',
      purchasePricePerKg: parseFloat(purchasePrice) || 20
    });

    setIsAddStockModalOpen(false);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    addMarketOffer({
      crop: offerCrop,
      variety: offerVariety,
      grade: offerGrade,
      quantityKg: parseFloat(offerQuantityKg) || 1000,
      expectedPricePerKg: parseFloat(offerPrice) || 25,
      location: offerLocation,
      availableFromDate: offerAvailDate,
      sellerName: 'MahaAgri Aggregators FPC',
      sellerPhone: '+91 98220 99441',
      status: 'OPEN',
      receivedBidsCount: 0
    });

    setIsCreateOfferModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" /> Warehouse & B2B Trade Exchange
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Inventory Management & B2B Marketplace
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-light">
            Monitor batch-tracked warehouse stock, spoilage risks, and publish bulk lots directly to Processors and Wholesalers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'INVENTORY' ? (
            <button
              onClick={() => setIsAddStockModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-950 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Warehouse Stock</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCreateOfferModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950 transition-all cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>+ Post B2B Sell Listing</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Toggle */}
      <div className="flex p-1.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 max-w-md">
        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'INVENTORY'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Warehouse Batches ({aggregatorInventory.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('MARKETPLACE')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'MARKETPLACE'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>B2B Sell Offers ({marketOffers.length})</span>
        </button>
      </div>

      {/* 1. INVENTORY MANAGEMENT VIEW */}
      {activeTab === 'INVENTORY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aggregatorInventory.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 transition-all space-y-4 shadow-xl group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={getCropImage(item.crop)}
                      alt={item.crop}
                      className="w-12 h-12 rounded-2xl object-cover border border-white/15 shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">{item.crop}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Grade {item.grade}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    item.spoilageRisk === 'LOW' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    Risk: {item.spoilageRisk}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Batch ID:</span>
                    <strong className="text-white">{item.batchId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Available:</span>
                    <strong className="text-emerald-400 font-bold">{(item.availableQuantityKg / 1000).toFixed(1)} Tonnes</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Reserved:</span>
                    <span className="text-neutral-300">{(item.reservedQuantityKg / 1000).toFixed(1)} Tonnes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Cost Basis:</span>
                    <span className="text-white">₹{item.purchasePricePerKg.toFixed(2)}/kg</span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400 space-y-0.5">
                  <p className="truncate">📍 {item.warehouse}</p>
                  <p className="text-neutral-500">Storage: {item.storageLocation}</p>
                </div>

                <button
                  onClick={() => {
                    setOfferCrop(item.crop);
                    setOfferGrade(item.grade);
                    setOfferQuantityKg((item.availableQuantityKg).toString());
                    setIsCreateOfferModalOpen(true);
                  }}
                  className="w-full py-2 bg-purple-600/30 hover:bg-purple-600/60 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>List Lot on Marketplace</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. B2B MARKETPLACE VIEW */}
      {activeTab === 'MARKETPLACE' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketOffers.map((offer) => (
            <div
              key={offer.id}
              className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={getCropImage(offer.crop)}
                      alt={offer.crop}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/15 shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{offer.crop}</h4>
                      <p className="text-xs text-neutral-400">{offer.variety}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block mt-1">
                        Grade {offer.grade}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {offer.status}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Offered Lot Volume:</span>
                    <strong className="text-white">{(offer.quantityKg / 1000).toFixed(1)} Tonnes ({offer.quantityKg.toLocaleString()} kg)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Asking Price:</span>
                    <strong className="text-emerald-400 text-sm">₹{offer.expectedPricePerKg.toFixed(2)} / kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Available From:</span>
                    <span className="text-white font-sans">{offer.availableFromDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">Location:</span>
                    <span className="text-neutral-300 font-sans truncate max-w-[150px]">{offer.location}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Received B2B Bids:</span>
                  <span className="font-bold font-mono text-cyan-400">{offer.receivedBidsCount} Active Inquiries</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => alert(`Reviewing bids for ${offer.crop}... 4 Wholesale buyers have submitted pricing quotes.`)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-md"
                >
                  Compare & Accept Bids
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Warehouse Stock */}
      {isAddStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleAddStock} className="bg-[#121214] border border-white/15 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Add Inventory Batch to Warehouse
              </h3>
              <button type="button" onClick={() => setIsAddStockModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Crop</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500"
                  >
                    <option value="Red Onion" className="bg-[#121214]">Red Onion</option>
                    <option value="Tomato" className="bg-[#121214]">Tomato</option>
                    <option value="Soybean" className="bg-[#121214]">Soybean</option>
                    <option value="Wheat" className="bg-[#121214]">Wheat</option>
                    <option value="Turmeric" className="bg-[#121214]">Turmeric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="A+" className="bg-[#121214]">Grade A+</option>
                    <option value="A" className="bg-[#121214]">Grade A</option>
                    <option value="B" className="bg-[#121214]">Grade B</option>
                    <option value="C" className="bg-[#121214]">Grade C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Quantity (Kg)</label>
                  <input
                    type="number"
                    required
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Purchase Cost (₹/kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Storage Godown / Warehouse</label>
                <input
                  type="text"
                  required
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Storage Chamber & Bay Slot</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsAddStockModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer"
              >
                Save Stock Batch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Create Marketplace B2B Offer */}
      {isCreateOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <form onSubmit={handleCreateOffer} className="bg-[#121214] border border-white/15 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-400" />
                Publish B2B Bulk Produce Offer
              </h3>
              <button type="button" onClick={() => setIsCreateOfferModalOpen(false)} className="p-2 text-neutral-400 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Crop</label>
                  <select
                    value={offerCrop}
                    onChange={(e) => setOfferCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Red Onion" className="bg-[#121214]">Red Onion</option>
                    <option value="Tomato" className="bg-[#121214]">Tomato</option>
                    <option value="Soybean" className="bg-[#121214]">Soybean</option>
                    <option value="Wheat" className="bg-[#121214]">Wheat</option>
                    <option value="Turmeric" className="bg-[#121214]">Turmeric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Quality Grade</label>
                  <select
                    value={offerGrade}
                    onChange={(e) => setOfferGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="A+" className="bg-[#121214]">Grade A+</option>
                    <option value="A" className="bg-[#121214]">Grade A</option>
                    <option value="B" className="bg-[#121214]">Grade B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Offered Volume (Kg)</label>
                  <input
                    type="number"
                    required
                    value={offerQuantityKg}
                    onChange={(e) => setOfferQuantityKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Asking Price (₹/kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Dispatch Packhouse Location</label>
                  <input
                    type="text"
                    required
                    value={offerLocation}
                    onChange={(e) => setOfferLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Available Date</label>
                  <input
                    type="date"
                    required
                    value={offerAvailDate}
                    onChange={(e) => setOfferAvailDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOfferModalOpen(false)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer"
              >
                Publish Live Offer
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
