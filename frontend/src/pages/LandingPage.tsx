import React from 'react';
import {
  Sprout, ArrowRight, TrendingUp, Truck, Users, CheckCircle2, Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ValueChainFlow } from '../components/ValueChainFlow';
import FoldText from '../components/ui/FoldText';
import { LandingElasticFeatures } from '../components/ui/landing-elastic-features';
import { useTranslation } from 'react-i18next';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsAuthModalOpen, setIsAIModalOpen } = useApp();
  const { t } = useTranslation();

  const farmerBenefits = [
    'Direct access to verified aggregators & bulk processing plants',
    'Dynamic transport rate calculator & reefer truck matcher',
    'Real-time Mandi price intelligence across Maharashtra & India',
    'AI-driven crop processing recommendations (e.g. Puree & Flakes)',
    'Cold storage & WDRA dry warehouse locator with live capacity',
    'Government scheme subsidy checker & 1-click application support'
  ];

  const buyerBenefits = [
    'Direct farm-gate sourcing with verified crop quality grades (A/A+)',
    'Traceable harvest dates, moisture level & GPS farm location',
    'Bulk requirement posting with 90%+ match scoring algorithms',
    'Transparent pricing & zero middleman hidden commission',
    'Scheduled weekly/monthly supply contracts with local farmers'
  ];

  return (
    <div className="space-y-12 py-6 px-4 md:px-8 max-w-[550px] ml-2 md:ml-8 lg:ml-12 relative z-10 pb-32">
      
      {/* Hero Banner Section */}
      <section className="relative rounded-xl overflow-hidden bg-black/20 backdrop-blur-md text-white border border-white/10 shadow-md">
        <div className="flex items-center">
          
          {/* Hero Content */}
          <div className="w-full p-8 md:p-12 space-y-6 z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight flex flex-col gap-2">
              <FoldText
                text={t('landing.heroLine1')}
                splitBy="word"
                trigger="mount"
              />
              <FoldText
                text={t('landing.heroLine2')}
                splitBy="word"
                trigger="mount"
                className="text-transparent bg-clip-text bg-gradient-to-r from-agri-300 via-emerald-200 to-amber-300"
              />
            </h1>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              <FoldText text={t('landing.heroSub')} trigger="scroll" splitBy="word" />
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                }}
                className="px-6 py-3.5 bg-agri-500 hover:bg-agri-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 group border border-agri-400/50"
              >
                <span><FoldText text={t('landing.getStarted')} trigger="scroll" splitBy="word" /></span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('solutions')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <span><FoldText text={t('landing.exploreSolutions')} trigger="scroll" splitBy="word" /></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Value Chain Flow Component */}
      <section className="rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-md overflow-hidden p-2">
        <ValueChainFlow />
      </section>

      {/* Platform Features Grid */}
      <section className="space-y-8 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-md p-6 md:p-8">
        <div className="text-left max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <FoldText text={t('landing.suite')} trigger="scroll" splitBy="word" />
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4">
            <FoldText text={t('landing.builtFor')} trigger="scroll" splitBy="word" />
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            <FoldText text={t('landing.eliminateDistress')} trigger="scroll" splitBy="word" />
          </p>
        </div>

        <LandingElasticFeatures />
      </section>

      {/* Dual Value Proposition: Farmer vs Buyer */}
      <section className="bg-black/20 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/10 shadow-md space-y-8 text-white">
        <div className="flex flex-col gap-12 divide-y divide-white/10">
          
          {/* Farmer Column */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-agri-300 text-xs font-bold rounded-full border border-white/10">
              <Sprout className="w-4 h-4 text-agri-400" /> <FoldText text={t('landing.forFarmers')} trigger="scroll" splitBy="word" />
            </div>
            <h3 className="text-2xl font-bold text-white"><FoldText text={t('landing.maximizeRealization')} trigger="scroll" splitBy="word" /></h3>
            <p className="text-sm text-gray-300">
              <FoldText text={t('landing.stopSuffering')} trigger="scroll" splitBy="word" />
            </p>
            <ul className="space-y-3 pt-2">
              {farmerBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                  <span><FoldText text={b} trigger="scroll" splitBy="word" /></span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-6 px-6 py-3 bg-agri-500 text-white text-sm font-bold rounded-xl hover:bg-agri-400 transition-colors shadow-md border border-agri-400/50"
            >
              <FoldText text={t('landing.registerFarmer')} trigger="scroll" splitBy="word" />
            </button>
          </div>

          {/* Buyer Column */}
          <div className="space-y-4 pt-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-blue-300 text-xs font-bold rounded-full border border-white/10">
              <Users className="w-4 h-4 text-blue-400" /> <FoldText text={t('landing.forBuyers')} trigger="scroll" splitBy="word" />
            </div>
            <h3 className="text-2xl font-bold text-white"><FoldText text={t('landing.directProcurement')} trigger="scroll" splitBy="word" /></h3>
            <p className="text-sm text-gray-300">
              <FoldText text={t('landing.sourceGraded')} trigger="scroll" splitBy="word" />
            </p>
            <ul className="space-y-3 pt-2">
              {buyerBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span><FoldText text={b} trigger="scroll" splitBy="word" /></span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-md text-white text-sm font-bold rounded-xl hover:bg-white/30 transition-colors shadow-md border border-white/20"
            >
              <FoldText text={t('landing.registerBuyer')} trigger="scroll" splitBy="word" />
            </button>
          </div>
        </div>
      </section>

      {/* Floating AI Callout Banner */}
      <section className="bg-black/30 backdrop-blur-xl text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-amber-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-agri-500/20 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white"><FoldText text={t('landing.haveQuestions')} trigger="scroll" splitBy="word" /></h3>
            <p className="text-xs text-gray-300 mt-1">
              <FoldText text={t('landing.askAgriAI')} trigger="scroll" splitBy="word" />
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="relative z-10 px-6 py-3 bg-amber-500/80 backdrop-blur-md text-white font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors shadow-md border border-amber-400/50 whitespace-nowrap"
        >
          <FoldText text={t('landing.chatAgriAI')} trigger="scroll" splitBy="word" />
        </button>
      </section>
    </div>
  );
};
