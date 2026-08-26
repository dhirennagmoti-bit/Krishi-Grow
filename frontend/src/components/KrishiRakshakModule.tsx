import React, { useState, useMemo } from 'react';
import {
  ShieldAlert, Bug, Droplet, Search, Filter, AlertTriangle, ExternalLink,
  CheckCircle2, Info, ChevronDown, ChevronUp, Sparkles, ScanLine, Sprout,
  ArrowRight, BookOpen, AlertOctagon, FileCheck, ShieldCheck, ChevronRight
} from 'lucide-react';
import { KRISHI_RAKSHAK_DATA, CROP_PROTECTION_SUMMARIES, type CropProtectionProblem } from '../data/krishiRakshakData';
import { CROP_CATALOG } from '../data/cropCatalog';
import { useApp } from '../context/AppContext';

interface KrishiRakshakModuleProps {
  initialCropId?: string;
}

export const KrishiRakshakModule: React.FC<KrishiRakshakModuleProps> = ({ initialCropId = 'rice' }) => {
  const { setIsScannerModalOpen, requireAuth } = useApp();
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | 'Pest' | 'Disease' | 'Weed' | 'Virus'>('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<'ALL' | 'Mild' | 'Moderate' | 'High' | 'Severe'>('ALL');
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  // Find selected crop catalog item and summary
  const selectedCrop = CROP_CATALOG.find(c => c.id === selectedCropId) || CROP_CATALOG[0];
  const cropSummary = CROP_PROTECTION_SUMMARIES[selectedCropId] || {
    id: selectedCrop.id,
    name: selectedCrop.name,
    category: selectedCrop.category,
    problemCount: 4,
    pestCount: 2,
    diseaseCount: 2,
    weedCount: 0,
    virusCount: 0,
    description: 'Protect this crop through timely scouting, cultural hygiene and label-approved interventions.'
  };

  // Filter problems for the selected crop and search/filter parameters
  const filteredProblems = useMemo(() => {
    return KRISHI_RAKSHAK_DATA.filter((prob) => {
      const matchesCrop = prob.cropId === selectedCropId;
      if (!matchesCrop) return false;

      const matchesType = selectedTypeFilter === 'ALL' || prob.type === selectedTypeFilter;
      const matchesSeverity = selectedSeverityFilter === 'ALL' || prob.severity === selectedSeverityFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        prob.problem.toLowerCase().includes(q) ||
        prob.symptoms.toLowerCase().includes(q) ||
        prob.treatmentGuidance.toLowerCase().includes(q) ||
        prob.preventionIPM.toLowerCase().includes(q);

      return matchesType && matchesSeverity && matchesSearch;
    });
  }, [selectedCropId, selectedTypeFilter, selectedSeverityFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedProblemId(prev => prev === id ? null : id);
  };

  const getTypeBadgeStyle = (type: CropProtectionProblem['type']) => {
    switch (type) {
      case 'Pest':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Disease':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Weed':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Virus':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const getSeverityBadgeStyle = (severity: CropProtectionProblem['severity']) => {
    switch (severity) {
      case 'Severe':
        return 'bg-red-950 text-red-300 border border-red-500/50 font-black';
      case 'High':
        return 'bg-orange-950 text-orange-300 border border-orange-500/40 font-bold';
      case 'Moderate':
        return 'bg-amber-950 text-amber-300 border border-amber-500/30 font-semibold';
      case 'Mild':
        return 'bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-medium';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* 1. TOP SAFETY BANNER & CIB&RC COMPLIANCE NOTICE */}
      <div className="bg-gradient-to-r from-red-950/80 via-neutral-900 to-amber-950/80 p-5 rounded-3xl border border-amber-500/30 shadow-2xl space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <AlertOctagon className="w-6 h-6 text-amber-400" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-black text-white tracking-tight">
                Krishi Rakshak — CIB&RC & PPQS Official Safety Protocol
              </h4>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40 font-bold uppercase tracking-wider">
                Mandatory Agricultural Guidelines
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Pesticides must <strong>never</strong> be used indiscriminately. Prioritize Integrated Pest Management (IPM: Cultural, Biological & Mechanical controls).
            </p>
          </div>
        </div>

        {/* Core Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 text-[11px] text-neutral-300">
          <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span><strong>No Pesticides for Viruses:</strong> Viruses have no chemical cure. Manage vectors only.</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Targeted Action:</strong> Never spray insecticides for fungal rot, or fungicides for insects.</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Verify Dosage/PHI:</strong> Strictly follow product labels and pre-harvest intervals (PHI).</span>
          </div>
        </div>
      </div>

      {/* 2. CROP SELECTION FLOW: 25 CROPS GRID WITH PROBLEM COUNTS */}
      <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              Select Crop to Access Protection Guide
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Choose from 25 crops to view verified pests, fungal/bacterial diseases, weeds, and IPM solutions.
            </p>
          </div>
          <button
            onClick={() => requireAuth(() => setIsScannerModalOpen(true))}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all shrink-0"
          >
            <ScanLine className="w-4 h-4 text-white" />
            <span>Diagnose Leaf with AI Scanner</span>
          </button>
        </div>

        {/* 25 Crops Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {CROP_CATALOG.map((crop) => {
            const isSelected = crop.id === selectedCropId;
            const summary = CROP_PROTECTION_SUMMARIES[crop.id];
            const probCount = summary?.problemCount || 4;

            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => {
                  setSelectedCropId(crop.id);
                  setExpandedProblemId(null);
                }}
                className={`relative p-3.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all group border cursor-pointer ${
                  isSelected
                    ? 'border-2 border-emerald-500 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Crop Icon */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 relative mb-1.5 transition-transform group-hover:scale-105 shadow-md bg-black/40">
                  <img
                    src={crop.iconUrl}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Crop Name */}
                <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                  {crop.name}
                </span>

                {/* Major Problems Badge */}
                <div className="mt-2 flex items-center gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-500 text-black' : 'bg-white/10 text-neutral-300'
                  }`}>
                    {probCount} Problems
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SELECTED CROP OVERVIEW CARD */}
      <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 rounded-2xl overflow-hidden border border-white/20 shadow-lg shrink-0 bg-black/40">
              <img
                src={selectedCrop.iconUrl}
                alt={selectedCrop.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-black text-white">{selectedCrop.name} Crop Protection Overview</h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  {selectedCrop.category}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl font-light">
                {cropSummary.description}
              </p>
            </div>
          </div>

          {/* Quick Problem Distribution Metric Counters */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <div className="bg-rose-950/60 border border-rose-500/30 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-rose-300 uppercase block font-bold">Pests</span>
              <span className="text-base font-black text-rose-400 font-mono">{cropSummary.pestCount}</span>
            </div>
            <div className="bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-amber-300 uppercase block font-bold">Diseases</span>
              <span className="text-base font-black text-amber-400 font-mono">{cropSummary.diseaseCount}</span>
            </div>
            {cropSummary.weedCount > 0 && (
              <div className="bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-center">
                <span className="text-[10px] text-emerald-300 uppercase block font-bold">Weeds</span>
                <span className="text-base font-black text-emerald-400 font-mono">{cropSummary.weedCount}</span>
              </div>
            )}
            {cropSummary.virusCount > 0 && (
              <div className="bg-purple-950/60 border border-purple-500/30 px-3 py-1.5 rounded-xl text-center">
                <span className="text-[10px] text-purple-300 uppercase block font-bold">Viruses</span>
                <span className="text-base font-black text-purple-400 font-mono">{cropSummary.virusCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. SEARCH AND FILTERS TOOLBAR */}
        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={`Search ${selectedCrop.name} pests, diseases, symptoms or active ingredients...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/15 bg-black/40 text-white placeholder-neutral-500 outline-none focus:border-emerald-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-neutral-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Type:
            </span>
            {(['ALL', 'Pest', 'Disease', 'Weed', 'Virus'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedTypeFilter(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTypeFilter === type
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedSeverityFilter}
              onChange={(e) => setSelectedSeverityFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-xl border border-white/15 bg-black/40 text-neutral-300 outline-none focus:border-emerald-400"
            >
              <option value="ALL">All Severities</option>
              <option value="Severe">Severe</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Mild">Mild</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. CROP PROBLEMS & PROTECTION DETAIL CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Verified Protection Records ({filteredProblems.length} Found)
          </h4>
          <span className="text-xs text-neutral-400">
            Source: CIB&RC / PPQS Major Uses Compendium
          </span>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="bg-black/40 rounded-3xl p-12 text-center border border-white/10 space-y-3">
            <Info className="w-10 h-10 text-neutral-400 mx-auto" />
            <p className="text-base font-bold text-white">No matching protection records found</p>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Try adjusting your search terms or clearing the type/severity filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTypeFilter('ALL');
                setSelectedSeverityFilter('ALL');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProblems.map((item) => {
              const isExpanded = expandedProblemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-black/60 backdrop-blur-xl rounded-3xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-emerald-500/50 shadow-2xl bg-black/80'
                      : 'border-white/10 hover:border-white/20 shadow-md'
                  }`}
                >
                  {/* Card Header Summary */}
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        {item.type === 'Pest' && <Bug className="w-6 h-6 text-rose-400" />}
                        {item.type === 'Disease' && <Droplet className="w-6 h-6 text-amber-400" />}
                        {item.type === 'Weed' && <Sprout className="w-6 h-6 text-emerald-400" />}
                        {item.type === 'Virus' && <AlertTriangle className="w-6 h-6 text-purple-400" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="text-lg font-black text-white">{item.problem}</h5>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getTypeBadgeStyle(item.type)}`}>
                            {item.type}
                          </span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${getSeverityBadgeStyle(item.severity)}`}>
                            {item.severity} Risk
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 font-light flex items-center gap-1.5">
                          <span className="font-semibold text-neutral-400">Symptoms:</span> {item.symptoms}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-neutral-400 block uppercase font-medium">Potential Loss</span>
                        <span className="text-xs font-bold text-rose-400 font-mono">{item.potentialLoss.split(' ')[0]} {item.potentialLoss.split(' ')[1]}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-300">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detailed Sections */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 space-y-6 pt-2 border-t border-white/10 animate-in fade-in">
                      
                      {/* Potential Loss Warning */}
                      <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/30 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs font-bold text-rose-300 uppercase tracking-wide block">
                            Potential Loss Without Intervention:
                          </strong>
                          <p className="text-xs text-neutral-200 mt-0.5 font-light leading-relaxed">
                            {item.potentialLoss}
                          </p>
                        </div>
                      </div>

                      {/* Integrated Pest Management (IPM) */}
                      <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          <h6 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                            Integrated Pest Management (IPM) & Prevention
                          </h6>
                        </div>
                        <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 text-xs text-neutral-300 leading-relaxed font-light">
                          {item.preventionIPM}
                        </div>
                      </div>

                      {/* Official Treatment / Active Ingredient Guidance */}
                      <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Droplet className="w-5 h-5 text-amber-400" />
                            <h6 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                              Treatment / Active Ingredient Guidance
                            </h6>
                          </div>
                          <span className="text-[10px] text-neutral-400 bg-black/40 px-2.5 py-1 rounded-md border border-white/10 font-mono">
                            CIB&RC Registered Only
                          </span>
                        </div>
                        
                        <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 text-xs text-neutral-200 leading-relaxed font-medium">
                          {item.treatmentGuidance}
                        </div>

                        {/* Dose & PHI Official Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                          <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Dose & Dilution</span>
                            <span className="text-amber-300/90 font-mono text-[11px] flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 shrink-0" />
                              {item.dosePhi}
                            </span>
                          </div>
                          <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Pre-Harvest Interval (PHI)</span>
                            <span className="text-amber-300/90 font-mono text-[11px] flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 shrink-0" />
                              Verify registered crop label before harvest
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Official Verification & Safety Actions */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                        <a
                          href={item.officialVerificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-xs font-semibold rounded-xl border border-white/15 flex items-center justify-center gap-2 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-emerald-400" />
                          <span>View Official PPQS Compendium PDF</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={item.amazonSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <span>Search Registered Products on Amazon India</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. BOTTOM SAFETY WARNING & REGULATORY CITATION */}
      <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <ShieldAlert className="w-6 h-6 text-emerald-400" />
          <div>
            <h4 className="text-base font-bold text-white">Krishi Grow Advisory & Regulatory Citation</h4>
            <p className="text-xs text-neutral-400 font-light">Official references and farmer safety compliance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-300 font-light">
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <h5 className="font-bold text-emerald-400 text-xs uppercase tracking-wider">Official Data Sources:</h5>
            <ul className="space-y-1.5 list-disc list-inside marker:text-emerald-400">
              <li>Central Insecticide Board & Registration Committee (CIB&RC)</li>
              <li>Directorate of Plant Protection, Quarantine & Storage (PPQS)</li>
              <li>Indian Council of Agricultural Research (ICAR)</li>
              <li>State Agricultural Universities (SAUs) Package of Practices</li>
            </ul>
          </div>

          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <h5 className="font-bold text-amber-400 text-xs uppercase tracking-wider">Safety & Legal Disclaimer:</h5>
            <p className="leading-relaxed text-[11px]">
              Always use Personal Protective Equipment (PPE: gloves, mask, eye protection). Follow label directions, recommended dilution rates, and pre-harvest intervals. Never spray during windy days or near water bodies. Consult your local Krishi Vigyan Kendra (KVK) for area-specific advisories.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
