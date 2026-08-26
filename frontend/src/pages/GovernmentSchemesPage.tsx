import React, { useState } from 'react';
import { FileText, ExternalLink, CheckCircle2, Search } from 'lucide-react';
import { governmentSchemes } from '../data/mockData';
import ScrollStack, { ScrollStackItem } from '../components/ui/ScrollStack';

export const GovernmentSchemesPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = governmentSchemes.filter((s) => {
    const matchesCrop = selectedCrop === 'ALL' || s.applicableCrops.includes(selectedCrop);
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight text-white">Government Schemes & Subsidies</h2>
              <p className="text-sm text-neutral-400 mt-1 font-light">
                Explore government infrastructure subsidies (AIF, PMFME, MIDH) with eligibility checks & direct apply links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm border border-white/10 rounded-xl focus:border-purple-500/50 outline-none bg-black/50 text-white font-light transition-all"
              />
            </div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-4 py-3 text-sm border border-white/10 rounded-xl focus:border-purple-500/50 outline-none bg-black/50 text-white font-light transition-all appearance-none"
            >
              <option value="ALL">All Applicable Crops</option>
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Mango">Mango</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="h-[80vh] w-full border border-white/5 rounded-3xl overflow-hidden bg-black/60 backdrop-blur-xl">
        <ScrollStack
          itemDistance={120}
          itemScale={0.01}
          itemStackDistance={10}
          stackPosition="2%"
          baseScale={0.85}
        >
          {filteredSchemes.map((s) => (
            <ScrollStackItem key={s.id} itemClassName="bg-black/60 backdrop-blur-3xl border border-white/10 shadow-lg rounded-3xl">
              <div className="p-8 h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                  {s.agency}
                </span>
                <h3 className="text-xl font-medium text-white mt-3">{s.name}</h3>
              </div>
              <div className="text-left md:text-right">
                <span className="text-xs text-neutral-400 block mb-1">Max Subsidy / Benefit</span>
                <span className="text-lg font-medium font-mono text-purple-400">{s.maxSubsidyAmount}</span>
              </div>
            </div>

            <p className="text-sm text-neutral-300 font-light leading-relaxed">{s.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/5 text-sm">
              <div className="space-y-1">
                <span className="font-medium text-white block">Eligibility Criteria</span>
                <p className="text-neutral-400 font-light leading-relaxed">{s.eligibility}</p>
              </div>
              <div className="space-y-1">
                <span className="font-medium text-white block">Subsidy & Financial Benefit</span>
                <p className="text-emerald-400 font-light leading-relaxed">{s.subsidyBenefit}</p>
              </div>
            </div>

            {/* Documents Required */}
            <div>
              <span className="text-sm font-medium text-white block mb-3">Required Checklist Documents:</span>
              <div className="flex flex-wrap gap-2">
                {s.requiredDocuments.map((doc, i) => (
                  <span key={i} className="text-xs bg-white/5 text-neutral-300 font-medium px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{doc}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[10px] text-gray-400 font-mono">Last Verified: {s.lastVerifiedDate}</span>
              <a
                href={s.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </div>
  );
};
