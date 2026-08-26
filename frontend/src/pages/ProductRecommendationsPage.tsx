import React, { useState, useMemo } from 'react';
import {
  Sparkles, CheckCircle2, ArrowRight, Play, Phone, Mail, MapPin,
  TrendingUp, ShieldCheck, Factory, Search, ExternalLink, ChevronDown
} from 'lucide-react';
import { CROP_VALUE_PRODUCTS, type CropProductProcessingGuide } from '../data/cropValueProducts';

export const ProductRecommendationsPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const cropNames = useMemo(() => {
    return Array.from(new Set(CROP_VALUE_PRODUCTS.map(c => c.cropName))).sort();
  }, []);

  const categories = useMemo(() => {
    return ['ALL', 'Vegetable', 'Grain & Pulse', 'Fruit', 'Commercial & Cash', 'Spice & Oilseed'];
  }, []);

  const filteredGuides = useMemo(() => {
    return CROP_VALUE_PRODUCTS.filter(item => {
      const matchCrop = selectedCrop === 'ALL' || item.cropName === selectedCrop;
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productsSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.buyerProcessorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCrop && matchCat && matchSearch;
    });
  }, [selectedCrop, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold shadow-lg shadow-amber-950/50">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Best Value-Added Products by Crop
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  AI Processing Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-light">
                Discover high-margin manufactured outputs, mapped processing buyers, and video manufacturing guides for all 26 crops.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-right">
              <span className="text-[10px] text-neutral-400 block">Covered Crops</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">26 Crops</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-right">
              <span className="text-[10px] text-neutral-400 block">Avg Value Boost</span>
              <span className="text-sm font-bold text-amber-300 font-mono">+38% Margin</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
          
          {/* Crop Selector with Down Arrow */}
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-black/80 border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer appearance-none transition-all"
            >
              <option value="ALL" className="bg-[#0e120f]">All 26 Crops</option>
              {cropNames.map(c => (
                <option key={c} value={c} className="bg-[#0e120f]">{c}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-black/80 border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer appearance-none transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-[#0e120f]">
                  {cat === 'ALL' ? 'All Crop Categories' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search product (chips, oil, puree, flour)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="space-y-6">
        {filteredGuides.length === 0 ? (
          <div className="bg-black/60 backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center text-neutral-400">
            No value-added processing guides found matching your search. Try resetting filters.
          </div>
        ) : (
          filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden hover:border-amber-500/30 transition-all group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Hyperrealistic Crop Image Column */}
                <div className="lg:col-span-4 relative h-64 lg:h-auto min-h-[260px] overflow-hidden bg-neutral-900">
                  <img
                    src={guide.image}
                    alt={guide.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent lg:hidden" />
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/30 shadow-lg">
                      {guide.category}
                    </span>
                  </div>

                  {/* Profit Margin pill */}
                  <div className="absolute bottom-4 left-4 bg-emerald-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-500/40 text-left shadow-lg">
                    <span className="text-[10px] text-neutral-400 block font-medium">Estimated Value Gain</span>
                    <span className="text-base font-black text-emerald-400 font-mono">+{guide.estimatedMarginPercent}% Profit</span>
                  </div>
                </div>

                {/* Content & Specs Column */}
                <div className="lg:col-span-8 p-6 md:p-8 space-y-5">
                  
                  {/* Title and Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Raw Crop: {guide.cropName}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                        {guide.productsCanBeMade[0]} & Derived Products
                      </h3>
                      <p className="text-xs text-neutral-300 mt-1 font-medium">
                        ✨ <strong className="text-amber-300">Products can be made:</strong> {guide.productsSummary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={guide.youtubeSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-950 transition-all border border-red-500/40 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Video Guide</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    </div>
                  </div>

                  {/* Derived Products Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Manufactured Outputs:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {guide.productsCanBeMade.map((p, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-neutral-200 text-xs font-semibold"
                        >
                          📦 {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Market Demand</span>
                      <span className="font-bold text-emerald-400 font-mono">{guide.marketDemand}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Capex Investment</span>
                      <span className="font-bold text-amber-300 font-mono">{guide.investmentLevel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Shelf Life Extension</span>
                      <span className="font-bold text-cyan-400 font-mono">+{guide.shelfLifeExtensionDays} Days</span>
                    </div>
                  </div>

                  {/* Mapped Buyer / Processor Partner Box */}
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Factory className="w-3.5 h-3.5" />
                        <span>Mapped Buyer / Processor Partner:</span>
                      </div>
                      <div className="text-sm font-bold text-white">{guide.buyerProcessorName}</div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" /> {guide.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {guide.phone && (
                        <a
                          href={`tel:${guide.phone.replace(/[^0-9+]/g, '')}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold border border-emerald-500/40 transition-all cursor-pointer shadow-sm"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Partner</span>
                        </a>
                      )}
                      {guide.email && (
                        <a
                          href={`mailto:${guide.email}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shadow-sm"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Why Recommended Bullet Points */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Why AgriAI Recommends This Value-Addition:
                    </span>
                    <ul className="space-y-1 text-xs text-neutral-300">
                      {guide.whyRecommended.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
