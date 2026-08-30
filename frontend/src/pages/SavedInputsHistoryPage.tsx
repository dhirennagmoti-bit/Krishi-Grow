import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  History, Search, Trash2, ExternalLink, Copy, Check, Filter,
  Truck, Sparkles, TrendingUp, FileText, ShoppingBag, Clock, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface SavedInputItem {
  id: string;
  title: string;
  type: 'TRANSPORT' | 'PROCESSING' | 'MANDI' | 'SCHEMES' | 'SOURCING';
  date: string;
  summary: string;
  details: Record<string, any>;
  targetTab: string;
}

export const initialSavedHistory: SavedInputItem[] = [
  {
    id: 'hist_01',
    title: 'Freight Rate Calculation — Nashik to Mumbai Vashi',
    type: 'TRANSPORT',
    date: '2026-08-29 14:30',
    summary: '10 Tonnes Tomato | 10T Eicher Truck | Est. Cost: ₹14,500',
    details: { crop: 'Tomato', quantity: 10, pickup: 'Nashik', destination: 'Mumbai (Vashi APMC)', vehicle: 'TRUCK_10T' },
    targetTab: 'transport'
  },
  {
    id: 'hist_02',
    title: 'Crop Value-Addition — Red Onion to Dehydrated Flakes',
    type: 'PROCESSING',
    date: '2026-08-28 11:15',
    summary: 'Sinnar Cluster | Margin: 28% | Shelf Life: 540 Days',
    details: { crop: 'Red Onion', product: 'Dehydrated Onion Flakes', margin: '28%', infra: 'Sinnar MIDC' },
    targetTab: 'solutions'
  },
  {
    id: 'hist_03',
    title: 'Mandi Price Watch — Lasalgaon APMC (Red Onion)',
    type: 'MANDI',
    date: '2026-08-27 09:45',
    summary: 'Modal Price: ₹2,550/Quintal | Trend: UP 📈',
    details: { mandi: 'Lasalgaon APMC', crop: 'Red Onion', modalPrice: 2550, trend: 'UP' },
    targetTab: 'market-prices'
  },
  {
    id: 'hist_04',
    title: 'PMKSY Micro-Irrigation Scheme Draft',
    type: 'SCHEMES',
    date: '2026-08-26 16:20',
    summary: '55% Subsidy | Drip System | Application ID: DRAFT_PMKSY_8842',
    details: { schemeId: 'sch_09', schemeName: 'PMKSY — Per Drop More Crop', subsidy: '55%' },
    targetTab: 'schemes'
  },
  {
    id: 'hist_05',
    title: 'Bulk Sourcing Request — Grade A Tomato (20 Tonnes)',
    type: 'SOURCING',
    date: '2026-08-25 18:00',
    summary: 'Weekly Delivery to Mumbai | Target: ₹3,200/Quintal',
    details: { crop: 'Tomato', quantity: 20, grade: 'A', price: 3200, region: 'Nashik' },
    targetTab: 'buyer-requirements'
  }
];

export const SavedInputsHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { setActiveTab } = useApp();
  const [historyItems, setHistoryItems] = useState<SavedInputItem[]>(initialSavedHistory);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved calculation history?')) {
      setHistoryItems([]);
    }
  };

  const filteredItems = historyItems.filter(item => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: SavedInputItem['type']) => {
    switch (type) {
      case 'TRANSPORT': return <Truck className="w-5 h-5 text-blue-400" />;
      case 'PROCESSING': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'MANDI': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'SCHEMES': return <FileText className="w-5 h-5 text-purple-400" />;
      case 'SOURCING': return <ShoppingBag className="w-5 h-5 text-pink-400" />;
      default: return <History className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-black/60 backdrop-blur-2xl p-6 md:p-8 rounded-xl border border-white/10 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold shrink-0">
              <History className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {t('savedHistory.title', { defaultValue: 'Saved Inputs & Calculation History' })}
              </h2>
              <p className="text-xs md:text-sm text-neutral-300 mt-1 font-normal">
                {t('savedHistory.subtitle', { defaultValue: 'Revisit, reload, or export your saved transport estimates, crop processing insights, mandi price watches, and scheme drafts.' })}
              </p>
            </div>
          </div>

          {historyItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('savedHistory.clearAll', { defaultValue: 'Clear History' })}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {['ALL', 'TRANSPORT', 'PROCESSING', 'MANDI', 'SCHEMES', 'SOURCING'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filterType === type
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {type === 'ALL' ? t('savedHistory.filterAll', { defaultValue: 'All Saved' }) : type}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={t('savedHistory.searchPlaceholder', { defaultValue: 'Search history...' })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-white/10 rounded-xl focus:border-purple-500/50 outline-none bg-black/60 text-white font-normal transition-all"
          />
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 space-y-3">
            <Clock className="w-10 h-10 text-neutral-500 mx-auto" />
            <h4 className="text-base font-bold text-white">No Saved History Found</h4>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Your saved transport calculations, crop value-add queries, mandi alerts, and scheme drafts will appear here for easy 1-click reloads.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-xl p-5 md:p-6 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all shadow-md group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {getTypeIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-mono">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleCopy(item.id, JSON.stringify(item.details, null, 2))}
                  className="p-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl border border-white/10 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy Parameters"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-neutral-400" />
                      <span className="text-[11px]">Copy JSON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab(item.targetTab)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload & Run</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-xl border border-white/10 text-xs transition-colors cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
