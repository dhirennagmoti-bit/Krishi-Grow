import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, Minus, Search, MapPin,
  ChevronDown, Building2, Package, Calendar, Filter, Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import {
  ALL_MAHARASHTRA_MANDI_PRICES, CROP_BASE_PRICES, getMandiPricesByCrop, type MaharashtraMandiRecord
} from '../data/maharashtraMandiPrices';
import { priceTrendHistorical } from '../data/mockData';

export const MarketPricesPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState<string>('Red Onion');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate network fetch for data-heavy section
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedCrop, selectedDistrict]);

  const cropList = useMemo(() => Object.keys(CROP_BASE_PRICES).sort(), []);

  // Filter all market records for the selected crop across all places in Maharashtra
  const cropRecords = useMemo(() => {
    return getMandiPricesByCrop(selectedCrop);
  }, [selectedCrop]);

  // Unique list of districts for the filter pill buttons
  const districtList = useMemo(() => {
    const set = new Set<string>();
    cropRecords.forEach(r => set.add(r.district));
    return ['ALL', ...Array.from(set).sort()];
  }, [cropRecords]);

  // Filtered by search term and selected district
  const filteredPrices = useMemo(() => {
    return cropRecords.filter(m => {
      const matchDistrict = selectedDistrict === 'ALL' || m.district === selectedDistrict;
      const matchSearch =
        m.marketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.taluka.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDistrict && matchSearch;
    });
  }, [cropRecords, selectedDistrict, searchTerm]);

  // Summary statistics for the chosen crop across Maharashtra
  const stats = useMemo(() => {
    if (cropRecords.length === 0) {
      return { min: 0, max: 0, avg: 0, totalArrivals: 0, topMarket: '', lowMarket: '' };
    }
    let min = Infinity;
    let max = -Infinity;
    let sumModal = 0;
    let totalArrivals = 0;
    let topMarket = '';
    let lowMarket = '';

    cropRecords.forEach(r => {
      if (r.maxPrice > max) {
        max = r.maxPrice;
        topMarket = `${r.marketName} (${r.district})`;
      }
      if (r.minPrice < min) {
        min = r.minPrice;
        lowMarket = `${r.marketName} (${r.district})`;
      }
      sumModal += r.modalPrice;
      totalArrivals += r.arrivalsQuintal;
    });

    const avg = Math.round(sumModal / cropRecords.length);
    return { min, max, avg, totalArrivals, topMarket, lowMarket };
  }, [cropRecords]);

  // Chart data for historical trends
  const chartData = useMemo(() => {
    if (priceTrendHistorical[selectedCrop]) return priceTrendHistorical[selectedCrop];

    const base = CROP_BASE_PRICES[selectedCrop]?.baseModal || 2500;
    const synthetic = [];
    const days = ['18 Aug', '19 Aug', '20 Aug', '21 Aug', '22 Aug', '23 Aug', 'Today'];

    for (let i = 0; i < days.length; i++) {
      const dayFactor = 0.95 + (i * 0.015) + (Math.sin(i) * 0.02);
      synthetic.push({
        date: days[i],
        'Nashik APMC': Math.round(base * dayFactor * 1.02),
        'Pune Gultekdi': Math.round(base * dayFactor * 1.06),
        'Mumbai Vashi APMC': Math.round(base * dayFactor * 1.11),
      });
    }
    return synthetic;
  }, [selectedCrop]);

  const mandiKeys = Object.keys(chartData[0] || {}).filter(k => k !== 'date');
  const lineColors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];

  return (
    <div className="space-y-6">
      
      {/* Header with Crop Selector Dropdown and Down Arrow */}
      <div className="bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-white/10 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-md">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">{t('marketPrices.headerTitle')}</h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('marketPrices.liveFeeds')}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-normal">
                {t('marketPrices.headerSubtitle')}
              </p>
            </div>
          </div>

          {/* Select Crop with Down Arrow */}
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
            <span className="text-xs font-bold text-neutral-300 pl-2">{t('marketPrices.selectCrop')}</span>
            <div className="relative">
              <select
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  setSelectedDistrict('ALL');
                  setSearchTerm('');
                }}
                className="w-56 pl-4 pr-10 py-2.5 bg-black/80 hover:bg-black border border-emerald-500/40 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 shadow-md cursor-pointer appearance-none transition-all"
              >
                {cropList.map(c => (
                  <option key={c} value={c} className="bg-[#0e120f] text-white py-1">
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none transition-transform" />
            </div>
          </div>
        </div>

        {/* Selected Crop Summary Cards - With Skeleton Support */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-white/10">
          {[
            { label: t('marketPrices.stateAvgPrice'), val: `₹${stats.avg.toLocaleString()}`, unit: t('marketPrices.qtl'), sub: t('marketPrices.acrossAPMCs', { count: cropRecords.length }), color: 'text-emerald-400' },
            { label: t('marketPrices.highestRate'), val: `₹${stats.max.toLocaleString()}`, unit: t('marketPrices.qtl'), sub: `📍 ${stats.topMarket || t('marketPrices.primaryMandis')}`, color: 'text-cyan-400' },
            { label: t('marketPrices.lowestRate'), val: `₹${stats.min.toLocaleString()}`, unit: t('marketPrices.qtl'), sub: `📍 ${stats.lowMarket || t('marketPrices.farmGateAPMC')}`, color: 'text-amber-300' },
            { label: t('marketPrices.totalArrivals'), val: stats.totalArrivals.toLocaleString(), unit: t('marketPrices.qtlLabel'), sub: t('marketPrices.volumeToday', { count: (stats.totalArrivals / 10).toFixed(0) }), color: 'text-blue-400' }
          ].map((stat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-neutral-400 font-medium block">{stat.label}</span>
              {isLoading ? (
                <div className="h-8 w-24 bg-white/10 rounded mt-1 animate-pulse" />
              ) : (
                <div className={`text-xl md:text-2xl font-black ${stat.color} font-mono mt-1`}>
                  {stat.val} <span className="text-xs text-neutral-400 font-sans font-normal">{stat.unit}</span>
                </div>
              )}
              {isLoading ? (
                <div className="h-4 w-32 bg-white/5 rounded mt-1.5 animate-pulse" />
              ) : (
                <span className="text-xs text-neutral-500 mt-0.5 block truncate" title={stat.sub}>{stat.sub}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recharts 7-Day APMC Price Trend Chart */}
      <div className="bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-white/10 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {t('marketPrices.trendTitle')} — {selectedCrop} (₹ {t('marketPrices.qtl')})
            </h3>
            <p className="text-xs text-neutral-500">{t('marketPrices.trendSubtitle')}</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-medium">{t('marketPrices.dailyUpdate')}</span>
        </div>

        <div className="h-64 w-full pt-2">
          {isLoading ? (
            <div className="w-full h-full bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData as any[]}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e120f',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.8)'
                  }}
                />
                {mandiKeys.map((key, idx) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={lineColors[idx % lineColors.length]} 
                    strokeWidth={3} 
                    dot={{ r: 3, fill: lineColors[idx % lineColors.length] }} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Complete Maharashtra Place-by-Place Mandi Table */}
      <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 shadow-md overflow-hidden p-6 md:p-8 space-y-6">
        
        {/* Controls: Search & District Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t('marketPrices.allPlaces')}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30">
                {selectedCrop} ({t('marketPrices.locationsCount', { count: filteredPrices.length })})
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {t('marketPrices.showingExact', { crop: selectedCrop })}
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('marketPrices.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-xs bg-white/5 border border-white/10 text-white rounded-xl focus:border-emerald-500 focus:outline-none w-72 transition-all placeholder-neutral-500"
            />
          </div>
        </div>

        {/* District Fast-Filter Pills */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-400" /> {t('marketPrices.filterDistrict')}
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {districtList.map(dist => (
              <button
                key={dist}
                type="button"
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  selectedDistrict === dist
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                }`}
              >
                {dist === 'ALL' ? t('marketPrices.allDistricts') : dist}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-neutral-400 font-bold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">{t('marketPrices.tableMarket')}</th>
                <th className="py-3.5 px-4">{t('marketPrices.tableTaluka')}</th>
                <th className="py-3.5 px-4">{t('marketPrices.tableVariety')}</th>
                <th className="py-3.5 px-4">{t('marketPrices.tableMin')}</th>
                <th className="py-3.5 px-4">{t('marketPrices.tableMax')}</th>
                <th className="py-3.5 px-4">{t('marketPrices.tableModal')}</th>
                <th className="py-3.5 px-4">{t('marketPrices.tableArrivals')}</th>
                <th className="py-3.5 px-4">{t('marketPrices.tableTrend')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4"><div className="h-4 w-24 bg-white/10 rounded animate-pulse" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 w-20 bg-white/5 rounded animate-pulse" /><div className="h-3 w-16 bg-white/5 rounded animate-pulse mt-1" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 w-16 bg-white/10 rounded animate-pulse" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 w-12 bg-white/10 rounded animate-pulse" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 w-14 bg-emerald-500/20 rounded animate-pulse" /></td>
                    <td className="py-3.5 px-4"><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></td>
                    <td className="py-3.5 px-4"><div className="h-5 w-16 bg-white/10 rounded-full animate-pulse" /></td>
                  </tr>
                ))
              ) : filteredPrices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    {t('marketPrices.noMarketFound', { searchTerm })}
                  </td>
                </tr>
              ) : (
                filteredPrices.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{t(`apmc.${m.marketName.replace(/\s+/g, '_')}`, m.marketName)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{t(`taluka.${m.taluka.replace(/\s+/g, '_')}`, m.taluka)}</div>
                      <div className="text-xs text-neutral-400">{t(`district.${m.district.replace(/\s+/g, '_')}`, m.district)}, {t('marketPrices.mh')}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-neutral-200">{t(`varieties.${m.variety.replace(/\s+/g, '_')}`, m.variety)}</div>
                      <div className="text-xs text-emerald-400">{t(`grades.${m.grade.replace(/\s+/g, '_')}`, m.grade)}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-300">₹{m.minPrice.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-300">₹{m.maxPrice.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ₹{m.modalPrice.toLocaleString()} <span className="text-xs font-normal text-neutral-400">{t('marketPrices.qtl')}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-white">{m.arrivalsQuintal.toLocaleString()}</span>{' '}
                      <span className="text-neutral-500 text-xs">{t('marketPrices.qtlLabel')}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {m.trend === 'UP' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                          <ArrowUpRight className="w-3 h-3" /> {t('marketPrices.up')}
                        </span>
                      ) : m.trend === 'DOWN' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs">
                          <ArrowDownRight className="w-3 h-3" /> {t('marketPrices.down')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-neutral-400 font-bold text-xs">
                          <Minus className="w-3 h-3" /> {t('marketPrices.stable')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

