import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText, ExternalLink, CheckCircle2, Search, ChevronDown, ChevronUp,
  ShieldCheck, Award, Info, Sparkles
} from 'lucide-react';
import { governmentSchemes } from '../data/mockData';

export const GovernmentSchemesPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track expanded scheme IDs (first scheme expanded by default)
  const [expandedSchemeIds, setExpandedSchemeIds] = useState<string[]>([governmentSchemes[0]?.id || '']);

  const toggleSchemeExpand = (schemeId: string) => {
    setExpandedSchemeIds(prev =>
      prev.includes(schemeId) ? prev.filter(id => id !== schemeId) : [...prev, schemeId]
    );
  };

  const filteredSchemes = governmentSchemes.filter((s) => {
    const matchesCrop = selectedCrop === 'ALL' || s.applicableCrops.includes(selectedCrop);
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.agency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-black/60 backdrop-blur-2xl p-6 md:p-8 rounded-xl border border-white/10 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold shrink-0">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black tracking-tight text-white">{t('governmentSchemes.title')}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Official Portal
                </span>
              </div>
              <p className="text-xs md:text-sm text-neutral-300 mt-1 font-normal">
                {t('governmentSchemes.subtitle')} — Select any scheme bar to view eligibility & application links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={t('governmentSchemes.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-xs border border-white/10 rounded-xl focus:border-blue-500/50 outline-none bg-black/60 text-white font-normal transition-all"
              />
            </div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2.5 text-xs border border-white/10 rounded-xl focus:border-blue-500/50 outline-none bg-black/60 text-white font-normal transition-all appearance-none cursor-pointer shrink-0"
            >
              <option value="ALL">{t('governmentSchemes.allCrops')}</option>
              <option value="Tomato">{t('governmentSchemes.tomato')}</option>
              <option value="Onion">{t('governmentSchemes.onion')}</option>
              <option value="Mango">{t('governmentSchemes.mango')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Interactive Expandable List */}
      <div className="space-y-4">
        {filteredSchemes.length === 0 ? (
          <div className="p-8 text-center bg-black/50 rounded-xl border border-white/10 text-neutral-400 text-sm">
            No schemes found matching your search query.
          </div>
        ) : (
          filteredSchemes.map((s) => {
            const isExpanded = expandedSchemeIds.includes(s.id);
            const schemeName = t(`govSchemes.${s.id}.name`, s.name);
            const agency = t(`govSchemes.${s.id}.agency`, s.agency);
            const maxSubsidy = t(`govSchemes.${s.id}.maxSubsidyAmount`, s.maxSubsidyAmount);
            const description = t(`govSchemes.${s.id}.description`, s.description);
            const eligibility = t(`govSchemes.${s.id}.eligibility`, s.eligibility);
            const subsidyBenefit = t(`govSchemes.${s.id}.subsidyBenefit`, s.subsidyBenefit);

            return (
              <div
                key={s.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'bg-black/70 border-blue-500/40 shadow-lg ring-1 ring-blue-500/20'
                    : 'bg-black/50 hover:bg-black/60 border-white/10 hover:border-white/20 shadow-sm'
                }`}
              >
                {/* ── Compact Header Bar (Touchable / Clickable) ── */}
                <div
                  onClick={() => toggleSchemeExpand(s.id)}
                  className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-blue-400" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                          {agency}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Officially Verified
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                        {schemeName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Max Benefit</span>
                      <span className="text-base md:text-lg font-black font-mono text-emerald-400">
                        {maxSubsidy}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-blue-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Expanded Full Details Content ("Gets Big") ── */}
                {isExpanded && (
                  <div className="p-6 md:p-8 pt-0 border-t border-white/10 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-xs md:text-sm text-neutral-300 font-normal leading-relaxed pt-4">
                      {description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-5 rounded-xl border border-white/5 text-xs">
                      <div className="space-y-1.5">
                        <span className="font-bold text-white block uppercase tracking-wider text-[11px]">
                          {t('governmentSchemes.eligibilityCriteria')}
                        </span>
                        <p className="text-neutral-300 font-normal leading-relaxed">
                          {eligibility}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[11px]">
                          {t('governmentSchemes.subsidyBenefit')}
                        </span>
                        <p className="text-emerald-300 font-normal leading-relaxed">
                          {subsidyBenefit}
                        </p>
                      </div>
                    </div>

                    {/* Documents Required */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-white block uppercase tracking-wider">
                        {t('governmentSchemes.requiredDocuments')}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {s.requiredDocuments.map((doc, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white/5 text-neutral-300 font-medium px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{t(`govSchemes.docs.${doc.replace(/\s+/g, '_')}`, doc)}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-white/10 gap-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                        <span>{t('governmentSchemes.lastVerified', { date: s.lastVerifiedDate })}</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Official Portal Verified
                        </span>
                      </div>

                      <a
                        href={s.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                      >
                        <span>{t('governmentSchemes.visitPortal')}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

