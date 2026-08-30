import React, { useState, useMemo } from 'react';
import {
  Sprout, BarChart3, TrendingUp, MapPin, Calendar, Filter,
  ShieldAlert, CheckCircle2, ArrowRight, Warehouse, Scale,
  DollarSign, Info, Layers, RefreshCw, AlertTriangle, ChevronRight,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import {
  LOCATION_DATA,
  AVAILABLE_CROPS,
  AVAILABLE_SEASONS,
  AVAILABLE_YEARS,
  getCropIntelligenceData,
  getDataSourceMetadata
} from '../services/cropDataService';

export const CropIntelligencePage: React.FC = () => {
  const { setActiveTab } = useApp();
  const { t } = useTranslation();

  // Filter States
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');
  const [selectedTaluka, setSelectedTaluka] = useState('Niphad');
  const [selectedCrop, setSelectedCrop] = useState('Onion');
  const [selectedSeason, setSelectedSeason] = useState('Rabi');
  const [selectedYear, setSelectedYear] = useState('2025-26');

  // Trend Metric Selection State ('area' | 'production' | 'yield')
  const [trendMetric, setTrendMetric] = useState<'area' | 'production' | 'yield'>('area');

  // Location Cascading Options
  const currentStateObj = useMemo(() => {
    return LOCATION_DATA.find(s => s.state === selectedState) || LOCATION_DATA[0];
  }, [selectedState]);

  const currentDistricts = useMemo(() => {
    return currentStateObj.districts;
  }, [currentStateObj]);

  const currentTalukas = useMemo(() => {
    const d = currentDistricts.find(dist => dist.name === selectedDistrict) || currentDistricts[0];
    return d ? d.talukas : [];
  }, [currentDistricts, selectedDistrict]);

  // Handle State Change
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const newState = LOCATION_DATA.find(s => s.state === stateName) || LOCATION_DATA[0];
    const firstDist = newState.districts[0];
    setSelectedDistrict(firstDist.name);
    setSelectedTaluka(firstDist.talukas[0] || '');
  };

  // Handle District Change
  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const d = currentDistricts.find(dist => dist.name === distName);
    if (d && d.talukas.length > 0) {
      setSelectedTaluka(d.talukas[0]);
    }
  };

  // Retrieve Intelligence Record
  const record = useMemo(() => {
    return getCropIntelligenceData(
      selectedState,
      selectedDistrict,
      selectedTaluka,
      selectedCrop,
      selectedSeason,
      selectedYear
    );
  }, [selectedState, selectedDistrict, selectedTaluka, selectedCrop, selectedSeason, selectedYear]);

  const dataSources = useMemo(() => getDataSourceMetadata(), []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Bar */}
      <div className="p-6 md:p-8 rounded-xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-500/20 text-agri-400 border border-agri-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sprout className="w-3.5 h-3.5" /> Regional Crop Coverage & Yield Insights
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Crop Intelligence & Pik Pahani Insights</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              ⚠ Demo / Simulated Data
            </span>
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-normal mt-1">
            Analyze crop coverage density, historical production trends, mandi arrival volumes, and supply outlooks across Maharashtra blocks.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('storage-processing')}
          className="flex items-center gap-2 px-4 py-2.5 bg-agri-600 hover:bg-agri-500 text-white rounded-xl text-xs font-bold shadow-md shadow-agri-950 transition-all cursor-pointer shrink-0"
        >
          <Warehouse className="w-4 h-4" />
          <span>Explore Processing Opportunities</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Filter Selector Bar */}
      <div className="p-6 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Filter className="w-4 h-4 text-agri-400" />
            <span>Select Region, Crop & Harvest Season</span>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            Location: {selectedTaluka}, {selectedDistrict}, {selectedState}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* State */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">State</label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-medium text-white focus:border-agri-500/50 outline-none transition-all cursor-pointer"
            >
              {LOCATION_DATA.map(s => (
                <option key={s.state} value={s.state} className="bg-neutral-900 text-white">{s.state}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-medium text-white focus:border-agri-500/50 outline-none transition-all cursor-pointer"
            >
              {currentDistricts.map(d => (
                <option key={d.name} value={d.name} className="bg-neutral-900 text-white">{d.name}</option>
              ))}
            </select>
          </div>

          {/* Taluka */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Taluka / Block</label>
            <select
              value={selectedTaluka}
              onChange={(e) => setSelectedTaluka(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-medium text-white focus:border-agri-500/50 outline-none transition-all cursor-pointer"
            >
              {currentTalukas.map(t => (
                <option key={t} value={t} className="bg-neutral-900 text-white">{t}</option>
              ))}
            </select>
          </div>

          {/* Crop */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-bold text-agri-400 focus:border-agri-500/50 outline-none transition-all cursor-pointer"
            >
              {AVAILABLE_CROPS.map(c => (
                <option key={c} value={c} className="bg-neutral-900 text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Season</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-medium text-white focus:border-agri-500/50 outline-none transition-all cursor-pointer"
            >
              {AVAILABLE_SEASONS.map(s => (
                <option key={s} value={s} className="bg-neutral-900 text-white">{s}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-medium text-white focus:border-agri-500/50 outline-none transition-all cursor-pointer"
            >
              {AVAILABLE_YEARS.map(y => (
                <option key={y} value={y} className="bg-neutral-900 text-white">{y}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* 3. Dashboard Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        
        {/* Cultivated Area */}
        <div className="p-5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cultivated Area</span>
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {record.cropCultivatedAreaHa.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">ha</span>
          </div>
          <p className="text-[10px] text-neutral-400">Reported block crop land</p>
        </div>

        {/* Total Production */}
        <div className="p-5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Production</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {record.productionTonnes.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">tonnes</span>
          </div>
          <p className="text-[10px] text-neutral-400">Total seasonal harvest</p>
        </div>

        {/* Average Yield */}
        <div className="p-5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Yield</span>
            <BarChart3 className="w-4 h-4 text-agri-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {record.averageYieldTonnesPerHa} <span className="text-xs text-neutral-400 font-normal">t/ha</span>
          </div>
          <p className="text-[10px] text-neutral-400">Per hectare output</p>
        </div>

        {/* Crop Area Share */}
        <div className="p-5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Crop Share</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {record.cropAreaSharePercent}%
          </div>
          <p className="text-[10px] text-neutral-400">Of total taluka farm area</p>
        </div>

        {/* YoY Change */}
        <div className="p-5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">YoY Change</span>
            {record.yoyChangePercent >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className={`text-xl md:text-2xl font-black font-mono ${record.yoyChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {record.yoyChangePercent >= 0 ? `+${record.yoyChangePercent}%` : `${record.yoyChangePercent}%`}
          </div>
          <p className="text-[10px] text-neutral-400">Vs previous season</p>
        </div>

        {/* Market Arrivals */}
        <div className="p-5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Arrivals</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {record.marketArrivalsTonnesPerDay.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">t/day</span>
          </div>
          <p className="text-[10px] text-neutral-400">Mandi daily intake</p>
        </div>

        {/* Current Price */}
        <div className="p-5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Mandi Price</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono">
            ₹{record.currentMarketPricePerQuintal} <span className="text-xs text-neutral-400 font-normal">/qtl</span>
          </div>
          <p className="text-[10px] text-neutral-400">Primary mandi spot rate</p>
        </div>

      </div>

      {/* 4. Crop Area Share Detailed Formula Banner */}
      <div className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-agri-400" />
            Cultivation Density & Land Share Formula
          </h3>
          <span className="text-xs font-mono text-neutral-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Formula: Selected Crop Area / Total Taluka Land × 100
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 block font-mono uppercase">Calculated Crop Share</span>
            <div className="text-2xl font-black text-agri-400 font-mono">
              {record.cropCultivatedAreaHa.toLocaleString()} ha / {record.totalTalukaAreaHa.toLocaleString()} ha = <span className="text-white underline">{record.cropAreaSharePercent}%</span>
            </div>
          </div>
          
          <div className="md:col-span-2 p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-neutral-200 leading-relaxed font-normal">
            <p className="font-bold text-white text-sm mb-1">
              "Approximately {record.cropAreaSharePercent}% of the reported cultivated area in {selectedTaluka} block is under {selectedCrop}."
            </p>
            <span className="text-[11px] text-neutral-400 italic">
              * Note: Land share reflects total cultivated area proportion across the taluka block, not individual farmer headcount percentage.
            </span>
          </div>
        </div>
      </div>

      {/* 5. Historical Trend Chart & Market Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Historical Trend Chart Component */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Historical Cultivation & Yield Trends (2021 – 2025)
              </h3>
              <p className="text-xs text-neutral-400">5-year comparative trajectory for {selectedCrop} in {selectedTaluka}</p>
            </div>

            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 shrink-0">
              <button
                onClick={() => setTrendMetric('area')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  trendMetric === 'area' ? 'bg-agri-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Area (ha)
              </button>
              <button
                onClick={() => setTrendMetric('production')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  trendMetric === 'production' ? 'bg-cyan-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Production (t)
              </button>
              <button
                onClick={() => setTrendMetric('yield')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  trendMetric === 'yield' ? 'bg-purple-600 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Yield (t/ha)
              </button>
            </div>
          </div>

          {/* Visual Trend Bars */}
          <div className="space-y-4 pt-2">
            {record.historicalTrend.map((tItem) => {
              const maxVal = Math.max(...record.historicalTrend.map(h => 
                trendMetric === 'area' ? h.areaHa : trendMetric === 'production' ? h.productionTonnes : h.yieldTonnesPerHa
              ));
              const currentVal = trendMetric === 'area' ? tItem.areaHa : trendMetric === 'production' ? tItem.productionTonnes : tItem.yieldTonnesPerHa;
              const percent = Math.round((currentVal / (maxVal || 1)) * 100);

              const barBg = trendMetric === 'area' ? 'bg-gradient-to-r from-agri-600 to-emerald-400'
                : trendMetric === 'production' ? 'bg-gradient-to-r from-cyan-600 to-blue-400'
                : 'bg-gradient-to-r from-purple-600 to-indigo-400';

              return (
                <div key={tItem.year} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-white">{tItem.year}</span>
                    <span className="font-mono text-neutral-300">
                      {trendMetric === 'area' && `${tItem.areaHa.toLocaleString()} ha`}
                      {trendMetric === 'production' && `${tItem.productionTonnes.toLocaleString()} tonnes`}
                      {trendMetric === 'yield' && `${tItem.yieldTonnesPerHa} t/ha`}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-300 flex items-center gap-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Cultivation density for {selectedCrop} has increased continuously over 5 consecutive years, driven by improved seed varieties and drip irrigation adoption in {selectedTaluka}.
            </span>
          </div>
        </div>

        {/* Market Intelligence Section */}
        <div className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                Market Intelligence
              </h3>
              <p className="text-xs text-neutral-400">Spot price & arrival density</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo Market Data
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs text-neutral-400 block uppercase font-mono">Primary Regional APMC</span>
              <span className="text-base font-bold text-white block">{record.primaryMandi}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[11px] text-neutral-400 block font-mono">Current Spot Price</span>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  ₹{record.currentMarketPricePerQuintal} <span className="text-[10px] font-normal text-neutral-400">/qtl</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[11px] text-neutral-400 block font-mono">Previous Week Price</span>
                <div className="text-lg font-black text-neutral-300 font-mono">
                  ₹{record.previousMarketPricePerQuintal} <span className="text-[10px] font-normal text-neutral-400">/qtl</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-mono">Daily Arrival Volume</span>
                <span className="font-bold text-white font-mono">{record.marketArrivalsTonnesPerDay.toLocaleString()} tonnes/day</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-mono">Price Trend Indicator</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +8.2% vs Last Week
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-neutral-400 leading-relaxed">
              💡 Architecture note: Data service layer is modularly built for live Agmarknet APMC REST API connections.
            </div>
          </div>
        </div>

      </div>

      {/* 6. Supply Outlook & Decision Support Indicator */}
      <div className="p-6 md:p-8 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-agri-400 uppercase tracking-widest mb-1">
              Krishi Grow Supply Outlook
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Decision-Support Estimate & Market Pressure Gauge
            </h3>
            <p className="text-xs text-neutral-300">
              Decision-support estimate based on available cultivation area, seasonal harvest timing, and historical arrivals.
            </p>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border shadow-md shrink-0 flex items-center gap-2 ${record.recommendation.badgeColor}`}>
            <ShieldAlert className="w-4 h-4" />
            <span>{record.recommendation.statusBadge}</span>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 p-6 rounded-xl border border-white/5">
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Actionable Farmer Recommendation
            </h4>
            <p className="text-sm text-neutral-200 font-normal leading-relaxed">
              {record.recommendation.detailedAdvice}
            </p>
            <div className="pt-2 text-[11px] text-neutral-400 italic">
              * Notice: Recommendations are provided strictly for decision-support guidance based on regional sample statistics and do not constitute guaranteed financial or trading advice.
            </div>
          </div>

          {/* Processing Connection Direct Action */}
          <div className="p-5 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-agri-400 uppercase tracking-wider block mb-1">
                Value Addition Opportunity
              </span>
              <h5 className="text-sm font-bold text-white">Recommended Processing Options</h5>
              <ul className="mt-2 space-y-1.5 text-xs text-neutral-300">
                {record.recommendation.processingOptions.map((opt, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-agri-400 shrink-0" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('storage-processing')}
              className="w-full py-2.5 px-4 bg-agri-600 hover:bg-agri-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Warehouse className="w-4 h-4" />
              <span>Explore Processing Units</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Data Sources Transparency Table */}
      <div className="p-6 md:p-8 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Data Sources & Metadata Provenance
            </h3>
            <p className="text-xs text-neutral-400">Full audit trail of agricultural data feeds powering this analysis</p>
          </div>
          <span className="text-xs font-mono text-neutral-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Transparent Architecture
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Data Type</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-normal">
              {dataSources.map((ds, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{ds.name}</td>
                  <td className="py-3.5 px-4 text-neutral-300">{ds.dataType}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-400">{ds.lastUpdated}</td>
                  <td className="py-3.5 px-4">
                    {ds.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ✓ Verified Source
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        ⚠ Simulated Demo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
